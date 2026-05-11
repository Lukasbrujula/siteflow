const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { db } = require("../../db");
const { encrypt } = require("../crypto");
const { testImapConnection } = require("../imap-scan");

const INBOX_PUBLIC_COLUMNS =
  "id, tenant_id, email, label, imap_host, imap_port, imap_user, " +
  "smtp_host, smtp_port, smtp_user, is_active, last_polled_at, " +
  "last_poll_error, created_at";

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

router.get("/", requireAuth, (req, res) => {
  try {
    const inboxes = db
      .prepare(
        "SELECT " +
          INBOX_PUBLIC_COLUMNS +
          " FROM inboxes WHERE tenant_id = ? ORDER BY created_at ASC",
      )
      .all(req.tenant.id);
    res.json({ inboxes });
  } catch (err) {
    console.error("[inboxes] list error:", err);
    res.status(500).json({ error: "Failed to fetch inboxes" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const body = req.body || {};
  const errors = [];
  if (typeof body.email !== "string" || body.email.trim() === "")
    errors.push('"email" must be a non-empty string');
  if (typeof body.password !== "string" || body.password === "")
    errors.push('"password" must be a non-empty string');
  if (typeof body.imapHost !== "string" || body.imapHost.trim() === "")
    errors.push('"imapHost" must be a non-empty string');
  if (typeof body.smtpHost !== "string" || body.smtpHost.trim() === "")
    errors.push('"smtpHost" must be a non-empty string');
  if (
    body.imapPort !== undefined &&
    (typeof body.imapPort !== "number" || !Number.isFinite(body.imapPort))
  )
    errors.push('"imapPort" must be a number');
  if (
    body.smtpPort !== undefined &&
    (typeof body.smtpPort !== "number" || !Number.isFinite(body.smtpPort))
  )
    errors.push('"smtpPort" must be a number');
  if (body.label !== undefined && typeof body.label !== "string")
    errors.push('"label" must be a string');

  if (errors.length > 0) {
    return res.status(422).json({ error: errors.join("; ") });
  }

  // Per add-inbox audit (question H): downstream tone/reply work needs the
  // tenant's Siteware token. Refuse to attach an inbox the tenant cannot use.
  if (!req.tenant.siteware_token) {
    return res.status(412).json({
      error: "Siteware-Zugangsdaten fehlen. Bitte Onboarding abschliessen.",
    });
  }

  const email = body.email.trim();
  const imapHost = body.imapHost.trim();
  const smtpHost = body.smtpHost.trim();
  const imapPort = typeof body.imapPort === "number" ? body.imapPort : 993;
  const smtpPort = typeof body.smtpPort === "number" ? body.smtpPort : 465;
  const label =
    typeof body.label === "string" && body.label.trim() !== ""
      ? body.label.trim()
      : email.split("@")[0] || "inbox";

  // Pre-flight UNIQUE(tenant_id, email) — caller gets a clean 409 instead of
  // SQLITE_CONSTRAINT_UNIQUE bubbling up as 500. There is still a small race
  // between this check and the INSERT; the UNIQUE index is the real guard.
  const existing = db
    .prepare(
      "SELECT id FROM inboxes WHERE tenant_id = ? AND lower(email) = lower(?)",
    )
    .get(req.tenant.id, email);
  if (existing) {
    return res.status(409).json({
      error: "An inbox with this email already exists for this tenant",
      code: "DUPLICATE_EMAIL",
    });
  }

  // Server-side IMAP test before persisting — mirrors the wizard's
  // /api/onboarding/test-connection path (server.js:244-279) so the user
  // cannot save credentials we have not just proven work.
  let imapResult;
  try {
    imapResult = await testImapConnection({
      host: imapHost,
      port: imapPort,
      user: email,
      password: body.password,
      tls: true,
    });
  } catch (err) {
    console.error("[inboxes] imap test error:", err);
    return res
      .status(400)
      .json({ success: false, error: "IMAP connection test failed" });
  }
  if (!imapResult || !imapResult.success) {
    return res.status(400).json({
      success: false,
      error: (imapResult && imapResult.error) || "IMAP connection test failed",
    });
  }

  const inboxId = crypto.randomUUID();
  const encImapPass = encrypt(body.password);
  const encSmtpPass = encrypt(body.password);

  try {
    db.prepare(
      `INSERT INTO inboxes
         (id, tenant_id, email, label, imap_host, imap_port, imap_user,
          imap_password_enc, smtp_host, smtp_port, smtp_user,
          smtp_password_enc, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    ).run(
      inboxId,
      req.tenant.id,
      email,
      label,
      imapHost,
      imapPort,
      email,
      encImapPass,
      smtpHost,
      smtpPort,
      email,
      encSmtpPass,
    );
  } catch (err) {
    if (err && err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        error: "An inbox with this email already exists for this tenant",
        code: "DUPLICATE_EMAIL",
      });
    }
    console.error("[inboxes] insert error:", err);
    return res.status(500).json({ error: "Failed to create inbox" });
  }

  const inbox = db
    .prepare("SELECT " + INBOX_PUBLIC_COLUMNS + " FROM inboxes WHERE id = ?")
    .get(inboxId);
  res.status(201).json({ inbox });
});

router.delete("/:id", requireAuth, (req, res) => {
  const inboxId = req.params.id;
  try {
    // Scope the lookup by tenant_id — a wrong tenant gets 404, not 403,
    // to avoid leaking which ids exist under other tenants (same posture
    // as the rest of this repo).
    const inbox = db
      .prepare("SELECT id FROM inboxes WHERE id = ? AND tenant_id = ?")
      .get(inboxId, req.tenant.id);
    if (!inbox) {
      return res.status(404).json({ error: "Inbox not found" });
    }

    // Last-inbox protection: deleting the only inbox would leave the
    // tenant with no mailbox to poll/send from. Force them to add a
    // replacement first.
    const { count } = db
      .prepare("SELECT COUNT(*) AS count FROM inboxes WHERE tenant_id = ?")
      .get(req.tenant.id);
    if (count === 1) {
      return res.status(409).json({
        error: "Cannot delete the last inbox",
        code: "LAST_INBOX",
      });
    }

    // Orphan-then-delete in one transaction so a mid-flight failure
    // doesn't leave emails pointing at a now-deleted inbox row. The
    // emails table has no FK cascade (db.js:127-153), so we null
    // inbox_id ourselves to keep history queryable on the tenant.
    const txn = db.transaction(() => {
      db.prepare("UPDATE emails SET inbox_id = NULL WHERE inbox_id = ?").run(
        inboxId,
      );
      db.prepare("DELETE FROM inboxes WHERE id = ? AND tenant_id = ?").run(
        inboxId,
        req.tenant.id,
      );
    });
    txn();

    res.status(204).end();
  } catch (err) {
    console.error("[inboxes] delete error:", err);
    res.status(500).json({ error: "Failed to delete inbox" });
  }
});

module.exports = router;
