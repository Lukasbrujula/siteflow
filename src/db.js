const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_DIR = path.join(__dirname, "../data");
const DB_PATH = path.join(DB_DIR, "siteflow.db");

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      imap_host TEXT,
      imap_user TEXT,
      imap_password_enc TEXT,
      smtp_host TEXT,
      smtp_user TEXT,
      smtp_password_enc TEXT,
      tone_profile TEXT,
      role TEXT DEFAULT 'user',
      created_at INTEGER DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS emails (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      message_id TEXT UNIQUE,
      from_address TEXT,
      subject TEXT,
      body TEXT,
      received_at INTEGER,
      classification TEXT,
      sentiment TEXT,
      urgency TEXT,
      confidence REAL,
      escalation_triggered INTEGER DEFAULT 0,
      escalation_reason TEXT,
      reasoning TEXT,
      draft_reply TEXT,
      status TEXT DEFAULT 'pending',
      created_at INTEGER DEFAULT (unixepoch()),
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      created_at INTEGER DEFAULT (unixepoch()),
      expires_at INTEGER NOT NULL,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );
    CREATE TABLE IF NOT EXISTS login_tokens (
      token TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      used INTEGER DEFAULT 0,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      tenant_id TEXT,
      action TEXT NOT NULL,
      detail TEXT,
      ip TEXT,
      created_at INTEGER DEFAULT (unixepoch())
    );
  `);
  // Migration: add confidence column for existing DBs (safe no-op if already present)
  try {
    db.exec("ALTER TABLE emails ADD COLUMN confidence REAL");
  } catch (err) {
    if (!err.message.includes("duplicate column name")) throw err;
  }
  // Migration: add escalation columns for existing DBs (safe no-op if already present)
  try {
    db.exec(
      "ALTER TABLE emails ADD COLUMN escalation_triggered INTEGER DEFAULT 0",
    );
  } catch (err) {
    if (!err.message.includes("duplicate column name")) throw err;
  }
  try {
    db.exec("ALTER TABLE emails ADD COLUMN escalation_reason TEXT");
  } catch (err) {
    if (!err.message.includes("duplicate column name")) throw err;
  }
  // Migration: add triage reasoning column (persists Triage agent's reasoning field)
  try {
    db.exec("ALTER TABLE emails ADD COLUMN reasoning TEXT");
  } catch (err) {
    if (!err.message.includes("duplicate column name")) throw err;
  }
  // Migration: add IMAP/SMTP port columns for onboarding
  try {
    db.exec("ALTER TABLE tenants ADD COLUMN imap_port INTEGER");
  } catch (err) {
    if (!err.message.includes("duplicate column name")) throw err;
  }
  try {
    db.exec("ALTER TABLE tenants ADD COLUMN smtp_port INTEGER");
  } catch (err) {
    if (!err.message.includes("duplicate column name")) throw err;
  }
  console.log("[db] Tables ready");
}

module.exports = { db, initDb };
