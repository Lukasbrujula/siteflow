# Frontend n8n-Era Recovery Audit

**Date:** 2026-04-22
**Mode:** Read-only reconnaissance. No edits, commits, or pushes were made.
**Scope:** `Lukasbrujula/siteflow` (this repo), `Lukasbrujula/siteware-frontend` (cloned at `/Users/lukasmargenfeld/clients/Siteware/siteware-frontend`), and the purported `Lukasbrujula/claude-chat-test`.

---

## Summary

The premise "an earlier commit of `siteware-frontend` called n8n webhooks directly" is **not supported by the evidence in that repo.** Even at its initial commit (`cbd756c`, 2026-04-09), `src/lib/api/webhooks.ts` already posted to **relative** paths (`/api/webhooks/<action>`, `/api/email/send`) against the project's own Express backend — not to `https://n8n.siteware.io`. There is no `import.meta.env.VITE_N8N_WEBHOOK_BASE_URL` read anywhere in the file history of `webhooks.ts`. The var appears only in `README.md` as stale, aspirational documentation.

The **actual** n8n-era artifacts almost certainly live in the **upstream** repo from which `siteware-frontend` was forked: `Lukasbrujula/siteware-email-dashboard`. That repo's `git ls-remote` exposes the tag `v1-stable-before-polling` (SHA `d26aa6e307e4ee44edc297ad85b1260481856e67`) — the likeliest snapshot of the original n8n-integrated dashboard before the Express/Turso/poller backend was grafted on.

`Lukasbrujula/claude-chat-test` **does not exist** on GitHub (404) and is not present locally under `/Users/lukasmargenfeld/clients/` or `/Users/lukasmargenfeld/projects/`.

---

## 1. `siteware-frontend` repo findings

**Path:** `/Users/lukasmargenfeld/clients/Siteware/siteware-frontend`
**Remote:** `https://github.com/Lukasbrujula/siteware-frontend.git`
**Branches:** `main` only (local + remote).
**Tags:** none.
**Stash:** empty.
**Reflog:** clean, linear — no unexpected resets, no rebases.
**Total commits on `main`:** 20.

### 1.1 Key commits

| SHA | Date | Message |
|---|---|---|
| `cbd756c` | 2026-04-09 15:06 | initial commit: fork of siteware-email-dashboard for backend integration |
| `7cd76b6` | 2026-04-09 18:23 | refactor: remove backend, adapt frontend for standalone API (removed `server/`, `api/`, `poller/`, n8n configs) |
| `b02a7fe` | 2026-04-15 22:48 | fix(api): rewrite all endpoints to match backend routes, fix dates and data mapping |

### 1.2 `webhooks.ts` across history

Only two commits have ever touched `src/lib/api/webhooks.ts`:

- **`cbd756c`** — already posts to `/api/webhooks/<action>` (relative, handled by the bundled Express server in `src/server/`) and `/api/email/send`. No n8n URL construction, no env-var lookup.
- **`b02a7fe`** — rewrote `postWebhook` away from `/api/webhooks/<action>` toward per-email routes like `/api/emails/:id/approve`, `/api/emails/:id/reject`, etc.

Verbatim from `cbd756c:src/lib/api/webhooks.ts`:

```typescript
async function postWebhook<T extends Record<string, unknown>>(
  action: string,
  payload: T,
): Promise<void> {
  const url = `/api/webhooks/${action}`;

  const response = await fetch(url, {
    method: "POST",
    headers: apiHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30_000),
  });
```

Note: `webhooks.ts` comments still *refer* to n8n conceptually ("n8n's inbound push," "n8n-side responsibility"), but the code itself targets the local Express server, not n8n.

### 1.3 What `7cd76b6` deleted (evidence of pre-split monolith)

The 2026-04-09 18:23 "remove backend" commit deleted, among others:

```
api/webhooks/[action].ts                           (-60)
api/email/[param].ts                              (-621)
api/onboarding/[action].ts                        (-758)
api/emails/[category].ts                           (-82)
api/emails/index.ts                                (-38)
api/events.ts                                       (-3)
api/tone-profile/[tenantId]/index.ts               (-90)
n8n-workflow-lane1.json                          (-1426)
n8n/webhook-trigger-node.json                      (-51)
.github/workflows/email-poller.yml                 (-26)
poller/package.json, poller/package-lock.json, poller/scripts/*
src/components/demo/DemoToolbar.tsx                (-81)
scripts/migrate.js                                 (-97)
```

So the `cbd756c → 7cd76b6` range contains n8n workflow JSON and a webhook-trigger-node JSON — but **these are n8n-side artifacts** (workflow definitions), not a frontend calling n8n. The frontend in that monorepo already talked to its own Express backend, not to n8n.

### 1.4 `cbd756c:package.json` identity

```json
"name": "siteware-email-dashboard"
"start": "node poller/scripts/poller.js"
```

This confirms `cbd756c` is a direct fork snapshot of `siteware-email-dashboard` *after* the Express+poller backend had already been fused in. It is **not** the pre-backend, pure-n8n era.

---

## 2. `siteflow` (this repo) findings

**Path:** `/Users/lukasmargenfeld/clients/SW V2/siteflow`
**Total commits:** 42
**Root commit:** `e29d08b initial commit`
**Branches / tags:** (not queried beyond main — recommend verifying if deeper recovery needed)

### 2.1 n8n references

- `git log --all --source --grep='n8n'` → **no results**
- `git log --all --source --grep='webhook'` → **no results**
- `git log --all --diff-filter=D --name-only | grep -i n8n` → **no results**
- `grep -rli 'n8n' docs/ README.md` → **no results**

The backend repo has **zero tracked references to n8n** at any commit. It was started as a clean Express+SQLite+Turso+poller stack; it was never an n8n integration repo.

### 2.2 Referenced-but-missing docs

- `docs/siteflow-state.md` — **does not exist**. The user's prompt cited §9 of this file for `claude-chat-test` context, but there is no such file in the repo. Present docs under `docs/`:
  ```
  BODY_EXTRACTION_AUDIT.md
  CODEBASE_AUDIT.md
  DEPLOY_AUDIT_38498a5.md
  RECLASSIFY_BACKEND_AUDIT.md
  WERBUNG_PREVIEW_AUDIT.md
  incidents/postmortem-2026-04-15.md
  runbooks/runbook-poller-not-saving.md
  ```
- `docs/incidents/postmortem-2026-04-16.md` — **does not exist**. The existing postmortem is dated **2026-04-15** and concerns the poller silently dropping emails (stale WAL handles, scrubbed `.env`, dead Siteware tokens) — unrelated to an n8n-era rewrite.

---

## 3. `claude-chat-test` repo

- **GitHub:** `git ls-remote https://github.com/Lukasbrujula/claude-chat-test.git` → `Repository not found` (404).
- **Local:** not present under `/Users/lukasmargenfeld/clients/` or `~/projects/`.
- **Conclusion:** treat as nonexistent. Either it was private and is gone, was never published, or the name differs.

---

## 4. The likely real location of n8n-era code: `siteware-email-dashboard`

Probed via `git ls-remote https://github.com/Lukasbrujula/siteware-email-dashboard.git`:

```
366d8b8db3f76006fe2f8892701183cd2a43cc65    HEAD
366d8b8db3f76006fe2f8892701183cd2a43cc65    refs/heads/main
d26aa6e307e4ee44edc297ad85b1260481856e67    refs/tags/v1-stable-before-polling
```

The tag name `v1-stable-before-polling` suggests this is the snapshot *before* the IMAP poller / Express backend were added — i.e., when the dashboard was still driven purely by n8n webhooks. This is the highest-value recovery target, not anything inside the current `siteware-frontend` repo.

This audit did **not** clone that repo. Recommend cloning it into a read-only sibling directory before making any recovery decisions:

```bash
git clone https://github.com/Lukasbrujula/siteware-email-dashboard.git \
  /Users/lukasmargenfeld/clients/Siteware/siteware-email-dashboard-recon
cd /Users/lukasmargenfeld/clients/Siteware/siteware-email-dashboard-recon
git checkout v1-stable-before-polling
cat src/lib/api/webhooks.ts   # verify it really posts to an n8n URL
grep -r 'VITE_N8N' .
grep -r 'n8n.siteware' .
```

If `webhooks.ts` there reads `import.meta.env.VITE_N8N_WEBHOOK_BASE_URL` (or constructs `https://n8n.siteware.io/webhook/...` directly), that confirms the recoverable n8n-era frontend.

---

## 5. Recoverability assessment

### Option A — Clean checkout, Just Works
**Not applicable to `siteware-frontend`.** No pre-rewrite commit in that repo targets n8n directly.
**Plausible for `siteware-email-dashboard @ v1-stable-before-polling`** — requires verification per §4.

### Option B — Checkout + 1–3 known tweaks
**Most likely path** for `siteware-email-dashboard @ v1-stable-before-polling`, if §4 confirms it hits n8n URLs. Tweaks would be:

1. Update `VITE_N8N_WEBHOOK_BASE_URL` to point at the current n8n host.
2. Patch any hard-coded webhook paths if they drifted (`/webhook/approve-draft` vs `/webhook/approve`, etc.).
3. Strip or re-point any tenant/auth headers that didn't exist in the n8n era (e.g. `getTenantId()` bearer tokens) — or add them if n8n now requires them.
4. Adjust CORS / proxy config in `vite.config.ts` if n8n is on a different origin.

### Option C — Too stale / depends on removed APIs
**Unlikely but possible.** If `v1-stable-before-polling` also depended on services that no longer exist (a pre-Siteware mock backend, a local demo toolbar that made up fake data), you'd rip those parts out. None of this is catastrophic.

**Recommended: Option B**, pending §4 confirmation.

---

## 6. Concrete recovery commands (do not execute without approval)

Per the audit's read-only directive, these are documented, not run:

```bash
# Step 1. Clone upstream into a read-only recon directory.
git clone https://github.com/Lukasbrujula/siteware-email-dashboard.git \
  /Users/lukasmargenfeld/clients/Siteware/siteware-email-dashboard-recon
cd /Users/lukasmargenfeld/clients/Siteware/siteware-email-dashboard-recon

# Step 2. Inspect the pre-polling tag.
git checkout -b recovery/n8n-era v1-stable-before-polling
cat src/lib/api/webhooks.ts
grep -rn 'VITE_N8N\|n8n.siteware\|/webhook/' src/

# Step 3. If confirmed to target n8n:
npm install
npm run build
# Serve dist/ somewhere; point VITE_N8N_WEBHOOK_BASE_URL at current n8n host.
```

If §4 proves the tag is *also* already backend-integrated (i.e. `siteware-email-dashboard` was n8n-bound only very briefly and lost that state before v1), step back to `git log --all --source -S 'VITE_N8N_WEBHOOK_BASE_URL' -- src/lib/api/webhooks.ts` in that repo to find the last commit that still read the n8n env var, and recover from there.

---

## 7. Unknowns / human judgment required

1. **Does `siteware-email-dashboard @ v1-stable-before-polling` actually call n8n?** Not verified by this audit (no clone was performed). Verify with §4 commands.
2. **Is the target n8n instance still running?** The current `siteflow` architecture replaced n8n entirely. If n8n is also decommissioned, "recovering the frontend" without a live n8n backend yields a working shell that talks to nothing. The user should confirm n8n is still reachable before investing in recovery.
3. **Why recover at all?** If the goal is reference (UI patterns, onboarding flow), a one-time checkout and screenshot is cheaper than a live rebuild. If the goal is production use, evaluate whether the current `siteware-frontend + siteflow` stack already covers it.
4. **`claude-chat-test` authoritative status.** If the user is sure this repo existed, it may have been private and deleted, or under a different GitHub org. Worth asking before assuming 404 = never existed.
5. **Missing in-repo docs.** `docs/siteflow-state.md` and `docs/incidents/postmortem-2026-04-16.md` were referenced in the prompt but do not exist in `siteflow`. The prompt may have been drafted against a different branch or an imagined state.

---

## 8. Recommended next step

Clone `Lukasbrujula/siteware-email-dashboard` into a recon directory, check out `v1-stable-before-polling`, and run the three grep commands in §4. That confirms or falsifies Option B in under five minutes — and tells you whether recovery is worth attempting at all.
