# Task: SH-01 — OTP Crypto + Session Cookie + OTP Rate Limit

## Status
- [ ] Pending
- [ ] Research Complete (awaiting Lukas approval)
- [ ] In Progress
- [ ] Verified
- [ ] Complete

---

## Pre-Flight Research (REQUIRED — DO NOT SKIP)

**Before any code changes, the agent must:**

1. Read `src/api/routes/auth.js` end-to-end
2. Read the session cookie configuration in `src/api/server.js`
3. Search for any other usage of `Math.random()` in `src/` — there may be more than the OTP one
4. Check whether `express-rate-limit` is already installed in `package.json`

**Report back to Lukas with:**

1. The exact file + line numbers where `Math.random()` is currently used for OTP generation
2. The current session cookie config (httpOnly, secure, sameSite, maxAge)
3. Any other `Math.random()` usages found and whether they're security-sensitive
4. Whether `express-rate-limit` is installed; if not, the install command needed
5. The current OTP request endpoint path and whether it has any existing rate limiting

**Wait for Lukas's "approved, go" before proceeding to implementation.**

---

## Pillars

### 1. Model
sonnet (mechanical changes, well-defined)

### 2. Tools Required
- [x] Read, Edit (file operations)
- [x] Bash: `node -c src/api/routes/auth.js`, `npm install` if needed
- [x] Grep, Glob (search for Math.random usage)
- [ ] WebFetch
- [ ] Task (sub-agents)

### 3. Guardrails (DO NOT)
- Do NOT modify: any database schema or migrations
- Do NOT modify: poller, workflow, or jobs services
- Do NOT modify: frontend code
- Do NOT change: existing OTP token format or length (clients may have references)
- Do NOT install: any package other than `express-rate-limit` (and only if not already installed)
- Run `node -c <file>` after each file change to verify syntax

### 4. Knowledge (MUST READ)
- [x] CLAUDE.md / siteflow-state.md (project state)
- [x] src/api/routes/auth.js (current OTP implementation)
- [x] src/api/server.js (session cookie config and middleware setup)
- [x] WORKFLOW.md (especially the "Edit policy" section — code via Claude Code, .env via sed on server)

**Domain facts the agent won't infer from code:**

- `crypto.randomInt(min, max)` returns a number in `[min, max)` exclusive — to get a 6-digit OTP, use `crypto.randomInt(100000, 1000000)`
- Session cookie `secure: true` only works over HTTPS. In production this is fine (Caddy provides HTTPS). In local dev, this would block login. Use `secure: process.env.NODE_ENV === 'production'`
- `express-rate-limit` v7+ has a different API than v6. Check installed version before writing config

### 5. Memory
- The April 21 lessons doc warned about silent encoding issues when shell-quoting passwords. Same lesson applies generally: always verify what was written by reading it back.
- The project uses `better-sqlite3` synchronously throughout — don't introduce async patterns

### 6. Success Criteria
- [x] No `Math.random()` calls remain in `src/api/routes/auth.js`
- [x] OTP is generated via `crypto.randomInt(100000, 1000000)`
- [x] Session cookie config includes `secure: process.env.NODE_ENV === 'production'`
- [x] Session cookie config includes `httpOnly: true` and `sameSite: 'lax'` (or 'strict' if existing was strict)
- [x] `POST /api/auth/request-otp` has rate limiting: max 5 requests per 15 minutes per IP
- [x] `node -c src/api/routes/auth.js` exits 0
- [x] `node -c src/api/server.js` exits 0
- [x] After deploy: `curl -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com"}' http://localhost:3000/api/auth/request-otp` succeeds the first 5 times and returns 429 on the 6th
- [x] After deploy: existing OTP login flow still works (verify by requesting OTP for `mdplaylisting@gmail.com` and logging in)

### 7. Dependencies
- [x] None (can start immediately)

### 8. Failure Handling

**Max attempts:** 3

**On failure (per attempt):**
- If `crypto.randomInt` not available: confirm Node.js version >=14.10. If older, escalate
- If rate-limit middleware breaks other endpoints: ensure it's applied ONLY to `/api/auth/request-otp`, not as a global middleware
- If session cookie change breaks login: check whether NODE_ENV is set to 'production' on the server and whether HTTPS is actually working

**After max attempts exhausted:**
- Escalate to Lukas with full error output and a list of what was tried

**Rollback command:**
```bash
git checkout -- src/api/routes/auth.js src/api/server.js
git checkout -- package.json package-lock.json  # if rate-limit was newly installed
```

### 9. Learning

**Log to LEARNINGS.md if:**
- Other Math.random() usages were found that should also be hardened
- The session cookie change required additional Caddy or proxy config changes
- The rate limit triggered false positives in normal usage patterns

---

## Human Checkpoint
- [ ] **REQUIRED** — Lukas reviews research output before implementation begins
- [ ] **REQUIRED** — Lukas verifies post-deploy that OTP login still works for `mdplaylisting@gmail.com`

---

## Description

Three small but real security improvements before onboarding paying customers:

1. Replace `Math.random()` for OTP with `crypto.randomInt` (cryptographically secure)
2. Set session cookie `secure: true` in production (prevents cookie leakage over HTTP)
3. Rate-limit the OTP request endpoint to prevent abuse (5 per 15 min per IP)

These are listed in the project state doc's Priority 4 backlog and were classified as "non-blocking for demo." With real customers coming, they shift to required.

## Steps

1. Pre-flight research (see above) — report back, wait for approval
2. Install `express-rate-limit` if not already installed
3. Replace `Math.random()` in `auth.js` OTP generation with `crypto.randomInt(100000, 1000000)`
4. Update session cookie config in `server.js` with secure/httpOnly/sameSite
5. Apply rate-limit middleware to `POST /api/auth/request-otp` only
6. Run `node -c` on both files
7. Commit with message: `chore(security): harden OTP crypto, session cookies, OTP rate limit`
8. Hand off to Lukas for deploy verification

## On Completion

- **Commit:** `chore(security): harden OTP crypto, session cookies, OTP rate limit`
- **Update:** Note in CLAUDE.md / state doc that priority 4 security items 1-3 are done
- **Handoff notes for SH-02:** No file overlap. Can run SH-02 in a separate Claude Code instance in parallel.
