# Body Extraction Audit

**Date:** 2026-04-20
**Scope:** `src/poller/index.js` — read-only audit, no code changes.
**Trigger:** Johanna @ SugarPool reported 2026-04-14 that many emails display raw MIME envelope text (e.g. `boundary="_000_FR4P281MB3664..."`) in the dashboard's "Originalmail" pane instead of the actual message body.

---

## 1. Parsing library

No dedicated MIME parser. The poller uses **`imap-simple`** (`package.json` line ~`"imap-simple": "^5.1.0"`) purely to fetch messages from IMAP. All MIME parsing is **hand-rolled** in `src/poller/index.js`:

- `parseRawHeader(rawSource, name)` — lines 18–29. Extracts a single header value from the raw source, handling folded continuation lines.
- `decodeMimeWords(str)` — lines 31–76. RFC 2047 encoded-word decoder for headers (added April 16, subject-side only).
- `stripHtml(html)` — lines 78–94. Naive regex-based HTML-to-text.
- `extractBodies(rawSource)` — lines 96–188. **Recursive custom MIME walker.** This is the function at the heart of the bug.

`mailparser` is **not** installed (confirmed via `package.json` grep).

## 2. Body extraction code path (parse → INSERT)

1. `src/poller/index.js:215-216` — grab the full raw RFC822 source:
   ```js
   const fullPart = msg.parts.find((p) => p.which === "");
   const rawSource = fullPart?.body || "";
   ```
2. `src/poller/index.js:222` — hand off to the custom walker:
   ```js
   const { bodyPlain, bodyHtml } = extractBodies(rawSource);
   ```
3. `src/poller/index.js:223` — pick plain, fall back to stripped HTML, fall back to empty:
   ```js
   const text = bodyPlain || stripHtml(bodyHtml) || "";
   ```
4. `src/poller/index.js:242-256` — INSERT, truncating to 5000 chars:
   ```js
   INSERT INTO emails (..., body, ...) VALUES (..., text.substring(0, 5000), ...)
   ```

There is only one `body` column (confirmed by the INSERT statement — no `body_html` or `body_plain`).

## 3. Multipart handling — what the code does

`extractBodies` (`index.js:96-188`) does handle `multipart/*`:

- **`index.js:98-108`** — splits raw source at the first `\r\n\r\n` (falls back to `\n\n`). Left side is header section, right side is body section.
- **`index.js:110-112`** — parses top-level `Content-Type` with `/^Content-Type:\s*([^\r\n;]+)/im`. Defaults to `"text/plain"` if no match.
- **`index.js:113-132`** — if content type starts with `multipart/`:
  - `index.js:114` — extract boundary via `/boundary="?([^"\r\n;]+)"?/i` (unanchored; not line-start-aware).
  - `index.js:119` — `bodySection.split(new RegExp("--" + escapedBoundary))` — **unanchored**, no `\r?\n` prefix required.
  - `index.js:124-129` — for each split-result part: skip empty / skip parts starting with `--` (catches the `--{boundary}--` close marker). Recurse into remaining parts via `extractBodies(part)`. Take the first non-empty `bodyPlain` and first non-empty `bodyHtml`.
- **`index.js:134-188`** — for non-multipart leaves: parse charset, parse `Content-Transfer-Encoding`, decode `base64` / `quoted-printable`, return as `text/plain` or `text/html` accordingly.

Preference order: **first** `text/plain` encountered depth-first wins; else **first** `text/html`; else nothing.

## 4. What ends up in the `body` column

`text` (which is `bodyPlain || stripHtml(bodyHtml) || ""`) goes straight into the `body` column, truncated to 5000 chars. No other field is involved. There is no HTML column; `stripHtml` is applied only when no `text/plain` leaf was found.

## 5. Places where non-body content can leak in

Several. The most consequential:

- **`index.js:105-108`** — If `headerEnd === -1` (no `\r\n\r\n` **and** no `\n\n` found in the input), the code sets `headerSection = ""` and **`bodySection = rawSource`**. The entire raw message — headers and all — is then parsed as body content. `contentType` defaults to `"text/plain"` (no header to parse), and the whole RFC822 source is dumped into the output.
- **`index.js:119` + `index.js:124`** — The boundary split is unanchored, and the preamble (index 0 of the split result — the text between the headers' blank line and the first `--{boundary}` marker) is not explicitly skipped. `part.trim() === ""` catches an empty preamble; `part.trimStart().startsWith("--")` catches only the closing marker. A non-empty preamble is recursed into like a real part.
- **`index.js:114`** — The boundary regex is unanchored. If a nested part's own `Content-Type` header declares a boundary with the same string, or if the body quotes the boundary string, `split` will cut there too.
- **`index.js:98-103`** — Line-ending handling is binary: it looks for `\r\n\r\n` first, then `\n\n`. A message with mixed endings (e.g., `\r\n` everywhere except one `\r\n\n` at the header/body boundary) can fall through both checks.

## 6. Diagnosis

**Root cause (most likely):** `extractBodies` silently falls through to "entire raw source = body" when it can't find a header/body separator (`index.js:105-108`). For some Exchange / Outlook messages — the observed case is `FR4P281MB3664...`, an Exchange Online hostname — the raw source delivered by `imap-simple` either has a non-standard header/body separator (mixed line endings, extra blank lines) or is actually body-only after IMAP's own parsing has stripped something. The code then treats the whole thing as `text/plain`, and what the user sees (`Schloss Georghausen`, `boundary="_000_..."`) is a **header section masquerading as body**:

- `Schloss Georghausen` is the `Organization:` header (SugarPool's client's Exchange org name).
- `boundary="..."` is the folded continuation of the `Content-Type:` header.

Both fit the pattern of RFC822 headers being stored as body text.

## 7. Ranked hypotheses

**H1 (highest confidence).** `extractBodies` can't find the header/body separator for certain Exchange-delivered messages, falls through the `-1` check, and stores headers-as-body. Trigger: unusual line-ending / header formatting that defeats both `\r\n\r\n` and `\n\n` lookups, or — more insidiously — a case where `\n\n` appears *inside* a folded header block (e.g., a blank line in a header continuation), placing the false header/body boundary mid-header and leaving the real body unparsed.

**H2.** The boundary split produces a non-empty preamble (the Exchange-typical "This is a multi-part message in MIME format." noise, or part headers bleeding backwards in a malformed source). The preamble is recursed into like a real part and, per H1, ends up as body content because it has no valid header/body separator of its own.

**H3.** The outer `Content-Type:` is folded across multiple lines with indentation such that the line-anchored `/^Content-Type:\s*([^\r\n;]+)/im` regex captures only whitespace or an empty value. `contentType` defaults to `"text/plain"`. The multipart branch is skipped entirely. The entire multipart body — with all its boundary markers, child headers, and encoded payloads — is returned as plain text.

H1 is the strongest fit for the specific observed output (organization header + boundary= declaration). H3 would produce longer, messier output (the entire multipart body). H2 is a secondary contributor that can trigger H1 recursively.

## 8. Proposed fix (description, not code)

**Preferred approach — replace the custom parser with `mailparser`:**
`mailparser` (`npm i mailparser`, same ecosystem as `imap-simple`, actively maintained) correctly handles:
- nested multipart walks (multipart/mixed, multipart/alternative, multipart/related)
- `text/plain` vs `text/html` selection (configurable preference)
- all common transfer encodings (base64, quoted-printable)
- charset conversion (including windows-1252, ISO-8859-*, UTF-16)
- header folding and RFC 2047 encoded words
- mixed-CRLF inputs

The change would be localized: replace the `extractBodies(rawSource)` call at `index.js:222` with `await simpleParser(rawSource)`, read `.text` and `.html` off the result. `parseRawHeader` and `decodeMimeWords` could stay for headers or be dropped in favour of `simpleParser`'s pre-parsed header fields. Estimated surface area: ~15–20 lines changed, ~100 lines removable.

**If staying with the hand-rolled parser (minimal patch to stop the bleeding):**
1. **Fail safely when no header separator is found.** When `headerEnd === -1` at `index.js:105`, return `{ bodyPlain: "", bodyHtml: "" }` instead of treating `rawSource` as body. Store an empty body rather than header text. This alone would prevent the observed "boundary=..." leakage.
2. **Anchor the boundary split to line starts.** Change `index.js:119` to split on `/\r?\n--{boundary}(?:\r?\n|--)/` so boundary-like substrings inside content can't cause spurious splits, and the closing marker (`--{boundary}--`) is handled in the same regex.
3. **Discard the preamble.** The first element of the split result is always the preamble by MIME spec — skip it unconditionally rather than recursing into it.
4. **Normalize line endings before parsing.** At the top of `extractBodies`, `rawSource = rawSource.replace(/\r\n/g, "\n")`. Use `\n\n` as the only separator check. Cuts the number of edge-case branches in half.
5. **Unfold folded headers.** Before running the `Content-Type` and `boundary` regexes, unfold continuation lines (regex `\r?\n[ \t]+` → space), mirroring what `parseRawHeader` already does for individual header lookups.

Recommendation: do (1) as a one-line defensive patch tonight if needed for the demo, and schedule the `mailparser` migration for a follow-up PR. (1) stops the user-visible symptom (garbage in the Originalmail pane) at the cost of some messages showing an empty body instead — which is strictly better than the current state.

---

## Appendix — key line references

| What | Where |
|---|---|
| Raw source fetch | `src/poller/index.js:215-216` |
| `extractBodies` call | `src/poller/index.js:222` |
| Header/body split (the failing check) | `src/poller/index.js:98-108` |
| Content-Type regex | `src/poller/index.js:110-111` |
| Multipart boundary regex | `src/poller/index.js:114` |
| Multipart body split | `src/poller/index.js:119` |
| Recursive part walk | `src/poller/index.js:124-129` |
| INSERT into `emails.body` | `src/poller/index.js:242-256` |

---

## Dependency Audit — 2026-04-20

Expansion to scope a `mailparser` migration cleanly.

### 1. Functions defined in `src/poller/index.js`

| Line | Name | Purpose |
|---|---|---|
| 18 | `parseRawHeader(rawSource, name)` | Extract a single RFC822 header value from raw source, with folded-line support. |
| 31 | `decodeMimeWords(str)` | Decode RFC 2047 encoded-words (`=?charset?B/Q?...?=`) in header values. |
| 78 | `stripHtml(html)` | Regex-based HTML-to-text fallback. |
| 96 | `extractBodies(rawSource)` | Recursive custom MIME walker — returns `{ bodyPlain, bodyHtml }`. |
| 190 | `pollInbox()` | The async IMAP polling loop; the only caller of all the above. |

### 2. Exports

`src/poller/index.js` has **no `module.exports`** and no named exports. Every helper is file-private. The file's only side effect is `setInterval(pollInbox, INTERVAL)` at the bottom — it's meant to be run as a process, not imported.

### 3. External importers of the poller

```
$ grep -rn "require.*poller\|from.*poller" src/ --include="*.js"
(no matches)
```

**Nothing else in the codebase imports from the poller.**

### 4. Helper call sites

All internal to `src/poller/index.js`:

| Helper | Called at | Input | Output consumed by |
|---|---|---|---|
| `parseRawHeader` | `:218` | `(rawSource, "From")` | `from` → later `decodeMimeWords(from)` at `:235` → INSERT as `from_address` |
| `parseRawHeader` | `:219` | `(rawSource, "Subject")` | `subject` → `decodeMimeWords(subject)` at `:236` → INSERT as `subject` + used for the message-ID hash at `:225-228` |
| `parseRawHeader` | `:220` | `(rawSource, "Date")` | `dateStr` → used only for the message-ID hash at `:225-228` |
| `extractBodies` | `:222` | `(rawSource)` | `{ bodyPlain, bodyHtml }` → `text = bodyPlain \|\| stripHtml(bodyHtml) \|\| ""` → INSERT as `body` |
| `extractBodies` (recursive) | `:126` | `(part)` | self-recursion inside the multipart branch |
| `stripHtml` | `:223` | `(bodyHtml)` | fallback plain text when no `text/plain` leaf exists |
| `decodeMimeWords` | `:235` | `(from)` | `decodedFrom` → INSERT as `from_address` |
| `decodeMimeWords` | `:236` | `(subject)` | `decodedSubject` → INSERT as `subject` |

### 5. Direct consumers of `rawSource`

Two distinct consumers: `parseRawHeader` (lines 218–220, called three times for `From` / `Subject` / `Date`) and `extractBodies` (line 222, once). `decodeMimeWords` does **not** touch `rawSource` — it only re-runs on the header-value outputs of `parseRawHeader`.

**Implication for the swap:** yes, we still need header extraction — but `mailparser.simpleParser(rawSource)` returns a parsed object with `.from`, `.subject`, `.date` pre-decoded (RFC 2047 handled internally). A clean migration replaces **both** `parseRawHeader` and `decodeMimeWords` calls, not just `extractBodies`. `stripHtml` also becomes redundant — `mailparser` gives `.text` directly.

Net: all four custom helpers become dead code after the swap.

### 6. Downstream dependencies on the `body` column shape

`grep -rn "\.body" src/` results, filtered to actual email-body consumers (HTTP `req.body` excluded):

| File:line | Usage | Shape expected |
|---|---|---|
| `src/workflow/index.js:101` | `{ name: "body", value: (email.body \|\| "").substring(0, 5000) }` as taskSetting for triage agent | string, truncated |
| `src/workflow/index.js:126` | `(email.body \|\| "").substring(0, 5000)` as reply-agent input | string, truncated |
| `src/workflow/index.js:177` | `(email.body \|\| "").substring(0, 5000)` (third consumer) | string, truncated |

All three consumers are defensive (`|| ""`), expect a string, and truncate to 5000. No consumer requires non-null, no one parses structure out of it. **The swap is backward-compatible** as long as we keep writing a plain-text string to `emails.body`.

Also-spotted: `src/api/imap-scan.js` has **its own parallel hand-rolled MIME parser** (`parsePartHeaders` at `:236`, `extractPlainText` at `:265`, `stripHtml` at `:321`, `decodeQuotedPrintable` at `:193`, `decodeByEncoding` at `:212`, `cleanEmailBody` at `:370`). It does **not** share code with the poller. It exports `testImapConnection, scanSentEmails, stripHtml` at `:620` and is the onboarding scan-sent path. The same bug pattern likely exists there — but it's a separate code path and a separate fix.

### 7. `mailparser` in `package.json`

```
$ grep -n "mailparser" package.json
(not listed)
```

Not a dependency. `imap-simple` (`^5.1.0`) is the only mail-related package.

### 8. `mailparser` install check

```
$ node -e "const m = require('mailparser'); console.log(Object.keys(m));"
Error: Cannot find module 'mailparser'
```

Not installed. Needs `npm i mailparser` (~1.3 MB, zero native deps, actively maintained — nodemailer ecosystem).

---

### Scope summary

**Swapping `extractBodies` (and `parseRawHeader`, `decodeMimeWords`, `stripHtml`) to `mailparser.simpleParser` is strictly local to `src/poller/index.js`.**

- Zero external importers of the poller (no `module.exports`, no requires anywhere).
- Three downstream consumers in `src/workflow/index.js` all treat `emails.body` as an opaque plain-text string with `|| ""` defenses and 5000-char truncation — the swap is backward-compatible.
- All four hand-rolled helpers (`parseRawHeader`, `decodeMimeWords`, `stripHtml`, `extractBodies`) become dead code and can be deleted.
- **One new dependency:** `npm i mailparser` (not currently installed).
- **Estimated change:** ~20 lines added inside `pollInbox`, ~160 lines removed (the four helpers). Net negative line count.

**Out of scope for tonight:** `src/api/imap-scan.js` has a parallel hand-rolled MIME parser (`extractPlainText`, `parsePartHeaders`, its own `stripHtml`, etc.) serving the onboarding scan-sent path. It likely has the same bug pattern but is a separate file and a separate task. Flag for follow-up.

**Recommendation:** simple, single-file patch, Sonnet, one commit. Install `mailparser`, replace `pollInbox`'s header + body extraction with `simpleParser`, delete the four dead helpers. No cross-cutting changes.
