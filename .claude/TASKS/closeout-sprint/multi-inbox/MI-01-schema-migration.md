# Task: MI-01 — Schema Migration (inboxes table + emails.inbox_id)

## Status

- [ ] Pending
- [ ] Pre-Flight Research complete (HUMAN APPROVED)
- [ ] In Progress
- [ ] Verified
- [ ] Complete

## Pillars

### 1. Model

`sonnet` — mechanical schema change following an existing idempotent-ALTER pattern. No architectural decisions remain; all design choices are locked in the audit.

### 2. Tools Required

- [x] Read, Edit (file operations on `siteflow:src/db.js`)
- [x] Bash: `node -e "require('./src/db').initDb()"` for local smoke test, `sqlite3` for verifying row counts on a copy of the live DB
- [x] Grep, Glob (verify no other code reads/writes the schema regions you're touching)
- [ ] Write (no new files)
- [ ] WebFetch
- [ ] Task (sub-agents)

### 3. Guardrails (DO NOT)

- Do NOT modify columns on the `tenants` table — they are kept post-migration for soft rollback per audit §3.3.
- Do NOT add `NOT NULL` to `emails.inbox_id`. SQLite cannot add `NOT NULL` to existing rows without a table rebuild; treat as application-layer invariant per audit §3.2.
- Do NOT touch `siteflow:src/poller/index.js`, `siteflow:src/api/routes/emails.js`, or any other code in this task. MI-02 through MI-06 own those.
- Do NOT introduce a migrations directory, version table, or migration runner. Match the existing idempotent pattern at `siteflow:src/db.js:73-107`.
- Do NOT change the existing `CREATE TABLE` definitions at `siteflow:src/db.js:16-71` or the existing ALTER blocks at lines 73-107.
- Do NOT silently swallow errors other than `duplicate column name` — match the existing pattern exactly.
- Do NOT run on the live VPS. All testing happens on a local copy of the DB file.

### 4. Knowledge (MUST READ)

- [x] `siteflow:CLAUDE.md` (always)
- [x] `siteflow:docs/audits/MULTI_INBOX_STATE_AUDIT_2026-05-06.md` §3 (schema design), §6.1 (forward migration script), §6.2 (live data on srv1572917), §6.3-§6.4 (rollback procedures), §10 (adjacent finding: poller is env-coupled, not DB-coupled — explains why this migration is poller-safe).
- [x] `siteflow:src/db.js` (entire file — 112 lines)
- [x] `siteflow:docs/audits/ONBOARDING_STATE_AUDIT_2026-05-06.md` for context on how `tenants.imap_*` came to be populated by `save-tenant`.

The audit is the canonical specification for this task. Do not re-derive design decisions; cite the audit when in doubt.

### 5. Memory

- The existing migration mechanism is **inline ALTER blocks inside `initDb()`**, each wrapped in `try/catch` that swallows only `duplicate column name`. There is no migrations directory and no version table. Follow this exact pattern.
- `db.pragma("foreign_keys = ON")` is set globally at `siteflow:src/db.js:12`. New FKs are enforced at write time.
- WAL mode is set at `siteflow:src/db.js:11`. Concurrent reads from the running poller are safe during the migration.
- `db.transaction(fn)(args)` is the better-sqlite3 transaction pattern. Used in the audit's backfill block.
- The poller (`siteflow:src/poller/index.js:7-17`) reads IMAP creds from `process.env`, not from the DB. The migration is therefore safe to run with the poller still running on the VPS — it does not race with poller reads.

### 6. Success Criteria

- [x] `siteflow:src/db.js` contains the full migration block from audit §6.1, appended to `initDb()` after the existing ALTER blocks (after line 107).
- [x] Re-running `node -e "require('./src/db').initDb()"` on a fresh DB creates the schema cleanly with no errors.
- [x] Re-running the same command twice in a row is a no-op (idempotent verification): no duplicate inbox rows inserted, no duplicate index errors logged.
- [x] On a copy of the live srv1572917 DB: after migration, `SELECT COUNT(*) FROM inboxes` equals the count of tenants with non-empty `imap_host`. Specifically: there are 2 such tenants per the companion onboarding audit's tenants dump, so expect 2 inbox rows.
- [x] `SELECT COUNT(*) FROM emails WHERE inbox_id IS NULL AND tenant_id IS NOT NULL` returns 0 after migration.
- [x] `SELECT label FROM inboxes` returns labels matching `tenant.email.split("@")[0]` for each migrated tenant.
- [x] `idx_inboxes_tenant_active` and `idx_emails_inbox` exist (`SELECT name FROM sqlite_master WHERE type='index'`).
- [x] No changes to `tenants.imap_*` / `tenants.smtp_*` columns: `SELECT imap_host FROM tenants` returns identical values before and after migration.
- [x] No new dependencies added to `package.json`.

### 7. Dependencies

- [x] None within the multi-inbox sprint — MI-01 is the entry point.
- [x] Local copy of the srv1572917 DB file at `siteflow:data/siteflow.db` (or a snapshot) for migration testing. If unavailable, ask before proceeding.

### 8. Failure Handling

**Max attempts:** 3

**On failure (per attempt):**

- **`SqliteError: foreign key mismatch`**: investigate which FK is failing; do NOT disable `foreign_keys`. Likely cause: a `tenants` row was deleted but its emails remain. Fix the data, not the schema.
- **`duplicate column name: inbox_id`**: expected on re-runs. The existing pattern's `if (!err.message.includes("duplicate column name")) throw err` already handles this. If it doesn't, you forgot to wrap the ALTER in try/catch.
- **Backfill UPDATE leaves rows with NULL `inbox_id`**: investigate which tenant the orphan rows belong to. Possible cause: tenant has emails but no `imap_host` populated, so no inbox row was created. Surface to human; do not auto-create an inbox without credentials.
- **`SQLITE_BUSY`**: WAL allows concurrent readers, but a long-running write transaction can still block. Retry once; if it persists, stop the local poller and retry.

**After max attempts exhausted:**

- Stop. Surface the full error log + the state of the DB (`.schema inboxes`, `SELECT COUNT(*) FROM inboxes`, `SELECT COUNT(*) FROM emails WHERE inbox_id IS NULL`) to the human.

**Rollback command:** `git checkout HEAD -- src/db.js`. Schema rollback only via the audit's hard-rollback procedure (audit §6.4) and only if the human explicitly requests it.

### 9. Learning

**Log to `siteflow:docs/LEARNINGS.md` if:**

- A tenant on srv1572917 has `imap_host` populated but other credential columns NULL (would create a half-broken inbox row).
- The SQLite version shipped with the project's `better-sqlite3` does not support the migration syntax used.
- The backfill SELECT picks up tenants the audit didn't anticipate (e.g., role='admin' tenants without real inboxes).
- `db.transaction` rollback semantics differ from what the audit assumes.
- The idempotent re-run produces any non-zero side effect (duplicate row, duplicate index, etc.).

---

## Human Checkpoint

- [ ] **REQUIRED** — Pre-Flight Research report approved before any edits to `src/db.js`.

---

## Pre-Flight Research (Phase A — DO FIRST, then PAUSE)

Before writing any code, perform this research and report back. Do not proceed to Phase B until the human has approved your findings.

1. Read the audit sections cited in pillar 4 in full.
2. Read `siteflow:src/db.js` end-to-end. Confirm:
   - Existing migration pattern (try/catch swallowing `duplicate column name`)
   - Existing FK declarations on `emails`, `sessions`, `login_tokens`
   - Existing indexes (none on the columns you'll be touching beyond PK and `email UNIQUE` on tenants)
3. If a local copy of `siteflow:data/siteflow.db` exists, run on a **copy** (do not touch the original):
   - `sqlite3 <copy> "SELECT id, email, imap_host FROM tenants"` — confirm tenant count and which have non-empty `imap_host`
   - `sqlite3 <copy> "SELECT COUNT(*) FROM emails"` — note the row count
   - `sqlite3 <copy> "SELECT sqlite_version()"` — confirm version supports `ALTER TABLE ... ADD COLUMN` and the `unixepoch()` default. SQLite 3.38+ ideally.
4. Confirm `siteflow:src/api/crypto.js` exists (read-only check; not modified in this task — but downstream tasks need it).
5. Confirm no other code path under `siteflow:src/` writes to a table named `inboxes` or reads `emails.inbox_id` today (`grep -rn "inboxes\|inbox_id" siteflow/src/`).

**Report back to the human with:**

- Number of tenants total / with `imap_host` populated
- Email row count
- SQLite version
- Any surprises versus the audit (e.g., extra columns on tenants, unexpected indexes)
- Whether you have a DB copy to test against, or you're proceeding without one (stop and ask if no copy is available)

**Then WAIT. Do not start Phase B until approved.**

---

## Description

Add the `inboxes` table, the `emails.inbox_id` column + index, and the backfill block to `siteflow:src/db.js` per the audit's section 6.1. The migration is idempotent and non-destructive: it does not modify or drop any existing column. After this task, the DB has the multi-inbox schema in place but no consumer code uses it yet — MI-02 through MI-06 wire it up.

The poller can keep running on the VPS during this migration because it reads IMAP creds from `process.env`, not from the DB (see audit §10).

## Steps

### Phase A — Pre-Flight Research

(See section above. Report and wait.)

### Phase B — Implementation

1. Open `siteflow:src/db.js`.
2. After line 107 (the last existing ALTER block), append the migration block from audit §6.1: `CREATE TABLE IF NOT EXISTS inboxes ...`, the index, the `ALTER TABLE emails ADD COLUMN inbox_id` (wrapped in the same try/catch pattern as the existing ALTERs), the second index, the `tenantsToMigrate` SELECT, the `db.transaction` wrapping `INSERT INTO inboxes`, and the orphan-email `UPDATE`.
3. Confirm the `console.log("[db] Tables ready")` at line 108 still runs after the new block.
4. Run `node -e "require('./src/db').initDb()"` against a fresh local DB. Capture log.
5. Run it again. Verify no errors and no duplicate rows.
6. If you have a copy of the srv1572917 DB, run against that copy. Verify success criteria 4-6.
7. `git diff src/db.js` — review change. Should be additive only.

### Phase C — Verification

1. Re-run all success criteria checks.
2. `grep -n "inbox_id\|inboxes" siteflow/src/db.js` — confirm references match what the audit specified.
3. Run the existing test suite if one exists for `db.js` (none currently, per project structure — skip).

## On Completion

- **Commit:** `feat(db): add inboxes table and emails.inbox_id with backfill (MI-01)`
- **Update:** No CLAUDE.md change. Pattern is unchanged; only schema grew.
- **Handoff notes for downstream tasks:**
  - **MI-02 (poller):** the table is `inboxes` with `id`, `tenant_id`, `imap_host`, `imap_port`, `imap_user`, `imap_password_enc`, `is_active`. Filter `WHERE is_active = 1`. Use `siteflow:src/api/crypto.js` `decrypt()` for `imap_password_enc`.
  - **MI-03 (send):** lookup is `SELECT * FROM inboxes WHERE id = ? AND tenant_id = ?`. SMTP fields parallel the IMAP ones.
  - **MI-04 (auth):** check is `SELECT 1 FROM inboxes WHERE tenant_id = ? AND is_active = 1 LIMIT 1`.
  - **MI-05 (list):** `LEFT JOIN inboxes i ON i.id = e.inbox_id`. New endpoint `GET /api/inboxes` returns `id, email, label, is_active` only — never credential fields.
  - All existing emails on srv1572917 will have `inbox_id` populated post-migration.
- **Do NOT deploy this commit alone.** The migration is safe to run, but the live VPS would have schema present + no consumer code, which is fine but uninformative. Bundle with MI-02 minimum before deploying.
