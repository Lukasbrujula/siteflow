# SiteFlow Closeout Sprint — Consolidated Task Index

**Created:** 2026-05-06
**Last revised:** 2026-05-06 (post-audit consolidation)
**Total Tasks:** 12 task files + 2 deltas (T7 runbook delta, T8 smoke test)
**Branch:** `feature/closeout-sprint`
**Source audits:**
- `siteflow:docs/audits/ONBOARDING_STATE_AUDIT_2026-05-06.md`
- `siteflow:docs/audits/MULTI_INBOX_STATE_AUDIT_2026-05-06.md`

---

## What This Sprint Delivers

A v1 SiteFlow that's genuinely customer-ready:

- **Security hardening** before any external user touches it
- **Multi-inbox per VPS** — one customer-person, multiple inboxes, one merged dashboard with inbox filter
- **Reclassification escape hatch** for when AI misclassifies
- **Post-send UI refresh** so approved emails actually leave the view
- **Operational runbooks** so Stefan can onboard customers without engineering involvement

What's explicitly NOT in scope (deferred to v1.1):

- Wizard onboarding fix (BROKEN per onboarding audit; manual SQL is canonical for v1)
- HTML e-signatures with legal footers
- White-label per-customer branding system (v1 ships single SugarPool brand)
- Per-inbox tone profiles or per-inbox agents
- Heartbeat field UI surfacing (`last_polled_at`, `last_poll_error` are written by poller in v1, surfaced in v1.1)
- Tab badge filtered counts ARE in v1 (per audit revision 2026-05-06)

---

## Execution Order

Tasks ordered for sequencing. Parallelization noted in the Dependency Graph below.

| # | Task | File | Description | Depends On | Est. (h) |
|---|------|------|-------------|------------|----------|
| 1 | SH-01 | `SH-01-otp-crypto-session-rate-limit.md` | OTP crypto + session cookie + OTP rate limit | None | 1.5 |
| 2 | SH-02 | `SH-02-indexes-cors.md` | SQL indexes + CORS tightening | None | 1.0 |
| 3 | RC-01 | `RC-01-reclassify-backend.md` | Reclassification backend endpoint | None | 1.5 |
| 4 | MI-01 | `multi-inbox/MI-01-schema-migration.md` | `inboxes` table + `emails.inbox_id` + backfill | None | 1.0 |
| 5 | MI-04 | `multi-inbox/MI-04-auth-onboarded-check.md` | `/me` onboarded uses inbox-existence | MI-01 | 0.25 |
| 6 | MI-02 | `multi-inbox/MI-02-poller-refactor.md` | Poller per-inbox loop + heartbeat writes | MI-01 | 3.25 |
| 7 | MI-03 | `multi-inbox/MI-03-send-path.md` | `/send` uses originating inbox SMTP | MI-01 | 1.5 |
| 8 | MI-05 | `multi-inbox/MI-05-list-and-inboxes-endpoint.md` | List JOIN + new GET /api/inboxes | MI-01 | 2.0 |
| 9 | FE-01 | `FE-01-reclassify-postsend-frontend.md` | Reclassify UI + post-send refresh (no rebuild) | RC-01 | 3.5 |
| 10 | MI-06 | `multi-inbox/MI-06-frontend-inbox-filter.md` | InboxFilter + filtered tab badges + shared rebuild | FE-01, MI-05 | 4.0 |
| 11 | RB-01 | `RB-01-stefan-vps-onboarding-runbook.md` | VPS + tenant + multi-inbox onboarding runbook | SH-01, SH-02, MI-01 | 3.5 |
| 12 | RB-02 | `RB-02-stefan-frontend-branding-runbook.md` | Frontend duplication + branding runbook | RB-01, MI-06 | 1.5 |
| — | T8 | (no separate file, see RB-01 §6 + multi-inbox audit §6) | End-to-end smoke test on srv1572917 | All above | 1.5 |

**Engineering subtotal:** 24.0h
**With smoke test:** 25.5h

At 5–6 focused hours per day, that's **4–5 days of focused work, ~1 calendar week** factoring in real-world cadence.

---

## Dependency Graph

```
SH-01 ─────────┐
SH-02 ─────────┤
RC-01 ──┐      ├──→ RB-01 ──→ RB-02
MI-01 ──┼──→ MI-04 (0.25h, can be parallel with MI-02..05)
        ├──→ MI-02 (poller)
        ├──→ MI-03 (send path)
        └──→ MI-05 ──→ MI-06 ──┐
                               ├──→ T8 (smoke test)
        FE-01 (depends on RC-01) ──┘
                               (FE-01 commits land in branch, MI-06 builds on top, single rebuild at end of MI-06)
```

**Parallel opportunities:**

- SH-01 + SH-02 + RC-01 + MI-01 can all start in parallel (separate Claude Code instances, zero file overlap).
- After MI-01: MI-02, MI-03, MI-04, MI-05 can all run in parallel (separate files).
- FE-01 can start as soon as RC-01 is merged.
- MI-06 must wait for both FE-01 and MI-05.
- RB-01 must wait for SH-01/SH-02/MI-01 (it documents post-hardening + post-multi-inbox state).

**Critical path** (longest sequential chain):
MI-01 → MI-05 → MI-06 → T8 = 1.0 + 2.0 + 4.0 + 1.5 = 8.5h sequential, with everything else fitting around it.

---

## Pre-Flight Protocol (applies to every task)

Every task file requires a Pre-Flight Research phase before any code is written. The agent:

1. Reads the cited audit sections + cited code files in full.
2. Confirms upstream dependencies are deployed locally.
3. Reports findings + a brief implementation sketch back to Lukas.
4. **Waits for explicit human approval** before starting implementation.

This is non-negotiable. The audits were produced from a code-traced snapshot; the codebase is the source of truth at execution time. Pre-Flight protects against drift.

The framework has paid for itself twice already on this project:

- Onboarding audit caught the wizard schema mismatch (would have shipped `[SIGNATUR EINFÜGEN]` to a paying customer)
- Multi-inbox audit caught that the poller reads env vars not DB (would have caused a deploy-window incident)

Don't skip Pre-Flight under time pressure. The April 20 lessons doc is the canonical reference: "when you notice yourself choosing workarounds over understanding because of fatigue or time pressure, name it out loud."

---

## Important Coordination Notes

### FE-01 + MI-06 share a rebuild

Both tasks modify the same frontend repo. The build/deploy step happens once, at the end of MI-06.

- FE-01 ends with code committed in the frontend repo branch — **no `npm run build`, no copy to backend, no backend commit.**
- MI-06 starts on top of FE-01's changes, adds its own changes, then runs `npm run build` once, copies `dist/*` once, commits once in the backend.
- Both pieces ship as a single deploy.

This is documented in detail in the FE-01 task file's "Coordination With MI-06" section at the top.

### RB-01 absorbs the T7 runbook delta

The multi-inbox audit identified a T7 runbook delta — Stefan's runbook needs to document inserting N inbox rows per tenant. Rather than a separate task file, this is folded into RB-01.

RB-01's Pre-Flight Research, Knowledge pillar, Success Criteria, and Proposed Structure all reflect this. The agent writes one runbook that covers VPS install, manual SQL tenant + inbox creation, tone_profile creation, Siteware config, and end-to-end verification.

### Manual SQL is the canonical onboarding path

The onboarding audit found the wizard is BROKEN at the code level (wizard's `tone_profile` schema doesn't match what workflow consumes; signature substitution no-ops). Fix is deferred to v1.1.

For v1, manual SQL is the only documented path. Stefan does not use the wizard. The runbook does not instruct him to. The wizard remains in the codebase but unused.

This is a deliberate, audit-justified decision — not an oversight. The audit document at `siteflow:docs/audits/ONBOARDING_STATE_AUDIT_2026-05-06.md` is the receipt.

---

## Sprint Stop Conditions

Stop the sprint immediately and reassess if:

1. Any task fails its max-attempt limit (3 attempts) — escalate, don't grind.
2. A task uncovers significant unknown work (>2x estimate) — re-scope before continuing.
3. Production breaks — fix prod, then resume sprint.
4. Lukas hits real fatigue (per April 20 lessons doc) — ship what's done, defer the rest.
5. The smoke test (T8) on srv1572917 fails — investigate before deploying anywhere else.

---

## On Sprint Completion

- Tag commit: `v1.0-closeout`
- Update `siteflow-state.md` with final state (all PIO and runbooks committed, multi-inbox in production, manual onboarding documented)
- Write closing handoff doc summarizing what shipped and what was deferred to v1.1
- Send Stefan the runbooks (RB-01 + RB-02) + offer one walkthrough call
- Commit both audit documents to `siteflow:docs/audits/` if not already there
- Push the `n8n-pipeline-integration` branch to GitHub if it hasn't been pushed (note: this has been a persistent housekeeping item throughout the project)

---

## v1.1 Deferred Backlog (NOT in this sprint)

For future reference:

- Wizard onboarding fix (per onboarding audit, ~6-10h engineering)
- v1.1 cleanup migration: drop `tenants.imap_*` and `tenants.smtp_*` columns once multi-inbox is proven stable
- Per-row inbox label badge in `EmailTable`
- Heartbeat field UI surfacing (`last_polled_at`, `last_poll_error` already written by poller in v1)
- User-defined inbox labels (override the auto-derived `email.split("@")[0]`)
- Per-inbox color coding
- Per-inbox tone profiles / per-inbox agents
- HTML e-signatures with legal footers
- Cleanup of dead v1 Turso/Vercel code in dashboard repo (per onboarding audit adjacent_findings)
- Multi-employee per VPS architecture (different model entirely, not currently planned)

---

**End of consolidated task index.**
