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

function defaultProfile(tenantId) {
  const now = new Date().toISOString();
  return {
    tenant_id: tenantId,
    greeting_style: "",
    closing_style: "",
    formality_level: "formal",
    sentence_length: "medium",
    vocabulary_complexity: "moderate",
    emotional_tone: "neutral",
    use_of_humor: false,
    typical_phrases: [],
    avoidances: [],
    industry_jargon: [],
    language: "de",
    created_at: now,
    updated_at: now,
  };
}

// GET /api/tone-profile — returns the authenticated tenant's tone profile
router.get("/", requireAuth, (req, res) => {
  try {
    const row = db
      .prepare("SELECT tone_profile FROM tenants WHERE id = ?")
      .get(req.tenant.id);

    let profile = null;
    if (row?.tone_profile) {
      try {
        profile = JSON.parse(row.tone_profile);
      } catch {
        profile = null;
      }
    }

    if (!profile || typeof profile !== "object") {
      profile = defaultProfile(req.tenant.id);
    } else {
      profile = {
        ...defaultProfile(req.tenant.id),
        ...profile,
        tenant_id: req.tenant.id,
      };
    }

    res.json({ success: true, data: profile });
  } catch (err) {
    console.error("[tone-profile] get error:", err);
    res.status(500).json({ error: "Failed to fetch tone profile" });
  }
});

// PUT /api/tone-profile — write JSON to tenants.tone_profile
router.put("/", requireAuth, (req, res) => {
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res
      .status(422)
      .json({ error: "Request body must be a tone profile object" });
  }

  try {
    const profileToStore = {
      ...body,
      tenant_id: req.tenant.id,
      updated_at: new Date().toISOString(),
    };
    const serialized = JSON.stringify(profileToStore);
    if (serialized.length > 100_000) {
      return res
        .status(422)
        .json({ error: "Tone profile exceeds maximum size of 100000 bytes" });
    }
    db.prepare("UPDATE tenants SET tone_profile = ? WHERE id = ?").run(
      serialized,
      req.tenant.id,
    );
    res.json({ success: true, data: profileToStore });
  } catch (err) {
    console.error("[tone-profile] put error:", err);
    res.status(500).json({ error: "Failed to save tone profile" });
  }
});

module.exports = router;
