const imapSimple = require("imap-simple");

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SENT_FOLDER_CANDIDATES = [
  "[Gmail]/Sent Mail",
  "Sent",
  "Sent Items",
  "Sent Messages",
  "Gesendet",
  "INBOX.Sent",
  "INBOX.Sent Items",
  "INBOX.Gesendet",
  "[Gmail]/Gesendet",
];

const CONNECTION_TIMEOUT_MS = 30000;
const MAX_BODY_LENGTH = 5000;
const INITIAL_LOOKBACK_DAYS = 30;
const EXTENDED_LOOKBACK_DAYS = 365;
const MIN_DIVERSE_EMAILS = 5;
const INITIAL_FETCH_LIMIT = 100;
const FINAL_CAP = 10;
const MAX_PER_RECIPIENT = 5;
const MIN_EMAILS_AFTER_FILTER = 5;

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function buildImapConfig(config) {
  return {
    imap: {
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port || 993,
      tls: config.tls !== false,
      tlsOptions: {
        servername: config.host,
      },
      authTimeout: CONNECTION_TIMEOUT_MS,
    },
  };
}

// ---------------------------------------------------------------------------
// Mailbox detection
// ---------------------------------------------------------------------------

function flattenBoxes(boxes, prefix, delimiter) {
  const result = [];
  for (const name of Object.keys(boxes)) {
    const box = boxes[name];
    const sep = delimiter || box.delimiter || "/";
    const fullPath = prefix ? prefix + sep + name : name;
    result.push({ path: fullPath, attribs: box.attribs || [] });
    if (box.children) {
      result.push(...flattenBoxes(box.children, fullPath, sep));
    }
  }
  return result;
}

function detectSentFolder(boxes) {
  const flat = flattenBoxes(boxes);

  // Strategy 1: \Sent special-use flag (RFC 6154) — most reliable
  for (const box of flat) {
    if (box.attribs && box.attribs.some((a) => a.toLowerCase() === "\\sent")) {
      console.log(
        "[imap-scan] Detected Sent folder via \\Sent flag: " + box.path,
      );
      return box.path;
    }
  }

  // Strategy 2: name matching (case-insensitive)
  const pathMap = new Map(flat.map((b) => [b.path.toLowerCase(), b.path]));
  for (const candidate of SENT_FOLDER_CANDIDATES) {
    const match = pathMap.get(candidate.toLowerCase());
    if (match) {
      console.log("[imap-scan] Detected Sent folder via name match: " + match);
      return match;
    }
  }

  console.log(
    "[imap-scan] Could not detect Sent folder. Available: " +
      flat.map((b) => b.path).join(", "),
  );
  return null;
}

// ---------------------------------------------------------------------------
// Header helpers
// ---------------------------------------------------------------------------

/**
 * Extract a value from imap-simple's parsed header object.
 * imap-simple parses HEADER body parts via Imap.parseHeader() into
 * { field: [value, ...] } objects.
 */
function getHeaderValue(headers, field) {
  if (!headers || typeof headers !== "object") return "";
  const values = headers[field.toLowerCase()];
  return values && values.length > 0 ? values[0] : "";
}

function extractEmailAddresses(headerValue) {
  if (!headerValue) return [];
  const matches = headerValue.match(/[\w.+\-]+@[\w.\-]+/g);
  return matches || [];
}

// ---------------------------------------------------------------------------
// Subject helpers
// ---------------------------------------------------------------------------

function normalizeSubject(subject) {
  return subject.replace(/^(\s*(Re|Fwd|AW|WG)\s*:\s*)+/i, "").trim();
}

function isForwarded(subject) {
  return /^\s*(Fwd|WG|Wg)\s*:/i.test(subject);
}

// ---------------------------------------------------------------------------
// Diversity filters
// ---------------------------------------------------------------------------

function filterForwarded(emails) {
  return emails.filter((e) => !isForwarded(e.subject));
}

function filterSelfSent(emails, userEmail) {
  const normalized = userEmail.toLowerCase();
  return emails.filter((e) => {
    const allRecipients = [...e.toAddresses, ...e.ccAddresses];
    if (allRecipients.length === 0) return true;
    const others = allRecipients.filter(
      (addr) => addr.toLowerCase() !== normalized,
    );
    return others.length > 0;
  });
}

function deduplicateBySubject(emails) {
  const seen = new Set();
  return emails.filter((e) => {
    const subjectKey = (e.subject || "").trim().toLowerCase();
    const recipientKey = (e.toAddresses[0] || "").toLowerCase();
    const key = subjectKey + "|" + recipientKey;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function deduplicateByRecipient(emails, maxPerRecipient) {
  const counts = new Map();
  return emails.filter((e) => {
    const recipients = e.toAddresses.map((a) => a.toLowerCase());
    if (recipients.some((r) => (counts.get(r) || 0) >= maxPerRecipient))
      return false;
    for (const r of recipients) {
      counts.set(r, (counts.get(r) || 0) + 1);
    }
    return true;
  });
}

// ---------------------------------------------------------------------------
// Content decoding
// ---------------------------------------------------------------------------

function normalizeCharset(charset) {
  if (!charset) return "utf-8";
  const lower = charset.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (lower === "utf8") return "utf-8";
  if (lower === "iso88591" || lower === "latin1") return "latin1";
  if (lower === "windows1252" || lower === "cp1252") return "latin1";
  return "utf-8";
}

/**
 * Decode quoted-printable via Buffer for correct UTF-8 handling.
 * Uses byte-array accumulation (not per-byte String.fromCharCode)
 * to preserve multi-byte UTF-8 sequences.
 */
function decodeQuotedPrintable(text) {
  const joined = text.replace(/=\r?\n/g, "");
  const bytes = [];
  let i = 0;
  while (i < joined.length) {
    if (joined[i] === "=" && i + 2 < joined.length) {
      const hex = joined.substring(i + 1, i + 3);
      if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
        bytes.push(parseInt(hex, 16));
        i += 3;
        continue;
      }
    }
    bytes.push(joined.charCodeAt(i));
    i++;
  }
  return Buffer.from(bytes).toString("utf-8");
}

function decodeByEncoding(body, transferEncoding, contentType) {
  const lowerTE = (transferEncoding || "").toLowerCase();
  const lowerCT = (contentType || "").toLowerCase();

  if (lowerTE.includes("quoted-printable")) {
    return decodeQuotedPrintable(body);
  }
  if (lowerTE.includes("base64")) {
    try {
      const cleaned = body.replace(/[\r\n\s]/g, "");
      const charsetMatch = lowerCT.match(/charset="?([^";\s]+)"?/i);
      const charset = normalizeCharset(charsetMatch ? charsetMatch[1] : null);
      return Buffer.from(cleaned, "base64").toString(charset);
    } catch (_) {
      return body;
    }
  }
  return body;
}

/**
 * Parse Content-Type and Content-Transfer-Encoding from a raw MIME
 * part header block (the text before \r\n\r\n within a multipart part).
 */
function parsePartHeaders(partText) {
  const headerEnd = partText.indexOf("\r\n\r\n");
  const altEnd = partText.indexOf("\n\n");
  const end = headerEnd !== -1 ? headerEnd : altEnd;
  const sep = headerEnd !== -1 ? 4 : 2;

  if (end === -1) {
    return { contentType: "", transferEncoding: "", body: partText };
  }

  const headersRaw = partText.slice(0, end);
  const body = partText.slice(end + sep);

  const ctMatch = headersRaw.match(/content-type:\s*(.+(?:\r?\n[ \t]+.+)*)/i);
  const cteMatch = headersRaw.match(/content-transfer-encoding:\s*(.+)/i);

  return {
    contentType: ctMatch ? ctMatch[1].replace(/\r?\n[ \t]+/g, " ").trim() : "",
    transferEncoding: cteMatch ? cteMatch[1].trim() : "",
    body: body,
  };
}

/**
 * Extract plain text from a message body.
 *
 * @param textBody  The TEXT body part from imap-simple (raw string)
 * @param parsedHeaders  The HEADER body part from imap-simple (parsed object)
 */
function extractPlainText(textBody, parsedHeaders) {
  const contentType = getHeaderValue(parsedHeaders, "content-type");
  const transferEncoding = getHeaderValue(
    parsedHeaders,
    "content-transfer-encoding",
  );
  const ctLower = contentType.toLowerCase();

  // Check for multipart
  const boundaryMatch = ctLower.match(/boundary="?([^";\s]+)"?/i);

  if (!boundaryMatch) {
    // Single-part message
    const decoded = decodeByEncoding(textBody, transferEncoding, contentType);
    if (ctLower.includes("text/html")) {
      return stripHtml(decoded);
    }
    return decoded;
  }

  // Multipart — split by boundary and find text/plain
  const boundary = boundaryMatch[1].trim();
  const mimeParts = textBody.split("--" + boundary);

  for (const rawPart of mimeParts) {
    const parsed = parsePartHeaders(rawPart);
    if (parsed.contentType.toLowerCase().includes("text/plain")) {
      return decodeByEncoding(
        parsed.body,
        parsed.transferEncoding,
        parsed.contentType,
      );
    }
  }

  // No text/plain — fall back to text/html
  for (const rawPart of mimeParts) {
    const parsed = parsePartHeaders(rawPart);
    if (parsed.contentType.toLowerCase().includes("text/html")) {
      return stripHtml(
        decodeByEncoding(
          parsed.body,
          parsed.transferEncoding,
          parsed.contentType,
        ),
      );
    }
  }

  return textBody;
}

// ---------------------------------------------------------------------------
// Body cleaning
// ---------------------------------------------------------------------------

function stripHtml(text) {
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripQuotedReplies(text) {
  const markerIndex = text.search(/^(On .+ wrote:|Am .+ schrieb\b.*:)/im);
  const beforeMarker = markerIndex === -1 ? text : text.slice(0, markerIndex);
  const lines = beforeMarker.split("\n");
  return lines
    .filter((line) => !/^\s*>/.test(line))
    .join("\n")
    .trim();
}

function stripSignature(text) {
  const lines = text.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const trimmed = lines[i].trimEnd();
    if (trimmed === "--" || trimmed === "-- ") {
      return lines.slice(0, i).join("\n").trim();
    }
  }
  return text.trim();
}

function extractSignature(text) {
  const lines = text.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const trimmed = lines[i].trimEnd();
    if (trimmed === "--" || trimmed === "-- ") {
      const sig = lines
        .slice(i + 1)
        .join("\n")
        .trim();
      return sig.length > 0 ? sig : null;
    }
  }
  return null;
}

function cleanEmailBody(raw) {
  const noHtml = stripHtml(raw);
  const noQuotes = stripQuotedReplies(noHtml);
  const noSig = stripSignature(noQuotes);
  const trimmed = noSig.replace(/\n{3,}/g, "\n\n").trim();
  return trimmed.length > MAX_BODY_LENGTH
    ? trimmed.slice(0, MAX_BODY_LENGTH)
    : trimmed;
}

// ---------------------------------------------------------------------------
// Error formatting
// ---------------------------------------------------------------------------

function formatImapError(context, err) {
  if (!(err instanceof Error)) {
    return context + ": " + String(err);
  }
  const parts = [context];
  if (err.responseStatus) parts.push("[" + err.responseStatus + "]");
  if (err.responseText) {
    parts.push(err.responseText);
  } else {
    parts.push(err.message);
  }
  if (err.code) parts.push("(code: " + err.code + ")");
  return parts.join(" — ");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Test IMAP connection and detect the Sent folder.
 * Credentials are used only for this check and are NOT stored.
 */
async function testImapConnection(config) {
  let connection;
  try {
    connection = await imapSimple.connect(buildImapConfig(config));
  } catch (err) {
    return {
      success: false,
      error: formatImapError("Connection failed", err),
    };
  }

  try {
    const boxes = await connection.getBoxes();
    const sentFolder = detectSentFolder(boxes);
    if (!sentFolder) {
      return {
        success: false,
        error: "Could not find Sent folder on this IMAP account",
      };
    }
    return { success: true, folder: sentFolder };
  } catch (err) {
    return {
      success: false,
      error: formatImapError("Connection test failed", err),
    };
  } finally {
    try {
      connection.end();
    } catch (_) {
      // Ignore logout errors
    }
  }
}

/**
 * Connect to IMAP, find the Sent folder, and fetch diverse
 * representative emails for tone analysis.
 *
 * Applies diversity filters (forwarded, self-sent, subject dedup,
 * recipient dedup) to avoid one thread or one recipient dominating
 * the sample.
 */
async function scanSentEmails(config) {
  const connection = await imapSimple.connect(buildImapConfig(config));

  try {
    const boxes = await connection.getBoxes();
    const sentFolder = detectSentFolder(boxes);
    if (!sentFolder) {
      throw new Error("Could not find Sent folder on this IMAP account");
    }

    console.log("[imap-scan] Opening Sent folder: " + sentFolder);
    await connection.openBox(sentFolder);

    const fetchOptions = {
      bodies: ["HEADER", "TEXT"],
      markSeen: false,
    };

    // First pass: 30 days
    let sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - INITIAL_LOOKBACK_DAYS);

    let messages = await connection.search(
      [["SINCE", sinceDate]],
      fetchOptions,
    );
    console.log(
      "[imap-scan] Initial search (" +
        INITIAL_LOOKBACK_DAYS +
        " days) returned " +
        messages.length +
        " messages",
    );

    // Expand to 365 days if too few results
    if (messages.length < MIN_DIVERSE_EMAILS) {
      sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - EXTENDED_LOOKBACK_DAYS);
      messages = await connection.search([["SINCE", sinceDate]], fetchOptions);
      console.log(
        "[imap-scan] Extended search (" +
          EXTENDED_LOOKBACK_DAYS +
          " days) returned " +
          messages.length +
          " messages",
      );
    }

    // Sort by date descending (most recent first), cap at initial limit
    messages.sort(
      (a, b) =>
        new Date(b.attributes.date).getTime() -
        new Date(a.attributes.date).getTime(),
    );
    messages = messages.slice(0, INITIAL_FETCH_LIMIT);

    // Parse headers and build envelope data for filtering
    const envelopes = messages.map((msg) => {
      const headerPart = msg.parts.find((p) => p.which === "HEADER") || {};
      const headers =
        typeof headerPart.body === "object" && headerPart.body !== null
          ? headerPart.body
          : {};
      const textPart = msg.parts.find((p) => p.which === "TEXT") || {};

      return {
        subject: getHeaderValue(headers, "subject") || "(no subject)",
        date:
          getHeaderValue(headers, "date") ||
          (msg.attributes.date
            ? msg.attributes.date.toISOString()
            : new Date().toISOString()),
        toAddresses: extractEmailAddresses(getHeaderValue(headers, "to")),
        ccAddresses: extractEmailAddresses(getHeaderValue(headers, "cc")),
        headers: headers,
        textBody:
          typeof textPart.body === "string"
            ? textPart.body
            : String(textPart.body || ""),
      };
    });

    // Apply diversity filters with per-stage logging
    const afterForwarded = filterForwarded(envelopes);
    console.log(
      "[imap-scan] After filterForwarded: " +
        envelopes.length +
        " → " +
        afterForwarded.length,
    );

    const afterSelfSent = filterSelfSent(afterForwarded, config.user);
    console.log(
      "[imap-scan] After filterSelfSent: " +
        afterForwarded.length +
        " → " +
        afterSelfSent.length,
    );

    const afterSubject = deduplicateBySubject(afterSelfSent);
    console.log(
      "[imap-scan] After deduplicateBySubject: " +
        afterSelfSent.length +
        " → " +
        afterSubject.length,
    );

    const afterRecipient = deduplicateByRecipient(
      afterSubject,
      MAX_PER_RECIPIENT,
    );
    console.log(
      "[imap-scan] After deduplicateByRecipient: " +
        afterSubject.length +
        " → " +
        afterRecipient.length,
    );

    let filtered = afterRecipient;
    if (afterRecipient.length < MIN_EMAILS_AFTER_FILTER) {
      filtered = filterSelfSent(envelopes, config.user);
      console.log(
        "[imap-scan] Fallback triggered: using pre-filter set (" +
          filtered.length +
          " emails)",
      );
    }

    // Cap at final limit
    const selected = filtered.slice(0, FINAL_CAP);

    // Process bodies and detect signature
    const emails = [];
    let detectedSignature = null;

    for (const info of selected) {
      const plainText = extractPlainText(info.textBody, info.headers);

      if (detectedSignature === null) {
        const noHtml = stripHtml(plainText);
        const noQuotes = stripQuotedReplies(noHtml);
        detectedSignature = extractSignature(noQuotes);
      }

      emails.push({
        subject: info.subject,
        body: cleanEmailBody(plainText),
        date: info.date,
      });
    }

    return { emails, detectedSignature };
  } catch (err) {
    const wrapped = new Error(formatImapError("IMAP scan failed", err));
    wrapped.cause = err;
    throw wrapped;
  } finally {
    try {
      connection.end();
    } catch (_) {
      // Ignore logout errors
    }
  }
}

module.exports = { testImapConnection, scanSentEmails, stripHtml };
