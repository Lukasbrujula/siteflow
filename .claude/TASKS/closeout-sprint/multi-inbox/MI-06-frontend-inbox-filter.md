# Task: MI-06 — Frontend InboxFilter (UI Store + Selector + Dropdown)

## Status

- [ ] Pending
- [ ] Pre-Flight Research complete (HUMAN APPROVED)
- [ ] In Progress
- [ ] Verified
- [ ] Complete

## Pillars

### 1. Model

`sonnet` — UI work with tight spec. The pattern is locked: separate filter axis intersecting tabs, single-dimensional store preserved.

### 2. Tools Required

- [x] Read, Edit, Write (`dashboard:siteware-frontend/src/...`)
- [x] Bash: `npx tsc --noEmit`, `npm test` (vitest), `npm run dev` for visual check
- [x] Grep, Glob (find all direct `useEmailStore((s) => s.<slice>)` callsites in the views)
- [ ] WebFetch
- [ ] Task

### 3. Guardrails (DO NOT)

- Do NOT modify `dashboard:siteware-frontend/src/components/layout/CategoryTabs.tsx`. Tabs stay untouched per audit §5.
- Do NOT modify the slice arrays on `email-store.ts` (`spam`, `ads`, `urgent`, `other`, `escalations`, `unsubscribes`, `sent`). Data shape preserved per audit §5.2.
- Do NOT modify `EmailTable.tsx` (no per-row inbox column in v1).
- Do NOT clear `selectedInboxId` when `setActiveTab` runs, and vice versa. The two axes are orthogonal per audit §5.1.
- Do NOT render the `InboxFilter` if `inboxes.length <= 1` per audit §5.1.
- Do NOT compute filtered tab badge counts. The audit accepts unfiltered counts as a v1 wart (gap_3). Adding filtered counts here is scope creep; defer to v1.1.
- Do NOT add a per-inbox column to `EmailTable.tsx` even if it would be a small change. v1.1.

### 4. Knowledge (MUST READ)

- [x] `dashboard:siteware-frontend/CLAUDE.md` (always)
- [x] `siteflow:docs/audits/MULTI_INBOX_STATE_AUDIT_2026-05-06.md` §5 (frontend filter integration spec — full read), §9 NOT_FOUND items 1, 2, 6, 7, 8 (open questions you must close during Pre-Flight).
- [x] `dashboard:siteware-frontend/src/components/layout/CategoryTabs.tsx` (read-only, do not modify — pattern reference)
- [x] `dashboard:siteware-frontend/src/lib/store/ui-store.ts`
- [x] `dashboard:siteware-frontend/src/lib/store/email-store.ts` (read for the slice keys; do not modify)
- [x] `dashboard:siteware-frontend/src/lib/api/emails.ts` (specifically `mapBackendEmail` lines 33-124)
- [x] `dashboard:siteware-frontend/src/types/email.ts` (enumerate every email subtype that needs the new fields)
- [x] `dashboard:siteware-frontend/src/components/layout/DashboardHeader.tsx` (mount point for `InboxFilter`)
- [x] All views: `SpamView.tsx`, `AdView.tsx`, `UrgentView.tsx`, `OtherView.tsx`, `EscalationView.tsx`, `UnsubscribeView.tsx`, `SentView.tsx`, `DraftReviewView.tsx`

### 5. Memory

- The two-axis pattern (classification tab × inbox filter) is the locked v1 contract. Do not introduce a third axis or a unified filter.
- Filter logic is `selectedInboxId === null ? all : all.filter(e => e.inbox_id === selectedInboxId)`. Trivial; resist temptation to add fuzzy matching, multi-select, etc.
- Sent view's source data may not carry `inbox_id` — this is gap_6 / NOT_FOUND #1 in the audit. Pre-Flight must resolve it before implementation.
- Vitest tests live next to the source files (`*.test.ts` / `*.test.tsx` siblings). Many existing tests in `email-store.test.ts`, `ui-store.test.ts`, view tests — they may need minor updates as fields are added to the email types.
- `mapBackendEmail` returns `RawEmail` (loose record) — the new fields are additive; keep them undefined-safe (`raw.inbox_id ?? null` etc.) for orphan rows.

### 6. Success Criteria

**API client:**

- [x] New file `dashboard:siteware-frontend/src/lib/api/inboxes.ts` exports `fetchInboxes(): Promise<readonly Inbox[]>`.
- [x] `Inbox` type: `{ readonly id: string; readonly email: string; readonly label: string; readonly is_active: boolean }`.
- [x] `fetchInboxes` hits `/api/inboxes`, parses `{ inboxes: [...] }`, returns the array. Handles non-200 by returning `[]` and logging.

**Store:**

- [x] `ui-store.ts` adds two state fields: `inboxes: readonly Inbox[]` (default `[]`), `selectedInboxId: string | null` (default `null`).
- [x] Adds two actions: `setInboxes(list)`, `setSelectedInboxId(id | null)`.
- [x] `setActiveTab` is unchanged — does NOT clear `selectedInboxId`.
- [x] `setSelectedInboxId` does NOT clear `selectedEmailId` or `activeTab`.

**Email mapping:**

- [x] `mapBackendEmail` in `lib/api/emails.ts` surfaces `inbox_id`, `inbox_email`, `inbox_label` on the returned object. Each defaults to `null` when the backend value is missing.
- [x] `IncomingEmail` and all subtypes in `dashboard:siteware-frontend/src/types/email.ts` gain three readonly fields: `inbox_id: string | null`, `inbox_email: string | null`, `inbox_label: string | null`.

**Component:**

- [x] New file `dashboard:siteware-frontend/src/components/layout/InboxFilter.tsx`. Renders a shadcn `Select` with first option "Alle Postfächer" (value = "" → null) and one option per inbox (value = `inbox.id`, label = `inbox.label`).
- [x] Reads from `useUiStore`, calls `setSelectedInboxId`.
- [x] Returns `null` when `inboxes.length <= 1`.
- [x] Mounted in `DashboardHeader.tsx`. Placement reviewed by human (per global UI/Design Protocol — propose 3 placements first).

**Filtering:**

- [x] New hook `useFilteredSlice(slice: CategorySlice)` exported from `lib/store/use-filtered-slice.ts` (or co-located). Reads the slice array via `useEmailStore` and `selectedInboxId` via `useUiStore`. Returns the filtered array.
- [x] Six views replaced their direct slice reads with `useFilteredSlice`: `SpamView`, `AdView`, `UrgentView` (via `DraftReviewView`), `OtherView`, `EscalationView`, `UnsubscribeView`. `SentView` participates IF gap_6 resolution confirms `inbox_id` is on sent rows.
- [x] Tab badges still show unfiltered counts (acceptable v1 wart per gap_3).

**Bootstrap:**

- [x] On dashboard mount, `fetchInboxes()` is called and the result feeds `setInboxes`. Co-located with the existing `hydrateFromServer` callsite.

**Verification:**

- [x] `npx tsc --noEmit` passes with zero errors.
- [x] `npm test` passes (existing tests). New behavior may require updating `email-store.test.ts` / `ui-store.test.ts` only to add the new fields' default values; do not rewrite test patterns.
- [x] Visual check: dashboard renders, filter dropdown appears when ≥2 inboxes exist, switching the filter narrows each tab's list to that inbox's emails. Tabs still navigate correctly. Default view shows all inboxes.
- [x] Visual check: with one inbox, the filter is hidden.

### 7. Dependencies

- [x] **MI-05 complete and verified.** `GET /api/inboxes` must respond with the expected shape, and `GET /api/emails` must return `inbox_id`/`inbox_email`/`inbox_label` per row.
- [x] **gap_6 resolved during Pre-Flight.** Determine whether sent rows carry `inbox_id`. Affects whether `SentView` participates in filtering.

### 8. Failure Handling

**Max attempts:** 3

**On failure (per attempt):**

- **`tsc` errors about missing fields on email subtypes**: enumerate every email subtype in `types/email.ts` and add the three fields to each. Don't try to fix one subtype at a time blindly.
- **Existing vitest tests fail because they construct mock email objects without the new fields**: update the mock factories to include defaults (`inbox_id: null`, `inbox_email: null`, `inbox_label: null`).
- **Filter does not narrow the list**: probably the views still call `useEmailStore((s) => s.spam)` directly. `grep -rn "useEmailStore((s) => s\.\(spam\|ads\|urgent\|other\|escalations\|unsubscribes\|sent\))" siteware-frontend/src/views/` to find missed callsites.
- **Filter clears on tab switch (or vice versa)**: the actions in `ui-store.ts` are coupled when they should not be. Re-check `setActiveTab` and `setSelectedInboxId`.
- **`InboxFilter` renders with one inbox**: the `inboxes.length <= 1` guard is missing or wrong.
- **Sent view filtering is broken**: gap_6 was not resolved cleanly. If sent rows lack `inbox_id`, exclude `SentView` from the filtered set and document in handoff.

**After max attempts exhausted:**

- Stop. Surface the failing test output + the relevant component diff.

**Rollback command:** `git checkout HEAD -- siteware-frontend/src/`

### 9. Learning

**Log to `siteflow:docs/LEARNINGS.md` if:**

- Sent view's data source does NOT carry `inbox_id` and the path to add it is non-trivial (e.g., requires backend change in this task vs. v1.1).
- The shadcn `Select` doesn't accept the empty-string-for-null pattern cleanly — informs the InboxFilter implementation.
- The `DashboardHeader.tsx` layout doesn't have a clean placement for the filter (cramped, mobile-broken, etc.) — feeds back into UI/Design Protocol for v1.1.
- Bootstrap timing: the dashboard renders before `setInboxes` resolves, and the filter briefly shows "Alle Postfächer" without the inbox list visible. Likely benign; document if any.

---

## Human Checkpoint

- [ ] **REQUIRED** — Pre-Flight Research report approved before writing components.
- [ ] **REQUIRED — UI/Design Protocol** — propose 3 visual directions for the `InboxFilter` placement in `DashboardHeader.tsx` (header-right with separator, header-left adjacent to logo, or as a dedicated row above the tabs). Wait for selection before implementing.
- [ ] **REQUIRED** — visual check approved by human in browser before commit.

---

## Pre-Flight Research (Phase A — DO FIRST, then PAUSE)

1. Read all audit + dashboard files in pillar 4 in full.
2. Verify MI-05 is deployed (curl the two endpoints locally).
3. **Resolve gap_6.** Find `SentView`'s source path:
   - Read `dashboard:siteware-frontend/src/views/SentView.tsx`
   - Read `dashboard:siteware-frontend/src/lib/store/email-store.ts` `setSentEmails` action and any callsite
   - Determine: does the API endpoint that populates `sent` return `inbox_id`? If yes, SentView participates in filtering. If no, document and exclude.
4. Enumerate email subtypes in `types/email.ts` that need the three new fields. Likely: `IncomingEmail`, `SpamAdEmail`, `DraftEmail`, `EscalationAlert`, `UnsubscribeStatus`, `SentEmail`. List explicitly.
5. List all views' direct `useEmailStore((s) => s.<slice>)` callsites that will be migrated to `useFilteredSlice`.
6. `npm test` — capture current passing test count as baseline.

**Report back with:**

- gap_6 resolution: SentView participates (Y/N) and the reasoning + citation
- Enumerated email subtypes that need updating
- List of views to migrate (file paths + line numbers of the slice reads)
- Three proposed visual directions for the `InboxFilter` placement (per UI/Design Protocol). For each: layout sketch in words, color/typography reference to existing `DashboardHeader` elements, and a reference app/screenshot if applicable.

**Then WAIT for both gap_6 confirmation AND filter placement selection.**

---

## Description

Adds the `InboxFilter` UI control as a separate axis intersecting the existing classification tabs. Default = "Alle Postfächer." When the user selects a specific inbox, the current tab's list narrows to that inbox's emails. Tabs and filter axes are orthogonal: switching tabs preserves the filter, and vice versa.

The data shape of the email store stays single-dimensional (slice arrays); the second dimension is computed on read via `useFilteredSlice`. This preserves all existing tests and slice operations.

## Steps

### Phase A — Pre-Flight Research

(Above. Report and wait.)

### Phase B — Implementation

1. **Types.** Add `inbox_id`, `inbox_email`, `inbox_label` (all `string | null`) to every email subtype in `types/email.ts`.
2. **API client.** Create `lib/api/inboxes.ts` per Pillar 6 spec.
3. **Store.** Extend `lib/store/ui-store.ts` with `inboxes`, `selectedInboxId`, `setInboxes`, `setSelectedInboxId`. `setActiveTab` unchanged.
4. **Mapping.** Update `mapBackendEmail` in `lib/api/emails.ts` to surface the three new fields.
5. **Selector hook.** Create `lib/store/use-filtered-slice.ts` exporting `useFilteredSlice(slice: CategorySlice)`.
6. **Component.** Create `components/layout/InboxFilter.tsx` per Pillar 6 spec. Implements the `length <= 1 → null` guard.
7. **Mount.** Add `<InboxFilter />` to `DashboardHeader.tsx` at the location selected by the human in Phase A.
8. **Wire views.** Replace direct slice reads in the six (or seven, pending gap_6) views with `useFilteredSlice`.
9. **Bootstrap.** Find the existing `hydrateFromServer` callsite (likely `App.tsx` or similar). Add `fetchInboxes().then(setInboxes)` adjacent.

### Phase C — Verification

1. `npx tsc --noEmit` — zero errors.
2. `npm test` — existing tests pass; update mock email factories to include the three new fields (default `null`).
3. Run `npm run dev`. With local DB containing 2+ inboxes:
   - Filter dropdown is visible
   - Switching the filter narrows the list of every tab
   - Switching tabs preserves the filter
   - Selecting "Alle Postfächer" restores
4. With 1 inbox: filter dropdown is hidden.
5. With 0 inboxes: filter dropdown is hidden, dashboard still renders.

## On Completion

- **Commit:** `feat(dashboard): inbox filter intersects classification tabs (MI-06)`
- **Update:** `siteware-frontend/CLAUDE.md` if there's a documented filter pattern section.
- **Handoff notes:**
  - **Smoke test (T8):** add a second inbox to one of the live tenants, verify the filter appears and works against real data.
  - **v1.1 follow-ups:** filtered tab badge counts (gap_3); per-row inbox label badge in `EmailTable`; user-defined inbox labels; per-inbox color coding.
