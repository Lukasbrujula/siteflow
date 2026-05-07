# Task: MI-05 — Email List JOIN + GET /api/inboxes Endpoint

## Status

- [ ] Pending
- [ ] Pre-Flight Research complete (HUMAN APPROVED)
- [ ] In Progress
- [ ] Verified
- [ ] Complete

## Pillars

### 1. Model

`sonnet` — two mechanical additions: a JOIN on the existing list query, and a new read-only endpoint. No architectural decisions remain.

### 2. Tools Required

- [x] Read, Edit (`siteflow:src/api/routes/emails.js`, `siteflow:src/api/server.js`)
- [x] Write (only if creating `siteflow:src/api/routes/inboxes.js` as a separate file — see Phase B step 1 for the call)
- [x] Bash: `node --check`, `curl` against the new endpoints
- [x] Grep (verify no other code path returns inbox credentials)
- [ ] WebFetch
- [ ] Task

### 3. Guardrails (DO NOT)

- Do NOT include credential fields (`imap_password_enc`, `smtp_password_enc`, `imap_host`, `imap_port`, `imap_user`, `smtp_host`, `smtp_port`, `smtp_user`) in the `GET /api/inboxes` response. Only `id`, `email`, `label`, `is_active` per audit §4.5.
- Do NOT change the classification grouping logic at `siteflow:src/api/routes/emails.js:42-53`.
- Do NOT change other endpoints in `routes/emails.js` (`/:id`, `/:id/draft`, `/:id/send`, `/:id/archive`, `/:id/reject`, `/:id/retriage`, `/:id/unsubscribe`).
- Do NOT use `INNER JOIN` on the email list query — must be `LEFT JOIN` so any orphan email (NULL `inbox_id` from a hypothetical pre-MI-01 leftover) still renders.
- Do NOT add the new endpoint under `/api/emails/inboxes` if it conflicts with existing routing — the audit recommends `/api/inboxes` mounted in `server.js`.
- Do NOT skip the `requireAuth` middleware on the new endpoint. Inbox info is per-tenant.

### 4. Knowledge (MUST READ)

- [x] `siteflow:CLAUDE.md` (always)
- [x] `siteflow:docs/audits/MULTI_INBOX_STATE_AUDIT_2026-05-06.md` §2 entries 5 + 7 (list response + new endpoint), §4.5 (combined spec).
- [x] `siteflow:src/api/routes/emails.js` lines 22-58 (list endpoint).
- [x] `siteflow:src/api/server.js` lines 19-25 (route mounting).
- [x] `siteflow:src/api/routes/auth.js` lines 6-19 (sample of how `requireAuth` is used in route files — pattern reference).

### 5. Memory

- The frontend uses the grouped response shape (`{ emails, spam, ad, urgent, ... }`). Adding fields per email is additive; the frontend's `mapBackendEmail` will pick up the new fields in MI-06.
- `LEFT JOIN` on a NULL `inbox_id` returns NULL for the joined columns. Frontend must handle that case (MI-06).
- The new endpoint mirrors a typical "list resources for tenant" pattern. Use `requireAuth` from this file (the existing function at `routes/emails.js:6-20`) or extract to shared if convenient — but no extraction in this task.

### 6. Success Criteria

**Email list (GET /api/emails):**

- [x] SELECT extended to include `e.inbox_id`, `i.email AS inbox_email`, `i.label AS inbox_label`.
- [x] `LEFT JOIN inboxes i ON i.id = e.inbox_id` added.
- [x] WHERE clause unchanged: `e.tenant_id = ?`.
- [x] Status filter unchanged.
- [x] ORDER BY / LIMIT / OFFSET unchanged.
- [x] `preview` mapping at line 38 still works.
- [x] Grouped-by-classification logic at lines 42-53 unchanged.
- [x] Manual `curl /api/emails` with valid session returns each email with the three new fields. Orphan emails (NULL `inbox_id`) return `inbox_email: null` and `inbox_label: null`.

**New endpoint (GET /api/inboxes):**

- [x] Endpoint exists, requires auth.
- [x] Response shape: `{ inboxes: [{ id, email, label, is_active }, ...] }`.
- [x] Filtered by `tenant_id = req.tenant.id`.
- [x] Ordered by `created_at ASC` (deterministic; first-created is "primary").
- [x] No credential fields in any response.
- [x] Manual `curl /api/inboxes` with valid session returns the tenant's inbox list.
- [x] `curl /api/inboxes` without a session cookie returns 401.

**General:**

- [x] `node --check` on every modified/created file.
- [x] No regressions on existing endpoints (smoke test `/api/emails` and `/api/auth/me`).

### 7. Dependencies

- [x] **MI-01 complete and verified.** `inboxes` table and `emails.inbox_id` column must exist.
- [x] At least one tenant + inbox + email locally for the JOIN test.

### 8. Failure Handling

**Max attempts:** 3

**On failure (per attempt):**

- **`SqliteError: no such table: inboxes`**: MI-01 is not deployed. Stop.
- **JOIN returns duplicate rows**: not possible with `LEFT JOIN inboxes i ON i.id = e.inbox_id` because `inboxes.id` is PK. If observed, the JOIN clause is wrong.
- **Frontend test in MI-06 fails because new fields are missing**: probably a typo in the SELECT alias (`AS inbox_email` not `AS inboxEmail`). Match the audit's casing exactly.
- **New endpoint returns credential fields**: the SELECT included them — narrow it to `id, email, label, is_active`.
- **Mounting conflict (404)**: the new route is mounted under wrong prefix. Confirm `app.use("/api/inboxes", ...)` in `server.js` or `router.get("/inboxes", ...)` in a file mounted at `/api`.

**After max attempts exhausted:**

- Surface the failing curl response + the relevant SELECT result.

**Rollback command:** `git checkout HEAD -- src/api/routes/emails.js src/api/server.js src/api/routes/inboxes.js` (last path only if the file was created).

### 9. Learning

**Log to `siteflow:docs/LEARNINGS.md` if:**

- LEFT JOIN performance on the email list is noticeably slower for tenants with many emails (>5k rows). Affects whether `idx_emails_inbox` from MI-01 is on the right column.
- The frontend type system (`dashboard:siteware-frontend/src/types/email.ts`) cannot represent `inbox_email: null` cleanly — informs MI-06.
- A credential field accidentally leaked through the new endpoint in any code path. (Should never happen with the explicit field list, but worth flagging if it does.)

---

## Human Checkpoint

- [ ] **REQUIRED** — Pre-Flight Research report approved before editing routes.
- [ ] **REQUIRED** — Manual `curl /api/inboxes` response reviewed. Specifically: confirm zero credential fields are present.

---

## Pre-Flight Research (Phase A — DO FIRST, then PAUSE)

1. Read audit sections in pillar 4 in full.
2. Read `siteflow:src/api/routes/emails.js` lines 22-58 carefully (the list endpoint and grouping logic).
3. Read `siteflow:src/api/server.js` lines 19-25 (route mounting pattern).
4. Read `siteflow:src/api/routes/auth.js` lines 6-19 (sample `requireAuth` usage). Note: the same pattern is duplicated in `routes/emails.js:6-20`. Either reuse from `emails.js` or duplicate (no extraction in this task).
5. Decide: new file `siteflow:src/api/routes/inboxes.js` mounted at `/api/inboxes`, OR append the route to `routes/emails.js` and keep the mount path in `server.js` accordingly. Audit suggests new file but allows either; recommend new file for clarity.
6. Confirm MI-01 is in place locally.

**Report back with:**

- Decision: new file or appended? With a one-line reason.
- The exact mount line you plan to add to `server.js`.
- Confirmation of zero unexpected references to the soon-to-exist `/api/inboxes` path elsewhere.

**Then WAIT.**

---

## Description

Two additions:

1. **Augment the email list response.** `GET /api/emails` already returns per-email metadata; add `inbox_id`, `inbox_email`, `inbox_label` via a `LEFT JOIN`. Existing classification grouping is unaffected.
2. **Add `GET /api/inboxes`.** A read-only, auth-required endpoint returning the tenant's inboxes (id, email, label, is_active only — no creds). Used by the dashboard's `InboxFilter` in MI-06 to populate the dropdown.

## Steps

### Phase A — Pre-Flight Research

(Above. Report and wait.)

### Phase B — Implementation

1. **Email list JOIN.** In `siteflow:src/api/routes/emails.js`, change the query string at line 27 from a flat `SELECT ... FROM emails WHERE tenant_id = ?` to:
   ```js
   `SELECT e.id, e.from_address, e.subject, e.body, e.draft_reply, e.received_at,
           e.classification, e.sentiment, e.urgency, e.confidence,
           e.escalation_triggered, e.escalation_reason, e.reasoning, e.status, e.created_at,
           e.inbox_id, i.email AS inbox_email, i.label AS inbox_label
      FROM emails e
      LEFT JOIN inboxes i ON i.id = e.inbox_id
     WHERE e.tenant_id = ?`
   ```
   Update the `if (status)` branch's append from `" AND status = ?"` to `" AND e.status = ?"` to match the new alias. Same for `ORDER BY received_at DESC` → `ORDER BY e.received_at DESC`. The classification grouping at lines 42-53 still reads `email.classification`, `email.escalation_triggered` — no change needed there.
2. **New endpoint.** Create `siteflow:src/api/routes/inboxes.js` (or append to `routes/emails.js` per Pre-Flight decision):
   ```js
   const express = require("express");
   const router = express.Router();
   const { db } = require("../../db");

   function requireAuth(req, res, next) {
     // Same shape as routes/emails.js:6-20
     const sessionId = req.cookies?.session;
     if (!sessionId) return res.status(401).json({ error: "Not authenticated" });
     const now = Math.floor(Date.now() / 1000);
     const session = db
       .prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > ?")
       .get(sessionId, now);
     if (!session) return res.status(401).json({ error: "Session expired" });
     const tenant = db.prepare("SELECT * FROM tenants WHERE id = ?").get(session.tenant_id);
     if (!tenant) return res.status(401).json({ error: "Tenant not found" });
     req.tenant = tenant;
     next();
   }

   router.get("/", requireAuth, (req, res) => {
     const inboxes = db
       .prepare("SELECT id, email, label, is_active FROM inboxes WHERE tenant_id = ? ORDER BY created_at ASC")
       .all(req.tenant.id);
     res.json({ inboxes });
   });

   module.exports = router;
   ```
3. **Mount.** In `siteflow:src/api/server.js`, add near line 24:
   ```js
   app.use("/api/inboxes", require("./routes/inboxes"));
   ```

### Phase C — Verification

1. `node --check` on all modified files.
2. Run the server. `curl http://localhost:3000/api/emails` (with session) returns the new fields.
3. `curl http://localhost:3000/api/inboxes` (with session) returns `{ inboxes: [...] }` with only the four allowed fields per row. Verify zero credential fields with: `curl ... | jq '.inboxes[0] | keys'` — expect exactly `["email", "id", "is_active", "label"]`.
4. `curl` without session returns 401.

## On Completion

- **Commit:** `feat(api): add /api/inboxes endpoint and inbox JOIN on /api/emails (MI-05)`
- **Update:** None to CLAUDE.md unless there's an "API endpoints" section to amend.
- **Handoff notes:**
  - **MI-06 (frontend):** consume `/api/inboxes` via a new `lib/api/inboxes.ts`. Per-email `inbox_id`/`inbox_label` is on every email returned by `/api/emails` — surface in `mapBackendEmail`.
  - **Smoke test (T8):** confirm zero credential fields in `/api/inboxes` response on a real session against srv1572917.
