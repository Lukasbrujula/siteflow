# Multi-Inbox State Audit — 2026-05-06

**Author:** Claude (research mode)
**Status:** Final
**Companion audit:** `siteflow:docs/audits/ONBOARDING_STATE_AUDIT_2026-05-06.md`
**Decision informed:** Minimum viable engineering set to support multiple IMAP/SMTP inboxes per tenant in v1, fitting in ~8–12h on top of the existing closeout sprint.

---

## 1. Executive Summary

- **Schema change is small.** One new `inboxes` table + one new column (`emails.inbox_id`). Existing `tenants.imap_*` / `smtp_*` columns are kept post-migration to enable soft rollback (revert code, leave schema).
- **Workflow is already inbox-agnostic.** Verified: `siteflow:src/workflow/index.js` reads only `tone_profile` from tenants. v1 keeps one tone profile per tenant; per-inbox tone is v1.1.
- **Poller change is the largest engineering item (~3h).** It also resolves a hidden coupling: today's poller reads IMAP creds from `process.env`, not from the DB — so single-inbox is enforced by env vars, not by schema. This makes migration safer (poller can keep running during the schema change) but means the "real" code change is bigger than just adding a loop.
- **Send path becomes per-inbox (~1.5h).** Reply uses the originating inbox's SMTP creds and `from:` address. The originating inbox is identified by `emails.inbox_id`, which is set by the poller's loop variable — never derived from headers or `from_address`.
- **Frontend filter is additive, not a replacement (~3.5h).** New `InboxFilter` dropdown in the header, intersects with existing classification tabs. Default = "Alle Postfächer." Tabs and slice-keyed email store untouched. Tab badge counts respect the inbox filter.
- **Engineering subtotal: ~11.5h.** Within budget. Total with runbook + smoke test: 14.0h.

---

## 2. Current Single-Inbox Surface Inventory

| # | Surface | Citation | Status |
|---|---------|----------|--------|
| 1 | Schema (tenants/emails) | `siteflow:src/db.js:16-71`, `99-107` | `ASSUMES_SINGLE_INBOX` |
| 2 | Poller | `siteflow:src/poller/index.js:7-122` | `ASSUMES_SINGLE_INBOX` |
| 3 | Workflow | `siteflow:src/workflow/index.js:156-209`, `262-282` | `INBOX_AGNOSTIC` |
| 4 | Send path | `siteflow:src/api/routes/emails.js:104-177` | `ASSUMES_SINGLE_INBOX` |
| 5 | Auth `/me` onboarded check | `siteflow:src/api/routes/auth.js:135-152` | `ASSUMES_SINGLE_INBOX` |
| 6 | Onboarding `save-tenant` | `siteflow:src/api/server.js:461-534` | `ASSUMES_SINGLE_INBOX` (wizard BROKEN per companion audit; runbook is canonical) |
| 7 | Email list response | `siteflow:src/api/routes/emails.js:23-58` | `ASSUMES_SINGLE_INBOX` |
| 8 | Frontend filter pattern | `dashboard:siteware-frontend/src/components/layout/CategoryTabs.tsx:19-129`; `dashboard:siteware-frontend/src/lib/store/email-store.ts:14-21`; `dashboard:siteware-frontend/src/lib/store/ui-store.ts:4-29` | `ASSUMES_SINGLE_INBOX` (single-dimensional data shape) |

**Key per-surface details:**

- **Poller** uses global env-based config (`process.env.IMAP_USER` etc.) at `siteflow:src/poller/index.js:7-17`. Tenant resolution is `LIMIT 1` at line 72. Email INSERT at lines 78-90 carries no inbox attribution.
- **Workflow** reads only `tenants.tone_profile` (`siteflow:src/workflow/index.js:157-159`, `262-264`). No reads of `imap_*` / `smtp_*`. Confirmed `INBOX_AGNOSTIC`.
- **Send path** sources SMTP from `process.env.SMTP_*` at `siteflow:src/api/routes/emails.js:144-149`. `from:` is `process.env.SMTP_USER` at line 152.
- **Auth onboarded check** at `siteflow:src/api/routes/auth.js:142` reads `tenant.imap_host` directly.
- **Frontend** has 7 fixed classification tabs (`CategoryTabs.tsx:19-27`) and a 7-array slice-keyed email store (`email-store.ts:14-21`). No second filter dimension exists in the data shape; the `Tabs` component itself is reusable.

---

## 3. Required Schema Changes

### 3.1 New `inboxes` table — `NEEDS_NEW_FIELD`

```sql
CREATE TABLE IF NOT EXISTS inboxes (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  label TEXT NOT NULL,
  imap_host TEXT,
  imap_port INTEGER,
  imap_user TEXT,
  imap_password_enc TEXT,
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_user TEXT,
  smtp_password_enc TEXT,
  is_active INTEGER DEFAULT 1,
  last_polled_at INTEGER,
  last_poll_error TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(tenant_id, email),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
CREATE INDEX IF NOT EXISTS idx_inboxes_tenant_active ON inboxes(tenant_id, is_active);
```

**Field rationale:**
- `email`: full inbox address (e.g., `info@sugarpool.de`); not the same as `tenants.email` (which is the login).
- `label`: stored display name = `email.split("@")[0]`. Stored, not computed, so v1.1 user-defined labels override without a schema change.
- `is_active`: soft-disable an inbox (handles mittwald-class IP rejection on one inbox without breaking the rest).
- `last_polled_at`, `last_poll_error`: heartbeat fields. **No UI reads these in v1; the poller writes them per cycle (success → `last_polled_at`; failure → `last_polled_at` + `last_poll_error`) so v1.1 dashboard surfacing requires no poller re-deploy.** Schema is locked; writes are required (see §4.1).
- `UNIQUE(tenant_id, email)`: per-tenant, not global.
- `FOREIGN KEY` matches existing pattern at `siteflow:src/db.js:47`.

### 3.2 Email row → inbox reference — `NEEDS_NEW_FIELD`

```sql
ALTER TABLE emails ADD COLUMN inbox_id TEXT;
CREATE INDEX IF NOT EXISTS idx_emails_inbox ON emails(inbox_id);
```

- Foreign key to `inboxes.id`. Kept alongside `tenant_id` (denormalized) to preserve auth scoping at `siteflow:src/api/routes/emails.js:28` without a JOIN on every query.
- Nullable in schema (SQLite `ALTER TABLE ADD COLUMN` cannot add `NOT NULL` to existing rows). Migration backfills all existing rows; application code (poller insert) populates new rows. Treated as application-layer invariant.

### 3.3 What stays — `OUT_OF_SCOPE`

- `tenants.imap_*` / `tenants.smtp_*` columns are kept post-migration for soft rollback. Both the tenant row and the (mirrored) inbox row will hold the same data through v1. v1.1 cleanup migration drops the tenant columns once multi-inbox is proven stable.
- No tone-profile, agent-id, color, or user-label fields on `inboxes`. v1.1.

---

## 4. Required Code Changes by Surface

### 4.1 Poller (`siteflow:src/poller/index.js`) — `NEW_LOGIC_REQUIRED`

- Drop the global env-based IMAP config (`siteflow:src/poller/index.js:7-17`).
- Refactor `pollInbox()` → `pollSingleInbox(inboxRow)`.
- Per-inbox connection config: `host: inboxRow.imap_host`, `port: inboxRow.imap_port`, `user: inboxRow.imap_user`, `password: decrypt(inboxRow.imap_password_enc)` using `siteflow:src/api/crypto.js`.
- Outer loop in cycle: `for (const inbox of db.prepare("SELECT * FROM inboxes WHERE is_active = 1").all())`. Each iteration wrapped in its own try/catch so one failing inbox does not interrupt the rest.
- INSERT becomes:
  ```sql
  INSERT INTO emails (id, tenant_id, inbox_id, message_id, from_address, subject, body, received_at, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  ```
  with `inboxRow.id` as `inbox_id` and `inboxRow.tenant_id` as `tenant_id`.
- **Invariant (locked):** `inbox_id` is the loop variable. Never derived from headers, `from_address`, or any other clever source. Forwarded mail must remain attributed to the inbox that fetched it.
- **Heartbeat writes (per cycle, per inbox):**
  - On successful completion of `pollSingleInbox(inboxRow)`: `UPDATE inboxes SET last_polled_at = unixepoch(), last_poll_error = NULL WHERE id = ?`.
  - On caught failure for that inbox: `UPDATE inboxes SET last_polled_at = unixepoch(), last_poll_error = ? WHERE id = ?` with the truncated error message (cap to ~500 chars; do not log credentials).
  - Both writes are inside the per-inbox try/catch boundary so one inbox's heartbeat failure does not affect siblings. No UI reads these in v1; v1.1 dashboard surfacing reuses the existing rows without a poller re-deploy.

### 4.2 Workflow — `INBOX_AGNOSTIC`

No changes. Locked per Checkpoint 1.

### 4.3 Send path (`siteflow:src/api/routes/emails.js` `/send`) — `NEW_LOGIC_REQUIRED`

- After fetching the email row at lines 106-109, fetch the originating inbox by `email.inbox_id` AND `req.tenant.id`.
- Build the nodemailer transporter from `inbox.smtp_host` / `inbox.smtp_port` / `inbox.smtp_user` / `decrypt(inbox.smtp_password_enc)`, replacing the env-based config at lines 144-149.
- `from:` becomes `inbox.email`, replacing `process.env.SMTP_USER` at line 152.
- No fallback to env. NULL `inbox_id` → 409 with clear error (silent fallback would defeat per-inbox routing).

### 4.4 Auth `/me` onboarded check (`siteflow:src/api/routes/auth.js:142`) — `NEW_LOGIC_REQUIRED` (trivial)

```js
const hasActiveInbox = db.prepare(
  "SELECT 1 FROM inboxes WHERE tenant_id = ? AND is_active = 1 LIMIT 1"
).get(tenant.id);
const onboarded = Boolean(hasActiveInbox) && Boolean(tenant.tone_profile);
```

Drop `imap_host` from the SELECT at lines 135-138.

### 4.5 Email list + new inboxes endpoint (`siteflow:src/api/routes/emails.js`) — `NEW_LOGIC_REQUIRED`

- Extend the list SELECT at line 27 with `LEFT JOIN inboxes i ON i.id = e.inbox_id`, returning `inbox_id`, `inbox_email`, `inbox_label` per email. `LEFT JOIN` so any pre-migration orphan still renders.
- Classification grouping at lines 42-53 unchanged.
- New endpoint `GET /api/inboxes` (in `siteflow:src/api/routes/inboxes.js` or appended to `emails.js`):
  ```js
  router.get("/inboxes", requireAuth, (req, res) => {
    const inboxes = db.prepare(
      "SELECT id, email, label, is_active FROM inboxes WHERE tenant_id = ? ORDER BY created_at ASC"
    ).all(req.tenant.id);
    res.json({ inboxes });
  });
  ```
  Mount in `siteflow:src/api/server.js` near line 24. Credentials never exposed.

### 4.6 Onboarding `save-tenant` (wizard) — `OUT_OF_SCOPE`

Wizard onboarding is BROKEN per the companion audit. Manual SQL is the canonical path. Runbook update covers the multi-inbox pattern (section 8.7). No code change.

---

## 5. Frontend Filter Integration

**Pattern (locked per Checkpoint 1):** separate `InboxFilter` UI control intersects with the existing classification `Tabs`. Tabs untouched. Default = "Alle Postfächer."

### 5.1 Surfaces touched

- **New API client** `dashboard:siteware-frontend/src/lib/api/inboxes.ts`: `fetchInboxes(): Promise<Inbox[]>` hitting `GET /api/inboxes`. Type: `Inbox = { id; email; label; is_active }`.
- **`ui-store` extension** at `dashboard:siteware-frontend/src/lib/store/ui-store.ts:4-29`: add `inboxes: readonly Inbox[]`, `selectedInboxId: string | null` (null = "all"), and actions `setInboxes`, `setSelectedInboxId`. The existing `setActiveTab` action stays unchanged. Tab and inbox axes are orthogonal: selecting a tab does not clear the inbox filter, and vice versa.
- **`mapBackendEmail`** at `dashboard:siteware-frontend/src/lib/api/emails.ts:33-124`: surface `inbox_id`, `inbox_email`, `inbox_label` on the normalized object. Email types in `dashboard:siteware-frontend/src/types/email.ts` need matching fields.
- **New component** `dashboard:siteware-frontend/src/components/layout/InboxFilter.tsx`: shadcn `Select` with "Alle Postfächer" + each inbox's `label`. Mounts in `DashboardHeader.tsx`. Renders nothing if `inboxes.length <= 1`.
- **Per-view filtering**: new selector hook `useFilteredSlice(slice)` reading both `email-store` slice and `ui-store.selectedInboxId`. Filter logic: `selectedInboxId === null ? all : all.filter(e => e.inbox_id === selectedInboxId)`. Replace direct `useEmailStore((s) => s.spam)` calls in `SpamView`, `AdView`, `DraftReviewView`, `EscalationView`, `UnsubscribeView`, `SentView`.
- **Bootstrap**: on dashboard mount, `fetchInboxes()` → `setInboxes(...)` alongside `hydrateFromServer`.

### 5.2 What stays untouched

- `CategoryTabs.tsx` — no changes.
- `email-store.ts` slices — keep the 7-slice classification shape; second dimension lives in `ui-store` + selector hook.
- `EmailTable.tsx` columns — no per-row inbox column in v1. v1.1 may add an inbox-label badge.

### 5.3 Tab badge counts respect the inbox filter (v1 fix)

Tab badges (`CategoryTabs.tsx:29-55`) currently read raw slice arrays via `useSliceCount`. In v1, wrap the slice read with the same filter logic as `useFilteredSlice`: read `selectedInboxId` from `ui-store` and return `selectedInboxId === null ? slice.length : slice.filter(e => e.inbox_id === selectedInboxId).length`. The component shape stays unchanged — only the count source changes. Adds ~0.5h to T6.

---

## 6. Migration Path

### 6.1 Forward migration

Inline in `siteflow:src/db.js` `initDb()`, following the existing idempotent-ALTER pattern (`siteflow:src/db.js:73-107`). Runs at every server startup.

1. `CREATE TABLE IF NOT EXISTS inboxes` (section 3.1).
2. Idempotent `ALTER TABLE emails ADD COLUMN inbox_id TEXT`.
3. Backfill: `INSERT INTO inboxes` one row per tenant where `imap_host IS NOT NULL` and no inbox row exists yet. Wrapped in `db.transaction`. Label = `tenant.email.split("@")[0] || "primary"`.
4. Backfill orphan emails: `UPDATE emails SET inbox_id = (SELECT id FROM inboxes WHERE tenant_id = emails.tenant_id ORDER BY created_at ASC LIMIT 1) WHERE inbox_id IS NULL AND tenant_id IS NOT NULL`.

**Properties:** Idempotent (re-runs are no-ops). Atomic per backfill batch. Non-destructive (no DROP, no UPDATE on existing tenant columns). Poller-safe — old poller reads `process.env.IMAP_*`, new poller reads `inboxes`; the two coexist during deploy because `process.env.IMAP_*` and the corresponding `tenants.imap_*` were set in sync by `install.sh`.

### 6.2 Live data on srv1572917

Two stub-pattern tenants (per the prior audit's tenants dump). Each has `imap_host`, `imap_port`, `imap_user`, `imap_password_enc`, `smtp_host`, `smtp_port`, `smtp_user`, `smtp_password_enc` populated. Migration creates one inbox row per tenant, label derived from each tenant's email prefix. All existing emails get `inbox_id` set to that row.

### 6.3 Soft rollback (recommended)

1. `pm2 stop all` → `git checkout <prev-commit> -- src/` → `pm2 start ecosystem`.
2. Old code reads `tenants.imap_*` (still populated) and `process.env.IMAP_*` (untouched). `inboxes` table and `emails.inbox_id` become unused but harmless.
3. Re-deploy is idempotent.

### 6.4 Hard rollback

Only needed for a clean v1 retry. Requires SQLite 3.35+ (better-sqlite3 ships with that):

```sql
UPDATE emails SET inbox_id = NULL;
DROP TABLE IF EXISTS inboxes;
ALTER TABLE emails DROP COLUMN inbox_id;
```

Then revert code and restart.

---

## 7. Gap-List

| ID | Gap | Severity |
|----|-----|----------|
| gap_1 | Save-tenant code path is BROKEN (per companion audit) and not extended for multi-inbox. Manual SQL runbook is canonical. | Medium — already known, deferred |
| gap_2 | `email.inbox_id` is application-layer invariant, not DB-enforced (NULL allowed). A poller bug could insert NULL silently. | Low — covered by error handling in T2 |
| gap_3 | Classification tab badges show unfiltered counts when inbox filter is active. | **Fixed in v1** — `useSliceCount` wraps `selectedInboxId` filter; see §5.3. |
| gap_4 | Heartbeat fields (`last_polled_at`, `last_poll_error`) ship with no UI consumers in v1. Risk of confusion if someone queries them and sees NULL forever. | Low — poller writes per cycle, UI surfacing v1.1. |
| gap_5 | No admin UI to add/disable an inbox. Stefan must run manual SQL. | Medium — scope-locked to manual SQL per onboarding audit |
| gap_6 | `Sent` view filtering depends on `inbox_id` being on sent rows. Needs verification — depends on what populates the sent slice. | `NOT_FOUND` — flagged for executing agent in T6 |

---

## 8. Recommended Task Breakdown

| Task | Description | Hours | Depends on |
|------|-------------|-------|------------|
| T1 | Schema migration in `siteflow:src/db.js` | 1.0 | None |
| T2 | Poller refactor to per-inbox loop + heartbeat writes | 3.25 | T1 |
| T3 | Send path looks up originating inbox SMTP | 1.5 | T1 |
| T4 | Auth `/me` onboarded check uses inbox-existence | 0.25 | T1 |
| T5 | Email list JOIN + new `GET /api/inboxes` endpoint | 2.0 | T1 |
| T6 | Frontend `InboxFilter` + selector hook + filtered tab badges + per-view wiring | 3.5 | T5 |
| **Engineering subtotal** | | **11.5** | |
| T7 | Manual SQL runbook update (delta to existing RB-01) | 1.0 | T1 |
| T8 | Smoke test on srv1572917 | 1.5 | T1–T6 |
| **Total** | | **14.0** | |

**Compression levers (rejected):**
- Defer `GET /api/inboxes` (T5 → 1.25h); frontend derives inbox list from email list. Cost: empty-inbox UX freshness.
- Fold T8 smoke test into sprint-end QA (saves 1.5h from this line item).

Both levers were considered and rejected during checkpoint review — T5 stays in scope (zero-emails-per-inbox UX matters); T8 stays in scope (live-data migration requires verification). Documented here for future reference, not for v1 use.

---

## 9. NOT_FOUND List

Questions this audit could not answer from the available sources:

1. Whether `Sent` view's source data carries `inbox_id` on the row — depends on whether `setSentEmails` is fed from `/api/emails` or a separate ingest path. (Affects T6 filtering of the sent view.)
2. Exact placement of the `InboxFilter` in `DashboardHeader.tsx` — pending visual review per global UI/Design Protocol.
3. Whether there is an existing PM2 ecosystem file path (`ecosystem.config.js` exists at repo root, but its restart-order behavior wasn't inspected for this audit). Affects T8.
4. Whether `crypto.decrypt` symmetric-key handling tolerates multiple encrypted blobs reusing the same key (assumed yes; not verified at line level).
5. Whether `install.sh` writes `process.env.IMAP_*` into a `.env` file that survives PM2 restarts, or sets them only in the current shell. (Affects whether old-poller still has working creds during deploy window.)
6. Whether the dashboard's Vite dev server proxies `/api/inboxes` correctly without explicit config changes (depends on the existing proxy rule, not inspected here).
7. The exact email types in `dashboard:siteware-frontend/src/types/email.ts` that need the new `inbox_id` / `inbox_email` / `inbox_label` fields — six subtypes likely, not enumerated here.
8. Whether existing Vitest tests around `email-store.ts` and `mapBackendEmail` will need updates — likely yes, not enumerated.
9. Whether the closeout sprint runbook (RB-01 / RB-02) is in `siteflow:docs/runbooks/` or in an external doc system. Only `runbook-poller-not-saving.md` is present in `siteflow:docs/runbooks/`.

---

## 10. Adjacent Findings

- **Poller is env-coupled, not DB-coupled.** `siteflow:src/poller/index.js:7-17` reads `process.env.IMAP_*`, never `tenants.imap_*`. Today's "single-inbox per tenant" is enforced by env vars, not schema. This is load-bearing for migration safety (poller can keep running through the schema migration) but means today's `tenants.imap_*` columns are write-only from save-tenant — read only by the auth onboarded check at `siteflow:src/api/routes/auth.js:142`. Worth promoting to a `LEARNINGS.md` entry.
- **SMTP password reuses IMAP password in save-tenant.** `siteflow:src/api/server.js:493-494` encrypts `creds.password` twice. Carries forward: per-inbox creds must accept distinct IMAP and SMTP passwords.

## 11. Draft `LEARNINGS.md` Entry

```markdown
## 2026-05-06 — Multi-inbox migration
**Expectation:** poller reads tenant IMAP creds from DB.
**Actual:** poller reads `process.env.IMAP_*` (`siteflow:src/poller/index.js:7-17`). Single-inbox is enforced by env vars, not schema.
**Source:** `siteflow:docs/audits/MULTI_INBOX_STATE_AUDIT_2026-05-06.md` §2, §10.
**Prompt update:** verify read paths AND write paths separately. A populated column does not mean any code reads it.
```

---

**End of audit.**
