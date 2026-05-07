# Task: SH-02 — SQL Indexes + CORS Tightening

## Status
- [ ] Pending
- [ ] Research Complete (awaiting Lukas approval)
- [ ] In Progress
- [ ] Verified
- [ ] Complete

---

## Pre-Flight Research (REQUIRED — DO NOT SKIP)

**Before any code changes, the agent must:**

1. Read `src/db.js` end-to-end — note the existing schema and any existing indexes
2. Read `src/api/server.js` — find the current CORS configuration
3. Run a database query to count rows in `emails` and check existing indexes:
   ```bash
   node -e 'const db=require("better-sqlite3")("data/siteflow.db"); console.log("rows:", db.prepare("SELECT COUNT(*) as c FROM emails").get()); console.log("indexes:", db.prepare("SELECT name, sql FROM sqlite_master WHERE type=\"index\" AND tbl_name=\"emails\"").all());'
   ```
4. Search the codebase for actual `WHERE` clauses on the `emails` table to identify which columns most need indexes

**Report back to Lukas with:**

1. Current emails table schema (columns + types)
2. Existing indexes on the emails table
3. Row count in production-equivalent state (test server is fine)
4. List of WHERE clauses found in code that filter on emails columns — this confirms which indexes are actually useful
5. Current CORS config (origin, credentials, methods)
6. Proposed list of indexes to add (default suggestion: `emails(status)`, `emails(tenant_id, status)`, `emails(received_at)`)
7. Proposed CORS allowed origins list

**Wait for Lukas's "approved, go" before proceeding to implementation.**

---

## Pillars

### 1. Model
sonnet (mechanical schema and config changes)

### 2. Tools Required
- [x] Read, Edit (file operations)
- [x] Bash: `node -e ...` for DB inspection
- [x] Grep, Glob (find WHERE clauses on emails)
- [ ] WebFetch
- [ ] Task (sub-agents)

### 3. Guardrails (DO NOT)
- Do NOT modify: any data in the emails table (CREATE INDEX is non-destructive, but no UPDATE/DELETE)
- Do NOT modify: existing indexes — only add new ones
- Do NOT touch: poller, workflow, jobs, or frontend code
- Do NOT use: `DROP INDEX` under any circumstances
- All `CREATE INDEX` statements MUST use `IF NOT EXISTS` (idempotent)
- The migration MUST run inline at startup like other schema operations in `db.js`

### 4. Knowledge (MUST READ)
- [x] siteflow-state.md (project state)
- [x] src/db.js (current schema + how migrations are applied)
- [x] src/api/server.js (current CORS setup)

**Domain facts the agent won't infer from code:**

- SQLite `CREATE INDEX IF NOT EXISTS` is fully idempotent and safe to run on every startup
- The state doc explicitly lists `emails.status` and `emails.tenant_id` as the two columns most needing indexes (Priority 4 backlog)
- A composite index `emails(tenant_id, status)` is more useful than two separate indexes for the most common query pattern (`WHERE tenant_id = ? AND status = ?`)
- The current CORS likely allows all origins. Tightening to specific allowed origins is the goal, but breaking the dashboard is unacceptable. Allowed origins should include the production domain and `http://localhost:3000` (or whatever dev port is used)

### 5. Memory
- April 16 dashboard rebuild postmortem: never assume the frontend works because the backend works. After CORS changes, manually verify dashboard still loads.
- Project uses `better-sqlite3` synchronously — `db.exec(...)` is the right call for DDL

### 6. Success Criteria
- [x] `CREATE INDEX IF NOT EXISTS` statements added to `src/db.js` for at minimum: `emails(status)`, `emails(tenant_id, status)`, `emails(received_at)`
- [x] Indexes verified present after restart:
  ```bash
  node -e 'const db=require("better-sqlite3")("data/siteflow.db"); console.table(db.prepare("SELECT name FROM sqlite_master WHERE type=\"index\" AND tbl_name=\"emails\"").all());'
  ```
- [x] `EXPLAIN QUERY PLAN` shows index usage for a representative query:
  ```bash
  node -e 'const db=require("better-sqlite3")("data/siteflow.db"); console.log(db.prepare("EXPLAIN QUERY PLAN SELECT * FROM emails WHERE tenant_id=? AND status=?").all("dummy", "draft"));'
  ```
  Expected: output should mention "USING INDEX" not "SCAN TABLE"
- [x] CORS allowed origins list is explicit (no wildcard) and includes production domain + dev origin
- [x] Dashboard still loads after deploy (manual check by Lukas)
- [x] Login flow still works after deploy (manual check by Lukas)
- [x] `node -c src/db.js` and `node -c src/api/server.js` exit 0

### 7. Dependencies
- [x] None (can start immediately, parallel with SH-01)

### 8. Failure Handling

**Max attempts:** 3

**On failure (per attempt):**
- If `CREATE INDEX` errors with "already exists": verify `IF NOT EXISTS` is in the SQL. If it is, the index is fine — that's not a real error
- If CORS change breaks dashboard: add the failing origin to the allowlist. If unclear which origin is failing, check browser devtools network tab for the rejected `Origin` header
- If indexes don't appear in `EXPLAIN QUERY PLAN`: SQLite query planner may need `ANALYZE` after creation. Run `db.exec("ANALYZE emails")` once

**After max attempts exhausted:**
- Escalate to Lukas with full output of `sqlite_master` and the specific query that's not using the index

**Rollback command:**
```bash
git checkout -- src/db.js src/api/server.js
# Indexes don't need explicit rollback — they don't hurt anything if they remain
```

### 9. Learning

**Log to LEARNINGS.md if:**
- The query planner unexpectedly didn't use a created index (may indicate need for ANALYZE or different index structure)
- The CORS tightening broke a flow that wasn't anticipated
- Other tables (sessions, login_tokens, audit_logs) showed up in research as also needing indexes

---

## Human Checkpoint
- [ ] **REQUIRED** — Lukas reviews research output (especially the proposed indexes and CORS origins) before implementation
- [ ] **REQUIRED** — Lukas verifies dashboard still loads and login still works after deploy

---

## Description

Two more priority-4 security/performance items from the backlog:

1. Add SQL indexes on `emails.status` and `emails.tenant_id` (state doc's Priority 4)
2. Tighten CORS from wildcard to explicit allowed origins (state doc's Priority 4)

Indexes matter as the emails table grows. CORS tightening matters when real customers are using the system — wildcard CORS is a real attack surface for credential theft via XSS.

## Steps

1. Pre-flight research (see above) — report back, wait for approval
2. Add `CREATE INDEX IF NOT EXISTS` statements to `db.js` initialization
3. Replace wildcard CORS with explicit origins in `server.js`
4. Run `node -c` on both files
5. Restart locally and verify indexes exist via `sqlite_master`
6. Commit with message: `chore(security): add emails indexes, tighten CORS origins`
7. Hand off to Lukas for deploy + dashboard/login verification

## On Completion

- **Commit:** `chore(security): add emails indexes, tighten CORS origins`
- **Update:** Note in state doc that priority 4 items 4-5 are done (only OTP rate limit remains, covered by SH-01)
- **Handoff notes for RB-01:** Runbook should mention that the install script now creates indexes automatically — Stefan doesn't need to run them manually
