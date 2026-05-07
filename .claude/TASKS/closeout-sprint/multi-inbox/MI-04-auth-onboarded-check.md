# Task: MI-04 — Auth /me Onboarded Check Uses Inbox Existence

## Status

- [ ] Pending
- [ ] Pre-Flight Research complete (HUMAN APPROVED)
- [ ] In Progress
- [ ] Verified
- [ ] Complete

## Pillars

### 1. Model

`sonnet` — trivial change (~10 lines). One SELECT modified, one boolean expression replaced.

### 2. Tools Required

- [x] Read, Edit (`siteflow:src/api/routes/auth.js` only)
- [x] Bash: `node --check`, manual `curl` against `/api/auth/me`
- [x] Grep (sanity check no other code reads `tenant.imap_host` for onboarded purposes)
- [ ] Write
- [ ] WebFetch
- [ ] Task

### 3. Guardrails (DO NOT)

- Do NOT change `request-otp`, `verify-otp`, `logout`, or the OTP transporter setup in this file. Only the `/me` endpoint (lines 124-152) is in scope.
- Do NOT remove the `tone_profile` portion of the onboarded check. Multi-inbox does not change tone-profile semantics — still tenant-scoped per audit §4.2 (workflow agnostic locked).
- Do NOT add a new boolean field to the response shape. The response key is still `onboarded: boolean` on the `tenant` object.
- Do NOT change the SELECT's other returned columns (`id`, `email`, `role`).
- Do NOT add a JOIN onto the existing tenants SELECT — keep the inbox-existence check as a separate prepared statement, matching the audit §4.4 spec.

### 4. Knowledge (MUST READ)

- [x] `siteflow:CLAUDE.md` (always)
- [x] `siteflow:docs/audits/MULTI_INBOX_STATE_AUDIT_2026-05-06.md` §2 entry 5 (auth surface), §4.4 (auth check spec).
- [x] `siteflow:src/api/routes/auth.js` lines 124-152 (the `/me` endpoint).

### 5. Memory

- The onboarded boolean drives the dashboard's onboarding-vs-app routing. False → wizard view (which is BROKEN per the companion audit, but still the route). True → main dashboard.
- After MI-01's migration, every tenant on srv1572917 with `imap_host` populated also has at least one row in `inboxes`. So the new check returns the same value as the old check for those tenants.
- Tenants created via the manual SQL runbook (post-MI-01) must INSERT into `inboxes` to flip onboarded to true. This is reflected in the runbook delta task (T7 in audit §8).

### 6. Success Criteria

- [x] The line at `siteflow:src/api/routes/auth.js:142` is replaced. New logic:
  ```js
  const hasActiveInbox = db
    .prepare("SELECT 1 FROM inboxes WHERE tenant_id = ? AND is_active = 1 LIMIT 1")
    .get(tenant.id);
  const onboarded = Boolean(hasActiveInbox) && Boolean(tenant.tone_profile);
  ```
- [x] `imap_host` is removed from the SELECT at lines 135-138. New SELECT: `SELECT id, email, role, tone_profile FROM tenants WHERE id = ?`.
- [x] `curl http://localhost:3000/api/auth/me` (with valid session cookie) for a tenant with at least one active inbox + non-NULL `tone_profile` returns `onboarded: true`.
- [x] Same call for a tenant with no inbox rows returns `onboarded: false`.
- [x] Same call for a tenant with an inbox row but `is_active = 0` returns `onboarded: false`.
- [x] Same call for a tenant with active inbox but NULL `tone_profile` returns `onboarded: false`.
- [x] No other endpoints' behavior changed.
- [x] `node --check src/api/routes/auth.js`.

### 7. Dependencies

- [x] **MI-01 complete and verified.** The `inboxes` table must exist with `is_active`.
- [x] (For local testing) at least one tenant row + at least one inbox row.

### 8. Failure Handling

**Max attempts:** 3

**On failure (per attempt):**

- **Prepared statement throws "no such table: inboxes"**: MI-01 is not deployed. Stop and verify.
- **`/me` returns `onboarded: false` for a tenant that should be onboarded**: check MI-01's backfill ran for that tenant. `SELECT id, is_active FROM inboxes WHERE tenant_id = ?` should return at least one `is_active = 1` row.
- **Tenants with malformed `tone_profile` (non-JSON string) cause the auth check to throw**: shouldn't happen since the new code uses `Boolean(tenant.tone_profile)` (a string check), not `JSON.parse`. If it does, audit §10's adjacent finding about save-tenant ON CONFLICT may be relevant.

**After max attempts exhausted:**

- Stop. Show the human the SELECT result for the affected tenant.

**Rollback command:** `git checkout HEAD -- src/api/routes/auth.js`. After rollback, the old check (`Boolean(tenant.imap_host)`) resumes; tenants on srv1572917 still have `imap_host` populated (kept post-migration per audit §3.3) so onboarded remains true.

### 9. Learning

**Log to `siteflow:docs/LEARNINGS.md` if:**

- A tenant exists with `tone_profile` populated but no inbox row, or vice versa. Indicates the runbook didn't insert both.
- The boolean coerces a `tone_profile` value to true that shouldn't count as onboarded (e.g., empty JSON object `{}`). If discovered, the check should become stricter (`tone_profile && tone_profile !== "{}"`); flag as v1.1 work.

---

## Human Checkpoint

- [ ] **REQUIRED** — Pre-Flight Research report approved before editing the endpoint.

---

## Pre-Flight Research (Phase A — DO FIRST, then PAUSE)

1. Read audit sections in pillar 4 in full.
2. Read `siteflow:src/api/routes/auth.js` lines 124-152.
3. Confirm MI-01 schema is in place locally: `sqlite3 <local-db> "SELECT id, tenant_id, is_active FROM inboxes"`.
4. `grep -rn "tenant.imap_host\|imap_host" siteflow/src/` — list everywhere `imap_host` is currently read or written. Confirm:
   - `siteflow:src/api/routes/auth.js:142` (this task)
   - `siteflow:src/api/server.js` save-tenant (kept post-migration per audit §3.3 — do not touch)
   - No other reads
5. Find a tenant + inbox combination locally (or note that you'll need to create one) for the four success-criteria scenarios.

**Report back with:**

- The exact line numbers of `imap_host` references found and which are in scope (only line 142)
- Local test plan for the four onboarded scenarios (active inbox + tone, no inbox, inactive inbox, no tone)

**Then WAIT.**

---

## Description

Swap the onboarded check at `siteflow:src/api/routes/auth.js:142` from `Boolean(tenant.imap_host) && Boolean(tenant.tone_profile)` to an inbox-existence check. Drop `imap_host` from the SELECT. The boolean meaning is unchanged for existing tenants; semantics now match the multi-inbox model.

## Steps

### Phase A — Pre-Flight Research

(Above. Report and wait.)

### Phase B — Implementation

1. Open `siteflow:src/api/routes/auth.js`.
2. At lines 135-138, change the SELECT from:
   ```js
   "SELECT id, email, role, imap_host, tone_profile FROM tenants WHERE id = ?"
   ```
   to:
   ```js
   "SELECT id, email, role, tone_profile FROM tenants WHERE id = ?"
   ```
3. Replace line 142 with the two-statement inbox check from Pillar 6.
4. Confirm the response shape at lines 144-152 is unchanged — `tenant.imap_host` was never returned, only used for the boolean.

### Phase C — Verification

1. `node --check src/api/routes/auth.js`.
2. Run the four `curl /api/auth/me` scenarios from Pillar 6.
3. `grep -n "imap_host" siteflow/src/api/routes/auth.js` returns nothing.

## On Completion

- **Commit:** `refactor(auth): /me onboarded check uses inbox existence (MI-04)`
- **Update:** No CLAUDE.md change.
- **Handoff notes:**
  - **MI-06 (frontend):** the dashboard's onboarding-route guard relies on the `onboarded` field. No frontend change needed in this task — the field meaning is preserved.
  - **Manual SQL runbook (T7 delta):** Stefan's per-customer SQL must INSERT into `inboxes` before `/me` returns `onboarded: true`. Document explicitly in the runbook update.
