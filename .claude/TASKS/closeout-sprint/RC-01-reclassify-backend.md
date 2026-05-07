# Task: RC-01 — Reclassification Backend Endpoint

## Status
- [ ] Pending
- [ ] Research Complete (awaiting Lukas approval)
- [ ] In Progress
- [ ] Verified
- [ ] Complete

---

## Pre-Flight Research (REQUIRED — DO NOT SKIP)

**Before any code changes, the agent must:**

1. Read `src/api/routes/emails.js` end-to-end — note all existing endpoint patterns
2. Read `src/workflow/index.js` — understand how `callReplyAgent` is called and what state transitions exist
3. Search for all places that read `emails.classification` and `emails.status` to understand the state machine
4. Check the existing `archive`, `reject`, and `retriage` endpoints — these are the closest analogs to what we're building

**Report back to Lukas with:**

1. The exact route signatures of `archive`, `reject`, `retriage` endpoints (verb + path + what they do)
2. The current set of valid classifications (likely: SPAM, AD, URGENT, OTHER, ESCALATION) — confirm by reading the workflow code
3. The current state machine: what status transitions happen when classification changes? Specifically:
   - If reclassifying SPAM/AD → URGENT/OTHER: should this trigger the Reply Composer to generate a draft? (Likely yes — the email moves from archived to needing review)
   - If reclassifying URGENT/OTHER → SPAM/AD: should this archive without a draft? (Likely yes)
   - What status should the email end up in for each transition?
4. Proposed endpoint signature: `POST /api/emails/:id/reclassify` with body `{ classification: "URGENT|OTHER|SPAM|AD|ESCALATION" }`
5. Whether the response should be synchronous (wait for Reply Composer if draft needed) or async (return 202 immediately, draft generates in background)

**Wait for Lukas's "approved, go" with the proposed state machine and sync/async decision before proceeding.**

---

## Pillars

### 1. Model
opus (cross-file reasoning: route + workflow integration + state machine)

### 2. Tools Required
- [x] Read, Edit (file operations)
- [x] Bash: `node -c src/api/routes/emails.js`, curl for endpoint testing
- [x] Grep, Glob (find classification usage)
- [ ] WebFetch
- [ ] Task (sub-agents)

### 3. Guardrails (DO NOT)
- Do NOT modify: `src/poller/index.js`, `src/jobs/index.js`, `src/db.js` schema (no new columns)
- Do NOT modify: any frontend code (FE-01 handles that)
- Do NOT modify: existing `archive`, `reject`, `retriage`, `send`, `unsubscribe` endpoint logic
- Do NOT change: existing classification values or add new ones
- Do NOT bypass: tenant scoping — the endpoint MUST verify the email belongs to the requesting tenant
- Do NOT trigger: Reply Composer for spam/ad classifications — those should not generate drafts
- The endpoint MUST be idempotent (re-classifying to the same value must not create duplicate drafts)

### 4. Knowledge (MUST READ)
- [x] siteflow-state.md (project state and roadmap)
- [x] handoff-2026-04-21.md (P1 reclassification was always the highest-priority post-launch work)
- [x] src/api/routes/emails.js (existing endpoint patterns)
- [x] src/workflow/index.js (callReplyAgent, state machine)

**Domain facts the agent won't infer from code:**

- SugarPool's email triage has 5 classifications: SPAM, AD, URGENT, OTHER, ESCALATION
- Drafts are generated for URGENT and OTHER. SPAM and AD go straight to archived.
- The dashboard expects `emails.classification` to drive which tab the email shows up in
- This is the single most-requested feature for customer trust — the "AI got it wrong" escape hatch
- Audit log must record the reclassification (who, when, from-classification, to-classification) for trust + debugging

### 5. Memory
- April 21 handoff explicitly listed this as P1 with scope notes
- The reclassification endpoint is meant to be called by the dashboard when a user clicks "Move to Sonstige" or similar — keep the API shape simple
- Per the April 21 handoff: "this touches the frontend, which means pulling the siteware-frontend repo, editing .tsx, rebuilding with Vite, copying dist/* to the backend's public/, committing the rebuilt bundle. More moving parts than anything we touched today." — THIS task is backend only, but plan the API shape so FE-01 has a clean contract.

### 6. Success Criteria
- [x] `POST /api/emails/:id/reclassify` exists with body validation: `{ classification: "URGENT"|"OTHER"|"SPAM"|"AD"|"ESCALATION" }`
- [x] Endpoint is tenant-scoped (returns 404 if email belongs to different tenant)
- [x] Reclassifying SPAM/AD → URGENT/OTHER triggers Reply Composer and sets status to `draft`
- [x] Reclassifying URGENT/OTHER → SPAM/AD sets status to `archived` without generating a draft
- [x] Reclassifying to ESCALATION sets status to whatever escalation-status the existing flow uses (research will determine this)
- [x] Reclassifying to the same classification is a no-op (returns 200 OK with current state, no re-trigger)
- [x] An audit log entry is written for every reclassification
- [x] `node -c src/api/routes/emails.js` exits 0
- [x] Manual curl test from Lukas:
  ```bash
  # Pick an archived AD email, reclassify to OTHER, verify draft generates
  curl -X POST -H "Content-Type: application/json" \
    -H "Cookie: <session-cookie>" \
    -d '{"classification":"OTHER"}' \
    http://localhost:3000/api/emails/<id>/reclassify
  ```
- [x] After test: query DB to confirm status changed and draft_reply is populated

### 7. Dependencies
- [x] None (can start immediately, parallel with SH-01 and SH-02)

### 8. Failure Handling

**Max attempts:** 3

**On failure (per attempt):**
- If Reply Composer call fails: do NOT leave the email in inconsistent state. Wrap reclassification in a transaction OR set status back to original on Composer error
- If audit log write fails: still complete the reclassification (log to console.error and continue) — audit log shouldn't block user-facing functionality
- If tenant scoping fails (404 on legitimate request): check that session middleware is correctly populating req.tenant before this route handler runs

**After max attempts exhausted:**
- Escalate to Lukas with the curl command, the response, and DB state before/after

**Rollback command:**
```bash
git checkout -- src/api/routes/emails.js
```

### 9. Learning

**Log to LEARNINGS.md if:**
- The state machine had a transition I didn't anticipate (e.g., what if email is currently in `pending` status?)
- The Reply Composer call had different behavior than expected for reclassified emails vs newly-arrived ones
- The audit log structure required extension to capture reclassification context

---

## Human Checkpoint
- [ ] **REQUIRED** — Lukas reviews research output (especially state machine proposal) before implementation
- [ ] **REQUIRED** — Lukas runs the curl test and verifies DB state before considering this complete

---

## Description

P1 from the post-launch roadmap. The "AI got it wrong" escape hatch.

When the AI misclassifies an email — say, classifies a real customer inquiry as AD and archives it — the user needs a one-click way to recover. Without this, one bad archive kills trust. This task builds the backend endpoint; FE-01 builds the UI that calls it.

## Steps

1. Pre-flight research (see above) — report back, wait for approval on state machine
2. Add `POST /api/emails/:id/reclassify` route handler in `src/api/routes/emails.js`
3. Implement state machine logic per approved approach
4. Add audit log write
5. Run `node -c`
6. Manually test with curl against test server (Lukas runs this)
7. Commit: `feat(api): add reclassification endpoint with state machine`
8. Hand off to FE-01 with the endpoint signature documented

## On Completion

- **Commit:** `feat(api): add reclassification endpoint with state machine`
- **Update:** State doc — mark P1 backend as done, P1 frontend (FE-01) is now unblocked
- **Handoff notes for FE-01:**
  - Endpoint: `POST /api/emails/:id/reclassify`
  - Body: `{ classification: "URGENT"|"OTHER"|"SPAM"|"AD"|"ESCALATION" }`
  - Response: 200 with updated email object, OR 404 if email not found / wrong tenant
  - Frontend should refetch the affected email + the destination bucket after a successful reclassify, or use optimistic update with rollback-on-error
