# AUDIT-2026-05-04 Task Batch — README

This batch contains task files for the launch-blocking and high-priority findings from the 2026-05-04 overnight audit. Reference: `.claude/AUDIT_SYNTHESIS_2026-05-04.md`.

## Files in this batch

| File | Audit Finding | Priority | Estimated Time | Sequencing |
|---|---|---|---|---|
| `AUDIT-L3-stub-lead-org-id.md` | L3 | 🔴 LAUNCH-BLOCKING | 30 min | First — independent, lowest risk |
| `AUDIT-L1-coaching-cards-render.md` | L1 | 🔴 LAUNCH-BLOCKING | 2-4 hr (calibrated ~45-90 min) | Second — core product feature |
| `AUDIT-H1-coaching-context.md` | H1 | 🟠 HIGH | 30-60 min | Sibling to L1, can parallelize |
| `AUDIT-H4-lead-status-enum.md` | H4 | 🟠 HIGH | 30-60 min | After L3, before any other status-touching work |
| `AUDIT-L2-compliance.md` | L2 | 🔴 LAUNCH-BLOCKING (multi-track) | 4-8 hr code + 1-3 wk vendor | Parallel track, multi-week |

## Recommended Day-1 Plan (post-audit)

**Morning (focused half-day):**
1. AUDIT-L3 (org_id fix, 30 min)
2. AUDIT-H4 (LeadStatus enum, 30-60 min) — discovery + decision gate first
3. AUDIT-H1 (productType + callDuration, 30 min)
4. AUDIT-L1 (coaching cards render, 2-4 hr)

By end of morning: 4 of the 5 audit-flagged code items closed. Compliance (L2) has Track B (redaction) doable in afternoon if energy permits, plus Friday WeWork alignment for Track C.

**Friday WeWork session:**
- Disclosure language review with Max
- DPA batch execution (include OpenAI for ZDR)
- Consent capture design alignment

**Following days:**
- L2 Track A (transcript encryption)
- L2 Track B (PII redaction)
- L2 Track C (consent capture, post-Friday alignment)
- ZDR signing wait (vendor-bounded)

## Meta-Notes on Task File Pattern

These task files follow the Nine Pillars structure that worked across 2026-05-04's launch-blocker work. Key elements that proved valuable:

**Phase 1 discovery-first review gate** (Pillar 8 hard-stops, Pillar 6 success criteria)
- Caught real issues 4+ times today before implementation
- Examples: schema migration question in LBT-02, name normalization question in LBT-05, treatment-status-conditional synonyms in LBT-01, insulin formulation gap pre-flight

**Memory system reference** (Pillar 5)
- Query claude-mem for prior patterns before inventing new ones
- Worked for MED-06 recovery and LBT-01 cancer synonym categorization

**Wiring check in Success Criteria** (Pillar 6)
- The "did changing input change output" test
- Directly addresses the dominant failure mode of this codebase ("structurally correct, semantically void")
- Should be the bar for "task complete," not just typecheck

**Hard stop conditions** (Pillar 8)
- Surface and stop, don't push through
- Today's audit demonstrated the value: 17 findings surfaced in 15 min by methodical investigation

**Direct reference to audit doc** (Pillar 4)
- Task file references audit synthesis instead of restating findings
- Reduces drift, keeps task file scannable

**Conservative defaults** (Pillar 3 guardrails)
- "If field is undefined, fall back to current behavior"
- Today's pattern across LBT-01, LBT-02, LBT-05, MED-06, insulin gap

**Multi-track separation for compliance** (L2 specifically)
- Compliance work has different shape than feature work
- Vendor-bounded portions called out explicitly
- Alignment gates (Friday WeWork) called out explicitly

## What's Different About These Task Files

Compared to the LBT-* and MED-* task files from earlier in the launch:

1. **Calibrated time estimates** — today's launch-blocker work compressed at 3-5x of spec estimates. These task files include both spec estimates and calibrated estimates so the planner has both.

2. **Source attribution** — each task references the audit synthesis section that surfaced the finding. Drift between audit findings and implementation is reduced.

3. **Memory references** — Pillar 5 explicitly mentions claude-mem queries that should run before implementation. Today's MED-06 recovery proved this pattern's value.

4. **Wiring check is mandatory** — Pillar 6 makes the data-changes-output test a gate, not a suggestion. The audit found 17 instances of decorative wiring; the fix template must guarantee non-decorative implementation.

5. **L2 is structurally different** — multi-track compliance work doesn't fit the "feature branch + PR + merge" pattern. Task file calls this out explicitly.

## What's Not in This Batch

The 9 medium-priority findings (M1-M9 from audit synthesis) are not in this batch. They're mostly cleanup, observability, and post-launch quality items. Task files for those should be written when launch is closer to done; pre-mature task generation creates pressure to address things that can defer cleanly.

The orchestration meta-task (H2 silent-failure observability) may or may not get its own task file depending on whether the framework refinement conversation captures it. It's a cross-cutting pattern more than a single fix.
