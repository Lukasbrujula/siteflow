# SiteFlow Codebase Audit

Generated: 2026-04-15. All line numbers reference the post-422be3a state of the repo.

---

## A. Server & Routing (`src/api/server.js`)

### A1. Route mounting — every `app.use()` and `app.get()`

| Line | Call                           | Target                                               |
| ---- | ------------------------------ | ---------------------------------------------------- |
| 9    | `app.use(cors())`              | CORS middleware, all origins, no configuration       |
| 10   | `app.use(express.json())`      | JSON body parser                                     |
| 11   | `app.use(cookieParser())`      | Cookie parser (required for session cookie)          |
| 12   | `app.use("/api/auth", ...)`    | `src/api/routes/auth.js`                             |
| 13   | `app.use("/api/emails", ...)`  | `src/api/routes/emails.js`                           |
| 15   | `app.use(express.static(...))` | Serves `public/` directory statically                |
| 17   | `app.get("/api/health", ...)`  | Inline health handler                                |
| 21   | `app.get("/{*path}", ...)`     | Catch-all → sends `public/index.html` (SPA fallback) |

### A2. Health endpoint

Returns: `{ status: "ok", time: new Date().toISOString() }` (server.js:18).

Does NOT check: database connectivity, SMTP reachability, IMAP credentials, workflow/poller process liveness, disk space, or whether `data/siteflow.db` exists.

### A3. Catch-all vs. `/api/health` conflict

No conflict. Express matches routes in registration order. `/api/health` is registered on line 17, the catch-all `/{*path}` on line 21. The specific route wins. The `express.static` middleware on line 15 also runs first for any file that exists in `public/`. Note: `/{*path}` is Express 5 wildcard syntax — incompatible with Express 4.

### A4. `initDb()` call order

`initDb()` is called on server.js:28, inside the `start()` async function, before `app.listen()` (line 29). Route handlers are registered at module load time (lines 12–13), before `start()` runs. In practice, no requests arrive before `listen()` completes — but if `initDb()` throws, the process exits (line 34–36) before the server binds.

### A5. Global middleware

`cors()` — all origins, no `origin` whitelist (line 9).
`express.json()` — parses JSON bodies (line 10).
`cookieParser()` — parses cookies (line 11).
`express.static()` — serves `public/` (line 15).
No request logging (no morgan), no rate limiting, no helmet.

---

## B. Database (`src/db.js`)

### B1. All tables, columns, types, constraints

**`tenants`** (db.js:16–28)
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| email | TEXT | UNIQUE NOT NULL |
| imap_host | TEXT | |
| imap_user | TEXT | |
| imap_password_enc | TEXT | |
| smtp_host | TEXT | |
| smtp_user | TEXT | |
| smtp_password_enc | TEXT | |
| tone_profile | TEXT | |
| role | TEXT | DEFAULT 'user' |
| created_at | INTEGER | DEFAULT (unixepoch()) |

**`emails`** (db.js:29–44)
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK → tenants(id) |
| message_id | TEXT | UNIQUE |
| from_address | TEXT | |
| subject | TEXT | |
| body | TEXT | |
| received_at | INTEGER | |
| classification | TEXT | |
| sentiment | TEXT | |
| urgency | TEXT | |
| draft_reply | TEXT | |
| status | TEXT | DEFAULT 'pending' |
| created_at | INTEGER | DEFAULT (unixepoch()) |

**`sessions`** (db.js:45–50)
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK → tenants(id) |
| created_at | INTEGER | DEFAULT (unixepoch()) |
| expires_at | INTEGER | NOT NULL |

**`login_tokens`** (db.js:51–57)
| Column | Type | Constraints |
|--------|------|-------------|
| token | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK → tenants(id) |
| expires_at | INTEGER | NOT NULL |
| used | INTEGER | DEFAULT 0 |

**`audit_logs`** (db.js:58–66)
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant*id | TEXT | *(no NOT NULL, no FK)\_ |
| action | TEXT | NOT NULL |
| detail | TEXT | |
| ip | TEXT | |
| created_at | INTEGER | DEFAULT (unixepoch()) |

### B2. Tables with `tenant_id`

With `tenant_id`: `emails`, `sessions`, `login_tokens`, `audit_logs` (nullable, no FK constraint).
Without `tenant_id`: `tenants` (it is the tenant table).

### B3. Indexes

No explicit `CREATE INDEX` statements exist anywhere in db.js. Indexes present are implicit from constraints only:

- `tenants.id` — PRIMARY KEY (implicit unique index)
- `tenants.email` — UNIQUE constraint (implicit index)
- `emails.id` — PRIMARY KEY
- `emails.message_id` — UNIQUE constraint (implicit index)
- `sessions.id` — PRIMARY KEY
- `login_tokens.token` — PRIMARY KEY
- `audit_logs.id` — PRIMARY KEY

**No index on `emails.status`, `emails.tenant_id`, or `emails.received_at`.** All queries filtering by status or tenant_id are full table scans.

### B4. Is `initDb()` idempotent?

Yes. Every `CREATE TABLE` uses `CREATE TABLE IF NOT EXISTS` (db.js:16, 29, 45, 51, 58). Safe to call multiple times.

### B5. Files importing `db`

| File                           | Require path                     |
| ------------------------------ | -------------------------------- |
| `src/api/routes/auth.js:6`     | `require("../../db")`            |
| `src/api/routes/emails.js:4`   | `require("../../db")`            |
| `src/api/server.js:5`          | `require("../db")` (initDb only) |
| `src/poller/index.js:3`        | `require("../db")`               |
| `src/workflow/index.js:2`      | `require("../db")`               |
| `scripts/bootstrap-admin.js:2` | `require("../src/db")`           |

All resolve to `src/db.js`. No secondary database module exists.

---

## C. Poller (`src/poller/index.js`)

### C1. Try/catch boundary

```
pollInbox() {
  let connection;               // line 118 — outside try
  try {                         // line 119 — try starts
    connection = await ...      // line 121
    await connection.openBox()  // line 122
    // ... search, loop ...
    for (const msg of messages) {
      // lines 137–178 — ALL inside try, NO per-message catch
    }
    connection.end();           // line 180
  } catch (err) {               // line 181 — catches everything
    console.error(...)
    if (connection) try { connection.end() } catch (e) {}
  }
}
```

Everything from line 121 to 180 is inside a single try block. There is no per-message try/catch.

### C2. Per-message error handling

None. A throw anywhere in the `for` loop (line 136–178) — malformed MIME, null body crash, DB UNIQUE constraint violation, FK constraint failure — immediately exits to the outer catch. All remaining messages in the batch are silently abandoned. The log says `[poller] Error: <message>` with no indication of how many messages were skipped.

### C3. Deduplication

Hash: `sha256(from + subject + dateStr)` (poller.js:147–150).

- `from` = raw From header string (may include display name, e.g. `"Alice <alice@example.com>"`)
- `subject` = raw Subject header string (un-decoded — see C8)
- `dateStr` = raw Date header string; if header absent, `parseRawHeader` returns `""` (not undefined)

Collision scenarios:

1. Same sender sends same subject twice in the same second (same Date header value) → genuine collision, second copy silently skipped.
2. Email client omits Date header → `dateStr = ""` → all headerless emails from same sender with same subject collide.
3. IMAP server returns the same message twice in one batch → second copy hits the `existing` check, `continue`, no INSERT, no "Saved" log.

### C4. Tenant lookup behavior

`db.prepare("SELECT id FROM tenants LIMIT 1").get()` (poller.js:157).

- Zero tenants → returns `undefined` → `if (!tenant) continue` → message silently skipped, no log.
- Multiple tenants → returns the first row in undefined order (no ORDER BY) → all emails assigned to an arbitrary tenant.
- The poller is not multi-tenant aware. Tenant isolation for incoming email depends solely on which tenant row happens to sort first.

### C5. `received_at` source

Set from `Date.now()` at INSERT time: `Math.floor(Date.now() / 1000)` (poller.js:172). NOT from the email's Date header.

### C6. IMAP connection cleanup

Both paths close the connection:

- Success: `connection.end()` line 180.
- Error: `if (connection) try { connection.end() } catch (e) {}` in the catch block (lines 183–185). Inner try/catch swallows any error from `connection.end()` itself.

### C7. `Imap.connect()` failure behavior

If `Imap.connect()` throws (e.g., bad credentials), the throw is caught by the outer catch, logs `[poller] Error: Invalid credentials (Failure)`, and returns. `setInterval` continues. The process does NOT crash. This is what is currently observed on the server — the poller loops every 3 minutes and logs the credential error on each attempt.

### C8. MIME Subject header decoding

No RFC 2047 decoding (`=?utf-8?Q?...?=` or `=?utf-8?B?...?=` encoded words). `parseRawHeader` (poller.js:18–29) uses raw regex string extraction. Subjects with non-ASCII characters encoded per RFC 2047 are stored as raw encoded strings (e.g., `=?UTF-8?Q?Betreff_mit_Umlauten?=`). This will produce garbled subjects for any German email with umlauts in the subject line.

---

## D. Workflow (`src/workflow/index.js`)

### D1. Triage path selection

Controlled by env var `SITEWARE_TRIAGE_MODE` (workflow.js:11):

```js
const TRIAGE_MODE = (
  process.env.SITEWARE_TRIAGE_MODE || "passthrough"
).toLowerCase();
```

- `"passthrough"` (default) → `callTriagePassthrough()`: calls Siteware's OpenAI proxy at `/v1/api/proxy/openai/v1/responses` with a hardcoded German system prompt.
- Any other value → `callTriageAgent()`: calls a Siteware agent directly at `/v1/api/completion/<TRIAGE_AGENT_ID>`.

`SITEWARE_TRIAGE_MODE` is not written by `install.sh`, so the default "passthrough" is always used unless manually added to `.env`.

### D2. `processEmail` error handling

On any throw inside the try block: `db.prepare("UPDATE emails SET status = ? WHERE id = ?").run("error", email.id)` (workflow.js, in the catch block). No retry logic. Emails stuck in "processing" status (if the process crashes mid-execution before the catch runs) would need manual status reset.

### D3. `callReplyAgent` tone profile trace

1. `tenantRow = db.prepare("SELECT tone_profile FROM tenants WHERE id = ?").get(email.tenant_id)`
2. `JSON.parse(tenantRow.tone_profile)` → object `tp` (silent `catch (e) {}` on parse failure)
3. `emailsignature = tp.email_signature || ""`
4. `knowledgebase = tp.knowledgebase || tp.knowledge_base || ""`
5. If `knowledgebase` is empty, a German placeholder fallback string is used.
6. Both are passed as `taskSettings` entries to the Siteware Reply agent API call.

### D4. `extractJson` behavior

````js
function extractJson(s) {
  if (!s) return null;
  if (typeof s === "object") return s; // already parsed
  let str = String(s)
    .trim()
    .replace(/^```(?:json)?\s*/i, "") // strip opening fence
    .replace(/\s*```$/, ""); // strip closing fence
  try {
    return JSON.parse(str);
  } catch (_) {}
  const m = str.match(/\{[\s\S]*\}/); // last resort: find JSON object
  if (m) {
    try {
      return JSON.parse(m[0]);
    } catch (_) {}
  }
  return null;
}
````

Handles markdown code fences. Handles the Siteware double-parse: callers pass `result.json.answer` (the string value inside the Siteware response wrapper), and `extractJson` parses that string into an object. Returns `null` on total failure — callers check for null and throw with the raw text for debugging.

### D5. Fields written to DB from triage/reply

`UPDATE emails SET status=?, classification=?, sentiment=?, urgency=?, draft_reply=?, subject=COALESCE(?,subject) WHERE id=?`

| Column         | Source                                                                       |
| -------------- | ---------------------------------------------------------------------------- |
| status         | `"draft"` (hardcoded)                                                        |
| classification | `triage.classification \|\| "OTHER"`                                         |
| sentiment      | `triage.sentiment \|\| null` — stored as a raw string (e.g. `"negative"`)    |
| urgency        | `triage.suggested_priority \|\| null`                                        |
| draft_reply    | `draft.body_plain \|\| draft.body_html \|\| ""`                              |
| subject        | `draft.subject \|\| email.subject \|\| ""` (COALESCE keeps existing if null) |

Fields NOT stored: `confidence`, `reasoning`, `escalation_triggered`, `escalation_reason`, `language_detected`.

### D6. Concurrent processing guard

The first operation in `processEmail` sets `status = "processing"`. The workflow cycle query is `SELECT * FROM emails WHERE status = 'pending'` — so an email already in "processing" is excluded from subsequent cycles. This is an adequate guard for the 30-second interval. Edge case: if the workflow process crashes between the "processing" UPDATE and the final "draft"/"error" UPDATE, the email is stuck in "processing" permanently with no automated recovery.

---

## E. Jobs (`src/jobs/index.js`)

### E1. Full file content

```js
console.log("[jobs] started");
```

That is the entire file. One line.

### E2. Event loop keepalive

None. The process logs one line and immediately exits (no `setInterval`, no `server.listen`, no pending callbacks).

### E3. PM2 behavior on exit

`ecosystem.config.js` specifies no `autorestart: false`, no `max_restarts`, no `restart_delay`. PM2 default behavior is `autorestart: true`. PM2 will restart the `jobs` process immediately after every exit, indefinitely. This creates a tight infinite restart loop: start → log "[jobs] started" → exit → restart → repeat. PM2 will eventually mark it `errored` after enough restarts in a short window (default: 15 restarts in 15 seconds), then stop restarting.

---

## F. Auth (`src/api/routes/auth.js`)

### F1. OTP cryptographic security

`Math.floor(100000 + Math.random() * 900000).toString()` (auth.js:14). `Math.random()` is NOT cryptographically secure (V8's xorshift128+, predictable with enough samples). Should be `crypto.randomInt(100000, 1000000).toString()`.

### F2. `requireAuth` location

Defined in `src/api/routes/emails.js` lines 6–20. Not in auth.js. Not in a shared module. `auth.js` implements the same session validation logic inline inside `/me` (lines 129–138) without sharing it. The function is not exported from emails.js — it is a module-private middleware.

### F3. Session cookie `secure` flag

`secure: false` (auth.js:102). Cookie is transmitted over HTTP connections. Behind Caddy (TLS termination), the actual transport is HTTPS — but if port 3000 is directly accessible without TLS (which it would be on the VPS before Caddy), sessions are sent in cleartext. Should be `secure: process.env.NODE_ENV === "production"` or always `true` behind a reverse proxy.

---

## G. Email Routes (`src/api/routes/emails.js`)

### G1. `tenant_id` isolation on list query

Yes, enforced. List query (emails.js:27): `WHERE tenant_id = ?` with `req.tenant.id`. Single-email query (emails.js:55): `WHERE id = ? AND tenant_id = ?`. `requireAuth` sets `req.tenant` from the session → DB lookup chain (emails.js:6–20). All data queries are tenant-scoped.

### G2. Send route tenant check / IDOR

No IDOR vulnerability. `SELECT * FROM emails WHERE id = ? AND tenant_id = ?` (emails.js:97–98). If the email belongs to another tenant, the query returns null → 404. A valid session cannot send an email belonging to a different tenant.

### G3. Placeholder check — hard block or soft warning?

Hard 422 block (emails.js:104–109). Pattern: `/\[BITTE ERGÄNZEN:[^\]]*\]/`. To make it a soft warning: remove the `return res.status(422)...` and add `hasUnfilledPlaceholders: true` to the success response JSON so the frontend can prompt the user without preventing send.

### G4. Post-send status

Set to `"sent"` (emails.js:149–152). Distinct from `"archived"`. The full status lifecycle observed in code: `pending` → `processing` → `draft` → `sent` (happy path), or → `error`, or → `archived` (SPAM/AD classification, or manual archive endpoint).

---

## H. Install Script (`install.sh`)

### H1. Repo cloned

`git clone https://github.com/Lukasbrujula/siteware-frontend.git` (install.sh:38). This is **NOT** the same repo as the working project (`Lukasbrujula/siteflow`). The install script clones a different repository. This is a critical mismatch — installs from `siteware-frontend`, but all actual development and bug fixes are committed to `siteflow`.

### H2. Hardcoded agent IDs

```
SITEWARE_TRIAGE_AGENT_ID=69a793b549b400eda5ba1d28
SITEWARE_REPLY_AGENT_ID=69a79a7474b96c80ef1a84e2
```

These do **not** match the state doc values (`69df929cfff5e6c3a00b88bb` / `69df943efff5e6c3a00b88c7`). Three distinct sets of agent IDs exist across the project history. The IDs on the running server are unknown without checking `/opt/siteflow/.env` directly.

### H3. Siteware token structure

Only one token is written: `SITEWARE_API_TOKEN=$SITEWARE_TOKEN` (install.sh:55). No `SITEWARE_TRIAGE_TOKEN` or `SITEWARE_REPLY_TOKEN`. workflow.js falls back to `SITEWARE_API_TOKEN` if the per-agent tokens are absent (lines 6–7 of workflow.js), so this works — but both agents share one token.

### H4. Credential validation

No validation. No IMAP test connection, no Siteware API test call. Install completes regardless of whether any credentials are correct.

### H5. Secret generation

`ENCRYPTION_KEY=$(openssl rand -hex 32)` and `SESSION_SECRET=$(openssl rand -hex 32)` (install.sh:24–25). Real 256-bit secrets generated at install time.

### H6. Post-install health check

No. Install prints "Installation complete!" and exits without calling the health endpoint or verifying any process started successfully.

### H7. `SITEWARE_TRIAGE_MODE` in `.env`

Not written. `workflow.js` defaults to `"passthrough"` when the var is absent, so passthrough mode is active by default after a fresh install. This is the correct behavior for the current deployment but is not explicit.

### H8. Node.js version from `apt install nodejs`

Ubuntu 24.04 LTS ships Node.js 18.x via `apt`. The server has v22.22.2, indicating it was installed via NodeSource or nvm after the fact — not via the install script's `apt install nodejs` line.

---

## I. Update Script (`update.sh`)

### I1. Repo

`git clone https://github.com/Lukasbrujula/siteware-frontend.git` (update.sh:12). Same wrong repo as install.sh. Any server-side updates to `src/` pushed to `siteflow` (the real repo) will not be picked up by running `update.sh`. The update script is non-functional for this project in its current state.

### I2. `.env` preservation

`.env` is not touched. The update script only copies `dist/*` → `public/` and `src/*` → `src/`. Environment configuration is safe from overwrites.

### I3. `npm install` after update

Yes, line 19.

### I4. PM2 restart with `--update-env`

Yes, all four processes restarted with `--update-env` (update.sh:22–25). New env vars added to `.env` between updates will be picked up.

---

## J. Missing Pieces

1. **`.env.example`** — Does not exist. No reference implementation for required environment variables. Operators must infer from install.sh or source code.

2. **`CLAUDE.md`** (project root) — Does not exist. There is a global `~/.claude/CLAUDE.md` but no project-level instructions.

3. **`.claude/` directory** — Does not exist in the project.

4. **Test files** — None. `package.json` scripts.test is `echo "Error: no test specified" && exit 1`. No test framework installed.

5. **`public/assets/`** — Pre-built React SPA. 7 JS chunks + 1 CSS + `index.html`. The build source is not in this repo. The install/update scripts copy from `siteware-frontend/dist/` — a separate repo whose source is not visible here.

6. **`write_*.py` files** — 8 files present locally (`write_auth.py`, `write_bootstrap.py`, `write_db.py`, `write_emails_route.py`, `write_install.py`, `write_poller.py`, `write_update.py`, `write_workflow.py`). They are gitignored (`write_*.py` in `.gitignore`). Based on names they are scaffolding scripts that wrote the initial server-side files programmatically. Not runtime code.

---

## K. Cross-Cutting Concerns

### K1. All environment variables by file

| Variable                   | File(s)                        | Fallback                                         |
| -------------------------- | ------------------------------ | ------------------------------------------------ |
| `PORT`                     | server.js:25                   | `3000`                                           |
| `SESSION_DURATION_DAYS`    | auth.js:9                      | `"7"`                                            |
| `SMTP_HOST`                | auth.js:22, emails.js:136      | none in auth.js; `"smtp.gmail.com"` in emails.js |
| `SMTP_PORT`                | auth.js:23, emails.js:137      | `"587"` both                                     |
| `SMTP_USER`                | auth.js:25, emails.js:139      | none                                             |
| `SMTP_PASSWORD`            | auth.js:26, emails.js:139      | none                                             |
| `IMAP_USER`                | poller.js:8                    | none                                             |
| `IMAP_PASSWORD`            | poller.js:9                    | none                                             |
| `IMAP_HOST`                | poller.js:10                   | `"imap.gmail.com"`                               |
| `POLL_INTERVAL_MS`         | poller.js:190                  | `"180000"` (3 min)                               |
| `SITEWARE_API_TOKEN`       | workflow.js:6–7                | none (used as fallback for the two below)        |
| `SITEWARE_TRIAGE_TOKEN`    | workflow.js:6                  | falls back to `SITEWARE_API_TOKEN`               |
| `SITEWARE_REPLY_TOKEN`     | workflow.js:7                  | falls back to `SITEWARE_API_TOKEN`               |
| `SITEWARE_TRIAGE_AGENT_ID` | workflow.js:8                  | none                                             |
| `SITEWARE_REPLY_AGENT_ID`  | workflow.js:9                  | none                                             |
| `SITEWARE_TRIAGE_MODE`     | workflow.js:11                 | `"passthrough"`                                  |
| `SITEWARE_TRIAGE_MODEL`    | workflow.js:12                 | `"gpt-4.1"`                                      |
| `NODE_ENV`                 | ecosystem.config.js:8,16,23,30 | `"production"` (set by PM2)                      |

### K2. Logging

`console.log` / `console.error` only. No structured logging, no log levels, no timestamps in messages (PM2 injects timestamps in `pm2 logs` output). No request logging middleware. No correlation IDs. No way to trace a request across the API → workflow chain.

### K3. Rate limiting

None. No rate limiting on any route. The OTP request endpoint (`POST /api/auth/request-otp`) in particular has no rate limit — an attacker can spam the SMTP account by triggering unlimited OTP emails. The verify endpoint has no lockout after failed attempts.

### K4. Input validation and sanitization

Email bodies are stored as-is from IMAP, truncated at 5000 chars. No sanitization. Draft replies from the workflow are stored as-is. The send endpoint sends `text:` (not `html:`), so no XSS via SMTP. No Zod or express-validator is used anywhere. `req.body` fields are used directly with only basic truthiness checks.

### K5. SMTP transporter creation pattern

`auth.js` (lines 21–29): Module-level singleton — created once when the module loads, reused for all OTP sends. No `SMTP_HOST` fallback (will be `undefined` if not set).

`emails.js` (lines 135–140): Fresh `nodemailer.createTransport()` on every send request. Has `SMTP_HOST` fallback to `"smtp.gmail.com"`.

The two transporters use the same credentials but are created differently and have different resilience to missing env vars.

---

## Summary of Critical Issues

| #   | Severity | Location                    | Issue                                                                                     |
| --- | -------- | --------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | CRITICAL | install.sh:38, update.sh:12 | Wrong repo cloned (`siteware-frontend` not `siteflow`) — install/update deploy stale code |
| 2   | CRITICAL | poller.js:136–178           | No per-message try/catch — one bad message aborts the entire batch silently               |
| 3   | HIGH     | poller.js:147–150           | Subject MIME encoding not decoded — German umlauts stored as `=?UTF-8?Q?...?=`            |
| 4   | HIGH     | poller.js:157               | Multi-tenant unsafe — all emails assigned to arbitrary first tenant row                   |
| 5   | HIGH     | install.sh:56–57            | Wrong agent IDs hardcoded (third distinct set, not matching state doc)                    |
| 6   | HIGH     | auth.js:14                  | `Math.random()` for OTP — not cryptographically secure                                    |
| 7   | HIGH     | auth.js:102                 | `secure: false` on session cookie                                                         |
| 8   | HIGH     | —                           | No rate limiting on OTP endpoint                                                          |
| 9   | MEDIUM   | src/db.js                   | No index on `emails.status` or `emails.tenant_id` — full table scans                      |
| 10  | MEDIUM   | src/jobs/index.js           | Jobs process exits immediately — PM2 restart loop                                         |
| 11  | MEDIUM   | workflow.js                 | Emails stuck in `"processing"` permanently if process crashes mid-execution               |
| 12  | LOW      | server.js:9                 | `cors()` with no origin whitelist — accepts all origins                                   |
| 13  | INFO     | —                           | No `.env.example`, no tests, no structured logging                                        |
