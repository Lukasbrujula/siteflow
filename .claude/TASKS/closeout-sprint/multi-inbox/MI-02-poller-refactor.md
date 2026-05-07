# Task: MI-02 — Poller Refactor to Per-Inbox Loop

## Status

- [ ] Pending
- [ ] Pre-Flight Research complete (HUMAN APPROVED)
- [ ] In Progress
- [ ] Verified
- [ ] Complete

## Pillars

### 1. Model

`sonnet` — non-trivial refactor with concrete spec. Connection lifecycle and error isolation are mechanical once the spec is locked.

### 2. Tools Required

- [x] Read, Edit (file operations on `siteflow:src/poller/index.js`)
- [x] Bash: run the poller locally (`node src/poller/index.js`) against a local DB with one or more inbox rows; `sqlite3` for verifying inserted email rows have `inbox_id` populated
- [x] Grep, Glob (verify no other code references `process.env.IMAP_*`)
- [ ] Write (no new files in `src/poller/`)
- [ ] WebFetch
- [ ] Task (sub-agents)

### 3. Guardrails (DO NOT)

- Do NOT modify `siteflow:src/db.js`. MI-01 owns schema.
- Do NOT derive `inbox_id` from email headers, `from_address`, `Delivered-To`, or any other source. **The `inbox_id` stamped on each insert MUST be the loop variable's `inbox.id`** per audit §1, §4.1 invariant. This is non-negotiable: forwarded mail and aliasing must not break attribution.
- Do NOT silently fall back to `process.env.IMAP_*` if the `inboxes` SELECT returns zero rows. An empty inbox table is a real condition (no tenants onboarded yet) and should produce a benign log line, not a fallback.
- Do NOT change the polling cadence (`INTERVAL` env var, `setInterval`).
- Do NOT change the `mailparser` / `imap-simple` / message-id dedup logic.
- Do NOT change the `since`/`SINCE`/`UNSEEN` search criteria.
- Do NOT introduce a new dependency.
- Do NOT log decrypted passwords. Ever.

### 4. Knowledge (MUST READ)

- [x] `siteflow:CLAUDE.md` (always)
- [x] `siteflow:docs/audits/MULTI_INBOX_STATE_AUDIT_2026-05-06.md` §1 (executive summary — invariant on inbox_id), §2 entry 2 (poller surface), §4.1 (poller change spec), §10 (poller is env-coupled — explains the magnitude of this change).
- [x] `siteflow:src/poller/index.js` (entire file — 122 lines)
- [x] `siteflow:src/api/crypto.js` (read fully to confirm `decrypt()` signature, error modes, key source)
- [x] `siteflow:src/db.js` (only to confirm the `inboxes` schema MI-01 introduced — do not modify)

### 5. Memory

- Today's poller uses ONE global IMAP config from `process.env` (`siteflow:src/poller/index.js:7-17`) and selects `tenants LIMIT 1` (line 72). Both must go.
- After MI-01, every existing email row has `inbox_id` populated by the migration backfill. The poller's INSERT must populate it too for new rows.
- The `inboxes.is_active` flag is the soft-disable mechanism. Filter on it.
- Existing connection error handling at `siteflow:src/poller/index.js:111-116` ends the connection in a catch block. Preserve this pattern per-inbox.
- The `decrypt` function in `siteflow:src/api/crypto.js` is a pure function over `(ciphertext) → plaintext` using a key from `process.env.ENCRYPTION_KEY`. If the env var is missing, it throws.

### 6. Success Criteria

- [x] `pollSingleInbox(inboxRow)` function exists, accepting one inbox row.
- [x] Outer loop in the cycle iterates `db.prepare("SELECT * FROM inboxes WHERE is_active = 1").all()`.
- [x] Each inbox iteration is wrapped in its own try/catch. A thrown exception inside one iteration must not skip subsequent iterations.
- [x] No reads of `process.env.IMAP_USER`, `process.env.IMAP_PASSWORD`, or `process.env.IMAP_HOST` remain anywhere in `siteflow:src/poller/index.js`. (`grep -n "process.env.IMAP" siteflow/src/poller/index.js` returns nothing.)
- [x] The INSERT statement carries both `tenant_id` (= `inboxRow.tenant_id`) and `inbox_id` (= `inboxRow.id`).
- [x] Local smoke test: insert a single inbox row pointing at a working IMAP server. Run the poller. Verify a fetched email lands in the DB with the correct `inbox_id` and `tenant_id`.
- [x] Failure isolation test: insert two inbox rows, one with deliberately wrong `imap_host` and one with working creds. Run the poller. Verify the working inbox fetches messages while the broken one logs an error and is skipped.
- [x] No password material appears in any log line.
- [x] `node src/poller/index.js` starts cleanly without warnings about missing env vars (since the new code does not use them for IMAP).

### 7. Dependencies

- [x] **MI-01 complete and verified.** The `inboxes` table must exist with the expected fields, and `emails.inbox_id` must be present.
- [x] `siteflow:src/api/crypto.js` exists and exports `decrypt()` (existing — no creation).
- [x] `process.env.ENCRYPTION_KEY` set in the runtime environment (it is, per `install.sh`).
- [x] At least one row in `inboxes` for local testing.

### 8. Failure Handling

**Max attempts:** 3

**On failure (per attempt):**

- **`decrypt` throws on a specific row**: log `inbox.id` + the error message (NOT the ciphertext). Skip that inbox. Continue to next. Do not retry.
- **IMAP connection refused / timeout / auth failure**: log `inbox.id` + the error class. End the connection (ignore errors from `connection.end()`). Continue to next inbox.
- **`mailparser` throws on a specific message**: existing pattern at lines 94-101 already handles this — preserve. Continue to next message in the same inbox.
- **INSERT fails with FK violation**: should not happen (MI-01 guarantees inbox row exists). If it does, MI-01 is incomplete — stop and surface.
- **`SELECT * FROM inboxes WHERE is_active = 1` returns empty**: log `[poller] no active inboxes — nothing to do` and return. Not an error.

**After max attempts exhausted (cycle level):**

- Surface to human with the per-inbox failure log. Do not loop forever in `setInterval`.

**Rollback command:** `git checkout HEAD -- src/poller/index.js`. After rollback, the old env-based poller resumes; it will use `process.env.IMAP_*` (which still works on srv1572917 per audit §6.1).

### 9. Learning

**Log to `siteflow:docs/LEARNINGS.md` if:**

- `decrypt` requires a different env var or signature than expected.
- An inbox row passes the `WHERE is_active = 1` filter but has malformed credentials (the application-layer invariant from MI-01 holds, but if not, this is the place it would surface).
- `imap-simple` connection cleanup leaks file descriptors when one of N inboxes is unreachable.
- Per-inbox connection setup adds material latency to the cycle (>2s per inbox). Affects how many inboxes a tenant can scale to.
- The order of inboxes in the SELECT matters somehow (it shouldn't — but if so, document).

---

## Human Checkpoint

- [ ] **REQUIRED** — Pre-Flight Research report approved before refactoring `src/poller/index.js`.
- [ ] **REQUIRED** — After implementation, before deploy: human must approve the failure-isolation test result (one broken inbox, one working).

---

## Pre-Flight Research (Phase A — DO FIRST, then PAUSE)

1. Read the audit sections in pillar 4 in full.
2. Read `siteflow:src/poller/index.js` end-to-end. Confirm:
   - Lines 7-17: env-based config block (will be removed)
   - Line 72: `LIMIT 1` tenant lookup (will be removed)
   - Lines 78-90: INSERT statement (will gain `inbox_id`)
   - Lines 111-116: connection error handling pattern (preserve)
3. Read `siteflow:src/api/crypto.js` end-to-end. Report:
   - Exact `decrypt` signature (`decrypt(ciphertext: string): string`?)
   - Where the encryption key comes from
   - What it throws on bad input
4. `grep -rn "process.env.IMAP" siteflow/src/` — list every reference. The poller is the canonical one; surface anything else.
5. Verify MI-01 is merged: `sqlite3 <local-db> ".schema inboxes"` returns the table definition.
6. Confirm `process.env.ENCRYPTION_KEY` is set in your local environment (without printing the value).

**Report back to the human with:**

- `decrypt` signature and key source
- Any `process.env.IMAP_*` references outside the poller
- Confirmation that `inboxes` table exists locally
- A proposed pseudocode sketch of the new `pollSingleInbox(inboxRow)` and the outer cycle loop, no more than 25 lines, for the human to spot any divergence from audit §4.1 before implementation

**Then WAIT. Do not start Phase B until approved.**

---

## Description

Refactor `siteflow:src/poller/index.js` from a single-global-config single-tenant poller to a per-inbox-loop poller. Each iteration of the loop builds an IMAP config from one row of the `inboxes` table, decrypts the password using `siteflow:src/api/crypto.js`, fetches new messages, and inserts each message with `inbox_id` set to the loop variable's `id`.

This is the largest single code change in the multi-inbox sprint (~3h). It also resolves a hidden coupling: today's poller is single-inbox because it reads from `process.env`, not because the schema enforces it.

## Steps

### Phase A — Pre-Flight Research

(Above. Report and wait.)

### Phase B — Implementation

1. Remove the global `config` object at lines 7-17.
2. Add `const { decrypt } = require("../api/crypto");` near the top.
3. Refactor `pollInbox()` to `pollSingleInbox(inboxRow)`:
   - Build the connection config from `inboxRow.imap_host`, `inboxRow.imap_port`, `inboxRow.imap_user`, `decrypt(inboxRow.imap_password_enc)`.
   - Replace the `LIMIT 1` tenant lookup at line 72 with `const tenantId = inboxRow.tenant_id;`.
   - Update the INSERT to include `inbox_id` at the matching position. Pass `inboxRow.id`.
   - Preserve the existing dedup-by-message-id logic, the existing `markSeen: false` behavior, and the existing per-message try/catch.
4. Replace the top-level `pollInbox()` invocation and the `setInterval` body with an outer loop:
   ```js
   async function runCycle() {
     const inboxes = db.prepare("SELECT * FROM inboxes WHERE is_active = 1").all();
     if (inboxes.length === 0) {
       console.log("[poller] no active inboxes");
       return;
     }
     for (const inbox of inboxes) {
       try { await pollSingleInbox(inbox); }
       catch (err) { console.error("[poller] inbox", inbox.id, "failed:", err.message); }
     }
   }
   runCycle();
   setInterval(runCycle, INTERVAL);
   ```
5. Confirm no `process.env.IMAP_*` references remain.

### Phase C — Verification

1. Run all Pillar 6 success criteria.
2. Run the failure-isolation test: two inbox rows, one with bad creds, one good. Verify good inbox still polls.
3. Surface the local poller log to the human for the second human checkpoint.

## On Completion

- **Commit:** `feat(poller): per-inbox loop, drop env-based IMAP config (MI-02)`
- **Update:** `siteflow:CLAUDE.md` if there's a section describing the poller's data flow — note that IMAP creds now come from the DB. (If no such section exists, skip.)
- **Handoff notes:**
  - **MI-03 (send):** the analogous pattern for SMTP. Look up inbox by `email.inbox_id`, decrypt password, build transporter.
  - **MI-08 / smoke test:** new behavior on the VPS — multiple inboxes can be added, each polls independently.
  - The old `process.env.IMAP_*` env vars are unused after this commit. They can stay in the `.env` for soft rollback (revert this commit, env vars are still there). v1.1 cleanup may remove them.
