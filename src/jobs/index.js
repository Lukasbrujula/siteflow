require("dotenv").config();
const { db, initDb } = require("../db");

initDb();

const DATA_RETENTION_DAYS = parseInt(
  process.env.DATA_RETENTION_DAYS || "90",
  10,
);

function runCleanup() {
  let deletedSessions = 0;
  let deletedTokens = 0;
  let deletedEmails = 0;

  try {
    const result = db
      .prepare("DELETE FROM sessions WHERE expires_at < unixepoch()")
      .run();
    deletedSessions = result.changes;
  } catch (err) {
    console.error("[jobs] Cleanup error (sessions):", err.message);
  }

  try {
    const result = db
      .prepare(
        "DELETE FROM login_tokens WHERE used = 1 OR expires_at < unixepoch()",
      )
      .run();
    deletedTokens = result.changes;
  } catch (err) {
    console.error("[jobs] Cleanup error (tokens):", err.message);
  }

  try {
    const result = db
      .prepare("DELETE FROM emails WHERE created_at < unixepoch() - ?")
      .run(DATA_RETENTION_DAYS * 86400);
    deletedEmails = result.changes;
  } catch (err) {
    console.error("[jobs] Cleanup error (emails):", err.message);
  }

  console.log(
    `[jobs] Cleanup: deleted ${deletedSessions} sessions, ${deletedTokens} tokens, ${deletedEmails} emails`,
  );
}

runCleanup();
setInterval(runCleanup, 3600000);
