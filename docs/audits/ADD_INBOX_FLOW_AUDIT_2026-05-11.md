# Add-Inbox Flow — Codebase Audit (2026-05-11)

Read-only audit of `/Users/lukasmargenfeld/clients/SW V2/siteflow`. No code modified.

Files inspected:
- `src/api/server.js` (entire file, 792 lines)
- `src/api/routes/auth.js`
- `src/api/routes/inboxes.js`
- `src/api/routes/onboarding-tenants.js`
- `src/api/routes/emails.js` (route surface + relevant grep hits)
- `src/api/routes/tone-profile.js` (route surface + relevant grep hits)
- `src/api/crypto.js`
- `src/api/imap-scan.js` (consumed via `require` only; testImapConnection/scanSentEmails called from server.js)
- `src/db.js`
- `src/poller/index.js`

Routers mounted in `src/api/server.js:35-39`:
- `/api/auth` → `routes/auth.js`
- `/api/emails` → `routes/emails.js`
- `/api/inboxes` → `routes/inboxes.js`
- `/api/onboarding` → `routes/onboarding-tenants.js`
- `/api/tone-profile` → `routes/tone-profile.js`

Inline endpoints in `src/api/server.js` (all guarded by `app.use("/api/onboarding", requireAuth)` at line 237):
- `POST /api/onboarding/test-connection` — `server.js:244`
- `POST /api/onboarding/validate-siteware` — `server.js:281`
- `POST /api/onboarding/scan-sent` — `server.js:349`
- `POST /api/onboarding/scrape-website` — `server.js:402`
- `POST /api/onboarding/analyze-tone` — `server.js:448`
- `POST /api/onboarding/save-tenant` — `server.js:551`

Health endpoint: `GET /api/health` — `server.js:694`. Static SPA served from `public/` at `server.js:692`, with `/api/*` 404 fallback at `server.js:769` and SPA catchall at `server.js:773`.

---

## A. Is there `POST /api/inboxes` (or similar) for adding an inbox to an existing tenant?

**No such endpoint exists.**

`src/api/routes/inboxes.js` defines exactly one route: `GET /` at line 21 (list inboxes for the authenticated tenant). There is no `router.post`, no `router.put`, no `router.patch`, no `router.delete`. `module.exports = router` at line 35.

`src/api/routes/onboarding-tenants.js` has destructive/edit endpoints but no "create new inbox" route:
- `GET /api/onboarding/tenants` — `onboarding-tenants.js:36` (list, reshaped as `tenant_id` rows)
- `GET /api/onboarding/tenant` — `onboarding-tenants.js:54` (returns `email_signature`)
- `POST /api/onboarding/tenant-toggle` — `onboarding-tenants.js:70` (flip `is_active`)
- `POST /api/onboarding/tenant-delete` — `onboarding-tenants.js:105` (delete inbox + cascade emails)
- `POST /api/onboarding/update-signature` — `onboarding-tenants.js:140`

The only path that creates a row in `inboxes` is `POST /api/onboarding/save-tenant` (`server.js:551`), and it is upsert-keyed on `inbox.id = tenant.id` (see C below) — i.e. it can only create or refresh the **primary** inbox tied 1:1 to the tenant. There is no code path that inserts an additional inbox row with a fresh UUID under the same `tenant_id`.

---

## B. Encryption helper for IMAP/SMTP passwords

- Function: `encrypt(plaintext)` — `src/api/crypto.js:13`. Complementary `decrypt` at `src/api/crypto.js:24`.
- Algorithm: `aes-256-gcm` (constant `ALGORITHM` at `crypto.js:3`). 12-byte random IV (`crypto.js:16`), 16-byte auth tag (`crypto.js:20`). Output format: `<ivHex>:<tagHex>:<ciphertextHex>`.
- Key source: `process.env.ENCRYPTION_KEY` (`crypto.js:6`), SHA-256-hashed to derive the 32-byte key (`crypto.js:10`). Throws if env var missing (`crypto.js:8`).
- Consumers: `server.js:12` (save-tenant), `poller/index.js:6` (decrypt on poll), `routes/emails.js` (decrypt for SMTP send at line 163).
- Backwards-compatibility quirk: `decrypt` returns input unchanged if the format doesn't match (`crypto.js:27`, `crypto.js:35`) so legacy plaintext rows still work.

---

## C. Path from `POST /api/onboarding/save-tenant` to the `inboxes` INSERT

Request guarded by global `app.use("/api/onboarding", requireAuth)` (`server.js:237`), so the caller must already have a session. Note: the body's `credentials.email` is **not** required to match `req.tenant.email` — the route trusts whatever the client posts.

Flow (`server.js:551-690`):
1. **Validate body** (lines 553-579): requires `credentials.{email,password,imapHost,smtpHost}`; optional `siteware_token`, `reply_agent_id`, `toneProfile`, `emailSignature`, `credentials.imapPort` (default 993), `credentials.smtpPort` (default 465).
2. **Build values** (lines 581-603): `tenantId = crypto.randomUUID()` (line 582; this value is discarded if email already exists — see step 5). `toneProfile` is JSON-stringified with optional `email_signature` merged in (lines 583-593).
3. **Encrypt passwords** (lines 606-607): `encImapPass = encrypt(creds.password)`, `encSmtpPass = encrypt(creds.password)`. Same plaintext is encrypted twice — produces two different ciphertexts because of the random IV per call.
4. **Upsert tenant** (lines 609-640): `INSERT INTO tenants (...) VALUES (...) ON CONFLICT(email) DO UPDATE SET ...`. `tone_profile`, `siteware_token`, `reply_agent_id` use `COALESCE(excluded.x, tenants.x)` so nulls don't clobber existing values; everything else overwrites.
5. **Resolve actual tenant id** (lines 643-646): re-reads `SELECT id FROM tenants WHERE email = ?` because on conflict the original `tenantId` is unused.
6. **Upsert inbox** — `server.js:652-683`. This is the INSERT into `inboxes`:

```sql
INSERT INTO inboxes
  (id, tenant_id, email, label, imap_host, imap_port, imap_user,
   imap_password_enc, smtp_host, smtp_port, smtp_user, smtp_password_enc,
   is_active)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
ON CONFLICT(id) DO UPDATE SET
  email = excluded.email,
  label = excluded.label,
  imap_host = excluded.imap_host,
  imap_port = excluded.imap_port,
  imap_user = excluded.imap_user,
  imap_password_enc = excluded.imap_password_enc,
  smtp_host = excluded.smtp_host,
  smtp_port = excluded.smtp_port,
  smtp_user = excluded.smtp_user,
  smtp_password_enc = excluded.smtp_password_enc,
  is_active = 1
```

Bound parameters (lines 671-682), in order:
1. `actualTenantId` → `id` (the **MI-01 invariant**: inbox.id == tenant.id; see comment at `server.js:648-650`)
2. `actualTenantId` → `tenant_id`
3. `creds.email` → `email`
4. `inboxLabel` (= `creds.email.split("@")[0] || "primary"`, line 651) → `label`
5. `creds.imapHost` → `imap_host`
6. `imapPort` → `imap_port`
7. `creds.email` → `imap_user`
8. `encImapPass` → `imap_password_enc`
9. `creds.smtpHost` → `smtp_host`
10. `smtpPort` → `smtp_port`
11. `creds.email` → `smtp_user`
12. `encSmtpPass` → `smtp_password_enc`

Implicit columns left at defaults: `is_active = 1` (literal in VALUES, also forced on conflict), `last_polled_at` NULL, `last_poll_error` NULL, `created_at` = `unixepoch()` (default per `db.js:143`).

7. Response: `{ success: true, tenantId: actualTenantId }` (line 685).

**Key consequence for add-inbox work:** this UPSERT is keyed on `id`, and `id` is hard-bound to `tenant_id`. A second call with a different `credentials.email` for the same tenant would create a brand-new tenant row (different `tenants.email` UNIQUE key) plus a brand-new inbox keyed under that new tenant — not a second inbox under the original tenant. So this endpoint cannot be re-used as an "add inbox to existing tenant" path without breaking the MI-01 invariant.

---

## D. Endpoint that validates IMAP credentials before save

`POST /api/onboarding/test-connection` — `src/api/server.js:244`.

- Signature: requires JSON body `{ imapHost: string, imapPort: number, email: string, password: string }` (validated lines 247-254).
- Behavior: calls `testImapConnection({ host, port, user, password, tls: true })` from `src/api/imap-scan.js` (imported at `server.js:14`).
- Responses: `200 { success: true, folder }` on success, `400 { success: false, error }` on connection failure, `422` on validation errors, `500` on uncaught errors.
- Auth: gated by the `requireAuth` middleware applied to `/api/onboarding` at `server.js:237`.

There is no `/api/inboxes/test-connection` or `/api/inboxes/:id/test-connection`. The only validation surface today lives under `/api/onboarding`.

---

## E. Endpoint that validates Siteware credentials

`POST /api/onboarding/validate-siteware` — `src/api/server.js:281`.

- Body: `{ token, triageAgentId, replyAgentId, toneAgentId }` (all required, line 291-299). Note the body shape: it checks `triageAgentId` + `toneAgentId` in addition to `replyAgentId`, but the values are not actually used in the call — only `token` is passed to the upstream request (lines 314-316). So this endpoint validates that the **token** works against `POST https://api.siteware.io/v1/api/proxy/openai/v1/responses` (line 312) by issuing a trivial `gpt-4.1` "test" request. It does not verify the agent IDs exist or are reachable.
- Responses: `200 { success: true }` if upstream returns 200; `200 { success: false, error: "Invalid Siteware API token" }` on 401/403; otherwise `{ success: false, error: "Could not reach Siteware API" }`.
- 10-second timeout (line 304).
- Auth: gated by the `/api/onboarding` requireAuth (`server.js:237`).

---

## F. SPA `/settings` route and auth rejection

- **Route serving:** no dedicated handler. The catchall `app.get("/{*path}", …)` at `src/api/server.js:773` sends `public/index.html` for every non-`/api` GET — including `/settings`. The server does not know or care what the SPA renders; routing is client-side. Static assets under `public/` are served via `express.static` at line 692.
- **Auth on the SPA shell:** none. The HTML is delivered unauthenticated to anyone hitting the route. The `requireAuth` middleware lives only on the JSON endpoints under `/api/auth/me` (defined inline in `routes/auth.js:143`), `/api/emails`, `/api/inboxes`, `/api/onboarding`, and `/api/tone-profile`. Each of those rejects with `401 { error: "Not authenticated" }` when `req.cookies.session` is missing (e.g. `server.js:107`, `routes/inboxes.js:7`, `routes/auth.js:145`, `routes/onboarding-tenants.js:7`).
- **Three copies of `requireAuth` exist:** `server.js:105`, `routes/inboxes.js:5`, `routes/onboarding-tenants.js:7`. All three are byte-equivalent: cookie → sessions row → tenants row (`SELECT *`) → assign to `req.tenant`. The `tone-profile.js` and `emails.js` routers must contain a fourth copy (not read in full here — confirmed via grep showing `requireAuth, (req, res)` usage at `tone-profile.js:42`/`75` and `emails.js:24`/`69`/`82`/`111`/`195`/`212`/`239`/`264`/`288`).

---

## G. Every existing endpoint under `/api/inboxes/*`

Only one is mounted — `src/api/routes/inboxes.js` exports a router with a single `GET /` (line 21).

| Method | Path | Behavior |
|---|---|---|
| GET | `/api/inboxes` | Returns `{ inboxes: [{ id, email, label, is_active }] }` for `req.tenant.id`, ordered by `created_at ASC` (`routes/inboxes.js:23-27`). |

There is **no** `POST /api/inboxes`, no `PATCH /api/inboxes/:id`, no `DELETE /api/inboxes/:id`, no `POST /api/inboxes/:id/draft`, no `POST /api/inboxes/:id/test-connection`. Inbox mutation today flows through `/api/onboarding/tenant-toggle`, `/api/onboarding/tenant-delete`, `/api/onboarding/save-tenant`, and `/api/onboarding/update-signature`.

---

## H. What `requireAuth` attaches to `req`

All four (likely five — counting `emails.js`/`tone-profile.js` copies) `requireAuth` implementations execute:

```js
const tenant = db.prepare("SELECT * FROM tenants WHERE id = ?").get(session.tenant_id);
req.tenant = tenant;
```

(`server.js:113-117`, `routes/inboxes.js:13-17`, `routes/onboarding-tenants.js:13-17`.)

Because of the `SELECT *`, `req.tenant` carries every column on the `tenants` row, which after migrations (`db.js:99-124`) is:

- `id`, `email`, `imap_host`, `imap_user`, `imap_password_enc`, `smtp_host`, `smtp_user`, `smtp_password_enc`, `tone_profile`, `role`, `created_at`
- `imap_port`, `smtp_port` (added `db.js:99`/`104`)
- `email_signature` (added `db.js:110`)
- **`siteware_token`** (added `db.js:116`)
- **`reply_agent_id`** (added `db.js:121`)

So **yes** — `req.tenant.siteware_token`, `req.tenant.reply_agent_id`, and `req.tenant.tone_profile` are all populated when the row contains them. The `analyze-tone` handler relies on exactly that (`server.js:495`). `tone_profile` is the raw JSON text — callers must `JSON.parse` it (e.g. `emails.js:144-145`).

Caveats:
- `imap_password_enc` / `smtp_password_enc` ride along on every authenticated request; the decrypted password never leaves the server because there is no endpoint that emits these fields, but they are in memory on every request.
- The tenant-level `imap_*` / `smtp_*` columns are now legacy duplicates of the `inboxes` row — `save-tenant` writes both (`server.js:609` and `server.js:652`), and the poller reads from `inboxes` (`poller/index.js:138`). Tenant-level fields are still consulted by the one-time backfill at `db.js:167-200`.

---

## Poller load path (supporting context, not asked but adjacent)

`runCycle()` at `src/poller/index.js:137` does `SELECT * FROM inboxes WHERE is_active = 1` (line 138) and iterates `pollSingleInbox(inbox)`. Each inbox supplies its own `imap_user`, `imap_host`, `imap_port`, and `decrypt(imap_password_enc)` (lines 21-27). So a freshly inserted inbox row with `is_active = 1` will be picked up on the next cycle (`POLL_INTERVAL_MS`, default 180_000ms = 3 min) without any restart — the poller does not cache the inbox list.

The poller writes `last_polled_at` / `last_poll_error` on the inbox row (lines 122-124, 131-133) but **neither column is currently exposed by `GET /api/inboxes`** — the list query only selects `id, email, label, is_active`.

---

## Calibration block (per pillar-10)

- **Citation accuracy:** High. Every line number cited above was read in full; the four `requireAuth` claims are sourced from explicit reads of `server.js`, `routes/inboxes.js`, `routes/onboarding-tenants.js`, plus a grep confirming the same pattern is referenced in `routes/emails.js` and `routes/tone-profile.js` (those two files were not read end-to-end, so the assertion that their `requireAuth` is byte-equivalent is inferred from the duplicated pattern and not verified — noted in the Disagreements section).
- **Spec match:** Full — answered A through H, called out each requested file (server, all five route files, db.js, poller, crypto helper), produced the exact INSERT statement for question C, and gave file:line citations throughout. Re-stating the ask: identify whether `POST /api/inboxes` exists (no), the password encryption helper (B), the save-tenant → inboxes INSERT path (C), the IMAP test endpoint (D), the Siteware-validate endpoint (E), the `/settings` route serving + auth gate (F), every `/api/inboxes/*` endpoint (G), and the shape of `req.tenant` set by `requireAuth` (H).
- **Edge cases covered:** Medium-High. Surfaced: (i) `save-tenant` is upsert-keyed on tenant.email so it can't model "second inbox for same tenant"; (ii) the same plaintext password is encrypted twice producing two different ciphertexts; (iii) tenant-level legacy imap/smtp columns coexist with `inboxes` rows; (iv) `validate-siteware` validates only the token, not agent IDs; (v) catchall route serves `/settings` unauthenticated — only the API rejects 401; (vi) `GET /api/inboxes` does not expose `last_poll_error` or `last_polled_at`.
- **Things not asked but relevant to building add-inbox:**
  - **MI-01 invariant collision.** `save-tenant` enforces `inbox.id == tenant.id` (`server.js:648-650` comment). Any new "add inbox" endpoint MUST mint a fresh inbox UUID and abandon this invariant for non-primary inboxes — and check that no downstream code (the db.js backfill at lines 200-209, anything that joins inboxes via tenant_id) assumes the equality.
  - **UNIQUE constraint on `inboxes(tenant_id, email)`** (`db.js:144`). A re-add of the same email under the same tenant will collide unless the handler also writes an `ON CONFLICT(tenant_id, email)` clause.
  - **Sessions vs tenants in a multi-inbox world.** `sessions.tenant_id` is the auth anchor (`db.js:50`, `auth.js:155`). Multiple inboxes per tenant works, but multiple tenants per human user does not — the OTP login at `auth.js:45` matches a single `tenants.email` row. If the product wants "user adds a second email address they own," the OTP/login model needs revisiting.
  - **Three (likely five) duplicated `requireAuth` implementations.** Risk of drift. If a new `/api/inboxes/test-connection` is added on the existing `routes/inboxes.js` router, it inherits the local copy at `routes/inboxes.js:5` — not the one in `server.js`. Worth consolidating before adding more surface area.
  - **CORS allowlist comes from `ALLOWED_ORIGINS`** (`server.js:21`) and rejects with `new Error("CORS: origin not allowed")` (line 29) — passing an `Error` to the cors callback yields a 500. Any new endpoint inherits this behavior.
  - **No CSRF protection** on state-changing endpoints. `sameSite: "strict"` on the session cookie (`auth.js:122`) is the only mitigation. A new `POST /api/inboxes` should not weaken this.
  - **Re-running `analyze-tone` requires `req.tenant.siteware_token`** (`server.js:495-501`, returns 412 if missing). If the add-inbox flow lets a user provide credentials before tone analysis, the order matters: save-tenant (or the new endpoint) must persist `siteware_token` first.
  - **`encrypt(null|"")` is a no-op** (`crypto.js:14`). If you ever allow a stored "OAuth-instead-of-password" inbox, the helper will silently store an empty string.
- **Disagreement / ambiguity / alternative surfaced:**
  - The user phrased the task assuming `routes/inboxes.js` or onboarding-tenants might host the add-inbox endpoint; the truth is the only inbox-creating code is `save-tenant`, and it is structurally unable to add a *second* inbox to an existing tenant without re-architecture. Alternatives to consider: (a) extend `routes/inboxes.js` with a fresh `POST /` that mints a new `inboxes.id`, or (b) generalize `save-tenant` with an explicit `mode: "primary" | "additional"` switch — the former is cleaner and avoids touching the wizard.
  - I did **not** read `routes/emails.js` and `routes/tone-profile.js` end-to-end. My claim that their `requireAuth` is byte-equivalent is inferred. If they diverge (e.g. attach more or fewer fields to `req`), question H could be slightly off for those routers.
  - I did **not** open `src/api/imap-scan.js`; the assertion that `testImapConnection`'s contract is `{ host, port, user, password, tls }` → `{ success, error?, folder? }` comes from how `server.js:262` calls it, not from reading the implementation.
- **Production verification needs:**
  - **Live DB schema check.** Run `PRAGMA table_info(inboxes);` and `PRAGMA table_info(tenants);` against `data/siteflow.db` on the test server. Migrations are `try/catch`-guarded (`db.js:73-124`), so the on-disk schema can diverge from the declared columns if an old DB pre-dates a migration.
  - **Verify the UNIQUE constraint is actually enforced** on legacy data: `SELECT tenant_id, email, COUNT(*) FROM inboxes GROUP BY 1,2 HAVING COUNT(*) > 1;`. If migration created duplicates before the constraint, the next add-inbox INSERT will fail.
  - **Confirm `ENCRYPTION_KEY` is set in the runtime env** and matches what the existing rows were encrypted with — if it rotated, `decrypt` at `poller/index.js:22` throws on next poll and quietly marks the inbox failed (`poller/index.js:131`).
  - **Confirm SPA build under `public/`** actually has a `/settings` route handler client-side before promising users a settings page — the server happily 200s any path.
  - **Hit `POST /api/onboarding/test-connection` against the production IMAP host** with the new inbox creds before persisting; the dashboard wizard already does this but a programmatic add-inbox flow must too.
