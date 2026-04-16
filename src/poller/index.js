require("dotenv").config();
const Imap = require("imap-simple");
const { db } = require("../db");
const crypto = require("crypto");

const config = {
  imap: {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASSWORD,
    host: process.env.IMAP_HOST || "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 10000,
  },
};

function parseRawHeader(rawSource, name) {
  const headerEnd = rawSource.search(/\r?\n\r?\n/);
  const headerSection =
    headerEnd !== -1 ? rawSource.substring(0, headerEnd) : rawSource;
  const regex = new RegExp(
    "^" + name + ":[ \\t]*([^\\r\\n]*(?:\\r?\\n[ \\t]+[^\\r\\n]*)*)",
    "im",
  );
  const match = headerSection.match(regex);
  if (!match) return "";
  return match[1].replace(/\r?\n[ \t]+/g, " ").trim();
}

function decodeMimeWords(str) {
  if (!str || !str.includes("=?")) return str;
  // Collapse whitespace between consecutive encoded words (RFC 2047 §6.2)
  let prev = null;
  while (prev !== str) {
    prev = str;
    str = str.replace(
      /(=\?[^?]+\?[BQbq]\?[^?]*\?=)\s+(=\?[^?]+\?[BQbq]\?[^?]*\?=)/g,
      "$1$2",
    );
  }
  return str.replace(
    /=\?([^?]+)\?([BQbq])\?([^?]*)\?=/g,
    (match, charset, encoding, encoded) => {
      try {
        const cs = charset.toLowerCase().replace(/[^a-z0-9]/g, "");
        let nodeEncoding;
        if (cs === "utf8") {
          nodeEncoding = "utf8";
        } else if (
          cs === "iso88591" ||
          cs === "latin1" ||
          cs === "windows1252"
        ) {
          nodeEncoding = "latin1";
        } else if (cs === "usascii" || cs === "ascii") {
          nodeEncoding = "ascii";
        } else {
          nodeEncoding = "utf8";
        }
        if (encoding.toUpperCase() === "B") {
          return Buffer.from(encoded, "base64").toString(nodeEncoding);
        }
        // Q encoding: _ → space, =XX → byte
        const binaryStr = encoded
          .replace(/_/g, "\x20")
          .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16)),
          );
        return Buffer.from(binaryStr, "binary").toString(nodeEncoding);
      } catch (e) {
        return match;
      }
    },
  );
}

function stripHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractBodies(rawSource) {
  // Find header/body boundary (support both \r\n\r\n and \n\n)
  let headerEnd = rawSource.indexOf("\r\n\r\n");
  let sepLen = 4;
  if (headerEnd === -1) {
    headerEnd = rawSource.indexOf("\n\n");
    sepLen = 2;
  }

  const headerSection =
    headerEnd !== -1 ? rawSource.substring(0, headerEnd) : "";
  const bodySection =
    headerEnd !== -1 ? rawSource.substring(headerEnd + sepLen) : rawSource;

  const ctMatch = headerSection.match(/^Content-Type:\s*([^\r\n;]+)/im);
  const contentType = ctMatch ? ctMatch[1].trim().toLowerCase() : "text/plain";

  if (contentType.startsWith("multipart/")) {
    const boundaryMatch = headerSection.match(/boundary="?([^"\r\n;]+)"?/i);
    if (!boundaryMatch) return { bodyPlain: bodySection.trim(), bodyHtml: "" };

    const boundary = boundaryMatch[1].trim();
    const escapedBoundary = boundary.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = bodySection.split(new RegExp("--" + escapedBoundary));

    let bodyPlain = "";
    let bodyHtml = "";

    for (const part of parts) {
      if (part.trim() === "" || part.trimStart().startsWith("--")) continue;
      const { bodyPlain: p, bodyHtml: h } = extractBodies(part);
      if (p && !bodyPlain) bodyPlain = p;
      if (h && !bodyHtml) bodyHtml = h;
    }

    return { bodyPlain, bodyHtml };
  }

  const charsetMatch = headerSection.match(
    /charset\s*=\s*["']?([^"';\s\r\n]+)/i,
  );
  const rawCharset = charsetMatch ? charsetMatch[1].toLowerCase() : "utf-8";
  // windows-1252 mapped to latin1 — identical except 0x80-0x9F range
  const charset =
    rawCharset === "utf-8" || rawCharset === "utf8"
      ? "utf-8"
      : rawCharset === "iso-8859-1" ||
          rawCharset === "latin1" ||
          rawCharset === "iso8859-1" ||
          rawCharset === "windows-1252" ||
          rawCharset === "cp1252"
        ? "latin1"
        : "utf-8";

  const encMatch = headerSection.match(
    /^Content-Transfer-Encoding:\s*([^\r\n]+)/im,
  );
  const encoding = encMatch ? encMatch[1].trim().toLowerCase() : "7bit";

  let decoded = bodySection;
  if (encoding === "base64") {
    try {
      decoded = Buffer.from(
        decoded.replace(/[\r\n\s]/g, ""),
        "base64",
      ).toString(charset);
    } catch (e) {
      decoded = bodySection;
    }
  } else if (encoding === "quoted-printable") {
    const stripped = decoded.replace(/=\r?\n/g, "");
    const bytes = [];
    let i = 0;
    while (i < stripped.length) {
      if (stripped[i] === "=" && i + 2 < stripped.length) {
        const hex = stripped.substring(i + 1, i + 3);
        if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
          bytes.push(parseInt(hex, 16));
          i += 3;
          continue;
        }
      }
      bytes.push(stripped.charCodeAt(i) & 0xff);
      i++;
    }
    decoded = Buffer.from(bytes).toString(charset);
  }

  if (contentType === "text/plain")
    return { bodyPlain: decoded.trim(), bodyHtml: "" };
  if (contentType === "text/html") return { bodyPlain: "", bodyHtml: decoded };
  return { bodyPlain: decoded.trim(), bodyHtml: "" };
}

async function pollInbox() {
  let connection;
  try {
    console.log("[poller] Connecting to IMAP...");
    connection = await Imap.connect(config);
    await connection.openBox("INBOX");

    const since = new Date();
    since.setDate(since.getDate() - 1);

    const searchCriteria = ["UNSEEN", ["SINCE", since]];
    const fetchOptions = {
      bodies: [""],
      markSeen: false,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log("[poller] Found " + messages.length + " new messages");

    let processed = 0,
      skipped = 0;

    for (const msg of messages) {
      let subject = "unknown";
      try {
        const fullPart = msg.parts.find((p) => p.which === "");
        const rawSource = fullPart?.body || "";

        const from = parseRawHeader(rawSource, "From");
        subject = parseRawHeader(rawSource, "Subject") || "(no subject)";
        const dateStr = parseRawHeader(rawSource, "Date");

        const { bodyPlain, bodyHtml } = extractBodies(rawSource);
        const text = bodyPlain || stripHtml(bodyHtml) || "";

        const messageId = crypto
          .createHash("sha256")
          .update(from + subject + dateStr)
          .digest("hex");

        const existing = db
          .prepare("SELECT id FROM emails WHERE message_id = ?")
          .get(messageId);
        if (existing) continue;

        const decodedFrom = decodeMimeWords(from);
        const decodedSubject = decodeMimeWords(subject);

        const tenant = db.prepare("SELECT id FROM tenants LIMIT 1").get();
        if (!tenant) continue;

        const emailId = crypto.randomUUID();
        db.prepare(
          `
          INSERT INTO emails (id, tenant_id, message_id, from_address, subject, body, received_at, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        ).run(
          emailId,
          tenant.id,
          messageId,
          decodedFrom,
          decodedSubject,
          text.substring(0, 5000),
          Math.floor(Date.now() / 1000),
          "pending",
        );

        console.log("[poller] Saved: " + decodedSubject);
        processed++;
      } catch (msgErr) {
        console.error(
          "[poller] Skipped message (subject: " +
            subject +
            "): " +
            msgErr.message,
        );
        skipped++;
      }
    }

    console.log(
      "[poller] Processed " + processed + " messages, " + skipped + " skipped",
    );

    connection.end();
  } catch (err) {
    console.error("[poller] Error:", err.message);
    if (connection)
      try {
        connection.end();
      } catch (e) {}
  }
}

const INTERVAL = parseInt(process.env.POLL_INTERVAL_MS || "180000");
console.log("[poller] Starting, interval: " + INTERVAL + "ms");
pollInbox();
setInterval(pollInbox, INTERVAL);
