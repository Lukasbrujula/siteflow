# Task: MI-03 — Send Path Uses Originating Inbox SMTP

## Status

- [ ] Pending
- [ ] Pre-Flight Research complete (HUMAN APPROVED)
- [ ] In Progress
- [ ] Verified
- [ ] Complete

## Pillars

### 1. Model

`sonnet` — single endpoint, single concept (look up by FK, build transporter, send). No architectural decisions remain.

### 2. Tools Required

- [x] Read, Edit (`siteflow:src/api/routes/emails.js` only)
- [x] Bash: type check (`node --check src/api/routes/emails.js`); manual send test against a local mailtrap or equivalent
- [x] Grep (verify no other endpoint reads `process.env.SMTP_*` for outbound mail)
- [ ] Write
- [ ] WebFetch
- [ ] Task

### 3. Guardrails (DO NOT)

- Do NOT silently fall back to `process.env.SMTP_*` if `email.inbox_id` is NULL or the inbox row is missing. Reject with HTTP 409 and a clear error message per audit §4.3.
- Do NOT change the placeholder/draft-marker logic at `siteflow:src/api/routes/emails.js:113-138`. The signature substitution still uses tenant `tone_profile.email_signature` per the companion onboarding audit.
- Do NOT change the audit-log INSERT pattern at lines 162-170.
- Do NOT touch other endpoints in this file (`/`, `/:id`, `/:id/draft`, `/:id/archive`, `/:id/reject`, `/:id/retriage`, `/:id/unsubscribe`). Only `/:id/send` (lines 104-177) is in scope.
- Do NOT change the OTP transporter in `siteflow:src/api/routes/auth.js` — that uses platform SMTP, not per-inbox SMTP, and stays env-based.
- Do NOT log decrypted passwords.
- Do NOT change the `from:` to anything other than `inbox.email`. Specifically, do not synthesize a "Reply via" wrapper or use the tenant's login email.

### 4. Knowledge (MUST READ)

- [x] `siteflow:CLAUDE.md` (always)
- [x] `siteflow:docs/audits/MULTI_INBOX_STATE_AUDIT_2026-05-06.md` §2 entry 4 (send path inventory), §4.3 (send path change spec).
- [x] `siteflow:docs/audits/ONBOARDING_STATE_AUDIT_2026-05-06.md` for context on the existing signature substitution path.
- [x] `siteflow:src/api/routes/emails.js` lines 104-177 (the `/send` endpoint).
- [x] `siteflow:src/api/crypto.js` (`decrypt` signature).

### 5. Memory

- The user-visible behavior change: replies are sent from whichever inbox received the original. Customers will see the correct `from:` address per inbox.
- The platform SMTP at `siteflow:src/api/routes/auth.js:21-29` is for OTP login emails, not customer replies. Different concern, different config.
- `email.inbox_id` is set by the MI-01 backfill for all existing rows. New rows are set by MI-02. The 409 case is a defensive guard, not a routinely-hit path.
- `nodemailer.createTransport` is already imported at line 3 — reuse.

### 6. Success Criteria

- [x] After fetching the email row at lines 106-109, the code looks up the inbox: `db.prepare("SELECT * FROM inboxes WHERE id = ? AND tenant_id = ?").get(email.inbox_id, req.tenant.id)`.
- [x] If the inbox lookup returns nothing, the endpoint returns HTTP 409 with `{ error: "Originating inbox not found for this email" }`.
- [x] The transporter is constructed from `inbox.smtp_host`, `inbox.smtp_port`, `inbox.smtp_user`, `decrypt(inbox.smtp_password_enc)`.
- [x] The `from:` field in the `sendMail` call is `inbox.email`.
- [x] No reads of `process.env.SMTP_HOST`, `process.env.SMTP_PORT`, `process.env.SMTP_USER`, `process.env.SMTP_PASSWORD` in the `/send` endpoint. (`grep -n "process.env.SMTP" siteflow/src/api/routes/emails.js` returns nothing.)
- [x] Manual send test: pick an email with known `inbox_id`, hit `POST /api/emails/:id/send` with valid session cookie, verify the SMTP server logs (or mailtrap) show the `from:` matches `inbox.email` and not `process.env.SMTP_USER`.
- [x] Manual 409 test: temporarily NULL out an email's `inbox_id` (`UPDATE emails SET inbox_id = NULL WHERE id = ?`), hit `/send`, verify 409 response. Restore the row after.
- [x] No password material in logs.
- [x] Existing tests (if any) for `/send` still pass.

### 7. Dependencies

- [x] **MI-01 complete and verified.** `emails.inbox_id` and `inboxes` schema must exist.
- [x] At least one inbox row with valid SMTP credentials in the local DB for the manual send test.
- [x] `siteflow:src/api/crypto.js` `decrypt` available (already exists, used by MI-02).

### 8. Failure Handling

**Max attempts:** 3

**On failure (per attempt):**

- **`decrypt` throws**: log `inbox.id` + error class. Return 500 with `{ error: "Send configuration error" }`. Do not leak the underlying error to the client.
- **`transporter.sendMail` throws (SMTP refused / auth failed)**: log `inbox.id` + error class. Return 500 with `{ error: "Failed to send email" }` (matches the existing pattern at lines 173-175). Do not retry inside the request — let the user retry.
- **Inbox lookup returns nothing despite `email.inbox_id` being non-NULL**: indicates an FK orphan (inbox row deleted while email row still references it). Surface as 409 per spec.
- **`req.tenant.id` mismatch with `inbox.tenant_id`**: prevented by the WHERE clause; if it happens, the 409 path covers it.

**After max attempts exhausted:**

- Stop. Surface the failure log + the offending email ID + inbox ID to the human.

**Rollback command:** `git checkout HEAD -- src/api/routes/emails.js`. After rollback, the old env-based send path resumes — it will use `process.env.SMTP_*` (still set on srv1572917).

### 9. Learning

**Log to `siteflow:docs/LEARNINGS.md` if:**

- The encrypted SMTP password decrypts to a different value than the encrypted IMAP password for the same inbox (today, save-tenant encrypts the same source string twice — see audit §10).
- `nodemailer` rejects the `from:` because `inbox.email` differs from the SMTP authenticated user (some providers enforce this; if so, surface the policy and the workaround).
- A customer's reply ends up rejected by spam filters because the `from:` domain differs from the SMTP server domain (DKIM/SPF alignment issue).

---

## Human Checkpoint

- [ ] **REQUIRED** — Pre-Flight Research report approved before editing the endpoint.
- [ ] **REQUIRED** — Manual send test result reviewed before deploying.

---

## Pre-Flight Research (Phase A — DO FIRST, then PAUSE)

1. Read audit sections in pillar 4 in full.
2. Read `siteflow:src/api/routes/emails.js` lines 104-177 carefully. Note exact placement of:
   - The email row fetch
   - The placeholder warning logic
   - The signature substitution logic (which still uses tenant tone_profile, NOT inbox)
   - The transporter construction
   - The audit-log INSERT
3. Confirm MI-01 is merged: `sqlite3 <local-db> "SELECT id, tenant_id, smtp_host FROM inboxes"`.
4. Confirm at least one local inbox row has valid SMTP creds (or a way to point at a test SMTP server).
5. `grep -rn "process.env.SMTP" siteflow/src/` — list every reference. Confirm `routes/auth.js` (OTP) is the only other one and that it stays untouched.

**Report back with:**

- A pseudocode sketch of the new `/send` body, ≤30 lines, for the human to confirm placement of the inbox lookup relative to the existing signature substitution and audit-log calls
- Whether your local DB has at least one inbox with valid SMTP creds for the manual send test, or how you plan to test
- Any other `process.env.SMTP_*` references discovered (audit predicts: only `routes/auth.js` for OTP)

**Then WAIT.**

---

## Description

Replace the env-based SMTP transporter in the `/send` endpoint with a per-email lookup of the originating inbox's SMTP credentials. The originating inbox is identified by `email.inbox_id`, which was set by the MI-01 backfill for existing rows and by MI-02's poller for new rows. The reply's `from:` becomes the inbox's email address — the user-visible behavior change.

## Steps

### Phase A — Pre-Flight Research

(Above. Report and wait.)

### Phase B — Implementation

1. Open `siteflow:src/api/routes/emails.js`. Navigate to the `/send` endpoint at line 104.
2. After the email row fetch (lines 106-109) and before the placeholder warning, add the inbox lookup:
   ```js
   const inbox = db
     .prepare("SELECT * FROM inboxes WHERE id = ? AND tenant_id = ?")
     .get(email.inbox_id, req.tenant.id);
   if (!inbox) return res.status(409).json({ error: "Originating inbox not found for this email" });
   ```
3. Add `const { decrypt } = require("../crypto");` near the top of the file (relative path: from `routes/emails.js` to `crypto.js` is `../crypto`).
4. Replace the transporter construction at lines 144-149 with:
   ```js
   const transporter = nodemailer.createTransport({
     host: inbox.smtp_host,
     port: inbox.smtp_port,
     secure: inbox.smtp_port === 465,
     auth: { user: inbox.smtp_user, pass: decrypt(inbox.smtp_password_enc) },
   });
   ```
5. Replace `from: process.env.SMTP_USER` at line 152 with `from: inbox.email`.
6. Verify no other lines reference `process.env.SMTP_*` in this file.

### Phase C — Verification

1. `node --check src/api/routes/emails.js` — syntax check.
2. Start the server locally; hit `POST /api/emails/:id/send` for a test email with valid `inbox_id`. Verify the outbound `from:` matches `inbox.email`.
3. Run the 409 test: NULL the `inbox_id` for one email, hit `/send`, verify 409. Restore.
4. `grep -n "process.env.SMTP" siteflow/src/api/routes/emails.js` returns nothing.
5. Surface the SMTP send log to the human.

## On Completion

- **Commit:** `feat(send): per-inbox SMTP credentials and from: address (MI-03)`
- **Update:** None to CLAUDE.md unless there's a "send flow" section.
- **Handoff notes:**
  - **MI-08 / smoke test:** verify a real reply from each inbox shows the correct `from:` in the customer's inbox.
  - The OTP path in `routes/auth.js` is unchanged and still uses platform SMTP. Do not unify these without explicit scope.
