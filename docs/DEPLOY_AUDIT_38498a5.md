# Deploy Audit — 63f0488 → 38498a5

**Scope:** 3 files changed, +18 / -4. `git diff --stat` confirms no other files touched.

---

## 1. Migration safety (`src/db.js`)

Two coordinated edits:

- `src/db.js:43` — `reasoning TEXT,` added to the `CREATE TABLE IF NOT EXISTS emails` block (between `escalation_reason` and `draft_reply`).
- `src/db.js:91-95` — new idempotent migration block:
  ```js
  try { db.exec("ALTER TABLE emails ADD COLUMN reasoning TEXT"); }
  catch (err) { if (!err.message.includes("duplicate column name")) throw err; }
  ```

**Idempotent?** Yes, in all three starting states:
- **Fresh DB:** `CREATE TABLE IF NOT EXISTS` creates the table with `reasoning`. The subsequent `ALTER` throws "duplicate column name" and is swallowed.
- **Existing DB without column (the prod case):** `CREATE TABLE IF NOT EXISTS` is a no-op. The `ALTER` runs and adds the column.
- **Existing DB with column (re-run):** `CREATE TABLE IF NOT EXISTS` is a no-op. The `ALTER` throws "duplicate column name" and is swallowed.

**Partial-failure window?** None. SQLite DDL is atomic per statement, and `ADD COLUMN` with a nullable `TEXT` (no default) does not rewrite the table — it only updates the schema record. Cheap and instant even on large tables.

**Failure mode to watch:** if the `ALTER` fails with any error whose message does *not* contain the literal string `"duplicate column name"` (e.g. "database is locked", "disk I/O error"), `initDb()` throws and the process crashes at startup. PM2 will loop-restart. That is the correct behavior — fail loud, don't run on a half-migrated schema.

---

## 2. Backward compatibility of the list endpoint (`src/api/routes/emails.js`)

The new SELECT at `src/api/routes/emails.js:27` includes `reasoning`. If the column does not exist at query time, `db.prepare(query)` throws `"no such column: reasoning"`. This is caught by the outer `try/catch` at line 55-58, which logs and returns **500 `{"error":"Failed to fetch emails"}`**.

This can only happen if the new code runs before `initDb()` has completed. In practice `initDb()` is invoked synchronously at startup before the server begins accepting requests, so this is not a live risk — but it is the failure mode if ordering ever changes.

---

## 3. Workflow writes (`src/workflow/index.js`)

- `src/workflow/index.js:236` — `const reasoning = triage.reasoning || null;`
- `src/workflow/index.js:240` — SPAM/AD auto-archive UPDATE now includes `reasoning = ?`. Parameter bound at line 249.
- `src/workflow/index.js:286` — draft UPDATE now includes `reasoning = ?`. Parameter bound at line 297.

**If `triage.reasoning` is undefined:** `undefined || null` → `null` written to DB. Empty string, `0`, and `false` also coerce to `null` via the `||`. The literal string `"undefined"` is **not** a possible outcome.

Both UPDATE paths are covered. Confirmed.

---

## 4. Preview computation (`src/api/routes/emails.js:35-39`)

```js
const rows = db.prepare(query).all(...params);
const emails = rows.map((row) => ({
  ...row,
  preview: (row.body || "").replace(/\s+/g, " ").slice(0, 200),
}));
```

- **Null/empty body:** `(null || "")` → `""` → `preview === ""`. No error.
- **Whitespace:** `/\s+/g` collapses runs of whitespace (spaces, tabs, newlines, CR) into a single space.
- **Char limit:** 200 chars, taken from the start (`slice(0, 200)`).
- **No `.trim()`:** if the body starts with whitespace, the first char of `preview` will be a single space. Cosmetic only — not a bug, but worth noting.

Computed per-request in-memory from `body`. Zero DB cost; the frontend contract (`preview` on every row) now matches.

---

## 5. Other changes

None. `git diff --stat` output:

```
src/api/routes/emails.js | 8 ++++++--
src/db.js                | 7 +++++++
src/workflow/index.js    | 7 +++++--
```

Three files, as expected. No config changes, no package.json changes, no frontend bundle changes, no schema changes beyond the one column.

---

## 6. Rollback safety (reset to 63f0488 after deploying 38498a5)

**Safe.** SQLite tolerates extra columns silently:

- Old code's `CREATE TABLE IF NOT EXISTS` is a no-op (table exists) — it will not try to recreate or alter.
- Old code's SELECT omits `reasoning` — the extra column is simply not read.
- Old code's UPDATE statements omit `reasoning` — the column retains whatever was last written, or `NULL` for rows written under old code.
- Any new rows written during the brief period when new code ran will have `reasoning` populated; rolling back preserves those values (no schema downgrade happens).

No data corruption. No downtime beyond the PM2 restart itself. The column becomes dormant until either you roll forward again or you drop it (which is not something to do without an explicit migration plan — don't).

---

## Verdict

**Safe to deploy.** Migration is idempotent, writes are backward-compatible, rollback is clean. One cosmetic nit (`preview` may have a leading space) is not a blocker.

Recommended deploy sequence on prod:

1. `git pull` — brings in `38498a5`.
2. `pm2 restart all --update-env` — triggers `initDb()`, which runs the `ALTER TABLE` migration on `data/siteflow.db`.
3. Tail logs for `[db] Tables ready` (success signal) and the absence of any `initDb` throw.
4. Hit `GET /api/emails` with a valid session and confirm `preview` and `reasoning` fields appear in the response JSON.

If step 2 crashes on startup with anything other than a "duplicate column name" swallow, stop and investigate before restarting — do not loop PM2 against a broken DB.
