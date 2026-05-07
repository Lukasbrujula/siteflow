# Task: RB-01 — Stefan VPS + Tenant Onboarding Runbook

## Status
- [ ] Pending
- [ ] Research Complete (awaiting Lukas approval)
- [ ] In Progress
- [ ] Verified
- [ ] Complete

---

## Pre-Flight Research (REQUIRED — DO NOT SKIP)

**Before writing the runbook, the agent must:**

1. Read `siteflow:docs/audits/ONBOARDING_STATE_AUDIT_2026-05-06.md` end-to-end. The wizard is BROKEN per gap_5/Path 2. The manual SQL pattern is the canonical onboarding path. The runbook documents this path, not the wizard.
2. Read `siteflow:docs/audits/MULTI_INBOX_STATE_AUDIT_2026-05-06.md` sections 3.1, 4.1, and the T7 delta description in TASK_INDEX_MULTI_INBOX.md. The runbook must document inserting N inbox rows per tenant after MI-01 ships.
3. Read `siteflow:install.sh` end-to-end — note every prompt and what it asks for.
4. Read the existing `siteflow:docs/runbooks/` directory if it exists — match the established format/voice (e.g., `runbook-poller-not-saving.md`).
5. Read `handoff-2026-04-20.md` "What made the old server usable again last night" — this is the original manual SQL pattern that the runbook formalizes.
6. Read `siteflow-state.md` section 7 (.env reference) — the runbook needs to document every variable.
7. Identify which IMAP providers are documented vs not (Gmail confirmed working; mittwald has the datacenter-IP problem; Microsoft 365, IONOS, GMX/Web.de untested).

**Report back to Lukas with:**

1. The exact list of prompts in `install.sh` and what each one means.
2. The current manual SQL pattern for adding a tenant after install — does it require Node + better-sqlite3, or raw `sqlite3` CLI? Confirm what the April 20 pattern actually used.
3. The post-MI-01 schema state: confirm `inboxes` table exists and `emails.inbox_id` column exists. The runbook documents the multi-inbox INSERT pattern.
4. A proposed table of contents for the runbook (suggested below in Steps).
5. List of IMAP providers to include explicit instructions for: Gmail (confirmed), Microsoft 365 (very likely works), GMX/Web.de (untested), IONOS (untested), mittwald (known datacenter-IP issue).
6. Whether to include screenshots — and if so, which screens are most important.

**Wait for Lukas's "approved, go" with the proposed structure before writing the runbook.**

---

## Pillars

### 1. Model
sonnet (writing task with clear inputs)

### 2. Tools Required
- [x] Read, Write (file operations)
- [x] Bash: optional, only if running install.sh on a fresh VPS to validate the runbook
- [x] Grep, Glob (search install.sh and existing runbooks)
- [ ] WebFetch
- [ ] Task (sub-agents)

### 3. Guardrails (DO NOT)
- Do NOT modify: any code in `src/`
- Do NOT modify: `install.sh` itself (it works; the runbook documents how to use it, not how to change it)
- Do NOT include: real credentials, API keys, tokens, or passwords in the runbook (use placeholders like `<SITEWARE_TOKEN>`)
- Do NOT assume: Stefan is a developer. The runbook must be executable by a non-technical operator using AI assistance.
- Do NOT skip: the verification step at the end of each section. Stefan needs to know if a step worked.
- **Do NOT instruct Stefan to use the wizard onboarding flow.** It is BROKEN per the onboarding audit (wizard's `tone_profile` schema does not match what workflow consumes; `[SIGNATUR EINFÜGEN]` ships visible to customers). Manual SQL is the only documented path until the wizard is fixed in v1.1.
- Do NOT remove: the dual-write of `tenants.imap_*` columns alongside the new `inboxes` row. This duplication is intentional through v1 for soft-rollback compatibility (multi-inbox audit §3.3).

### 4. Knowledge (MUST READ)
- [x] `siteflow:docs/audits/ONBOARDING_STATE_AUDIT_2026-05-06.md` — wizard is BROKEN; manual SQL is canonical
- [x] `siteflow:docs/audits/MULTI_INBOX_STATE_AUDIT_2026-05-06.md` §3.1, §4.1, §6 — schema and migration
- [x] `siteflow:.claude/TASKS/closeout-sprint/multi-inbox/TASK_INDEX_MULTI_INBOX.md` — T7 delta description
- [x] `siteflow:install.sh`
- [x] `siteflow:docs/runbooks/runbook-poller-not-saving.md` — voice and structure
- [x] `handoff-2026-04-20.md` — original manual SQL pattern
- [x] `handoff-2026-04-21.md` — operational state
- [x] `WORKFLOW.md` — especially the "Edit policy" section about .env via sed on server

**Domain facts the agent won't infer from code:**

- The intended audience is Stefan, not a developer. He may use Claude or another AI to assist while following the runbook.
- The deployment model is: customer has their own Hostinger account with their own VPS. Stefan accesses via Hostinger's browser terminal (SSH passphrase issues with direct SSH have been recurring per state doc).
- Each customer is fully isolated. Mistakes on one customer's VPS cannot affect another. This is the core DSGVO and security promise.
- The Siteware agents (Triage, Reply, Ton-Analyse) are PER-CUSTOMER in their own Siteware organization. The customer (or SugarPool admin team) creates them; Stefan installs them by ID into `.env`.
- Ton-Analyse agent ID is required during install but not actively used in v1 (the wizard is BROKEN; tone analysis goes through manual SQL with hand-pasted values). Note this in the runbook so Stefan doesn't get confused.
- mittwald and similar German hosts may reject IMAP auth from Hostinger datacenter IPs. This is a customer-side issue (their mail provider must whitelist) — the runbook should document this gotcha so Stefan knows what to do when it happens.
- **One VPS = one customer = one person with potentially multiple inboxes** (per multi-inbox audit). A CEO with `info@`, `kontakt@`, and a personal work email gets one VPS with three inbox rows. The runbook must show how to insert N inboxes.

### 5. Memory
- April 20 handoff: install.sh has a quirk where `[ -f "$INSTALL_DIR/package.json" ]` trips false-positive if the repo was pre-cloned. Workaround: save install.sh to /root, ensure /opt/siteflow doesn't exist, run from /root.
- The "Alle Assistenten erlaubt" checkbox in Siteware UI does NOT work reliably. Always tick agents individually.
- Per April 21 handoff: macOS smart-quote autocorrect can mangle pasted passwords. Use Node one-liners or careful pasting.
- Per onboarding audit: `tone_profile` JSON shape that workflow reads is `{email_signature, knowledgebase}`. Other fields (formality_level, common_phrasing, language_mix) are dead-shape compliance from the April 20 stub pattern but harmless.
- Per multi-inbox audit gap_2: `email.inbox_id` is application-layer invariant, not DB-enforced. The manual SQL section MUST insert inbox rows BEFORE any email rows reference them.

### 6. Success Criteria
- [x] Runbook saved to `siteflow:docs/runbooks/stefan-vps-tenant-onboarding.md`
- [x] Sections cover: prerequisites, fresh VPS install (with install.sh), post-install verification, manual tenant creation, manual inbox creation (one or more per tenant), tone_profile creation with hand-pasted values, Siteware configuration, end-to-end verification
- [x] Each major section ends with a verification step (curl, log check, or DB query)
- [x] Per-provider IMAP/SMTP details for: Gmail, Microsoft 365, IONOS, GMX/Web.de
- [x] Explicit "what to do if X fails" troubleshooting per section, OR pointers to existing runbook for poller-not-saving
- [x] Document the install.sh pre-clone gotcha
- [x] Document the Siteware "Alle Assistenten erlaubt" gotcha
- [x] Document mittwald-class datacenter-IP-block troubleshooting
- [x] Document the dual-write of `tenants.imap_*` AND `inboxes.imap_*` (intentional, soft-rollback)
- [x] Provide a copy-paste Node one-liner for inserting tenant + inbox rows + tone_profile
- [x] Lukas reads the runbook end-to-end and confirms it's executable by Stefan with AI assistance
- [x] Stefan walkthrough call scheduled (post-completion, not blocking)

### 7. Dependencies
- [x] SH-01 + SH-02 must be done — runbook documents the post-hardening install state
- [x] **MI-01 must be done — the `inboxes` table and `emails.inbox_id` column must exist on the canonical install path**
- [x] install.sh in current working state on main branch

### 8. Failure Handling

**Max attempts:** 2 (writing task, less iteration needed)

**On failure (per attempt):**
- If a section is unclear after writing: simplify by reducing to the minimum executable steps. Stefan + AI can fill gaps if needed; over-explaining adds confusion.
- If a verification step requires technical knowledge Stefan doesn't have: replace with a more concrete check (e.g., "open this URL in browser, you should see X" instead of "curl /api/health and parse JSON").
- If the manual SQL pattern is ambiguous: provide a fully copy-paste-ready Node script Stefan runs unmodified except for filling in placeholders.

**After max attempts exhausted:**
- Escalate to Lukas — the runbook may need a structural rethink with Stefan in the room.

**Rollback command:**
```bash
rm siteflow:docs/runbooks/stefan-vps-tenant-onboarding.md
```

### 9. Learning

**Log to LEARNINGS.md if:**
- A step in the runbook turned out to be impossible without developer-level knowledge (means the install or onboarding flow itself needs to change)
- An IMAP provider hit unexpected issues during validation
- The manual SQL pattern produced a tenant that the workflow couldn't process
- Stefan's walkthrough revealed assumptions in the runbook that didn't hold

---

## Human Checkpoint
- [ ] **REQUIRED** — Lukas reviews research output (proposed structure) before writing
- [ ] **REQUIRED** — Lukas reads completed runbook end-to-end and signs off as Stefan-executable
- [ ] **OPTIONAL** — Stefan walkthrough call (recommended within first week of use)

---

## Description

Stefan needs to onboard new customers without Lukas. This runbook codifies the process from "customer signed contract" to "customer logged into their own dashboard."

The runbook reflects two key audit findings:

1. **Wizard is BROKEN** (onboarding audit). Manual SQL is the canonical path. The runbook does not instruct Stefan to use the wizard.
2. **Multi-inbox is in v1** (multi-inbox audit). One VPS hosts one customer-person who may have multiple inboxes. The runbook documents inserting N inbox rows per tenant.

Both audits live at `siteflow:docs/audits/`. They are the source of truth for the onboarding model documented here.

## Proposed Structure

```
1. Prerequisites
   1.1 What you need from the customer (mailbox addresses + app passwords for EACH inbox)
   1.2 What you need from SugarPool team (Siteware agent IDs, API token)
   1.3 Tools you'll need access to (Hostinger browser terminal, Siteware UI)

2. Fresh VPS Setup (one-time per customer)
   2.1 Provision Ubuntu 24.04 VPS in customer's Hostinger account
   2.2 Connect via Hostinger browser terminal
   2.3 Run install.sh (with the pre-clone gotcha documented)
   2.4 Verify: pm2 list shows 4 processes online; inboxes table exists in DB

3. Manual Tenant + Inbox Creation (the canonical path)
   3.1 Per-provider IMAP/SMTP settings (Gmail, M365, IONOS, GMX, Web.de)
   3.2 Encrypting credentials with siteflow:src/api/crypto.js
   3.3 Inserting the tenant row (Node one-liner, copy-paste from runbook)
   3.4 Inserting one or more inbox rows (Node one-liner, copy-paste — one INSERT per inbox)
   3.5 Inserting the tone_profile JSON (manual stub with email_signature + knowledgebase)
   3.6 IMPORTANT: dual-write tenants.imap_* AND inboxes.imap_* (do NOT skip the tenant columns — soft-rollback depends on them)
   3.7 Verify: poller logs show successful IMAP connect for each inbox

4. Siteware Configuration
   4.1 Verify customer has their own Siteware organization
   4.2 Create or verify the three agents (Triage, Reply, Ton-Analyse)
   4.3 Generate API key with all three agents EXPLICITLY ticked (Alle Assistenten gotcha)
   4.4 Update .env with token + agent IDs
   4.5 Verify: workflow logs show successful triage

5. Why we don't use the wizard
   5.1 Brief explanation: the wizard is deferred to v1.1
   5.2 If a customer asks: SugarPool's white-glove onboarding is a feature, not a limitation
   5.3 Pointer to the audit for engineering context (do not share with customers)

6. End-to-End Verification
   6.1 Send a test email TO EACH INBOX
   6.2 Wait for poller cycle
   6.3 Login to dashboard via OTP
   6.4 Verify: email appears in correct tab with correct classification
   6.5 Verify: inbox filter shows all configured inboxes
   6.6 Verify: switching the filter narrows the email list
   6.7 Approve a draft from each inbox; verify outbound from: matches the originating inbox

7. Customer Handoff
   7.1 Send dashboard URL + login email
   7.2 First-login walkthrough (what they'll see)
   7.3 What to do when they have questions

8. Troubleshooting
   8.1 Pipeline isn't moving emails → see runbook-poller-not-saving.md
   8.2 IMAP auth rejected from datacenter IP (mittwald-class) → customer must file support ticket with their mail provider
   8.3 Siteware returns 403 → check that all three agents are explicitly ticked in API key allowlist
   8.4 Inbox filter not appearing → confirm at least 2 inbox rows for the tenant
   8.5 Reply sends from wrong inbox → check email row's inbox_id is set correctly
```

## Steps

1. Pre-flight research — report back, wait for structure approval
2. Write runbook following approved structure
3. Cross-reference existing `runbook-poller-not-saving.md` for voice/style
4. Have Lukas read end-to-end, iterate on unclear sections
5. Commit: `docs(runbook): Stefan VPS + tenant onboarding runbook`
6. Schedule Stefan walkthrough call (1 week out, ~30 min)

## On Completion

- **Commit:** `docs(runbook): Stefan VPS + tenant onboarding runbook`
- **Update:** State doc — point to this runbook as the canonical onboarding process
- **Handoff notes for RB-02:** Frontend duplication runbook should reference this one as a prerequisite ("complete VPS onboarding first, then come back here for branding")
