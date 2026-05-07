# Frontend n8n-Era Inspection — `siteware-email-dashboard @ v1-stable-before-polling`

**Date:** 2026-04-22
**Cloned to:** `/Users/lukasmargenfeld/clients/SW V2/siteware-email-dashboard`
**Checked-out tag:** `v1-stable-before-polling` → commit `d26aa6e307e4ee44edc297ad85b1260481856e67`
**Commit message:** `fix: input validation, signature sanitization, placeholder guard, cleanup console.logs`
**Mode:** Read-only. No edits, commits, pushes, or installs performed.

---

## TL;DR

At the `v1-stable-before-polling` tag the frontend does **not** talk to n8n directly. It POSTs to **relative** `/api/webhooks/<action>` on its own bundled Express server (`src/server/index.ts`), which forwards to n8n server-side. Direct-to-n8n calls were removed ~halfway through the repo's history at commit `1b4e7b3`.

The **last commit where the frontend *did* talk to n8n directly is `03e716b`** ("feat: wire dashboard actions to n8n webhook endpoints"). That commit reads `VITE_N8N_WEBHOOK_BASE_URL` and builds `${BASE}/webhook/approve-draft` etc. — which is exactly the shape needed to point at `http://srv1572917.hstgr.cloud:5678/webhook/pipeline` (with one small change if the new n8n uses a single pipeline endpoint).

Practically there are two viable recovery paths:

- **Path A (light):** check out `03e716b`, set `VITE_N8N_WEBHOOK_BASE_URL`, possibly collapse four URLs into one `/webhook/pipeline` with an `action` discriminator. Dashboard runs on mock data (no Express, no SSE). Good for UI review and firing actions at n8n. **~2–4 hours.**
- **Path B (full):** use `v1-stable-before-polling`, bring up the Express ingestion server, retarget its forward-to-n8n URL. More complete but needs SQLite + tenant config + IMAP credentials. **~4–8 hours.**

---

## 1. Codebase shape (at `d26aa6e`)

| Attribute | Value |
|---|---|
| Framework | React 19.2 SPA (no SSR) |
| Router | `react-router-dom@^7.13` (`/`, `/onboarding`, `/settings`) |
| Build tool | Vite 7.3 + `@vitejs/plugin-react` |
| TS | 5.9 strict |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`, shadcn/ui primitives |
| State | Zustand 5 (`email-store`, `auth-store`, `ui-store`) |
| Testing | Vitest 4 + `@testing-library/react` + happy-dom |
| Package name | `siteware-email-dashboard` (not `-frontend`) |
| Bundle includes | Express server + IMAP poller + Turso client (all in one repo) |
| Size | **13,503 LOC** TS/TSX (non-test), 86 source files, 2.8 MB repo |

**Entry points**

- `src/main.tsx` — root React mount, wraps `<App />` in `<BrowserRouter>` with three routes.
- `src/App.tsx` — composes `DashboardHeader`, `CategoryTabs`, optional `DemoToolbar`, `Toaster`. No auth gate here (see §5).

**Key source areas**

```
src/
  App.tsx, main.tsx
  views/
    SpamView, AdView, UrgentView, OtherView, EscalationView,
    UnsubscribeView, OnboardingView, SettingsView, LoginView
  components/
    layout/{DashboardHeader, CategoryTabs}
    onboarding/{Step1Credentials, Step2ScanSent, Step3WebsiteScrape,
               Step4ToneAnalysis, Step5Confirm, OnboardingComplete,
               ManualExamplesStep, EmailConnectionStep, ToneAnalysisStep}
    settings/{ToneSettingsPanel}
    demo/DemoToolbar
    ui/ (shadcn primitives)
  hooks/useDataStream.ts                 # SSE client
  lib/
    api/{webhooks, emails, audit, headers}
    store/{email-store, auth-store, ui-store}
    mock-data.ts, seed-store.ts, constants.ts
  types/{email, webhook, audit}
  server/                                # Express backend bundled in-repo
    index.ts                             # /api/webhooks/*, /api/emails, /events
    sse.ts, validation.ts, db.ts, db-turso.ts
    auth.ts, audit.ts, crypto.ts
    n8n-nodes/{attempt-unsubscribe, reply-composer-with-tone}.js
    onboarding/{backfill-inbox, imap-scan, scrape-website,
               analyze-tone, run-profile}.ts
    tone-profile/{schema, analyzer-prompt, composer-injection, store}.ts
poller/                                  # IMAP poller (Node script)
api/                                     # Vercel-style serverless routes (legacy)
```

---

## 2. Every network call (client-side)

### 2.1 `src/lib/api/webhooks.ts` (the file this whole audit is about)

Header:
```ts
import { apiHeaders } from "@/lib/api/headers";
import { getTenantId } from "@/lib/store/auth-store";
```

Internal helper:
```ts
async function postWebhook<T extends Record<string, unknown>>(
  action: string,
  payload: T,
): Promise<void> {
  const url = `/api/webhooks/${action}`;                 // RELATIVE

  const response = await fetch(url, {
    method: "POST",
    headers: apiHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30_000),
  });
  …
}
```

Public functions (all POST, relative URLs unless noted):

| Function | Method | URL (client sees) | Body shape |
|---|---|---|---|
| `approveDraft(payload)` | POST | `/api/email/send` (direct SMTP via Express, not n8n) | `{ tenant_id, to, subject, body_html, body_plain, email_id }` |
| `rejectDraft(payload)` | POST | `/api/webhooks/reject` | `{ email_id, reason? }` |
| `retriage(payload)` | POST | `/api/webhooks/retriage` | `{ email_id, sender_email, subject, original_category: "SPAM"\|"AD" }` |
| `unsubscribe(payload)` | POST | `/api/webhooks/unsubscribe` | `{ email_id, sender_email, list_unsubscribe_url?, list_unsubscribe_mailto? }` |

All four use `apiHeaders()`, which sets `X-API-Key: VITE_API_SECRET_KEY`.

### 2.2 Data display / ingestion

- `src/hooks/useDataStream.ts`: `new EventSource("/api/events")` for real-time email events. Also bulk hydrates from `GET /api/emails?tenant_id=<id>` on connect.
- `src/lib/api/emails.ts`: `refreshStoreFromServer()` → `GET /api/emails?tenant_id=<id>`. Category PATCH endpoints (`/api/email/<id>/status`).
- `src/lib/api/audit.ts`: `POST /api/audit` (fire-and-forget audit events).

### 2.3 Other relative fetches (onboarding/settings)

| File | URL |
|---|---|
| `App.tsx:37` | `GET /api/onboarding/verify?t=<token>` |
| `components/demo/DemoToolbar.tsx:34` | `POST /api/demo/trigger` |
| `components/onboarding/EmailConnectionStep.tsx:48` | `POST /api/onboarding/test-connection` |
| `components/onboarding/Step3WebsiteScrape.tsx:38` | `POST /api/onboarding/scrape-website` |
| `components/onboarding/ToneAnalysisStep.tsx:46` | `POST /api/onboarding/scan-sent` |
| `components/onboarding/ManualExamplesStep.tsx:54` | `POST /api/onboarding/examples` |
| `components/settings/ToneSettingsPanel.tsx:142,203` | `GET/PUT /api/tone-profile/<tenantId>` |
| `components/settings/ToneSettingsPanel.tsx:208` | `POST /api/onboarding/update-signature` |

### 2.4 Absolute URLs

None in frontend source. Every fetch is relative. The only absolute n8n URL in the whole repo is **server-side**:

```ts
// src/server/onboarding/backfill-inbox.ts:4
const N8N_TRIAGE_URL = "https://siteware.app.n8n.cloud/webhook/email-inbound";
```

That's used by the Express server when backfilling the inbox after onboarding — not by the React app.

### 2.5 Vite proxy (`vite.config.ts`)

```ts
const apiPort = process.env.VITE_DASHBOARD_API_PORT || "3002";
const apiTarget = `http://localhost:${apiPort}`;
server: {
  proxy: {
    "/api/events": { target: apiTarget, rewrite: p => p.replace(/^\/api\/events/, "/events") },
    "/api":        { target: apiTarget, changeOrigin: true },
  },
}
```

So every `/api/*` fetch in dev goes to `http://localhost:3002` (the bundled Express server), and `/api/events` becomes `/events` on that server.

---

## 3. Does it assume a backend between it and n8n? **Yes — at this tag.**

Evidence:

1. `webhooks.ts` only ever builds **relative** `/api/webhooks/<action>` URLs. There's no reading of `VITE_N8N_WEBHOOK_BASE_URL` anywhere in the `src/` tree at `d26aa6e`.
2. Vite proxies `/api/*` to `localhost:3002` (the bundled Express server).
3. README at this tag explicitly states:
   ```
   4. User actions (approve, reject, retriage, unsubscribe) POST back to n8n webhooks
   ```
   and documents webhook paths `/webhook/approve-draft`, `/webhook/reject-draft`, `/webhook/retriage`, `/webhook/unsubscribe` — but those are documented as **targets the Express server forwards to**, not URLs the browser hits.
4. The Express server (`src/server/index.ts` at `d26aa6e`) contains comment: `// --- Mark email as sent (n8n callback after actual send) ---` and registers `/api/webhooks/*` routes that forward to n8n.
5. **Historical pivot**: commit `1b4e7b3` ("feat: proxy n8n webhook calls through Vercel API routes") explicitly removed `VITE_N8N_WEBHOOK_BASE_URL` from the frontend and added server-side proxying. The direct-to-n8n mode is the *predecessor* state.

### 3.1 The actual direct-to-n8n era: commit `03e716b`

The earliest commit that introduced `webhooks.ts` (`03e716b`, "feat: wire dashboard actions to n8n webhook endpoints") did read `VITE_N8N_WEBHOOK_BASE_URL`:

```ts
const N8N_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_BASE_URL as
  | string
  | undefined

async function postWebhook<T extends Record<string, unknown>>(
  path: string,
  payload: T,
): Promise<void> {
  if (!N8N_BASE_URL) {
    throw new WebhookError(
      'VITE_N8N_WEBHOOK_BASE_URL ist nicht konfiguriert',
      0,
      path,
    )
  }
  const url = `${N8N_BASE_URL}${path}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  …
}
```

At `03e716b` the dashboard is seeded from `src/lib/mock-data.ts` — there is no backend to display incoming emails from. Actions fire against real n8n, but displayed email data is mock.

---

## 4. Strings to change to point at the new n8n (`http://srv1572917.hstgr.cloud:5678`)

### 4.1 If you use Path A (`03e716b` + env var)

Only environment:

```bash
# .env.local
VITE_N8N_WEBHOOK_BASE_URL=http://srv1572917.hstgr.cloud:5678
```

Then `webhooks.ts` builds:

- `http://srv1572917.hstgr.cloud:5678/webhook/approve-draft`
- `http://srv1572917.hstgr.cloud:5678/webhook/reject-draft`
- `http://srv1572917.hstgr.cloud:5678/webhook/retriage`
- `http://srv1572917.hstgr.cloud:5678/webhook/unsubscribe`

**If the new n8n workflow uses a single `/webhook/pipeline` endpoint** (as the name `siteflow-pipeline-stateless` suggests), collapse the four URLs into one with an `action` discriminator. Exact diff (in `src/lib/api/webhooks.ts` at commit `03e716b`):

```diff
 async function postWebhook<T extends Record<string, unknown>>(
-  path: string,
+  action: string,
   payload: T,
 ): Promise<void> {
   if (!N8N_BASE_URL) { … }
-  const url = `${N8N_BASE_URL}${path}`
+  const url = `${N8N_BASE_URL}/webhook/pipeline`
   const response = await fetch(url, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
-    body: JSON.stringify(payload),
+    body: JSON.stringify({ action, ...payload }),
   })
 }

 export function approveDraft(payload: ApproveDraftPayload) {
-  return postWebhook('/webhook/approve-draft', payload)
+  return postWebhook('approve-draft', payload)
 }
-… same change for rejectDraft, retriage, unsubscribe
```

Also add CORS allowance on the n8n side for `http://localhost:5173` (Vite dev) and whatever host serves production.

### 4.2 If you use Path B (`v1-stable-before-polling` + Express proxy)

Frontend needs **no** changes. Change the server-side forward target inside `src/server/index.ts` (where `/api/webhooks/<action>` forwards to n8n). Also change:

```ts
// src/server/onboarding/backfill-inbox.ts:4
const N8N_TRIAGE_URL = "https://siteware.app.n8n.cloud/webhook/email-inbound";
```

to the new n8n's inbound-triage URL.

### 4.3 Headers

- At `03e716b`: only `Content-Type: application/json`. No auth header. n8n must accept unauthenticated POSTs (or use Basic/Header-Auth configured per-webhook).
- At `d26aa6e`: also `X-API-Key` (from `VITE_API_SECRET_KEY`), consumed by the Express server — not by n8n. If you strip the Express server, `apiHeaders()` adds a benign empty header that n8n will ignore.

---

## 5. Auth / login

### 5.1 At `d26aa6e` (v1-stable-before-polling) — yes, there is login

- `src/views/LoginView.tsx` exists (OTP flow).
- `src/lib/store/auth-store.ts` is a Zustand store tracking `{ tenantId, imapUser, isVerified, isLoading, error }`, persisted via `sessionStorage` (`SESSION_TOKEN_KEY`). Exported `getTenantId()` returns the tenant or `"default"`.
- `src/lib/api/headers.ts` adds `X-API-Key: import.meta.env.VITE_API_SECRET_KEY ?? ""` to every API request.
- The flow: OTP → Express verifies → returns tenant_id → stored in sessionStorage → all subsequent `/api/*` calls carry `X-API-Key` and `?tenant_id=…`.
- **This is auth for the Express middle-tier, not for n8n.** n8n at this tag is not authenticated from the browser's perspective (the browser never talks to n8n).

### 5.2 At `03e716b` — no login

At the direct-to-n8n commit, `auth-store.ts` and `LoginView.tsx` don't exist. `webhooks.ts` POSTs with only `Content-Type: application/json`. The dashboard assumes it talks unauthenticated to n8n (or relies on n8n-webhook-level auth you configure on the n8n side).

---

## 6. Approve / reject / retriage flow (at `d26aa6e`)

Shape of user action → network call → expected response:

**Approve** (approveDraft) — *does not touch n8n; uses tenant SMTP*:
- Client sends: `POST /api/email/send` with body `{ tenant_id, to, subject, body_html, body_plain, email_id }` + `X-API-Key`.
- Server: loads tenant SMTP creds from Turso, sends via Nodemailer, PATCHes email status to `sent`.
- Response: `{ warning?: string }` (200) or `{ error }` (non-2xx).
- Client on success: emits audit event, removes email from Zustand store (auto-archive).

**Reject** (rejectDraft):
- Client sends: `POST /api/webhooks/reject` with `{ email_id, reason? }` + `X-API-Key`.
- Server: forwards to n8n `/webhook/reject-draft-v2` (paths were bumped to v2 at `65c731d`), returns result.
- Client on success: removes email from store.

**Retriage** (retriage):
- Client sends: `POST /api/webhooks/retriage` with `{ email_id, sender_email, subject, original_category }` + `X-API-Key`.
- Server: forwards to n8n `/webhook/retriage-v2`. Note that only a 150-char preview is sent from the dashboard; n8n must look up full body by `email_id` from its own storage.
- Client on success: removes email from store.

**Unsubscribe** (unsubscribe):
- Client sends: `POST /api/webhooks/unsubscribe` with `{ email_id, sender_email, list_unsubscribe_url?, list_unsubscribe_mailto? }` + `X-API-Key`.
- Server: forwards to n8n `/webhook/unsubscribe-v2` (which attempts HTTP GET / mailto).
- Client on success: updates unsubscribe status in store.

Errors: all throw `WebhookError(message, status, endpoint)` which the callers surface as German toasts via `sonner`.

**At `03e716b`** the four paths are the direct-n8n ones:
- `POST ${N8N_BASE_URL}/webhook/approve-draft` — body `{ email_id, draft_html, draft_plain, sender_email, subject }` (no `reply_language` yet)
- `POST ${N8N_BASE_URL}/webhook/reject-draft` — body `{ email_id, reason? }`
- `POST ${N8N_BASE_URL}/webhook/retriage` — body `{ email_id, sender_email, subject, original_category: "SPAM"|"AD" }`
- `POST ${N8N_BASE_URL}/webhook/unsubscribe` — body `{ email_id, sender_email, list_unsubscribe_url?, list_unsubscribe_mailto? }`

Timeout: `AbortSignal.timeout(15_000)` at `03e716b`, bumped to `30_000` in later commits.

---

## 7. Minimum change list to run against `siteflow-pipeline-stateless` at `http://srv1572917.hstgr.cloud:5678`

### 7.1 If the new n8n exposes the four legacy paths (`/webhook/approve-draft`, `/webhook/reject-draft`, `/webhook/retriage`, `/webhook/unsubscribe`)

**Steps (against commit `03e716b`, no code edits):**

1. `git checkout 03e716b` (in the cloned recon dir; do not write back to origin).
2. Create `.env.local`:
   ```
   VITE_N8N_WEBHOOK_BASE_URL=http://srv1572917.hstgr.cloud:5678
   ```
3. `npm install && npm run build` (uses React 19 — should work without changes).
4. Serve `dist/` on any static host, or `npm run dev` for local.
5. Configure CORS on n8n to allow `Origin: <wherever you're serving from>`.

This is a one-env-var change. Estimated hands-on time: **30–60 minutes.** Caveat: dashboard will only show *mock* emails (no real inbound), since `03e716b` predates the Express data server.

### 7.2 If the new n8n exposes a single `/webhook/pipeline` endpoint with an action discriminator

**Steps (against commit `03e716b`, with one small code edit):**

1. `git checkout 03e716b`.
2. Patch `src/lib/api/webhooks.ts`:
   - Change `postWebhook(path, payload)` to accept `action` instead of `path`.
   - Change URL construction to `${N8N_BASE_URL}/webhook/pipeline`.
   - Wrap body as `{ action, ...payload }`.
   - Update the four callers (`approveDraft`, `rejectDraft`, `retriage`, `unsubscribe`) to pass action names (`'approve-draft'`, `'reject-draft'`, `'retriage'`, `'unsubscribe'`).
3. Set `VITE_N8N_WEBHOOK_BASE_URL=http://srv1572917.hstgr.cloud:5678` in `.env.local`.
4. Build, serve, enable CORS on n8n.

Diff is ~15 lines in one file (§4.1 above). Estimated hands-on time: **2–4 hours** including n8n verification.

### 7.3 If you want real email data displayed (not mock) — Path B

1. Use `v1-stable-before-polling` instead of `03e716b`.
2. Leave frontend alone.
3. In `src/server/index.ts`, change the n8n forward target from whatever `siteware.app.n8n.cloud` URL is hard-coded to `http://srv1572917.hstgr.cloud:5678`. Also change `src/server/onboarding/backfill-inbox.ts:4` (`N8N_TRIAGE_URL`).
4. Stand up a SQLite DB (the repo ships a schema migration), create a tenant row with IMAP + SMTP credentials.
5. `npm run dev:server` (port 3002) and `npm run dev` (port 5173) in parallel. Optionally `node poller/scripts/poller.js` for IMAP polling.
6. Configure `.env` with `ENCRYPTION_KEY`, `VITE_API_SECRET_KEY`, `API_SECRET_KEY`, `DASHBOARD_CORS_ORIGINS=http://localhost:5173`, and `VITE_DASHBOARD_API_PORT=3002`.

Estimated hands-on time: **4–8 hours**, dominated by Turso/SQLite setup, tenant seeding, and IMAP credential plumbing.

---

## 8. Build & run

From `package.json` at `d26aa6e`:

```json
"scripts": {
  "dev": "vite",
  "dev:server": "tsx src/server/index.ts",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest run",
  "test:server": "vitest run --config vitest.server.config.ts",
  "test:all": "npm run test && npm run test:server",
  "start": "node poller/scripts/poller.js"
}
```

Minimum to run locally:

```bash
cd /Users/lukasmargenfeld/clients/SW V2/siteware-email-dashboard
npm install          # Node 20+, may warn about peer deps with React 19
npm run dev          # port 5173
# In another terminal, if you want data to actually appear:
npm run dev:server   # port 3002 (needs SQLite/env)
```

At `03e716b` the only required command is `npm run dev`. No server to start — mock data seeds the store.

Build: `npm run build` emits `dist/` (fully static, deploy anywhere).

---

## 9. Effort estimate

| Path | Goal | Hands-on hours |
|---|---|---|
| A.1 | `03e716b` + env var, four legacy webhook paths on new n8n | **0.5–1 h** |
| A.2 | `03e716b` + one-file patch for single `/webhook/pipeline` endpoint | **2–4 h** |
| B | `v1-stable-before-polling` + retarget Express forward URL + tenant seeding | **4–8 h** |

The "right" choice depends on one question the audit can't answer: **does `siteflow-pipeline-stateless` expose one endpoint or four?** If you can answer that (or reshape the n8n side cheaply), Path A.1 or A.2 gets a working UI in front of your new n8n in one afternoon.

---

## 10. Risks / open questions

1. **Does the new n8n accept browser Origin?** CORS must be enabled on every webhook node, or the browser will block responses. n8n's default is to reject CORS for `Access-Control-Allow-Origin: *` unless explicitly configured.
2. **Payload field drift.** The new pipeline may expect different field names (e.g. `category` vs `original_category`, or `html` vs `draft_html`). Verify with a curl against each endpoint before wiring the UI.
3. **Session storage for tenantId.** At `03e716b` there is no tenant concept. If the new n8n requires a tenant id in the payload, add it to all four payloads (5 LOC in `webhooks.ts`).
4. **React 19 compatibility.** A few dev tools (e.g. `happy-dom`, `@testing-library/react@16`) may warn. Build/runtime is fine; test suite may need minor bumps.
5. **Shadcn/ui component versions.** `radix-ui@^1.4.3` is a meta-package — newer releases may have breaking exports. If install fails, pin to resolved versions from `package-lock.json` (not in the `03e716b` tree; take it from `d26aa6e` or regenerate).
6. **Static-host + env baking.** `VITE_*` variables are inlined at build time. To change the n8n URL after deploy, rebuild. For dynamic targeting, read from `window.__CONFIG__` or similar instead of `import.meta.env`.

---

## 11. Concrete next step

If Path A.1 looks right: verify in one minute whether the four legacy paths work on the new n8n:

```bash
curl -X POST http://srv1572917.hstgr.cloud:5678/webhook/approve-draft \
  -H 'Content-Type: application/json' \
  -d '{"email_id":"probe","draft_html":"<p>x</p>","draft_plain":"x","sender_email":"a@b.c","subject":"test"}' -i

curl -X POST http://srv1572917.hstgr.cloud:5678/webhook/reject-draft   -H 'Content-Type: application/json' -d '{"email_id":"probe","reason":"test"}' -i
curl -X POST http://srv1572917.hstgr.cloud:5678/webhook/retriage       -H 'Content-Type: application/json' -d '{"email_id":"probe","sender_email":"a@b.c","subject":"t","original_category":"SPAM"}' -i
curl -X POST http://srv1572917.hstgr.cloud:5678/webhook/unsubscribe    -H 'Content-Type: application/json' -d '{"email_id":"probe","sender_email":"a@b.c"}' -i
```

Four `200`s → Path A.1. One `404` or `405` on any of them → Path A.2 (single `/webhook/pipeline`). Something else → talk to n8n first, not the frontend.
