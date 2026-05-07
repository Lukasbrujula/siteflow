const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { db } = require("../../db");
const { decrypt } = require("../crypto");

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

// GET /api/emails — list all emails for tenant
router.get("/", requireAuth, (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let query =
      "SELECT id, from_address, subject, body, draft_reply, received_at, classification, sentiment, urgency, confidence, escalation_triggered, escalation_reason, reasoning, status, created_at FROM emails WHERE tenant_id = ?";
    const params = [req.tenant.id];
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }
    query += " ORDER BY received_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));
    const rows = db.prepare(query).all(...params);
    const emails = rows.map((row) => ({
      ...row,
      preview: (row.body || "").replace(/\s+/g, " ").slice(0, 200),
    }));

    // Group by classification for frontend store compatibility
    // Escalated emails route to "escalation" key, bypassing classification buckets
    const grouped = {};
    for (const email of emails) {
      let key;
      if (email.escalation_triggered === 1) {
        key = "escalation";
      } else {
        key = (email.classification || "OTHER").toLowerCase();
      }
      if (grouped[key] === undefined) grouped[key] = [];
      grouped[key].push(email);
    }
    res.json({ emails, ...grouped });
  } catch (err) {
    console.error("[emails] list error:", err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

// GET /api/emails/:id — get single email with draft
router.get("/:id", requireAuth, (req, res) => {
  try {
    const email = db
      .prepare("SELECT * FROM emails WHERE id = ? AND tenant_id = ?")
      .get(req.params.id, req.tenant.id);
    if (!email) return res.status(404).json({ error: "Email not found" });
    res.json({ email });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch email" });
  }
});

// PATCH /api/emails/:id/draft — update draft reply
router.patch("/:id/draft", requireAuth, (req, res) => {
  try {
    const { draft_reply } = req.body;
    if (!draft_reply)
      return res.status(400).json({ error: "draft_reply required" });
    const email = db
      .prepare("SELECT * FROM emails WHERE id = ? AND tenant_id = ?")
      .get(req.params.id, req.tenant.id);
    if (!email) return res.status(404).json({ error: "Email not found" });
    db.prepare("UPDATE emails SET draft_reply = ? WHERE id = ?").run(
      draft_reply,
      req.params.id,
    );
    db.prepare(
      "INSERT INTO audit_logs (id, tenant_id, action, detail, ip) VALUES (?, ?, ?, ?, ?)",
    ).run(
      require("crypto").randomUUID(),
      req.tenant.id,
      "draft_edited",
      req.params.id,
      req.ip,
    );
    res.json({ message: "Draft updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update draft" });
  }
});

// POST /api/emails/:id/send — approve and send reply
router.post("/:id/send", requireAuth, async (req, res) => {
  try {
    const email = db
      .prepare("SELECT * FROM emails WHERE id = ? AND tenant_id = ?")
      .get(req.params.id, req.tenant.id);
    if (!email) return res.status(404).json({ error: "Email not found" });
    if (!email.draft_reply)
      return res.status(400).json({ error: "No draft to send" });

    const inbox = db
      .prepare("SELECT * FROM inboxes WHERE id = ? AND tenant_id = ?")
      .get(email.inbox_id, req.tenant.id);
    if (!inbox)
      return res
        .status(409)
        .json({ error: "Originating inbox not found for this email" });

    // Soft warning if unfilled placeholders remain — user can still send
    let placeholderWarning = null;
    if (/\[BITTE ERGÄNZEN:[^\]]*\]/.test(email.draft_reply)) {
      placeholderWarning =
        "E-Mail enthält noch nicht ausgefüllte Platzhalter ([BITTE ERGÄNZEN: …]).";
    }

    // Fix 1: Strip draft markers and replace signature placeholder
    const DRAFT_MARKER = "[ENTWURF — Bitte prüfen und freigeben]";
    const SIGNATURE_PLACEHOLDER = "[SIGNATUR EINFÜGEN]";

    const tenantRow = db
      .prepare("SELECT tone_profile FROM tenants WHERE id = ?")
      .get(req.tenant.id);
    let emailSignature = "";
    try {
      const toneProfile = tenantRow?.tone_profile
        ? JSON.parse(tenantRow.tone_profile)
        : {};
      emailSignature = toneProfile.email_signature || "";
    } catch (e) {}

    const cleanedBody = email.draft_reply
      .replaceAll(DRAFT_MARKER, "")
      .replaceAll(SIGNATURE_PLACEHOLDER, emailSignature)
      .trim();

    const cleanedSubject = ("Re: " + email.subject)
      .replaceAll(DRAFT_MARKER, "")
      .trim();

    const transporter = nodemailer.createTransport({
      host: inbox.smtp_host,
      port: inbox.smtp_port,
      secure: inbox.smtp_port === 465,
      auth: { user: inbox.smtp_user, pass: decrypt(inbox.smtp_password_enc) },
    });

    await transporter.sendMail({
      from: inbox.email,
      to: email.from_address,
      subject: cleanedSubject,
      text: cleanedBody,
    });

    db.prepare("UPDATE emails SET status = ? WHERE id = ?").run(
      "sent",
      email.id,
    );
    db.prepare(
      "INSERT INTO audit_logs (id, tenant_id, action, detail, ip) VALUES (?, ?, ?, ?, ?)",
    ).run(
      require("crypto").randomUUID(),
      req.tenant.id,
      "email_sent",
      email.id,
      req.ip,
    );

    res.json({ message: "Email sent", warning: placeholderWarning });
  } catch (err) {
    console.error("[emails] send error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// POST /api/emails/:id/archive — archive email
router.post("/:id/archive", requireAuth, (req, res) => {
  try {
    const email = db
      .prepare("SELECT * FROM emails WHERE id = ? AND tenant_id = ?")
      .get(req.params.id, req.tenant.id);
    if (!email) return res.status(404).json({ error: "Email not found" });
    db.prepare("UPDATE emails SET status = ? WHERE id = ?").run(
      "archived",
      email.id,
    );
    res.json({ message: "Archived" });
  } catch (err) {
    res.status(500).json({ error: "Failed to archive" });
  }
});

// POST /api/emails/:id/reject — human rejects AI draft, archives with reason
router.post("/:id/reject", requireAuth, (req, res) => {
  try {
    const email = db
      .prepare("SELECT * FROM emails WHERE id = ? AND tenant_id = ?")
      .get(req.params.id, req.tenant.id);
    if (!email) return res.status(404).json({ error: "Email not found" });
    db.prepare("UPDATE emails SET status = ? WHERE id = ?").run(
      "archived",
      email.id,
    );
    const reason = req.body?.reason || null;
    db.prepare(
      "INSERT INTO audit_logs (id, tenant_id, action, detail, ip) VALUES (?, ?, ?, ?, ?)",
    ).run(
      require("crypto").randomUUID(),
      req.tenant.id,
      "draft_rejected",
      reason ? email.id + ": " + reason : email.id,
      req.ip,
    );
    res.json({ message: "Draft rejected" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject draft" });
  }
});

// POST /api/emails/:id/retriage — reset to pending for reclassification
router.post("/:id/retriage", requireAuth, (req, res) => {
  try {
    const email = db
      .prepare("SELECT * FROM emails WHERE id = ? AND tenant_id = ?")
      .get(req.params.id, req.tenant.id);
    if (!email) return res.status(404).json({ error: "Email not found" });
    db.prepare(
      "UPDATE emails SET status = ?, classification = NULL, draft_reply = NULL, escalation_triggered = 0, escalation_reason = NULL WHERE id = ?",
    ).run("pending", email.id);
    db.prepare(
      "INSERT INTO audit_logs (id, tenant_id, action, detail, ip) VALUES (?, ?, ?, ?, ?)",
    ).run(
      require("crypto").randomUUID(),
      req.tenant.id,
      "retriaged",
      email.id,
      req.ip,
    );
    res.json({ message: "Email queued for retriage" });
  } catch (err) {
    res.status(500).json({ error: "Failed to queue retriage" });
  }
});

// POST /api/emails/:id/unsubscribe — stub: unsubscribe from sender (not yet implemented)
router.post("/:id/unsubscribe", requireAuth, (req, res) => {
  try {
    const email = db
      .prepare("SELECT * FROM emails WHERE id = ? AND tenant_id = ?")
      .get(req.params.id, req.tenant.id);
    if (!email) return res.status(404).json({ error: "Email not found" });
    db.prepare(
      "INSERT INTO audit_logs (id, tenant_id, action, detail, ip) VALUES (?, ?, ?, ?, ?)",
    ).run(
      require("crypto").randomUUID(),
      req.tenant.id,
      "unsubscribe_requested",
      email.id,
      req.ip,
    );
    res
      .status(501)
      .json({ message: "Unsubscribe not yet implemented", status: "stub" });
  } catch (err) {
    res.status(500).json({ error: "Failed to process unsubscribe" });
  }
});

// POST /api/emails/:id/reclassify — "AI got it wrong" escape hatch
router.post("/:id/reclassify", requireAuth, async (req, res) => {
  const { new_classification } = req.body;
  const VALID = ["SPAM", "AD", "URGENT", "OTHER"];
  if (!VALID.includes(new_classification)) {
    return res.status(400).json({
      error: "Invalid classification. Must be one of: SPAM, AD, URGENT, OTHER",
    });
  }

  const email = db
    .prepare("SELECT * FROM emails WHERE id = ? AND tenant_id = ?")
    .get(req.params.id, req.tenant.id);
  if (!email) return res.status(404).json({ error: "Email not found" });

  if (email.status === "sent") {
    return res.status(409).json({ error: "Cannot reclassify a sent email" });
  }

  if (email.classification === new_classification) {
    return res.json({ message: "No change", email });
  }

  const oldClassification = email.classification;
  const goesToArchive =
    new_classification === "SPAM" || new_classification === "AD";
  const needsDraft = !goesToArchive && !email.draft_reply;

  try {
    if (goesToArchive) {
      db.prepare(
        "UPDATE emails SET classification = ?, status = 'archived', draft_reply = NULL, " +
          "escalation_triggered = 0, escalation_reason = NULL WHERE id = ?",
      ).run(new_classification, email.id);
    } else if (needsDraft) {
      db.prepare(
        "UPDATE emails SET status = 'processing', classification = ? WHERE id = ?",
      ).run(new_classification, email.id);

      try {
        const { callReplyAgent } = require("../../workflow/index");
        const synthTriage = { classification: new_classification };
        const draft = await callReplyAgent(email, synthTriage);
        let draftReply = draft.body_plain || draft.body_html || "";

        const tenantRow = db
          .prepare("SELECT tone_profile FROM tenants WHERE id = ?")
          .get(req.tenant.id);
        let signature = "";
        try {
          const tp = tenantRow?.tone_profile
            ? JSON.parse(tenantRow.tone_profile)
            : {};
          signature = tp.email_signature || "";
        } catch (_) {}
        if (signature) {
          draftReply = draftReply.replace(
            /\[SIGNATUR EINF(Ü|UE)GEN\]/gi,
            signature,
          );
        }

        db.prepare(
          "UPDATE emails SET status = 'draft', draft_reply = ?, " +
            "escalation_triggered = 0, escalation_reason = NULL WHERE id = ?",
        ).run(draftReply, email.id);
      } catch (agentErr) {
        console.error(
          "[emails] reclassify reply agent failed:",
          agentErr.message,
        );
        db.prepare("UPDATE emails SET status = 'error' WHERE id = ?").run(
          email.id,
        );
        return res
          .status(502)
          .json({ error: "Reply agent failed; email marked error" });
      }
    } else {
      // URGENT/OTHER → URGENT/OTHER (different class), draft already exists — keep it
      db.prepare(
        "UPDATE emails SET classification = ?, escalation_triggered = 0, escalation_reason = NULL WHERE id = ?",
      ).run(new_classification, email.id);
    }

    db.prepare(
      "INSERT INTO audit_logs (id, tenant_id, action, detail, ip) VALUES (?, ?, ?, ?, ?)",
    ).run(
      require("crypto").randomUUID(),
      req.tenant.id,
      "reclassified",
      email.id + ": " + (oldClassification || "NULL") + " -> " + new_classification,
      req.ip,
    );

    const updated = db
      .prepare("SELECT * FROM emails WHERE id = ?")
      .get(email.id);
    res.json({ message: "Reclassified", email: updated });
  } catch (err) {
    console.error("[emails] reclassify error:", err);
    res.status(500).json({ error: "Failed to reclassify email" });
  }
});

module.exports = router;
