# Reclassify Backend Audit

**Scope:** read-only audit of the SiteFlow backend to prepare for a `POST /api/emails/:id/reclassify` feature. No code edits.

Files inspected (HEAD at time of audit):

- `src/db.js` — schema + migrations
- `src/api/routes/emails.js` — all email endpoints
- `src/workflow/index.js` — triage + reply agents, processing loop
- `src/poller/index.js` — IMAP INSERT only
- `docs/CODEBASE_AUDIT.md` — 2026-04-15 structural audit (cross-referenced)
- `public/assets/index-otHpdlTp.js` — shipped frontend bundle (minified, grepped)

No `docs/FRONTEND_AUDIT.md` exists.

---

## 1. Classification values

**Possible values:** `SPAM`, `AD`, `URGENT`, `OTHER`. Defined by the Triage agent's system prompt in `src/workflow/index.js:19-23`:

```
SPAM   — Phishing, schaedliche Massenwerbung, kompromittierter Absender
AD     — legitime Werbung, Newsletter, automatisierte Benachrichtigungen
URGENT — Beschwerde, Zahlung, Vertragskuendigung, Frist <48h …
OTHER  — alles andere mit echtem Antwortbedarf
```

The DB column `emails.classification` is `TEXT` with no CHECK constraint (`src/db.js:37`) — any string is storable, but the system only ever writes one of the four enum values.

**Every code path that writes `emails.classification`:**

| Path                                                  | Value written                                     |
| ----------------------------------------------------- | ------------------------------------------------- |
| `src/workflow/index.js:240` (SPAM/AD branch UPDATE)   | `triage.classification \|\| "OTHER"`              |
| `src/workflow/index.js:286` (draft branch UPDATE)     | `triage.classification \|\| "OTHER"`              |
| `src/api/routes/emails.js:231` (retriage endpoint)    | `NULL` (clears the column)                        |

**Not written by:**

- `src/poller/index.js:76-90` — INSERT does not include `classification` (relies on the `emails.classification` default, which is implicit NULL since the column has no DEFAULT clause).

So: classification is NULL at INSERT time, set to one of four enums by workflow after triage, and cleared to NULL by retriage. Nothing else ever writes it.

---

## 2. Status values + full state machine

**Observed values** (grep of the whole repo):

| Value        | Set by                                                | Meaning                                              |
| ------------ | ------------------------------------------------------ | ---------------------------------------------------- |
| `pending`    | `src/db.js:45` (column default); `src/poller/index.js:89`; `src/api/routes/emails.js:232` | Waiting for workflow to triage                       |
| `processing` | `src/workflow/index.js:213`                            | Workflow has picked it up; not visible to next cycle |
| `archived`   | `src/workflow/index.js:242` (SPAM/AD); `src/api/routes/emails.js:187` (manual archive); `src/api/routes/emails.js:204` (reject) | Terminal, no draft, no send                          |
| `draft`      | `src/workflow/index.js:288`                            | Reply agent produced a draft, awaiting human approval |
| `sent`       | `src/api/routes/emails.js:159`                         | SMTP succeeded                                       |
| `error`      | `src/workflow/index.js:307`                            | Workflow threw inside `processEmail`                 |

**Which status means "archived without a draft":** `archived` set via the SPAM/AD branch at `src/workflow/index.js:242` (no `draft_reply` ever written).
**Which status means "draft awaiting review":** `draft` set at `src/workflow/index.js:288`.
**Which status means "sent":** `sent` set at `src/api/routes/emails.js:159`.

**State machine (happy paths + edges):**

```
              ┌────────────────── retriage ──────────────┐
              ▼                                          │
            pending ──► processing ──┬─► archived (SPAM/AD)
                                     │        ▲
                                     │        │ (manual archive or reject)
                                     ├─► draft ──► sent
                                     │   │
                                     │   └─► archived (reject)
                                     │
                                     └─► error
```

**Every code path that writes `emails.status`:**

| File:Line                         | Writes status to     | From which origin   |
| --------------------------------- | -------------------- | ------------------- |
| `src/db.js:45`                    | `'pending'` (DEFAULT)| table create        |
| `src/poller/index.js:89`          | `'pending'`          | fresh INSERT        |
| `src/workflow/index.js:213-216`   | `'processing'`       | any `pending` row picked up |
| `src/workflow/index.js:240-251`   | `'archived'`         | SPAM or AD classification |
| `src/workflow/index.js:285-299`   | `'draft'`            | URGENT or OTHER, draft succeeded |
| `src/workflow/index.js:306-309`   | `'error'`            | exception inside processEmail |
| `src/api/routes/emails.js:158-161`| `'sent'`             | SMTP send OK        |
| `src/api/routes/emails.js:186-189`| `'archived'`         | manual archive      |
| `src/api/routes/emails.js:203-206`| `'archived'`         | reject              |
| `src/api/routes/emails.js:230-232`| `'pending'`          | retriage            |

---

## 3. Relationship between classification and status

The branching happens exactly once, inside `processEmail`, at `src/workflow/index.js:238`:

```js
if (classification === "SPAM" || classification === "AD") {
  // UPDATE … status = 'archived', classification = ?, …  (line 240)
  return;                                                 // line 253 — skips reply agent
}
// …fall through to callReplyAgent…
// UPDATE … status = 'draft', classification = ?, draft_reply = ?, …  (line 286)
```

**Rule:**

- `classification ∈ {SPAM, AD}` → `status = 'archived'`, **no draft_reply written**. Email never reaches the reply agent.
- `classification ∈ {URGENT, OTHER}` → `callReplyAgent()` runs, `draft_reply` populated, `status = 'draft'`.

This is the core asymmetry the reclassify feature has to bridge: reclassifying SPAM/AD → URGENT/OTHER requires a draft that was never generated.

---

## 4. Draft generation trigger

**Where it happens:** `callReplyAgent()` at `src/workflow/index.js:156-209`. POSTs to `api.siteware.io/v1/api/completion/<REPLY_AGENT_ID>` with the tone profile, incoming email, knowledge base, and triage classification, returns a parsed JSON object with `body_plain` / `body_html` / `subject`.

**Conditions to run:** entered only after the SPAM/AD early-return at `src/workflow/index.js:253` is skipped — i.e. when `classification ∈ {URGENT, OTHER}`.

**Trace from "triaged" → "draft_reply populated":**

1. `runWorkflowCycle` at `src/workflow/index.js:313-321` selects up to 5 emails with `status = 'pending'`.
2. For each: `processEmail` sets `status = 'processing'` (line 213).
3. `callTriageAgent` (line 218) — classification arrives.
4. If SPAM/AD: UPDATE + return at line 253. No draft.
5. Otherwise: `callReplyAgent` (line 256) → `draftReply` string built (lines 257-283, includes client-side `[SIGNATUR EINFÜGEN]` substitution).
6. Final UPDATE at line 286 writes `draft_reply = ?`, `status = 'draft'`.

**What would need to happen to trigger draft generation on-demand for an already-classified email?**

Two realistic paths exist:

- **Option A — reset to `pending`:** just set `status = 'pending'` and let `runWorkflowCycle` pick it up. **Problem:** the workflow runs triage first (line 218) — it will overwrite the user's chosen classification with whatever the Triage agent returns. This is exactly what retriage does today (see §5). Unsuitable for reclassify where the user is overriding the AI.
- **Option B — call the Reply agent directly:** import/export `callReplyAgent` from `src/workflow/index.js` (currently module-private, not exported — module.exports is absent from workflow.js entirely: the file is a long-running script, not a module). The endpoint synthesises a minimal `triage` object from the user's chosen classification and calls the reply agent inline.

Option B is the only path that preserves the user's override. It requires a small refactor: convert `src/workflow/index.js` to also `module.exports = { callReplyAgent }` without breaking the standalone entry point (keep `runWorkflowCycle()` and `setInterval` guarded by `if (require.main === module)` or move them to a separate entry file).

---

## 5. Retriage endpoint

`src/api/routes/emails.js:223-246`. Implementation:

```js
router.post("/:id/retriage", requireAuth, (req, res) => {
  // … ownership check …
  db.prepare(
    "UPDATE emails SET status = ?, classification = NULL, draft_reply = NULL, escalation_triggered = 0, escalation_reason = NULL WHERE id = ?"
  ).run("pending", email.id);
  // audit_logs INSERT with action = "retriaged"
  res.json({ message: "Email queued for retriage" });
});
```

**What it does:** DB-only state reset. Clears `classification`, `draft_reply`, `escalation_triggered`, `escalation_reason`; sets `status = 'pending'`. Does **not** clear `sentiment`, `urgency`, `confidence`, or `reasoning` (oversight — those linger from the prior triage).

**Does it re-run triage?** Not inline. It relies on the workflow cycle — within 30 seconds (`src/workflow/index.js:323`), `runWorkflowCycle` picks up the now-pending row and runs `callTriageAgent` + (if applicable) `callReplyAgent` from scratch.

**Does it regenerate the draft?** Yes, but only as a side effect of the workflow cycle re-processing the email. If the fresh triage returns SPAM/AD, no draft is regenerated.

**Reuse potential for reclassify:** no. Retriage discards the human decision by design; reclassify preserves it.

---

## 6. Reject endpoint

`src/api/routes/emails.js:197-221`. UPDATE: `status = 'archived'` only. Leaves `classification`, `draft_reply`, `sentiment`, etc. intact. Logs to `audit_logs` with `action = 'draft_rejected'` and detail `email.id` or `email.id + ": " + reason` if the caller supplied one (`req.body.reason`).

**Reusable for reclassify?** No — reject is terminal archive with a reason, orthogonal to changing classification. But the audit-log pattern (`action = ..., detail = req.body.reason`) is the template to follow.

---

## 7. Archive endpoint

`src/api/routes/emails.js:180-194`. UPDATE: `status = 'archived'` only. Touches no other column. **Does not write an audit_logs entry** (distinct from reject, which does).

This tells us something about product intent: the existing system treats "classification" and "draft_reply" as immutable side-channel metadata once set — manual archive doesn't clear them. So keeping them on reclassify (rather than nulling) is consistent with the existing grain of the code.

---

## 8. Send endpoint

`src/api/routes/emails.js:103-177`. Full behavior:

1. Ownership check (`WHERE id = ? AND tenant_id = ?`, line 107).
2. `400` if `draft_reply` is empty.
3. **Soft** placeholder warning if `[BITTE ERGÄNZEN: …]` still present — does not block send (lines 114-118). This was recently changed from a hard block.
4. Strips `[ENTWURF — Bitte prüfen und freigeben]` marker, substitutes signature placeholder with `tenants.tone_profile.email_signature`.
5. Builds nodemailer transporter per request (no connection pooling).
6. `sendMail({ from, to: email.from_address, subject: "Re: " + subject, text: cleanedBody })`.
7. UPDATE `status = 'sent'`.
8. `audit_logs` entry with `action = 'email_sent'`.

**State transition:** `draft → sent`. No other columns touched.

---

## 9. Design considerations for `POST /api/emails/:id/reclassify`

Request body: `{ new_classification: "SPAM" | "AD" | "URGENT" | "OTHER" }`.

### 9a. Columns to update besides `classification`

Must also update:

- **`status`** — if new class ∈ {SPAM, AD}: `'archived'`. If new class ∈ {URGENT, OTHER}: `'draft'` *after* a fresh draft is generated (or an intermediate state if async — see 9c).
- **`escalation_triggered`** and **`escalation_reason`** — if new class is not URGENT, escalation should be cleared (set to `0` / `NULL`). Keeping an `escalation_triggered = 1` flag on a newly-classified `AD` row would corrupt the `grouped.escalation` bucket in `GET /api/emails` (routed at `src/api/routes/emails.js:46`).
- **`draft_reply`** — see 9b/9c.

Should **not** touch:

- `body`, `subject`, `from_address`, `received_at`, `message_id` — immutable provenance.
- `sentiment`, `urgency` — these came from the Triage agent, still informative context; no strong reason to clear them. Follow the archive-endpoint precedent of leaving AI-side metadata alone unless there's a concrete reason.

### 9b. Reclassify URGENT/OTHER → SPAM/AD: what about `draft_reply`?

Product intent question. The existing `archive` endpoint (§7) leaves `draft_reply` untouched when a draft email is archived — so the code grain says: don't destroy data on reclassification. But a SPAM/AD row with a stored draft_reply is confusing and could be accidentally sent if the UI ever exposes a send button in the Spam/Ad views.

**Recommendation:** set `draft_reply = NULL` on reclassify to SPAM/AD. The draft is conceptually invalidated by the reclassification — keeping it would violate the rule enforced in the SPAM/AD branch of `src/workflow/index.js:240` (which never writes a draft_reply on those classes). Archive is a different action (the user is parking the email; the draft is still a truthful artifact). Reclassify is a correction (the prior draft was based on a mistaken classification).

### 9c. Reclassify SPAM/AD → URGENT/OTHER: how to generate the missing draft?

Three options:

**(i) Reset `status = 'pending'`.**
The workflow picks it up, re-runs triage, overwrites the user's override. **Fails the user intent.** Unsuitable.

**(ii) Call the Reply Composer inline in the endpoint.**
Synthesise `{ classification: new_classification, ...rest }` from existing columns. Call `callReplyAgent(email, synthesisedTriage)`. Store the returned draft, set `status = 'draft'`. **Pros:** single write, no new state, user sees draft immediately on next poll (dashboard polls every 20s per recent commit `6e5675b`). **Cons:** blocks the HTTP response for several seconds while Siteware's Reply API runs (current reply agent latency on the test server: ~3-10s). Needs a small refactor to export `callReplyAgent` — see §4 Option B.

**(iii) Introduce a new status `'needs_draft'` and a second workflow loop that only runs the reply agent.**
**Pros:** fast endpoint response, cleaner separation of concerns. **Cons:** requires workflow code changes, new status value to handle in the `GET /api/emails` grouping and frontend (frontend currently doesn't know this status — would show up ungrouped).

**Recommendation: (ii) inline call.** Lowest-risk. The refactor to export `callReplyAgent` is ~5 lines. The ~5-10s response time is acceptable for a user-initiated action with a clear "reclassifying…" UI state, especially since the dashboard already tolerates async via the 20s poll.

If latency becomes a UX problem, (iii) is the graduation path.

### 9d. Should `confidence` and `reasoning` be cleared?

**Precedent:** `retriage` (§5) clears `classification`, `draft_reply`, `escalation_*` but **not** `confidence`, `sentiment`, `urgency`, `reasoning`. `archive` and `reject` clear nothing. The code's grain is: don't touch AI-side metadata unless you have to.

**Recommendation:** preserve `confidence` and `reasoning` as audit trail. They represent the AI's *original* judgment, which is exactly what the reclassify action is overriding — losing that would destroy the most useful debugging artifact. The frontend already displays `reasoning` in the "Klassifizierungsgrund" panel per the recent change in `docs/WERBUNG_PREVIEW_AUDIT.md` — leaving it intact means the UI continues to surface "the AI thought X because Y, but I overrode it to Z."

If the product later wants to distinguish "original AI reasoning" vs "post-override reasoning," a new `reclassified_from TEXT` column would be cleaner than mutating `reasoning`.

### 9e. `audit_logs` usage

Table exists (`src/db.js:63-70`): columns `id, tenant_id, action, detail, ip, created_at`. Existing action values used in the codebase:

| Action                  | Written by                                |
| ----------------------- | ----------------------------------------- |
| `draft_edited`          | `PATCH /api/emails/:id/draft`             |
| `email_sent`            | `POST /api/emails/:id/send`               |
| `draft_rejected`        | `POST /api/emails/:id/reject`             |
| `retriaged`             | `POST /api/emails/:id/retriage`           |
| `unsubscribe_requested` | `POST /api/emails/:id/unsubscribe`        |

`archive` and `list` do NOT log. The established pattern for any state-changing action is:

```js
db.prepare(
  "INSERT INTO audit_logs (id, tenant_id, action, detail, ip) VALUES (?, ?, ?, ?, ?)"
).run(crypto.randomUUID(), req.tenant.id, "reclassified",
      `${email.id}: ${old_class} -> ${new_class}`, req.ip);
```

Use `action = 'reclassified'`, detail `"{email_id}: {OLD} -> {NEW}"` (matches the reject endpoint's `email.id + ": " + reason` shape at `src/api/routes/emails.js:214`).

---

## 10. Frontend expectations

Bundle inspected: `public/assets/index-otHpdlTp.js` (single minified file, only frontend bundle shipped).

**Grep results:**

- `/reclassif(y|ication)/i` → **zero matches**. The shipped frontend does **not** currently call any reclassify endpoint.
- `/retriage/` → one match inside an async function `u0(a)`:

  ```js
  async function u0(a) {
    const r = mi(a.email_id, "retriage");
    const s = await fetch(r, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_email: a.sender_email,
        subject: a.subject,
        original_category: a.original_category,
      }),
      signal: AbortSignal.timeout(30000),
    });
    // …error handling…
  }
  ```

  `mi(a, r)` = `` `/api/emails/${encodeURIComponent(a)}/${r}` ``.

  **Note:** the frontend sends `{sender_email, subject, original_category}` to retriage. The backend reads only `req.params.id` and ignores the body (`src/api/routes/emails.js:224-246`). The body is dead weight — the FE was scaffolded against a different contract at some point.

- All other action URL suffixes the FE calls: `archive`, `retriage`, `reject` (body: `{reason}`), `unsubscribe` (body: `{sender_email, list_unsubscribe_url, list_unsubscribe_mailto}`), plus `/api/emails/${id}/archive`. No `reclassify` suffix.

**Conclusion:** there is no pre-existing frontend contract for reclassify. The backend endpoint can be designed freely; the frontend bundle will need a corresponding update (new action helper, new button wiring in the views). That frontend work is not in this repo — `install.sh`/`update.sh` pull from `Lukasbrujula/siteware-frontend` (per `docs/CODEBASE_AUDIT.md` §H1, §I1).

---

## 11. State-machine edge cases

**Case A: Reclassify a `draft` email OTHER → SPAM.**
Currently no code path covers this. Under recommendation 9b: `draft_reply` is set to NULL, `status` flips `draft → archived`, `classification = 'SPAM'`. No workflow interaction needed (no draft to generate). Safe.

**Case B: Reclassify a `sent` email.**
Should this be allowed? A sent email has already been replied to — changing its classification is audit revisionism with no operational effect (the reply is out the door). The frontend `grouped` bucketing at `src/api/routes/emails.js:44-53` would move a sent email into a different bucket, which may be confusing. **Recommendation:** return `409 Conflict` if `status === 'sent'`. Let the reject/retriage endpoints handle corrective action for pre-send mistakes; reclassify is for pre-send / post-archive corrections only.

**Case C: Reclassify URGENT → URGENT (no-op).**
Idempotent; UPDATE would still run (SET classification=URGENT where it already is URGENT). No draft regenerated (already draft). **Recommendation:** early-return `200` with `{ message: "No change" }` when `old_class === new_class`. Skip audit log to avoid noise.

**Case D: Two rapid reclassifies in a row.**
Concurrency vectors:

1. **Two reclassify HTTP requests race** — SQLite serializes writes via WAL; the second UPDATE wins. If both target the same email, you get the later classification. Benign.
2. **Reclassify races with the workflow cycle.** Dangerous path: user reclassifies SPAM → URGENT at T=0, endpoint calls reply agent inline (option 9c-ii). Meanwhile `runWorkflowCycle` fires at T+Δ, sees `status = 'processing'` or similar — not `pending`, so it skips. Safe **if** the endpoint sets `status = 'processing'` at the start of the reply-agent call (mirroring `src/workflow/index.js:213`) and sets it to `draft` on success, `error` on failure. Otherwise, if the endpoint changes `status = 'pending'` at any point, the workflow may grab it and triage it from scratch, overwriting the user's choice. **The endpoint must never set status to 'pending' during reclassify.**
3. **Reclassify races with manual archive/send.** Both are single UPDATEs; last-write-wins. If the user archives and then reclassifies, the second wins. Acceptable.

---

## 12. Testability — manual curl verification

Assumptions: test server at `https://test.siteware.io` (or wherever SiteFlow is deployed for staging). Session cookie required. Replace `$SESSION`, `$EMAIL_ID`, `$TENANT_ID` as needed.

**(1) Inspect an email's current state:**

```bash
curl -s -b "session=$SESSION" \
  https://test.siteware.io/api/emails/$EMAIL_ID | jq '.email | {id, classification, status, draft_reply, reasoning}'
```

**(2) Seed a known state for a test case** (requires shell access to the VPS; there is no test-only HTTP endpoint):

```bash
# On the server
sqlite3 /opt/siteflow/data/siteflow.db <<SQL
UPDATE emails
SET classification = 'AD', status = 'archived', draft_reply = NULL, escalation_triggered = 0
WHERE id = '$EMAIL_ID';
SQL
```

**(3) Reclassify AD → OTHER (should trigger inline draft generation):**

```bash
curl -s -b "session=$SESSION" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"new_classification":"OTHER"}' \
  https://test.siteware.io/api/emails/$EMAIL_ID/reclassify
# Expect: HTTP 200, ~5-10s latency, {"message": "Reclassified, draft generated"}
```

**(4) Verify each column changed correctly:**

```bash
sqlite3 /opt/siteflow/data/siteflow.db \
  "SELECT classification, status, length(draft_reply), reasoning IS NOT NULL AS has_reasoning, escalation_triggered FROM emails WHERE id = '$EMAIL_ID';"
# Expect: OTHER | draft | >0 | 1 | 0
```

**(5) Verify audit_logs entry:**

```bash
sqlite3 /opt/siteflow/data/siteflow.db \
  "SELECT action, detail, datetime(created_at, 'unixepoch') FROM audit_logs WHERE tenant_id = '$TENANT_ID' ORDER BY created_at DESC LIMIT 1;"
# Expect: reclassified | $EMAIL_ID: AD -> OTHER | <recent timestamp>
```

**(6) Verify the GET list endpoint now buckets it correctly:**

```bash
curl -s -b "session=$SESSION" https://test.siteware.io/api/emails \
  | jq '{other_count: (.other | length), ad_count: (.ad | length)}'
```

**(7) Edge-case checks:**

```bash
# Same-class no-op
curl -s -b "session=$SESSION" -H "Content-Type: application/json" -X POST \
  -d '{"new_classification":"OTHER"}' https://test.siteware.io/api/emails/$EMAIL_ID/reclassify
# Expect: HTTP 200, {"message": "No change"}, no new audit_logs row

# Reject reclassify of a sent email
sqlite3 /opt/siteflow/data/siteflow.db "UPDATE emails SET status='sent' WHERE id='$EMAIL_ID';"
curl -s -w '%{http_code}\n' -b "session=$SESSION" -H "Content-Type: application/json" -X POST \
  -d '{"new_classification":"SPAM"}' https://test.siteware.io/api/emails/$EMAIL_ID/reclassify
# Expect: 409

# Invalid classification value
curl -s -w '%{http_code}\n' -b "session=$SESSION" -H "Content-Type: application/json" -X POST \
  -d '{"new_classification":"BOGUS"}' https://test.siteware.io/api/emails/$EMAIL_ID/reclassify
# Expect: 400
```

---

## Proposed Approach

**Endpoint:** `POST /api/emails/:id/reclassify` with body `{ new_classification: "SPAM" | "AD" | "URGENT" | "OTHER" }`. Tenant-scoped ownership check matching the other endpoints.

**State transitions handled:**

- `*` → SPAM/AD: UPDATE `classification`, `status='archived'`, `draft_reply=NULL`, `escalation_*=0/NULL`. No external calls. Fast.
- SPAM/AD → URGENT/OTHER: set `status='processing'`, call `callReplyAgent` inline with a synthesized triage object `{ classification: new_class, … }`, then UPDATE with `status='draft'`, new `draft_reply`, new `classification`. On reply-agent failure, UPDATE `status='error'` and return 502.
- URGENT/OTHER → URGENT/OTHER (different): UPDATE classification only; leave existing `draft_reply` intact (it is still a valid draft for another reply-worthy class). Optionally offer a `?regenerate=true` query param later for full draft regeneration.
- Same-class: 200 no-op, no audit log.
- `status='sent'`: reject with 409.

**Implementation complexity: MEDIUM.** The endpoint itself is small (~50 lines), but it requires a refactor of `src/workflow/index.js` to export `callReplyAgent` while preserving its current behavior as a standalone script entry point (wrap `runWorkflowCycle`/`setInterval` in a `require.main === module` guard or split into a `workflow/agent.js` module + `workflow/index.js` runner). The refactor is low-risk but must be tested against the existing pending-email processing loop.

**Remaining unknowns needing a frontend-side audit:**

1. Where exactly in the `siteware-frontend` React source the reclassify action button should attach — Spam/Ad views need a "Move to Dringend/Sonstige" affordance; Draft views need "Move to Spam/Werbung" on the draft row.
2. What the frontend state store does when a row's `classification` changes mid-poll — does `hydrateFromServer` (seen in `m0()` at the bundle) correctly remove the row from its old bucket and insert into the new one, or does it double-render?
3. Whether a "reclassifying…" loading state is acceptable for the ~5-10s reply-agent latency, or if async status `'needs_draft'` (option 9c-iii) is required for UX.
4. Whether the frontend stale `original_category` field sent on retriage should be repurposed to carry `new_classification` for reclassify (backend must not conflate the two endpoints — distinct actions, distinct URLs).
