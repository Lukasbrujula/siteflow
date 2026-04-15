require("dotenv").config();
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { db } = require("../../db");

const OTP_EXPIRY_MINUTES = 10;
const SESSION_DURATION_DAYS = parseInt(
  process.env.SESSION_DURATION_DAYS || "7",
);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateId() {
  return crypto.randomUUID();
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// POST /api/auth/request-otp
router.post("/request-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const tenant = db
      .prepare("SELECT * FROM tenants WHERE email = ?")
      .get(email);
    if (!tenant)
      return res.status(404).json({ error: "No account found for this email" });

    const token = generateOTP();
    const expiresAt = Math.floor(Date.now() / 1000) + OTP_EXPIRY_MINUTES * 60;

    db.prepare("DELETE FROM login_tokens WHERE tenant_id = ?").run(tenant.id);
    db.prepare(
      "INSERT INTO login_tokens (token, tenant_id, expires_at) VALUES (?, ?, ?)",
    ).run(token, tenant.id, expiresAt);

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your SiteFlow login code",
      text:
        "Your login code is: " +
        token +
        ". Valid for " +
        OTP_EXPIRY_MINUTES +
        " minutes.",
    });

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("[auth] request-otp error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token)
      return res.status(400).json({ error: "Email and token required" });

    const tenant = db
      .prepare("SELECT * FROM tenants WHERE email = ?")
      .get(email);
    if (!tenant) return res.status(404).json({ error: "No account found" });

    const now = Math.floor(Date.now() / 1000);
    const record = db
      .prepare(
        "SELECT * FROM login_tokens WHERE token = ? AND tenant_id = ? AND used = 0 AND expires_at > ?",
      )
      .get(token, tenant.id, now);

    if (!record)
      return res.status(401).json({ error: "Invalid or expired code" });

    db.prepare("UPDATE login_tokens SET used = 1 WHERE token = ?").run(token);

    const sessionId = generateId();
    const expiresAt = now + SESSION_DURATION_DAYS * 86400;
    db.prepare(
      "INSERT INTO sessions (id, tenant_id, expires_at) VALUES (?, ?, ?)",
    ).run(sessionId, tenant.id, expiresAt);

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      maxAge: SESSION_DURATION_DAYS * 86400 * 1000,
      sameSite: "strict",
    });

    res.json({ message: "Logged in", role: tenant.role });
  } catch (err) {
    console.error("[auth] verify-otp error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  const sessionId = req.cookies?.session;
  if (sessionId) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
  }
  res.clearCookie("session");
  res.json({ message: "Logged out" });
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  const sessionId = req.cookies?.session;
  if (!sessionId) return res.status(401).json({ error: "Not authenticated" });

  const now = Math.floor(Date.now() / 1000);
  const session = db
    .prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > ?")
    .get(sessionId, now);
  if (!session) return res.status(401).json({ error: "Session expired" });

  const tenant = db
    .prepare("SELECT id, email, role FROM tenants WHERE id = ?")
    .get(session.tenant_id);
  if (!tenant) return res.status(401).json({ error: "Account not found" });

  res.json({ tenant });
});

module.exports = router;
