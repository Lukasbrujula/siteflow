const express = require("express");
const router = express.Router();
const { db } = require("../../db");

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

function inboxToTenantShape(inbox) {
  const isoCreated = new Date(inbox.created_at * 1000).toISOString();
  return {
    tenant_id: inbox.id,
    imap_user: inbox.imap_user || inbox.email || null,
    smtp_user: inbox.smtp_user || null,
    email: inbox.email,
    label: inbox.label,
    active: inbox.is_active ? 1 : 0,
    created_at: isoCreated,
    updated_at: isoCreated,
  };
}

// GET /api/onboarding/tenants — list inboxes for the authenticated tenant
router.get("/tenants", requireAuth, (req, res) => {
  try {
    const inboxes = db
      .prepare(
        `SELECT id, email, label, imap_user, smtp_user, is_active, created_at
         FROM inboxes
         WHERE tenant_id = ?
         ORDER BY created_at ASC`,
      )
      .all(req.tenant.id);
    res.json({ success: true, data: inboxes.map(inboxToTenantShape) });
  } catch (err) {
    console.error("[onboarding-tenants] list error:", err);
    res.status(500).json({ error: "Failed to fetch tenants" });
  }
});

// GET /api/onboarding/tenant — return current tenant's signature
router.get("/tenant", requireAuth, (req, res) => {
  try {
    const row = db
      .prepare("SELECT email_signature FROM tenants WHERE id = ?")
      .get(req.tenant.id);
    res.json({
      success: true,
      data: { email_signature: row?.email_signature ?? null },
    });
  } catch (err) {
    console.error("[onboarding-tenants] tenant get error:", err);
    res.status(500).json({ error: "Failed to fetch tenant" });
  }
});

// POST /api/onboarding/tenant-toggle — flip is_active for a scoped inbox
router.post("/tenant-toggle", requireAuth, (req, res) => {
  const body = req.body || {};
  if (typeof body.tenant_id !== "string" || body.tenant_id === "") {
    return res
      .status(422)
      .json({ error: '"tenant_id" must be a non-empty string' });
  }
  if (typeof body.active !== "boolean") {
    return res.status(422).json({ error: '"active" must be a boolean' });
  }

  try {
    const inbox = db
      .prepare("SELECT id FROM inboxes WHERE id = ? AND tenant_id = ?")
      .get(body.tenant_id, req.tenant.id);
    if (!inbox) {
      return res
        .status(404)
        .json({ error: `Tenant "${body.tenant_id}" not found` });
    }
    db.prepare(
      "UPDATE inboxes SET is_active = ? WHERE id = ? AND tenant_id = ?",
    ).run(body.active ? 1 : 0, body.tenant_id, req.tenant.id);
    res.json({
      success: true,
      tenant_id: body.tenant_id,
      active: body.active,
    });
  } catch (err) {
    console.error("[onboarding-tenants] toggle error:", err);
    res.status(500).json({ error: "Failed to update tenant" });
  }
});

// POST /api/onboarding/tenant-delete — remove inbox + cascade emails
router.post("/tenant-delete", requireAuth, (req, res) => {
  const body = req.body || {};
  if (typeof body.tenant_id !== "string" || body.tenant_id === "") {
    return res
      .status(422)
      .json({ error: '"tenant_id" must be a non-empty string' });
  }

  try {
    const inbox = db
      .prepare("SELECT id FROM inboxes WHERE id = ? AND tenant_id = ?")
      .get(body.tenant_id, req.tenant.id);
    if (!inbox) {
      return res
        .status(404)
        .json({ error: `Tenant "${body.tenant_id}" not found` });
    }

    const txn = db.transaction(() => {
      db.prepare("DELETE FROM emails WHERE inbox_id = ?").run(body.tenant_id);
      db.prepare("DELETE FROM inboxes WHERE id = ? AND tenant_id = ?").run(
        body.tenant_id,
        req.tenant.id,
      );
    });
    txn();

    res.json({ success: true, deleted: body.tenant_id });
  } catch (err) {
    console.error("[onboarding-tenants] delete error:", err);
    res.status(500).json({ error: "Failed to delete tenant" });
  }
});

// POST /api/onboarding/update-signature — write tenants.email_signature
router.post("/update-signature", requireAuth, (req, res) => {
  const body = req.body || {};
  if (typeof body.email_signature !== "string") {
    return res
      .status(422)
      .json({ error: '"email_signature" must be a string' });
  }
  if (body.email_signature.length > 10_000) {
    return res
      .status(422)
      .json({ error: '"email_signature" exceeds maximum length of 10000' });
  }

  try {
    db.prepare("UPDATE tenants SET email_signature = ? WHERE id = ?").run(
      body.email_signature,
      req.tenant.id,
    );
    res.json({ success: true });
  } catch (err) {
    console.error("[onboarding-tenants] update-signature error:", err);
    res.status(500).json({ error: "Failed to update signature" });
  }
});

module.exports = router;
