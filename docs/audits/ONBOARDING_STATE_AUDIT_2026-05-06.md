# Onboarding State Audit — 2026-05-06

Source authority: live code in `siteflow:src/`, the live `tenants` table on `srv1572917` (dump in conversation 2026-05-06), `siteflow:install.sh`, and the wizard frontend at `dashboard:siteware-frontend/`. Code wins over docs where they disagree.

## 1. Executive summary

- The manual SQL onboarding pattern from April 20 is the only working onboarding path today. Both live tenants on `srv1572917` were provisioned this way and have hand-pasted `tone_profile` stubs.
- The wizard pipeline (`OnboardingView` + `siteflow:src/api/server.js` onboarding endpoints) is **structurally broken**: even a successful end-to-end run produces a `tone_profile` JSON with the wrong field names and silently drops `emailSignature` and `websiteData`. Wizard-onboarded tenants would ship drafts with `[SIGNATUR EINFÜGEN]` literally visible. This is verifiable at the code level — no runtime test required.
- The signature substitution workaround in `siteflow:src/workflow/index.js:262-282` works correctly when `tone_profile.email_signature` is populated (manual path) and no-ops when empty (wizard path).
- `install.sh` provisions infrastructure correctly and prompts for the right inputs (including `SITEWARE_TONE_AGENT_ID` since `aacd1db`). It does not by itself produce a working tenant — that requires either the wizard or manual SQL.
- Stefan cannot onboard a customer end-to-end today without engineering involvement, OR without a documented manual SQL runbook. The current closeout sprint has neither. A decision is required before RB-01 executes — see Section 5.

## 2. Onboarding pipeline inventory

| # | Step | Owner | Status | Evidence |
|---|------|-------|--------|----------|
| 1 | Customer signs contract | Stefan | out of scope | — |
| 2 | Provision VPS | Stefan | out of scope | — |
| 3 | Run `install.sh` as root: collects domain, admin email, IMAP user/pass, Siteware token, 3 agent IDs (triage/reply/tone). Validates IMAP (3 retries) and Siteware token. Generates `ENCRYPTION_KEY` and `SESSION_SECRET`. Bootstraps admin. Configures Caddy. Starts PM2 (app, poller, workflow, jobs). Health check. | Stefan | WORKS | `siteflow:install.sh:37-111`, `:223-307`, `:309-340` |
| 4 | Admin logs in. `/me` returns `onboarded = Boolean(imap_host) && Boolean(tone_profile)`. Fresh tenant has neither → wizard route. | Stefan | WORKS | `siteflow:src/api/routes/auth.js:135-152` |
| 5a | Wizard 6-step flow: Credentials → Siteware → ScanSent → Website → ToneAnalysis → Confirm. Calls `/api/onboarding/{test-connection,validate-siteware,scan-sent,scrape-website,analyze-tone,save-tenant}`. | Stefan | BROKEN | see Section 3, Path 2 |
| 5b | Manual SQL: `INSERT INTO tenants (...)` with hand-pasted `email_signature` + `knowledgebase` JSON stub. | Engineering | WORKS | `siteflow:src/db.js:16-28`; live DB dump shows two tenants this way |
| 6 | Poller (PM2 process) connects IMAP every `POLL_INTERVAL_MS` (default 180000), fetches new mail via `mailparser`, dedupes by `Message-ID`, inserts to `emails` table. | system | WORKS | `siteflow:src/poller/index.js`; commits `63f0488`, `e48beac`, `76d218f` |
| 7 | Workflow (PM2 process) picks up `status='pending'` rows, calls Triage agent, then Reply agent. Reads `tenants.tone_profile.email_signature` and `tone_profile.knowledgebase`, passes as taskSettings. Substitutes `[SIGNATUR EINFÜGEN]` placeholder client-side. | system | WORKS for manual-SQL tenants; no-op signature substitution for wizard tenants | `siteflow:src/workflow/index.js:156-200`, `:262-282` |
| 8 | Frontend dashboard shows email + draft. | Stefan | WORKS | out of audit scope; covered by FE-01/RC-01 |

## 3. Tone profile state

`tone_profile` is a single TEXT column on `tenants` storing JSON (`siteflow:src/db.js:25`). No separate table for history, employees, or onboarding status.

### Path 1 — Manual SQL onboarding: WORKS

Direct INSERT writes the JSON shape that `siteflow:src/workflow/index.js:167-168` reads:
```json
{"email_signature": "...", "knowledgebase": "...", "formality_level": "neutral", "common_phrasing": [], "language_mix": "de"}
```
Live DB confirms: `mdplaylisting@gmail.com` (153 chars, signature only) and `margenfeldlukas@gmail.com` (333 chars, signature + knowledgebase). Workflow reads only `tp.email_signature` and `tp.knowledgebase || tp.knowledge_base`; the other three fields are unused dead-shape compliance.

Citation: `siteflow:src/db.js:16-28`; `siteflow:src/workflow/index.js:158-200`; `siteflow:src/api/routes/auth.js:142`; live `tenants` dump 2026-05-06.

### Path 2 — Wizard analyze-tone: BROKEN

Five gaps. Gap 5 is structural and load-bearing.

**Gap 1.** No runtime verification: zero wizard-produced rows in any live DB. Both `srv1572917` tenants are manual SQL stubs.

**Gap 2.** Commit `de0d1b5` ("align analyze-tone taskSettings with Siteware variable names") renamed taskSettings to `input_sentemails`, `input_websitecontent`, `input_industry` (`siteflow:src/api/server.js:421-423`). The match between these names and the live Siteware Tone Analyzer agent's defined inputs is unverifiable from local files.

**Gap 3.** Zero tests for any onboarding endpoint or wizard component (verified — no `*.test.js` under `siteflow:src/api/`, no test for `Step4ToneAnalysis` or `Step5Confirm` in `dashboard:siteware-frontend/`).

**Gap 4.** No tests in siteflow at all (full repo).

**Gap 5 (load-bearing).** Wizard output schema does not match workflow consumption schema. Verified at code level:

- Wizard normalizes analyze-tone response into `{formality, greeting, closing, sentenceStyle, avoidances, preferences, jargon}` (`dashboard:siteware-frontend/src/components/onboarding/Step4ToneAnalysis.tsx:113-121`).
- `emailSignature` is captured separately, initialized from `detectedSignature` from scan-sent (`Step4ToneAnalysis.tsx:78`), and emitted at end of Step 4 as `onUpdate({ toneProfile: profile, emailSignature })` (line 141) — never merged into `toneProfile`.
- `Step5Confirm.tsx:80-92` POSTs to save-tenant with body `{credentials, toneProfile, websiteData, emailSignature}` — four peer keys.
- `siteflow:src/api/server.js:484-489` reads only `body.credentials` and `body.toneProfile`. **`body.emailSignature` and `body.websiteData` are silently dropped.**
- `siteflow:src/workflow/index.js:167-168` reads `tp.email_signature` and `tp.knowledgebase` from the parsed `tone_profile`. Neither field is produced by the wizard pipeline.

Result: a successful wizard run stores a `tone_profile` containing seven fields workflow never reads, missing the two fields workflow needs. Signature substitution at `siteflow:src/workflow/index.js:273` no-ops because `tp.email_signature` is undefined. Drafts ship with `[SIGNATUR EINFÜGEN]` literally visible.

### Path 3 — Signature substitution: WORKS

`siteflow:src/workflow/index.js:262-282`. After Reply agent returns, parse `tone_profile`, regex-replace `/\[SIGNATUR EINF(Ü|UE)GEN\]/gi` with `tp.email_signature`. Empty signature → no-op (intended, per commit `47b1e3a`). Both live tenants substitute correctly. Both Ü/UE branches covered.

## 4. Gap-list — what Stefan cannot do today without engineering help

| # | Gap | Severity | Source |
|---|-----|----------|--------|
| G1 | Run the wizard end-to-end and produce a tenant with a working `tone_profile`. The wizard pipeline is structurally broken. | Blocks wizard-based onboarding entirely. | Section 3, Path 2, Gap 5 |
| G2 | Onboard via manual SQL without an existing runbook. The April 20 procedure exists in handoff docs only. RB-01 currently covers VPS setup, not tenant insertion. | Blocks Stefan from solo onboarding regardless of which path is chosen. | `docs/runbooks/` listing, RB-01 scope |
| G3 | Provide a `tone_profile` JSON template Stefan can adapt per customer. No template exists in repo or runbooks. | Procedural; required for Option B viability. | Repo search, none found |
| G4 | Verify the Siteware Tone Analyzer agent's expected taskSettings names. Required before any wizard fix can be runtime-tested. | Blocks Option A. | Siteware UI inspection, not in repo |
| G5 | Confirm IMAP from VPS IP can authenticate against the customer's mail host (Mittwald is a known landmine). | Operational, not code. | Pre-existing per prompt |

G1 and G2 are the load-bearing gaps. G3-G5 follow from the choice between Option A and Option B.

## 5. Recommended next actions

Two legitimate options. Both close G1 and G2. Tradeoffs follow.

### Option A — Fix the wizard

Add an engineering task before RB-01 executes.

**Scope:**
1. Modify `siteflow:src/api/server.js:484-489` (save-tenant) to merge `body.emailSignature` into the `toneProfile` JSON before stringifying. Decide whether to also persist `body.websiteData` (probably as `knowledgebase` in the same JSON). ~1-2 hours.
2. Either rename wizard `toneProfile` fields to match what workflow reads, or extend workflow to read both schemas. The simpler change is in save-tenant: emit a normalized JSON that satisfies workflow's expectations regardless of wizard field names. ~2-4 hours.
3. Add at least one integration test that drives save-tenant and asserts the stored `tone_profile` contains `email_signature` and `knowledgebase`. ~1-2 hours.
4. Live runtime test against the real Siteware Tone Analyzer agent, including verification of taskSettings variable names (closes G4). ~1-2 hours, depends on test-server availability.

**Estimated total:** 6-10 hours engineering + 1 round of QA on `srv1572917` before RB-01.

**Tradeoff:** delays the closeout sprint. Onboarding becomes self-service for Stefan. Lowers per-customer onboarding cost going forward.

### Option B — Skip the wizard, document the manual path

Move wizard-fix to v1.1.

**Scope:**
1. Expand RB-01 (or add a new RB-03) to document the manual SQL onboarding procedure: SSH in, run admin bootstrap, INSERT the `tenants` row with the canonical `tone_profile` JSON template, restart PM2. ~1-2 hours.
2. Provide a `tone_profile` JSON template with `email_signature` and `knowledgebase` placeholders Stefan fills in per customer (closes G3). ~30 minutes.
3. Document the wizard as v1.1 deferred work with a pointer to this audit. ~15 minutes.

**Estimated total:** 2-3 hours documentation. No code changes.

**Tradeoff:** Stefan touches SQL on every onboarding (~30 minutes per customer for the tenant insert step, on top of the rest). Wizard remains broken in the codebase. A future customer or developer who tries the wizard hits the bug.

## 6. NOT_FOUND list

Questions this audit could not answer with confidence. Each line: question + source needed.

- Does the Siteware Tone Analyzer agent's defined input variable names match `input_sentemails` / `input_websitecontent` / `input_industry`? — Inspect agent definition in Siteware UI.
- Has the wizard ever returned a 200 from analyze-tone against the real Siteware agent in any environment? — Server logs on `srv1572917` from any wizard attempt; or a fresh test run.
- Does `scripts/bootstrap-admin.js` handle re-runs idempotently? — Read `siteflow:scripts/bootstrap-admin.js`; not opened in this audit.
- Does the poller read `tone_profile` for any reason, or only feed `emails` rows that workflow then reads? — Read `siteflow:src/poller/index.js:1-122` (not opened in this audit).
- What is the canonical shape of `knowledgebase`? Free string only, or structured? — No schema, no examples beyond the one live tenant's prose paragraph.
- Was `body.websiteData` intended to persist somewhere we did not inspect, or is it a wiring gap? — Grep across siteflow shows save-tenant is the only consumer named in routes; if intentionally dropped, the wizard sending it is dead weight.
- Does Mittwald IMAP authenticate from current VPS IPs after the SugarPool incident? — Operational test against a live customer, not in repo.
- Are `dashboard:api/tone-profile/analyze.ts`, `dashboard:api/tone-profile/[tenantId]/index.ts`, `dashboard:api/tone-profile/[tenantId]/injection.ts`, `dashboard:api/tone-profiles/index.ts` part of the dead Turso v1 stack, or do they have a separate live consumer? — File-by-file read; treated as adjacent finding here.
- Does `siteware-frontend/` (the directory at `dashboard:siteware-frontend/`) get bundled into `siteflow:public/assets/index-otHpdlTp.js` at build time? — Checked the existence of the bundle (Apr 20) but did not verify which source tree builds it.

## Adjacent findings (out of audit scope, not pursued)

- **Dead v1 code in dashboard repo.** `dashboard:api/onboarding/[action].ts` imports from `dashboard:src/server/db-turso.js` and `dashboard:src/server/tone-profile/store-turso.js`. This is the pre-VPS-architecture Vercel + Turso v1 stack, never deleted after migration. The four `dashboard:api/tone-profile/*` files are likely part of the same dead stack, not verified file-by-file. Recommend a cleanup task in a future sprint, not this one.
- **Cruft.** `siteflow:src/api/server.js.save` (backup file) and seven `write_*.py` scripts at `siteflow:` root (Apr 14 bootstrap origin) — appear to be unused. Not load-bearing but should be removed.
- **No tests.** `siteflow:` has zero `*.test.js` files. RB-01 inheriting an untested codebase is a separate concern.

## Learning to log

To `docs/LEARNINGS.md` (siteflow repo):

- **Date:** 2026-05-06
- **Component:** Onboarding wizard / save-tenant integration
- **Documented claim (Apr 20-21 handoffs):** "wizard works pending tone-analysis taskSettings rename"
- **Actual state:** Even after the `de0d1b5` rename, the wizard cannot produce a `tone_profile` workflow can consume. Frontend emits `{formality, greeting, ...}` schema; workflow reads `email_signature` and `knowledgebase`; save-tenant drops the separately-sent `emailSignature` field on the floor.
- **Source citation:** `siteflow:src/api/server.js:484-489`; `dashboard:siteware-frontend/src/components/onboarding/Step5Confirm.tsx:80-92`; `dashboard:siteware-frontend/src/components/onboarding/Step4ToneAnalysis.tsx:113-141`; `siteflow:src/workflow/index.js:167-168`.
- **Recommendation:** update handoff narrative; add this audit as the canonical reference for wizard state until the fix lands.
