# Audit: Vorschau + Klassifizierungsgrund panel (AD / SPAM views)

**Symptom:** Panel shows the labels "Vorschau" and "Klassifizierungsgrund" but the `<p>` tags below them are empty.

---

## 1. Backend — what does `GET /api/emails` return?

`src/api/routes/emails.js:27`

```
SELECT id, from_address, subject, body, draft_reply, received_at,
       classification, sentiment, urgency, confidence,
       escalation_triggered, escalation_reason, status, created_at
FROM emails WHERE tenant_id = ?
```

No column named `preview`, `body_preview`, `reasoning`, or `classification_reason` is selected or computed. The closest field is `body` (full body text).

Response shape (`src/api/routes/emails.js:50`): `{ emails, spam: [...], ad: [...], urgent: [...], other: [...], escalation: [...] }` — each grouped array contains the raw rows listed above.

---

## 2. DB schema — is there a triage-reasoning column?

`src/db.js:29-47` (table `emails`):

```
id, tenant_id, message_id, from_address, subject, body, received_at,
classification, sentiment, urgency, confidence,
escalation_triggered, escalation_reason,
draft_reply, status, created_at
```

**No `reasoning` column exists.** All three `ALTER TABLE emails ADD COLUMN` migrations (lines 72-89) add `confidence`, `escalation_triggered`, and `escalation_reason` — none add `reasoning`.

---

## 3. Workflow — does the triage `reasoning` get stored?

The triage agent is explicitly asked to return a `reasoning` field (`src/workflow/index.js:32`):

```
{"classification":..,"confidence":..,"reasoning":"1-2 Saetze deutsch",...}
```

After triage returns (`src/workflow/index.js:218`), the workflow extracts `classification`, `sentiment`, `urgency`, `escalated`, `escalationReason`, and `confidence`. It **never** reads `triage.reasoning`.

The two UPDATE statements that persist triage results:

- SPAM/AD branch — `src/workflow/index.js:238-249`
  ```
  UPDATE emails SET status=?, classification=?, sentiment=?, urgency=?,
                    confidence=?, escalation_triggered=?, escalation_reason=?
  WHERE id=?
  ```
- Reply branch — `src/workflow/index.js:283-296`
  ```
  UPDATE emails SET status=?, classification=?, sentiment=?, urgency=?,
                    confidence=?, draft_reply=?, subject=COALESCE(?, subject),
                    escalation_triggered=?, escalation_reason=?
  WHERE id=?
  ```

Neither includes `reasoning`. The agent's `reasoning` value is discarded as soon as `processEmail` finishes.

---

## 4. Frontend — what does the expanded row pull?

Source is shipped as a minified bundle only (`public/assets/index-otHpdlTp.js`). The two relevant JSX nodes render literally:

```js
// Vorschau
<span …>"Vorschau"</span>
<p   …>{a.preview}</p>

// Klassifizierungsgrund
<span …>"Klassifizierungsgrund"</span>
<p   …>{a.reasoning}</p>
```

`a` is the email row object as returned by `GET /api/emails`. The component expects two fields directly: **`preview`** and **`reasoning`**. There is no mapper in the frontend that derives `preview` from `body` or that renames any backend field — the Zustand store passes the API row through verbatim to this component.

(A separate "Originalmail" panel elsewhere in the bundle does fall back `a.body_plain || a.preview`, but the Vorschau/Klassifizierungsgrund panel does not.)

---

## 5. How does the component handle empty / null / undefined?

React renders `null`, `undefined`, `false`, and `""` as nothing inside children. Because the `<p>` tags have no conditional wrapper, the tag itself is always emitted, and for all four values it ends up as an **empty `<p>`**. There is no "—" fallback, no placeholder, no `hidden` class. That is exactly the observed symptom: labels render, paragraphs are empty.

---

## Diagnosis

Two independent defects, both upstream of the frontend:

1. **`reasoning` is never persisted.** The Triage agent returns it, the workflow ignores it, the DB has no column for it, and the API does not select it. The frontend field `a.reasoning` resolves to `undefined` on every row.
2. **`preview` does not exist in the API response.** The DB has `body`, the API returns `body`, but the component reads `preview`. A naming mismatch — no field is being renamed or truncated on the way out.

Both fields arrive at the component as `undefined`, so both `<p>` children render empty. That is the entire bug.

---

## Proposed fix (in English, no code)

Three coordinated changes:

1. **Add a `reasoning` column to the `emails` table.**
   - In `src/db.js`, extend the `CREATE TABLE emails` block with `reasoning TEXT`, and add a matching `ALTER TABLE emails ADD COLUMN reasoning TEXT` migration alongside the existing ones so existing databases pick it up on restart.

2. **Persist `triage.reasoning` in the workflow.**
   - In `src/workflow/index.js`, extract `reasoning` from the triage JSON response the same way `classification`, `sentiment`, etc. are extracted.
   - Add `reasoning = ?` to both UPDATE statements (the SPAM/AD branch near line 238 and the draft branch near line 283), and bind `triage.reasoning ?? null` into the parameter list.

3. **Return `reasoning` and a `preview` from the list endpoint.**
   - In `src/api/routes/emails.js`, add `reasoning` to the SELECT column list in `GET /api/emails` (and `GET /api/emails/:id` already uses `SELECT *`, so it will pick the column up automatically once step 1 is done).
   - For `preview`, the cleanest fix is to compute it server-side so the frontend contract doesn't change: after the SELECT, map each row to attach `preview = (row.body || "").replace(/\s+/g, " ").trim().slice(0, 200)` (or similar — matching whatever length the UI expects). Do this in the same route handler, before the `grouped` loop, so both the `emails` array and each category bucket receive rows with a `preview` field.
   - Alternative if you'd rather change the frontend: rebuild the SPA so the component reads `a.body` (or a truncated version of it) instead of `a.preview`. Given the frontend is shipped as a minified bundle and the source repo isn't in this checkout, the server-side mapping is lower-risk.

After these three changes, backfill is optional: existing rows will have `reasoning = NULL` until they are retriaged, but new incoming mail will populate both panels correctly.
