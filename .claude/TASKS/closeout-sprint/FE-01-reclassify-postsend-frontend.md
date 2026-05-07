# Task: FE-01 — Reclassification UI + Post-Send Refresh

## Status
- [ ] Pending
- [ ] Research Complete (awaiting Lukas approval)
- [ ] In Progress
- [ ] Verified
- [ ] Complete

---

## Coordination With MI-06 (READ FIRST)

This task and MI-06 (multi-inbox frontend filter) both modify the same frontend repo. They share files: `email-store.ts`, `ui-store.ts`, `mapBackendEmail` in `emails.ts`, the views.

**Sequencing rule: FE-01 runs first, MI-06 runs second, single rebuild + deploy at the end of MI-06.**

This means:

- FE-01 ends with code committed in the frontend repo branch — but **NO `npm run build`**, **NO copying `dist/*` to backend**, **NO commit in the backend repo**.
- MI-06 starts on top of FE-01's changes, adds its own changes, then runs `npm run build` once, copies `dist/*` once, commits once in the backend.
- Both pieces ship as a single deploy.

If FE-01 is executed and the agent reaches step "rebuild and deploy" — **stop**. Lukas confirms whether MI-06 has been merged into the same branch first.

This avoids two rebuild cycles, two deploys, and two opportunities for conflict on overlapping files.

---

## Pre-Flight Research (REQUIRED — DO NOT SKIP)

**Before any code changes, the agent must:**

This task spans the separate frontend repo. Research happens in `Lukasbrujula/siteware-frontend`, NOT the backend.

1. Read `src/lib/api/webhooks.ts` — understand the current `approveDraft`, `rejectDraft`, `retriage` patterns
2. Read `src/lib/store/email-store.ts` — understand the Zustand slice structure per category
3. Read `src/lib/store/ui-store.ts` — understand current UI state (this is also where MI-06 will add `selectedInboxId`; design the FE-01 changes to not collide)
4. Read the dashboard table component (likely `src/components/email/EmailTable.tsx` or similar) — note where the existing action column is
5. Read `src/views/` — identify which views show which classifications (Werbung/Spam/Sonstige/Urgent/etc.) so we know where the reclassify button needs to appear
6. Read `src/hooks/useDataStream.ts` — understand the current 20s polling cycle
7. Check the existing `approveDraft` flow specifically — does it currently refetch after success, or is the post-send-refresh bug because it doesn't?
8. Check whether MI-06's task file specifies any changes to the same files. If so, plan the FE-01 changes to be additive, not destructive.

**Report back to Lukas with:**

1. Confirmation of which view files need the reclassify action added (probably Spam, Werbung, Sonstige, Urgent — anywhere a list of classified emails is shown)
2. The current state-shape: how do email-store slices know about each category, and how does an email "move" between categories today? (Likely it doesn't — re-poll picks up the new state)
3. The exact bug in `approveDraft` that causes the post-send refresh issue — is it missing a refetch, missing a slice update, or something else?
4. Proposed UI for the reclassify action: dropdown? menu? button per row? confirmation dialog?
5. Whether to do optimistic updates (faster UI, rollback on error) or pessimistic (wait for backend confirm, simpler) — recommend one with reasoning
6. Estimated lines of code changed and which files
7. Confirmation that the planned changes don't overlap destructively with MI-06 (ui-store fields, mapBackendEmail extensions, view wiring)

**Wait for Lukas's "approved, go" with UI approach + state strategy before proceeding.**

---

## Pillars

### 1. Model
opus (cross-file frontend reasoning, state management decisions, API integration)

### 2. Tools Required
- [x] Read, Edit, Write (file operations)
- [x] Bash: `npx tsc --noEmit` to verify type-clean (NOT `npm run build` — see Coordination)
- [x] Grep, Glob (find existing patterns)
- [ ] WebFetch
- [ ] Task (sub-agents)

### 3. Guardrails (DO NOT)
- Do NOT modify: any backend code (RC-01 already shipped the endpoint)
- Do NOT modify: the build configuration (vite.config, tsconfig)
- Do NOT install: new dependencies
- Do NOT change: the existing 20s polling interval
- Do NOT touch: `src/lib/api/emails.ts` `mapBackendEmail` function unless absolutely needed for the new field — that function is load-bearing per April 16 postmortem
- **Do NOT run `npm run build`. Do NOT copy `dist/*` to backend `public/`. Do NOT commit in the backend repo.** The build + deploy happens once at the end of MI-06.
- All changes must compile with `npx tsc --noEmit` exit 0

### 4. Knowledge (MUST READ)
- [x] siteflow-state.md
- [x] handoff-2026-04-21.md (P1 + P2 scope notes)
- [x] postmortem-2026-04-16.md (the dashboard rebuild lessons — esp. "URL string literals are a known weak spot")
- [x] WORKFLOW.md (especially Deployment Flow section for frontend changes)
- [x] Frontend repo audit at `docs/FRONTEND_AUDIT.md` if it exists
- [x] `siteflow:.claude/TASKS/closeout-sprint/multi-inbox/MI-06-frontend-inbox-filter.md` — to confirm what MI-06 touches and avoid destructive overlap

**Domain facts the agent won't infer from code:**

- The frontend is a separate repo: `Lukasbrujula/siteware-frontend`. Build with `npm run build`, then copy `dist/*` to backend's `public/` directory, commit the rebuilt bundle in the backend repo. **In FE-01, do not perform the build/copy/commit step.** That happens once at end of MI-06.
- Werbung, Spam, Sonstige, Urgent each correspond to a classification value (AD, SPAM, OTHER, URGENT respectively). ESCALATION goes to a separate Eskalation view.
- The 20s poll will eventually converge the UI state with backend state, but users notice the lag. Optimistic updates eliminate the lag at the cost of complexity.
- Per April 21 handoff: post-send UI refresh is the explicit name for the bug where approved emails stay visible until manual page reload.
- Per multi-inbox audit §5: MI-06 adds `selectedInboxId: string | null` to ui-store, plus `inboxes: readonly Inbox[]`, plus a `useFilteredSlice(slice)` selector hook. Plan FE-01's state changes to coexist with these.

### 5. Memory
- April 16 postmortem: every action endpoint went 404 because frontend strings didn't match backend routes. Use the EXACT endpoint shape from RC-01's handoff notes.
- April 21 handoff explicitly grouped these two features as related: "Once reclassification exists, 'found in spam, actually important' becomes cleanly handleable."
- The frontend rebuild dance is non-trivial — that's why FE-01 + MI-06 share a single rebuild at the end.

### 6. Success Criteria

**Reclassification UI:**
- [x] An "Aktionen" or equivalent action element appears per row in Werbung, Spam, Sonstige, Urgent views
- [x] Clicking the action surfaces options to move to each other classification
- [x] On click, calls `POST /api/emails/:id/reclassify` with the chosen classification
- [x] On success: the email disappears from the current view and appears in the destination view (without page reload)
- [x] On error: shows a toast/error message and the row stays in the current view

**Post-send refresh:**
- [x] After successful approve+send, the email disappears from Sonstige (or wherever it was) and appears in Gesendet
- [x] No manual page reload required

**General:**
- [x] `npx tsc --noEmit` exits 0
- [x] **`npm run build` is NOT run as part of this task. Bundle is NOT copied to backend. No backend commit.**
- [x] Frontend repo branch contains FE-01 commits ready for MI-06 to build on top of
- [x] After MI-06 has also merged and the shared rebuild has happened, Lukas verifies on test server:
  - Reclassify a Werbung email to Sonstige — verify it moves and a draft is generated
  - Reclassify a Sonstige email to Spam — verify it moves to Werbung/Spam without a draft
  - Approve and send a draft — verify it moves from Sonstige to Gesendet without page reload

### 7. Dependencies
- [x] RC-01 must be deployed and verified working — frontend can't call an endpoint that doesn't exist
- [x] Frontend repo must be cloned locally (Lukas confirms before starting)

### 8. Failure Handling

**Max attempts:** 3

**On failure (per attempt):**
- If TypeScript errors after adding the new API call: check that the response type matches what RC-01 actually returns. Update the type in `webhooks.ts` if needed.
- If reclassify call returns 404: verify the backend has `/api/emails/:id/reclassify` (not `/api/email/:id/reclassify` — singular vs plural is a known landmine per April 16 postmortem)
- If state update doesn't move the email between views: the Zustand slices may be keyed in a way that requires explicit removal from old slice + addition to new. Check store structure.
- If a change overlaps destructively with MI-06's planned changes: stop and surface to Lukas before proceeding.

**After max attempts exhausted:**
- Escalate to Lukas with the network tab capture, console errors, and the proposed state structure

**Rollback command:**
```bash
# In frontend repo:
git checkout -- src/lib/api/webhooks.ts src/lib/store/email-store.ts <changed view files>
```

### 9. Learning

**Log to LEARNINGS.md if:**
- The Zustand store structure required deeper changes than expected
- The optimistic update approach hit edge cases (rapid clicks, network errors mid-transition)
- The post-send bug had a deeper cause than just missing refetch
- A planned change conflicted with MI-06 in a way the FE-01 / MI-06 split didn't anticipate

---

## Human Checkpoint
- [ ] **REQUIRED** — Lukas reviews research output (especially UI approach + state strategy) before implementation
- [ ] **REQUIRED** — Lukas confirms MI-06 readiness before allowing the shared rebuild step (handled at end of MI-06, not here)
- [ ] **REQUIRED** — Lukas runs all four manual verification scenarios on test server before considering complete (after MI-06 also lands)

---

## Description

Two related frontend features bundled into one task to share the rebuild cycle with MI-06:

1. **Reclassification UI** (P1 from roadmap): Dashboard buttons to move misclassified emails between buckets. Calls the RC-01 endpoint.
2. **Post-send refresh** (P2 from roadmap): Fix the bug where approved emails stay visible in Sonstige until manual page reload.

This task makes the code changes. MI-06 makes its frontend changes on top. Then a single rebuild + deploy cycle ships both.

## Steps

1. Pre-flight research in frontend repo — report back, wait for approval (including confirmation of MI-06 overlap)
2. Implement reclassification action + API call in `webhooks.ts`
3. Update Zustand store to handle the move-between-slices logic
4. Add the action UI to Werbung, Spam, Sonstige, Urgent views
5. Fix `approveDraft` to refetch or optimistically update post-send
6. Run `npx tsc --noEmit` — must exit 0
7. **STOP. DO NOT BUILD. DO NOT DEPLOY.** Commit FE-01 changes in the frontend repo on the shared branch.
8. Hand off to MI-06.

## On Completion

- **Commit (frontend repo only):** `feat(dashboard): reclassify action + post-send refresh (FE-01)`
- **No backend commit.** Bundle rebuild and backend commit happen at end of MI-06.
- **Update:** State doc — P1 and P2 are coded; awaiting MI-06 + shared rebuild for deploy.
- **Handoff notes for MI-06:** branch contains FE-01 changes; MI-06 starts on top of those, adds its changes, then runs the single rebuild + backend commit + deploy.
