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

router.get("/", requireAuth, (req, res) => {
  try {
    const inboxes = db
      .prepare(
        "SELECT id, email, label, is_active FROM inboxes WHERE tenant_id = ? ORDER BY created_at ASC",
      )
      .all(req.tenant.id);
    res.json({ inboxes });
  } catch (err) {
    console.error("[inboxes] list error:", err);
    res.status(500).json({ error: "Failed to fetch inboxes" });
  }
});

module.exports = router;
