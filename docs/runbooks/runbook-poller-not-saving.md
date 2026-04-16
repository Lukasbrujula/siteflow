# Runbook: Poller logs "Saved" but emails don't appear in the database

**Symptom:** The poller log shows `[poller] Saved: <subject>` for incoming emails, but those rows never appear when querying the SQLite database.

**Severity:** High — the entire pipeline is silently broken. No emails reach triage or draft generation.

**Estimated time to resolve:** 15–45 minutes depending on root cause.

---

## Quick diagnosis flowchart

Run these in order. Stop at the first one that returns unexpected output.

### Step 1: Confirm the symptom

```bash
ssh root@<server-ip>
cd /opt/siteflow
node -e 'const db=require("better-sqlite3")("data/siteflow.db"); console.table(db.prepare("SELECT status, COUNT(*) as c FROM emails GROUP BY status").all());'
pm2 logs poller --lines 30 --nostream
```

If the poller log shows `[poller] Saved: ...` for recent test emails but the DB count is unchanged, you have this bug. Continue.

### Step 2: Check for stale file handles (most common cause)

```bash
lsof -p $(pm2 pid poller) 2>/dev/null | grep -i siteflow
```

Look for `(deleted)` next to any `siteflow.db-wal` or `siteflow.db-shm` line. If you see `(deleted)`, the poller is writing to orphaned files that no other process can see. **Fix:**

```bash
pm2 restart poller --update-env
```

Re-run the `lsof` check — `(deleted)` markers should be gone. Send a test email, wait 4 minutes, re-query the DB. If count goes up, you're fixed. **Stop here.** If not, continue to Step 3.

### Step 3: Check IMAP credentials

```bash
pm2 logs poller --lines 50 --nostream | grep -i "invalid credentials"
```

If you see lots of `[poller] Error: Invalid credentials (Failure)` lines, the Gmail App Password is wrong, expired, or revoked.

```bash
grep -E '^(IMAP|SMTP|ADMIN_EMAIL)' /opt/siteflow/.env
```

If the values look like `your-gmail-address@gmail.com` or `your-gmail-app-password`, the `.env` file got reset (probably by `git pull` — see "How this happens" below). Real values needed.

**Fix:** Generate a fresh Gmail App Password at https://myaccount.google.com/apppasswords (logged in as the tenant's mailbox account), then update `.env`:

```bash
sed -i 's|^IMAP_USER=.*|IMAP_USER=your-real-email@gmail.com|' /opt/siteflow/.env
sed -i 's|^IMAP_PASSWORD=.*|IMAP_PASSWORD=xxxxxxxxxxxxxxxx|' /opt/siteflow/.env
sed -i 's|^SMTP_USER=.*|SMTP_USER=your-real-email@gmail.com|' /opt/siteflow/.env
sed -i 's|^SMTP_PASSWORD=.*|SMTP_PASSWORD=xxxxxxxxxxxxxxxx|' /opt/siteflow/.env
sed -i 's|^ADMIN_EMAIL=.*|ADMIN_EMAIL=your-real-email@gmail.com|' /opt/siteflow/.env
```

(Replace placeholders with real values. Note: Gmail App Passwords are 16 chars, no spaces.)

```bash
pm2 restart all --update-env
```

Wait 60 seconds, then check logs:

```bash
pm2 logs poller --lines 20 --nostream
```

Should see `[poller] Found N new messages` followed by `[poller] Saved: ...` and **no** new `Invalid credentials` errors.

### Step 4: Check Siteware token

If poller works but workflow throws errors:

```bash
pm2 logs workflow --lines 30 --nostream
```

If you see `403 ERROR_AUTHORIZATION_INVALID`, the Siteware token is dead. Test it:

```bash
TOKEN=$(grep ^SITEWARE_TRIAGE_TOKEN /opt/siteflow/.env | cut -d= -f2)
curl -sS -o /dev/null -w "HTTP %{http_code}\n" https://api.siteware.io/v1/api/agents -H "Authorization: Bearer $TOKEN"
```

`HTTP 200` = good. `HTTP 403` = dead. Generate a new key in Siteware UI under **Einstellungen → API-Zugriffsschlüssel**, ensuring both agents (Triage + Reply) are explicitly added to the allowlist (the "Alle Assistenten erlaubt" option does NOT work reliably — always tick agents individually).

Update both token slots:

```bash
sed -i 's|^SITEWARE_TRIAGE_TOKEN=.*|SITEWARE_TRIAGE_TOKEN=<new-jwt>|' /opt/siteflow/.env
sed -i 's|^SITEWARE_REPLY_TOKEN=.*|SITEWARE_REPLY_TOKEN=<new-jwt>|' /opt/siteflow/.env
```

**Verify both updates took** (this is critical — sed can fail silently if the line doesn't match):

```bash
grep ^SITEWARE_TRIAGE_TOKEN /opt/siteflow/.env | sha256sum
grep ^SITEWARE_REPLY_TOKEN /opt/siteflow/.env | sha256sum
```

If both tokens should be the same, the hashes should match. If they differ unexpectedly, re-run the failed sed.

```bash
pm2 restart all --update-env
```

### Step 5: Reset stuck rows

If you have rows in `error` status from the broken period, reset them so the workflow retries:

```bash
node -e 'const db=require("better-sqlite3")("data/siteflow.db"); const r=db.prepare("UPDATE emails SET status=?, classification=NULL WHERE status=?").run("pending","error"); console.log("Reset rows:",r.changes);'
```

Wait 60 seconds, then verify:

```bash
node -e 'const db=require("better-sqlite3")("data/siteflow.db"); console.table(db.prepare("SELECT status, COUNT(*) as c FROM emails GROUP BY status").all());'
pm2 logs workflow --lines 20 --nostream
```

Expected: `error` count drops to 0 (or close to it), `draft` and `archived` counts rise.

---

## How to send a test email properly

```
To:      <tenant-mailbox>@gmail.com
Subject: SiteFlow Test YYYY-MM-DD A — <unique-string>
Body:    A short German B2B-style inquiry, e.g. "können Sie mir bitte eine Kopie der Rechnung 12345 zusenden?"
```

Use unique subjects so you can grep logs and find them in the DB. Use German content so triage classifies as `OTHER` (not `AD`/`SPAM`) and the Reply Composer fires.

**Note:** German em-dashes (—) and umlauts in subjects come back MIME-encoded (`=?utf-8?Q?...?=`) in the DB and dashboard. This is a known display bug, not a poller bug.

---

## Reference: useful one-liners

```bash
# All status counts
node -e 'const db=require("better-sqlite3")("data/siteflow.db"); console.table(db.prepare("SELECT status, COUNT(*) as c FROM emails GROUP BY status").all());'

# Recent rows (any status)
node -e 'const db=require("better-sqlite3")("data/siteflow.db"); console.table(db.prepare("SELECT id, status, subject, classification FROM emails ORDER BY received_at DESC LIMIT 10").all());'

# Find specific email by partial subject match
node -e "const db=require('better-sqlite3')('data/siteflow.db'); console.table(db.prepare(\"SELECT id, status, subject, classification FROM emails WHERE subject LIKE '%SEARCH_TERM%'\").all());"

# Reset all errors to pending
node -e 'const db=require("better-sqlite3")("data/siteflow.db"); const r=db.prepare("UPDATE emails SET status=?, classification=NULL WHERE status=?").run("pending","error"); console.log("Reset:",r.changes);'

# What env vars does the running poller actually have?
cat /proc/$(pm2 pid poller)/environ | tr '\0' '\n' | grep -iE 'imap|smtp|siteware'

# Is the Siteware token valid?
TOKEN=$(grep ^SITEWARE_TRIAGE_TOKEN /opt/siteflow/.env | cut -d= -f2); curl -sS -o /dev/null -w "HTTP %{http_code}\n" https://api.siteware.io/v1/api/agents -H "Authorization: Bearer $TOKEN"

# Process status
pm2 list

# Restart everything with fresh env
pm2 restart all --update-env
```
