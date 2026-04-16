require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const https = require("https");
const { initDb, db } = require("../db");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const http = require("http");
const dns = require("dns");
const net = require("net");
const { encrypt } = require("./crypto");
const {
  testImapConnection,
  scanSentEmails,
  stripHtml,
} = require("./imap-scan");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/emails", require("./routes/emails"));

// ---------------------------------------------------------------------------
// Onboarding helpers
// ---------------------------------------------------------------------------

// SITEWARE_TONE_AGENT_ID: the "SiteFlow Tone Analyzer" Siteware agent.
// The agent must be individually allowlisted for the API key —
// the "Alle Assistenten erlaubt" checkbox does NOT work.
const TONE_AGENT_ID = process.env.SITEWARE_TONE_AGENT_ID;

function requireAuth(req, res, next) {
  const sessionId = req.cookies?.session;
  if (!sessionId) return res.status(401).json({ error: "Not authenticated" });
  const now = Math.floor(Date.now() / 1000);
  const session = db
    .prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > ?")
    .get(sessionId, now);
  if (!session) return res.status(401).json({ error: "Session expired" });
  const tenant = db
    .prepare("SELECT * FROM tenants WHERE id = ?")
    .get(session.tenant_id);
  if (!tenant) return res.status(401).json({ error: "Tenant not found" });
  req.tenant = tenant;
  next();
}

function isPrivateIp(ip) {
  if (net.isIPv6(ip)) return true;
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4) return true;
  if (parts[0] === 0) return true;
  if (parts[0] === 10) return true;
  if (parts[0] === 127) return true;
  if (parts[0] === 169 && parts[1] === 254) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  return false;
}

async function assertPublicUrl(url) {
  const parsed = new URL(url);
  const hostname = parsed.hostname.replace(/^\[|\]$/g, "");

  if (/^(localhost|0\.0\.0\.0)$/i.test(hostname)) {
    throw new Error("URL targets a private address");
  }

  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) throw new Error("URL targets a private address");
    return;
  }

  const { address } = await dns.promises.lookup(hostname);
  if (isPrivateIp(address)) {
    throw new Error("URL targets a private address");
  }
}

async function fetchUrl(url, redirectCount) {
  redirectCount = redirectCount || 0;
  if (redirectCount > 5) throw new Error("Too many redirects");

  await assertPublicUrl(url);

  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { timeout: 10000 }, (res) => {
      if (
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith("/")) {
          const base = new URL(url);
          redirectUrl = base.origin + redirectUrl;
        }
        res.resume();
        fetchUrl(redirectUrl, redirectCount + 1)
          .then(resolve)
          .catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error("HTTP " + res.statusCode));
        return;
      }
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve(body));
    });
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out"));
    });
  });
}

function sitewarePost(apiPath, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: "api.siteware.io",
        path: apiPath,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let buf = "";
        res.on("data", (c) => (buf += c));
        res.on("end", () => {
          try {
            resolve({
              status: res.statusCode,
              json: JSON.parse(buf),
              raw: buf,
            });
          } catch (_) {
            resolve({ status: res.statusCode, json: null, raw: buf });
          }
        });
      },
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function stripMarkdownFences(text) {
  const trimmed = String(text).trim();
  const match = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
  return match ? match[1].trim() : trimmed;
}

app.use("/api/onboarding", requireAuth);

// ---------------------------------------------------------------------------
// Onboarding routes: test-connection, scan-sent, scrape-website,
//                    analyze-tone, save-tenant
// ---------------------------------------------------------------------------

app.post("/api/onboarding/test-connection", async (req, res) => {
  const body = req.body || {};
  const errors = [];
  if (typeof body.imapHost !== "string" || body.imapHost === "")
    errors.push('"imapHost" must be a non-empty string');
  if (typeof body.imapPort !== "number" || !Number.isFinite(body.imapPort))
    errors.push('"imapPort" must be a number');
  if (typeof body.email !== "string" || body.email === "")
    errors.push('"email" must be a non-empty string');
  if (typeof body.password !== "string" || body.password === "")
    errors.push('"password" must be a non-empty string');

  if (errors.length > 0) {
    res.status(422).json({ error: errors.join("; ") });
    return;
  }

  try {
    const result = await testImapConnection({
      host: body.imapHost,
      port: body.imapPort,
      user: body.email,
      password: body.password,
      tls: true,
    });

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }
    res.json({ success: true, folder: result.folder });
  } catch (err) {
    console.error("[onboarding] test-connection error:", err);
    res.status(500).json({ success: false, error: "Connection test failed" });
  }
});

app.post("/api/onboarding/scan-sent", async (req, res) => {
  const body = req.body || {};
  const errors = [];
  if (typeof body.imapHost !== "string" || body.imapHost === "")
    errors.push('"imapHost" must be a non-empty string');
  if (typeof body.imapPort !== "number" || !Number.isFinite(body.imapPort))
    errors.push('"imapPort" must be a number');
  if (typeof body.email !== "string" || body.email === "")
    errors.push('"email" must be a non-empty string');
  if (typeof body.password !== "string" || body.password === "")
    errors.push('"password" must be a non-empty string');

  if (errors.length > 0) {
    res.status(422).json({ error: errors.join("; ") });
    return;
  }

  try {
    const result = await scanSentEmails({
      host: body.imapHost,
      port: body.imapPort,
      user: body.email,
      password: body.password,
      tls: true,
    });

    res.json({
      success: true,
      emails: result.emails,
      detectedSignature: result.detectedSignature,
      emailCount: result.emails.length,
    });
  } catch (err) {
    console.error("[onboarding] scan-sent error:", err);
    res.status(500).json({ success: false, error: "Scan failed" });
  }
});

app.post("/api/onboarding/scrape-website", async (req, res) => {
  const body = req.body || {};
  if (typeof body.url !== "string" || body.url.trim() === "") {
    res.status(422).json({ error: '"url" must be a non-empty string' });
    return;
  }

  let parsed;
  try {
    parsed = new URL(body.url.trim());
  } catch (_) {
    res.status(422).json({ error: '"url" is not a valid URL' });
    return;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    res.status(422).json({ error: '"url" must use http or https protocol' });
    return;
  }

  try {
    const html = await fetchUrl(parsed.href);
    const descMeta =
      (html.match(
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
      ) || [])[1] || "";
    const kwMeta =
      (html.match(
        /<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']+)["']/i,
      ) || [])[1] || "";
    const keywords = kwMeta
      ? kwMeta
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : [];
    const rawText = stripHtml(html).replace(/\s+/g, " ").trim().slice(0, 2000);
    const description = descMeta || rawText.slice(0, 200);

    res.json({ success: true, description, keywords, rawText });
  } catch (err) {
    console.error("[onboarding] scrape-website error:", err);
    res.status(500).json({ error: "Website scrape failed" });
  }
});

app.post("/api/onboarding/analyze-tone", async (req, res) => {
  if (!TONE_AGENT_ID) {
    res.status(503).json({ error: "SITEWARE_TONE_AGENT_ID not configured" });
    return;
  }

  const body = req.body || {};
  const errors = [];
  if (!Array.isArray(body.sentEmails)) {
    errors.push('"sentEmails" must be an array');
  } else if (body.sentEmails.length === 0) {
    errors.push('"sentEmails" must contain at least one email');
  } else {
    for (let i = 0; i < Math.min(body.sentEmails.length, 20); i++) {
      const email = body.sentEmails[i];
      if (typeof email !== "object" || email === null) {
        errors.push('"sentEmails[' + i + ']" must be an object');
      } else {
        if (typeof email.subject !== "string")
          errors.push('"sentEmails[' + i + '].subject" must be a string');
        if (typeof email.body !== "string")
          errors.push('"sentEmails[' + i + '].body" must be a string');
      }
    }
  }
  if (
    body.websiteContent !== null &&
    body.websiteContent !== undefined &&
    typeof body.websiteContent !== "string"
  ) {
    errors.push('"websiteContent" must be a string or null');
  }

  if (errors.length > 0) {
    res.status(422).json({ error: errors.join("; ") });
    return;
  }

  const sentEmails = body.sentEmails.slice(0, 20);
  const websiteContent =
    typeof body.websiteContent === "string" ? body.websiteContent : "";

  const emailsText = sentEmails
    .map((e) => "Subject: " + e.subject + "\n\n" + e.body)
    .join("\n\n---\n\n");

  const token =
    process.env.SITEWARE_TRIAGE_TOKEN || process.env.SITEWARE_API_TOKEN;
  if (!token) {
    res.status(503).json({ error: "SITEWARE_TRIAGE_TOKEN not configured" });
    return;
  }

  try {
    const result = await sitewarePost(
      "/v1/api/completion/" + TONE_AGENT_ID,
      {
        taskSettings: [
          { name: "input_sentemails", value: emailsText },
          { name: "input_websitecontent", value: websiteContent },
          { name: "input_industry", value: "" },
        ],
        stream: false,
      },
      token,
    );

    if (result.status !== 200) {
      res
        .status(502)
        .json({ error: "Siteware API error: HTTP " + result.status });
      return;
    }

    const answerRaw = result.json && result.json.answer;
    if (!answerRaw) {
      res.status(502).json({ error: "Siteware API returned no answer field" });
      return;
    }

    const cleaned = stripMarkdownFences(answerRaw);
    let profile;
    try {
      profile = JSON.parse(cleaned);
    } catch (_) {
      res
        .status(502)
        .json({ error: "Tone analysis returned invalid response" });
      return;
    }

    res.json({ success: true, profile });
  } catch (err) {
    console.error("[onboarding] analyze-tone error:", err);
    res.status(500).json({ error: "Tone analysis failed" });
  }
});

app.post("/api/onboarding/save-tenant", async (req, res) => {
  const body = req.body || {};
  const errors = [];

  if (typeof body.credentials !== "object" || body.credentials === null) {
    errors.push('"credentials" must be an object');
  } else {
    const creds = body.credentials;
    if (typeof creds.email !== "string" || creds.email === "")
      errors.push('"credentials.email" is required');
    if (typeof creds.password !== "string" || creds.password === "")
      errors.push('"credentials.password" is required');
    if (typeof creds.imapHost !== "string")
      errors.push('"credentials.imapHost" is required');
    if (typeof creds.smtpHost !== "string")
      errors.push('"credentials.smtpHost" is required');
  }

  if (errors.length > 0) {
    res.status(422).json({ error: errors.join("; ") });
    return;
  }

  const creds = body.credentials;
  const tenantId = crypto.randomUUID();
  const toneProfile = body.toneProfile
    ? JSON.stringify(body.toneProfile)
    : null;
  const imapPort = typeof creds.imapPort === "number" ? creds.imapPort : 993;
  const smtpPort = typeof creds.smtpPort === "number" ? creds.smtpPort : 465;

  try {
    const encImapPass = encrypt(creds.password);
    const encSmtpPass = encrypt(creds.password);

    db.prepare(
      `INSERT INTO tenants (id, email, imap_host, imap_user, imap_password_enc,
         smtp_host, smtp_user, smtp_password_enc, tone_profile, imap_port, smtp_port)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         imap_host = excluded.imap_host,
         imap_user = excluded.imap_user,
         imap_password_enc = excluded.imap_password_enc,
         smtp_host = excluded.smtp_host,
         smtp_user = excluded.smtp_user,
         smtp_password_enc = excluded.smtp_password_enc,
         tone_profile = COALESCE(excluded.tone_profile, tenants.tone_profile),
         imap_port = excluded.imap_port,
         smtp_port = excluded.smtp_port`,
    ).run(
      tenantId,
      creds.email,
      creds.imapHost,
      creds.email,
      encImapPass,
      creds.smtpHost,
      creds.email,
      encSmtpPass,
      toneProfile,
      imapPort,
      smtpPort,
    );

    // Get the actual tenant ID (may differ if email already existed)
    const row = db
      .prepare("SELECT id FROM tenants WHERE email = ?")
      .get(creds.email);

    res.json({ success: true, tenantId: row.id });
  } catch (err) {
    console.error("[onboarding] save-tenant error:", err);
    res.status(500).json({ error: "Save failed" });
  }
});

app.use(express.static(path.join(__dirname, "../../public")));

app.get("/api/health", async (req, res) => {
  const checks = {};

  // DB check
  try {
    const row = db
      .prepare("SELECT MAX(created_at) as last_email FROM emails")
      .get();
    checks.db = "ok";
    checks.poller =
      row && row.last_email
        ? new Date(row.last_email * 1000).toISOString()
        : null;
  } catch (err) {
    checks.db = "error";
    checks.poller = null;
  }

  // Error count
  try {
    const row = db
      .prepare("SELECT COUNT(*) as c FROM emails WHERE status = 'error'")
      .get();
    checks.error_count = row ? row.c : 0;
  } catch (err) {
    checks.error_count = null;
  }

  // Siteware token check
  const token =
    process.env.SITEWARE_TRIAGE_TOKEN || process.env.SITEWARE_API_TOKEN;
  if (!token) {
    checks.siteware_token = "not_configured";
  } else {
    checks.siteware_token = await new Promise((resolve) => {
      const timer = setTimeout(() => {
        req_sw.destroy();
        resolve("timeout");
      }, 3000);

      const req_sw = https.request(
        {
          hostname: "api.siteware.io",
          path: "/v1/api/agents",
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        },
        (resp) => {
          clearTimeout(timer);
          resp.resume();
          resolve(resp.statusCode === 200 ? "valid" : "invalid");
        },
      );
      req_sw.on("error", () => {
        clearTimeout(timer);
        resolve("invalid");
      });
      req_sw.end();
    });
  }

  const status =
    checks.db === "error"
      ? "down"
      : checks.siteware_token === "valid" ||
          checks.siteware_token === "not_configured"
        ? "ok"
        : "degraded";
  res
    .status(status === "down" ? 500 : 200)
    .json({ status, checks, time: new Date().toISOString() });
});

app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

const PORT = process.env.PORT || 3000;

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log("[server] Running on port " + PORT);
  });
}

start().catch((err) => {
  console.error("[server] Failed to start:", err);
  process.exit(1);
});

module.exports = app;
