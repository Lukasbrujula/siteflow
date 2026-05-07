# Multi-Inbox — Task Index

**Created:** 2026-05-06
**Total Tasks:** 6 (MI-01 through MI-06) + T7 runbook delta + T8 smoke test
**Branch (suggested):** `feature/multi-inbox`
**Source audit:** `siteflow:docs/audits/MULTI_INBOX_STATE_AUDIT_2026-05-06.md`
**Companion audit:** `siteflow:docs/audits/ONBOARDING_STATE_AUDIT_2026-05-06.md`

---

## Scope

This index covers ONLY the multi-inbox engineering work. The closeout-sprint tasks SH-01, SH-02, RC-01, FE-01, RB-01, RB-02 are tracked separately and stay as drafted. Lukas merges this with the prior set manually after both audits are committed.

The audit is the canonical specification. Each task file's Knowledge pillar cites specific audit sections. If a task description and the audit disagree, the audit wins — open a question, do not deviate silently.

---

## Execution Order

| Task | File | Description | Depends On | Est. (h) |
|------|------|-------------|------------|----------|
| MI-01 | `MI-01-schema-migration.md` | Add `inboxes` table + `emails.inbox_id` + backfill (idempotent) | None (entry point) | 1.0 |
| MI-02 | `MI-02-poller-refactor.md` | Refactor poller to per-inbox loop, drop env-based IMAP config | MI-01 | 3.0 |
| MI-03 | `MI-03-send-path.md` | `/send` uses originating inbox's SMTP credentials and `from:` | MI-01 | 1.5 |
| MI-04 | `MI-04-auth-onboarded-check.md` | `/me` onboarded = inbox-existence + tone_profile | MI-01 | 0.25 |
| MI-05 | `MI-05-list-and-inboxes-endpoint.md` | LEFT JOIN inboxes on `/api/emails`; new `GET /api/inboxes` | MI-01 | 2.0 |
| MI-06 | `MI-06-frontend-inbox-filter.md` | UI store + selector hook + `InboxFilter` component + view wiring | MI-05 | 3.0 |
| **Engineering subtotal** | | | | **10.75** |
| T7 (delta) | (delta to RB-01, no separate file) | Runbook update — manual SQL inserts inbox row(s) per tenant | MI-01 | 1.0 |
| T8 (verify) | (smoke test, see below) | End-to-end deploy + verify on srv1572917 | MI-01..MI-06 | 1.5 |
| **Total** | | | | **13.25** |

---

## Dependency Graph

```
MI-01 (schema) ──┬─→ MI-02 (poller)
                 ├─→ MI-03 (send)
                 ├─→ MI-04 (auth)
                 └─→ MI-05 (list + endpoint) ──→ MI-06 (frontend)
```

MI-02, MI-03, MI-04, MI-05 are independent of each other given MI-01. They can run in parallel by separate agents if convenient.

MI-06 must wait for MI-05 because it consumes `GET /api/inboxes` and the new fields on `GET /api/emails`.

---

## Pre-Flight Protocol (applies to every MI-* task)

Every task file requires a Pre-Flight Research phase before any code is written. The agent:

1. Reads the cited audit sections in full.
2. Reads the cited code files end-to-end.
3. Confirms upstream dependencies are deployed locally.
4. Reports findings + a brief implementation sketch back to the human.
5. **Waits for explicit human approval** before starting Phase B (implementation).

This is non-negotiable. The audit was produced from a code-traced snapshot; the codebase is the source of truth at execution time. Pre-Flight protects against drift.

---

## T7 — Runbook Delta (no separate task file)

**Owner:** the existing closeout-sprint task `RB-01`. This is a delta, not a new task.

**Action:** when RB-01 is executed, append a multi-inbox addendum:

- After `INSERT INTO tenants ...`, `INSERT INTO inboxes ...` once per IMAP/SMTP credential set the customer brings.
- Each inbox row carries: `id` (uuid), `tenant_id`, `email` (full inbox address), `label` (= `email.split("@")[0]`), encrypted IMAP+SMTP creds (use `siteflow:src/api/crypto.js` `encrypt`), `is_active = 1`.
- Continue writing `tenants.imap_*` columns from the primary inbox per audit §3.3 (soft-rollback compatibility). This data duplication is intentional through v1.
- Document the dual-write explicitly so future maintainers don't "clean up" the duplication and break rollback.

**Estimate:** ~1 hour of documentation work, separate from engineering budget.

**Do not generate a standalone 9-Pillar task file for T7** — Lukas will fold this delta into RB-01 when merging the multi-inbox tasks with the prior closeout-sprint set.

---

## T8 — Smoke Test (verification step, no separate task file)

**Trigger:** after all of MI-01 through MI-06 are merged and verified locally.

**Procedure on srv1572917:**

1. `pm2 stop all`
2. Deploy the merged code (`git pull` or equivalent). Server starts → `initDb()` runs → migration creates one inbox row per existing tenant + backfills `emails.inbox_id`.
3. `pm2 restart all`
4. Verify:
   - `sqlite3 data/siteflow.db "SELECT COUNT(*) FROM inboxes WHERE is_active = 1"` returns the expected count (= count of tenants with `imap_host` populated).
   - `sqlite3 data/siteflow.db "SELECT COUNT(*) FROM emails WHERE inbox_id IS NULL AND tenant_id IS NOT NULL"` returns 0.
   - PM2 poller logs show `[poller] inbox <id>` per active inbox.
   - Hit `/api/inboxes` with a real session → returns the inbox list with zero credential fields.
   - Hit `/api/emails` with a real session → emails carry `inbox_id`, `inbox_email`, `inbox_label`.
   - Dashboard renders. With one inbox, filter is hidden.
5. **Add a second test inbox** to one of the existing tenants via manual SQL (per the T7 runbook delta). Restart poller. Verify:
   - Poller logs show both inboxes being polled.
   - Dashboard now shows the `InboxFilter` dropdown with 2 entries.
   - Switching the filter narrows the email list to the selected inbox.
6. **Send a draft from each inbox.** Verify:
   - Outbound `from:` header in the customer's mailbox matches the originating inbox.
   - SMTP server logs show creds from the corresponding inbox row, not from `process.env.SMTP_*`.
7. Roll back if anything is broken (audit §6.3 soft rollback).

**Estimate:** ~1.5 hours including failure budget.

---

## Compression Levers

If the budget tightens during execution, the audit identifies two cuts:

- **Defer `GET /api/inboxes` (MI-05 → ~1.25h).** Frontend derives the inbox list from the email list. Cost: empty-inbox UX freshness (an inbox with zero emails wouldn't appear in the filter).
- **Fold T8 into sprint-end QA.** Saves 1.5h from this line. Acceptable if a separate QA pass is already planned.

Do not cut MI-04. It is 0.25h and removes the only remaining hard read of `tenants.imap_host`.
Do not cut MI-02's failure-isolation pattern. Per-inbox try/catch is load-bearing for the mittwald-class scenario described in audit §1.

---

## Post-Sprint Cleanup (v1.1, NOT in scope)

For the record, deferred work referenced in the audit:

- v1.1 cleanup migration: drop `tenants.imap_*` and `tenants.smtp_*` columns once multi-inbox is proven stable.
- Filtered tab badge counts (gap_3).
- Per-row inbox label badge in `EmailTable` (audit §5.2).
- Heartbeat field consumers: surface `last_polled_at` / `last_poll_error` in the dashboard (audit §3.1).
- User-defined inbox labels (override the auto-derived `email.split("@")[0]`).
- Per-inbox color coding.
- Per-inbox tone profiles / per-inbox agents.
- Multi-employee per VPS (different architecture entirely).

---

## Branch & Commit Convention

- Branch: `feature/multi-inbox`
- Commit prefix per task: `feat(<scope>): <description> (MI-XX)`
- Squash-merge per task is acceptable; alternatively keep individual commits for traceability.

---

**End of multi-inbox task index.**
