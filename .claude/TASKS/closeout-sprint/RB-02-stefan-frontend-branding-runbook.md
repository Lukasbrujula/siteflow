# Task: RB-02 — Stefan Frontend Duplication & Branding Runbook

## Status
- [ ] Pending
- [ ] Research Complete (awaiting Lukas approval)
- [ ] In Progress
- [ ] Verified
- [ ] Complete

---

## Pre-Flight Research (REQUIRED — DO NOT SKIP)

**Before writing the runbook, the agent must:**

1. Read the frontend repo's README and any existing branding documentation
2. Identify every place in the frontend where SugarPool branding appears (logo, color, footer text, page title)
3. Read the existing build-and-deploy process (from WORKFLOW.md and any frontend audit doc)
4. Determine: is the per-customer branding done by editing CSS variables, swapping image assets, or both?
5. Check whether there's a `public/` or `assets/` directory structure that makes asset swapping straightforward

**Report back to Lukas with:**

1. Complete list of every file/asset that needs per-customer customization (logo files, color values, footer/header text, page title, favicon)
2. Whether there's an existing pattern for branding configuration, or whether each customer is a manual fork
3. Proposed runbook structure (suggested below)
4. Realistic time estimate per customer for Stefan to do this manually (if it's >30 min, the runbook may need to recommend a more automated approach)
5. Whether the per-customer branding belongs in the customer's VPS only, or also requires changes in a separate repo

**Wait for Lukas's "approved, go" with the structure before writing.**

---

## Pillars

### 1. Model
sonnet (writing task with clear inputs)

### 2. Tools Required
- [x] Read, Write (file operations)
- [x] Bash: optional, only if running `npm run build` to validate the runbook
- [x] Grep, Glob (find branding references in frontend)
- [ ] WebFetch
- [ ] Task (sub-agents)

### 3. Guardrails (DO NOT)
- Do NOT modify: any code in `src/`
- Do NOT modify: the build configuration
- Do NOT introduce: a new branding system or refactor the existing approach (out of scope — runbook documents the current state)
- Do NOT include: actual customer branding (logos, colors). Use placeholders.
- Do NOT skip: a verification step at the end (Stefan must know the branding is correct before handing off to the customer)

### 4. Knowledge (MUST READ)
- [x] siteflow-state.md
- [x] handoff-2026-04-21.md (mentions the frontend rebuild dance)
- [x] WORKFLOW.md (especially the Deployment Flow section)
- [x] Frontend repo's existing docs (FRONTEND_AUDIT.md if it exists)
- [x] The runbook from RB-01 (this runbook should slot in cleanly after that one)

**Domain facts the agent won't infer from code:**

- Andreas's directive (May 5): "Stefan duplicates the frontend per customer, applies branding, points it at the new VPS." This is the operational model — not automated, manual but documented.
- Andreas's time estimate: 2-3h per customer for setup, ~30-45 min per employee for additional onboarding. The runbook should aim to fit within that 2-3h window.
- The frontend currently has minimal theming. Customer branding is mostly: logo file, footer text, possibly primary color via CSS variable.
- Stefan accesses customer VPSs via Hostinger browser terminal. He needs to be able to upload assets (logos) — this might require briefly using SCP from a workstation, or a webmail-style upload.
- The frontend lives in a separate repo: `Lukasbrujula/siteware-frontend`. Per-customer branding may or may not warrant a fork — this is what the research phase decides.

### 5. Memory
- April 21 handoff explicitly called out the frontend rebuild dance: "pulling the siteware-frontend repo, editing .tsx, rebuilding with Vite, copying dist/* to the backend's public/, committing the rebuilt bundle. More moving parts than anything we touched today."
- FE-01 just shipped reclassification + post-send fixes — this runbook documents the post-FE-01 frontend state

### 6. Success Criteria
- [x] Runbook saved to `docs/runbooks/stefan-frontend-customer-branding.md`
- [x] Sections cover: prerequisites (RB-01 must be done first), branding inventory (what changes per customer), step-by-step customization, build + deploy, verification
- [x] Each customization step includes a "what success looks like" check
- [x] If a fork-per-customer model is used: clear instructions for naming the fork, where to commit, how to keep it in sync with the canonical frontend
- [x] If a CSS-variable model is used: clear instructions for which file to edit and what each variable does
- [x] Build + deploy section reuses commands from existing handoffs (no new build process)
- [x] Final verification step: Stefan opens the dashboard and visually confirms branding is correct
- [x] Lukas reads end-to-end and signs off

### 7. Dependencies
- [x] FE-01 must be deployed (runbook documents the post-FE-01 state)
- [x] RB-01 must be complete (this runbook references it as a prerequisite)

### 8. Failure Handling

**Max attempts:** 2 (writing task)

**On failure (per attempt):**
- If the per-customer branding turns out to require code changes, not just config: STOP. Escalate. The current scope assumes it's mostly assets + maybe one CSS variable. If it's more, that's a separate engineering task, not a runbook.
- If the build fails consistently: include the exact error in the runbook's troubleshooting section, with a "call Lukas" path

**After max attempts exhausted:**
- Escalate to Lukas — likely means the branding model needs a small refactor before a runbook is useful

**Rollback command:**
```bash
rm docs/runbooks/stefan-frontend-customer-branding.md
```

### 9. Learning

**Log to LEARNINGS.md if:**
- The branding model required more code changes than expected (means a follow-up engineering task is needed)
- Stefan hit issues that suggest the runbook needs to live in two parts (developer-side prep + Stefan-side execution)
- A customer wanted branding customization beyond what the runbook supports (logo + color + footer)

---

## Human Checkpoint
- [ ] **REQUIRED** — Lukas reviews research output (especially the proposed branding model) before writing
- [ ] **REQUIRED** — Lukas reads completed runbook and signs off as Stefan-executable
- [ ] **OPTIONAL** — Stefan walkthrough alongside RB-01 walkthrough

---

## Description

The second of two operational runbooks. This one documents how Stefan customizes the frontend dashboard for each customer with their branding.

Per Andreas's directive: per-customer customization is a paid service offering. SugarPool charges for the 2-3h setup. The runbook makes that service deliverable by a non-developer.

## Proposed Structure

```
1. Prerequisites
   1.1 RB-01 must be complete (customer's VPS is up and running)
   1.2 What branding assets you need from the customer (logo, color preferences, exact company name for footer)
   1.3 Tools you'll need (frontend repo cloned locally, npm/node installed)

2. Branding Inventory
   2.1 What changes per customer (logo file, primary color, footer text, page title, favicon)
   2.2 What stays the same across customers (layout, components, German UX copy)
   2.3 Time estimate: ~30-45 min per customer once you've done it twice

3. Customer-Specific Customization
   3.1 Logo swap
   3.2 Color override (if using CSS variables)
   3.3 Footer + page title edits
   3.4 Favicon
   3.5 (Per research: any other per-customer touchpoints)

4. Build + Deploy
   4.1 Run npm run build in the frontend repo
   4.2 Copy dist/* to the customer's backend public/ directory
   4.3 Commit the rebuilt bundle in the customer's backend
   4.4 Restart pm2 on the customer's VPS

5. Verification
   5.1 Open the customer's dashboard URL in browser
   5.2 Verify logo, colors, footer all look correct
   5.3 Verify a known feature (login, view a draft) still works (no functional regression)

6. Customer Handoff
   6.1 Confirmation message template to send the customer
   6.2 What to mention about the dashboard (where reclassification button is, etc.)

7. Troubleshooting
   7.1 Build fails → exact error patterns + escalation path
   7.2 Logo doesn't load → check file path, file extension, file size limit
   7.3 Color override didn't apply → cache clear, hard refresh
```

## Steps

1. Pre-flight research — report back, wait for structure approval
2. Write runbook following approved structure
3. Cross-reference RB-01's voice/style for consistency
4. Have Lukas read end-to-end, iterate on unclear sections
5. Commit: `docs(runbook): Stefan frontend duplication & branding runbook`
6. Add to Stefan walkthrough call agenda (alongside RB-01)

## On Completion

- **Commit:** `docs(runbook): Stefan frontend duplication & branding runbook`
- **Update:** State doc — Stefan now has both runbooks, project closeout is on track
- **Final closeout step:** Update `siteflow-state.md` with the final post-closeout state and write a closing handoff doc summarizing what shipped, what was deferred, and what Stefan now owns operationally
