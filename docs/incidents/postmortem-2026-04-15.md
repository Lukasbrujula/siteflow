# Post-mortem: April 15, 2026 — Poller silently dropping emails

**Authors:** Lukas Margenfeld (with Claude as co-pilot)
**Date of incident:** Approximately April 9–15, 2026 (gradual degradation, full failure on April 15)
**Date of resolution:** April 15, 2026, ~23:00 CET
**Severity:** High — production pipeline non-functional for ~6 days
**Customer impact:** Single test tenant; no real customer affected. But this is a class of bug that would catastrophically affect production tenants, hence the writeup.

---

## TL;DR

Three independent bugs stacked on top of each other made the symptom hard to diagnose:

1. **Stale SQLite WAL/SHM file handles** in the poller process caused INSERTs to land in orphaned files invisible to other processes. Caused by someone (likely an earlier troubleshooting session) deleting `siteflow.db-wal` while the poller was running.
2. **Gmail credentials were wiped from `.env`** by a `git pull` that brought down a "scrub credentials" commit. Old PM2 processes survived on in-memory env until they were restarted, hiding the problem.
3. **Siteware API tokens were dead** (rotated/revoked at some point). This was masked by bug #2 — the workflow couldn't even reach Siteware because no new emails were being processed.

Fix order: restart poller (resolved #1) → restore Gmail creds + restart all (resolved #2 and surfaced #3) → regenerate Siteware token + restart workflow (resolved #3).

Total resolution time once we sat down to fix it: about 90 minutes including misdirection.

---

## Timeline

| When | What |
|---|---|
| ~April 9 | Last known successful end-to-end processing. The `siteflow.db` main file's mtime is from this date. |
| Sometime April 9–15 | Someone runs `rm` on `siteflow.db-wal` or `-shm` while the poller process is running. The poller's open file descriptors keep pointing at the now-deleted inodes. |
| Sometime April 9–15 | Commit `073ab04 chore: scrub credentials from .env — use placeholders` is pushed to the repo. |
| Sometime April 9–15 | A `git pull` is run on the server. `.env` on disk is overwritten with placeholder values. PM2 processes keep running on their in-memory environment from before the pull, so nothing visibly breaks immediately. |
| Sometime April 9–15 | Siteware token is rotated (likely by Andreas as part of normal hygiene). Old token now returns 403 from Siteware API. |
| April 15, ~21:00 | Lukas notices the poller logs "Saved" but rows don't appear. Starts investigation. |
| April 15, ~22:00 | Code-path analysis (via Claude Code) rules out the four most likely hypotheses (silent `continue`, hash collision, FK mismatch, transaction issues). All proven impossible by literal code reading. |
| April 15, ~22:30 | Pivot to environmental investigation. `lsof` reveals stale `(deleted)` file handles on `.db-wal` and `.db-shm`. |
| April 15, ~22:45 | `pm2 restart poller` clears stale handles. Test confirms INSERT now persists. But no new emails arriving — IMAP also broken. |
| April 15, ~22:50 | `grep` of `.env` reveals all credentials are placeholders. `git log` shows the scrub commit. New Gmail App Password generated. |
| April 15, ~23:00 | New `.env` written. All processes restarted. Poller succeeds, picks up 17 emails including two test emails sent earlier. |
| April 15, ~23:05 | Workflow now fails on every email with `Triage passthrough 403`. Siteware token is dead. |
| April 15, ~23:10 | New Siteware key generated with both agents allowlisted. Updated in `.env`. Both tokens verified with curl. |
| April 15, ~23:15 | First sed on Reply token didn't take (operator error, copy-paste hiccup). Caught by sha256sum comparison. Re-applied. |
| April 15, ~23:20 | Full pipeline working end-to-end. Status counts: 20 archived, 6 draft, 0 error. Test emails A and B both processed correctly. |

---

## Root causes

### Root cause 1: Deleted SQLite files while a process held them open

On Unix, deleting a file that a process has open does not actually free the inode — it just unlinks the directory entry. The process continues writing to the orphaned inode forever. Other processes that open a file with the same name get a fresh inode.

For SQLite in WAL mode, the writer process appends to `<dbname>.db-wal`. Other connections read both the main file and the WAL via the `.db-shm` index. If the writer's WAL handle points to a deleted inode while the readers' handles point to the current on-disk WAL, the writer's commits are real (from its perspective) but invisible to everyone else.

**Why it happened:** Almost certainly a previous troubleshooting session ran something like `rm /opt/siteflow/data/siteflow.db-*` to "clean up" the WAL/SHM files, not realizing the poller was holding handles to them.

**Why it survived for days:** No symptom was visible until you actually tried to query the data. The poller was happy, the workflow was processing the older rows it could see, and PM2 didn't crash.

### Root cause 2: Tracking `.env` in git

`.env` was committed to the repository at some point. A later commit scrubbed the values to placeholders (probably with the right intention — preventing secrets in the repo). On the next `git pull` on the server, the on-disk file was overwritten.

The processes didn't fail immediately because Linux processes carry their environment in memory — they don't re-read `.env` unless restarted. So the bug was latent until the next `pm2 restart`, which is exactly what happened during this troubleshooting session.

**Why it survived undetected:** The same in-memory env protection that hid the problem also meant nobody noticed. The first thing that exposed it was *us*, when we restarted the poller to fix bug #1.

### Root cause 3: API tokens with no monitoring

The Siteware tokens died at some point and nobody was alerted. Same as bug #2, this was hidden by bug #1 — no emails were being processed at all, so no one noticed Siteware was also broken.

---

## What made this hard to diagnose

1. **Three bugs stacked.** Fixing #1 immediately surfaced #2. Fixing #2 immediately surfaced #3. Each fix felt like "we made it worse" until the next layer was visible.
2. **The most prominent symptom (Saved logs but no rows) had no plausible code-path explanation.** A careful code reading by Claude Code ruled out every named hypothesis. This was correct — the bug was environmental, not in the code at all. But it took time to accept that.
3. **The "ghost" PM2 processes.** Until we restarted, the poller was occasionally succeeding (we saw "Saved" lines in the log). That made it look like the code was *almost* working. In reality, those successes were writing to deleted files and the credentials being used were stale in-memory values from before the `.env` scrub.

---

## What went well

- **Methodical hypothesis-rule-out via code reading** (Claude Code). Even though the hypotheses were wrong, ruling them out cleanly forced us to look elsewhere instead of speculatively patching code.
- **Confirming each fix incrementally.** We didn't try to fix everything at once; each layer was validated (lsof clean, count goes up, curl returns 200, error count drops) before moving on.
- **The sha256sum check on the two tokens** caught a silently-failed sed before it cost us another 20 minutes of confusion.

## What went poorly

- **No one wrote down what they did.** The original `rm` of the WAL files (if that's what happened) was never recorded. No commit message explained the `.env` scrub's impact. No record of when the Siteware token rotated. All of these contributed to the diagnostic time.
- **Initial mental model was "the code is broken."** It was easier and more satisfying to look at the code than to verify the runtime environment. The actual evidence pointing to environment (the file mtimes, the older successful rows, the "stopped working recently" pattern) was there from the start, but ignored.
- **No alerting.** The pipeline was broken for ~6 days before anyone noticed. Production tenants would have been catastrophic.

---

## Action items

### Immediate (do today/tomorrow)

- [ ] **Untrack `.env` from git** and add to `.gitignore`. Verified the fix is in place after this commit; future pulls cannot overwrite credentials.
- [ ] **Rotate the Gmail App Password** that was pasted into chat during this session. Same for both Siteware JWTs.
- [ ] **Document the working `.env` template** somewhere outside the repo (1Password, Bitwarden, encrypted file) so future deploys have a reference of the real variable shape.

### Short-term (this week)

- [ ] **Add a health-check endpoint** to the API that returns 500 if any of: poller hasn't logged a successful poll in >10 minutes, workflow has >N rows in `error` status, IMAP credentials have failed >5 times in a row. Hit it from an external monitor (UptimeRobot, etc.).
- [ ] **Add per-message try/catch in the poller** — currently any throw inside the per-message loop aborts the rest of the batch via the outer catch. A per-message try/catch with `console.error("[poller] Skipped msg X:", err)` would have made tonight's diagnosis much faster.
- [ ] **Alert on PM2 restart count thresholds.** The workflow had 3,901 restarts before this session — that's not "online and working," that's "crash-looping." We need to surface that.

### Medium-term (this month)

- [ ] **Multi-tenant work** (separate priority — currently this is a single-tenant install).
- [ ] **Onboarding flow** for tone profile and signature capture.
- [ ] **Dashboard frontend bugs** (dates, confidence, sort order, original body display, MIME-encoded subjects).
- [ ] **Soft-warning instead of hard 422 block** for unfilled placeholders (CEO bug 5).
- [ ] **Token rotation playbook** — when Andreas rotates a Siteware token, what's the procedure? Currently it's "everything breaks until someone manually updates `.env`." Needs to be either automated or at least documented.

### Long-term / process

- [ ] **Never rm WAL/SHM files while processes are running.** If WAL needs cleanup, run `PRAGMA wal_checkpoint(TRUNCATE)` from a connection, or stop processes first. Add this to the runbook.
- [ ] **Every config change goes through `.env` + `pm2 restart all --update-env`.** No silent SSH edits, no `export` in shell, no PM2 ecosystem file edits. One canonical source of truth.
- [ ] **Decide repo strategy for `.env.example`.** A template file (`.env.example`) tracked in git with placeholder names (no real values, just variable names) is best practice. Real `.env` is generated at install time and never tracked.

---

## Lessons for trainees onboarding new customers

If you're setting up SiteFlow for a new customer and something doesn't work:

1. **Always check `.env` first.** Many problems trace back to a value being a placeholder, missing, or rotated.
2. **Always check what's actually running, not just what's on disk.** `cat /proc/$(pm2 pid <process>)/environ | tr '\0' '\n'` shows the live env. `pm2 describe <process>` shows the live script path. These can differ from what you expect.
3. **Always send a test email with a unique, distinctive subject** before declaring something fixed. "It looks fine in the logs" is not the same as "the data is in the database."
4. **Always confirm tokens with the diagnostic endpoint:** `curl https://api.siteware.io/v1/api/agents -H "Authorization: Bearer $TOKEN"`. A token can be in `.env`, look correct, and still be dead.
5. **If a fix surfaces a new error, that's progress, not regression.** Each layer of broken hides the next layer.
