require("dotenv").config();
const Imap = require("imap-simple");
const { simpleParser } = require("mailparser");
const { db } = require("../db");
const crypto = require("crypto");
const { decrypt } = require("../api/crypto");

if (!process.env.ENCRYPTION_KEY) {
  console.error(
    "[poller] FATAL: ENCRYPTION_KEY is not set; cannot decrypt inbox credentials. Exiting.",
  );
  process.exit(1);
}

async function pollSingleInbox(inbox) {
  let connection;
  try {
    console.log("[poller] Connecting to IMAP for inbox " + inbox.id + "...");
    const config = {
      imap: {
        user: inbox.imap_user,
        password: decrypt(inbox.imap_password_enc),
        host: inbox.imap_host,
        port: inbox.imap_port || 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 10000,
      },
    };
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
    console.log(
      "[poller] inbox " + inbox.id + ": found " + messages.length + " new messages",
    );

    let processed = 0,
      skipped = 0;

    for (const msg of messages) {
      let subject = "unknown";
      try {
        const fullPart = msg.parts.find((p) => p.which === "");
        const rawSource = fullPart?.body || "";

        const parsed = await simpleParser(rawSource);

        const from =
          (parsed.from &&
            parsed.from.value &&
            parsed.from.value[0] &&
            parsed.from.value[0].address) ||
          (parsed.from && parsed.from.text) ||
          "";
        subject = parsed.subject || "(no subject)";
        const dateStr = parsed.date ? parsed.date.toISOString() : "";
        const text = parsed.text || "";

        const messageId = parsed.messageId
          ? parsed.messageId.trim()
          : crypto
              .createHash("sha256")
              .update(from + subject + dateStr)
              .digest("hex");

        const existing = db
          .prepare("SELECT id FROM emails WHERE message_id = ?")
          .get(messageId);
        if (existing) continue;

        const emailId = crypto.randomUUID();
        db.prepare(
          `INSERT INTO emails (id, tenant_id, inbox_id, message_id, from_address, subject, body, received_at, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ).run(
          emailId,
          inbox.tenant_id,
          inbox.id,
          messageId,
          from,
          subject,
          text.substring(0, 5000),
          Math.floor(Date.now() / 1000),
          "pending",
        );

        console.log("[poller] inbox " + inbox.id + " saved: " + subject);
        processed++;
      } catch (msgErr) {
        console.error(
          "[poller] inbox " +
            inbox.id +
            " skipped message (subject: " +
            subject +
            "): " +
            msgErr.message,
        );
        skipped++;
      }
    }

    console.log(
      "[poller] inbox " +
        inbox.id +
        ": processed " +
        processed +
        ", skipped " +
        skipped,
    );

    connection.end();
    db.prepare(
      "UPDATE inboxes SET last_polled_at = unixepoch(), last_poll_error = NULL WHERE id = ?",
    ).run(inbox.id);
  } catch (err) {
    console.error("[poller] inbox " + inbox.id + " error: " + err.message);
    if (connection)
      try {
        connection.end();
      } catch (e) {}
    db.prepare(
      "UPDATE inboxes SET last_polled_at = unixepoch(), last_poll_error = ? WHERE id = ?",
    ).run((err.message || "").substring(0, 500), inbox.id);
  }
}

async function runCycle() {
  const inboxes = db.prepare("SELECT * FROM inboxes WHERE is_active = 1").all();
  if (inboxes.length === 0) {
    console.log("[poller] no active inboxes — nothing to do");
    return;
  }
  for (const inbox of inboxes) {
    try {
      await pollSingleInbox(inbox);
    } catch (err) {
      console.error("[poller] inbox " + inbox.id + " unhandled:", err.message);
    }
  }
}

const INTERVAL = parseInt(process.env.POLL_INTERVAL_MS || "180000");
console.log("[poller] Starting, interval: " + INTERVAL + "ms");
runCycle();
setInterval(runCycle, INTERVAL);
