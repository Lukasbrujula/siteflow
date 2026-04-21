require("dotenv").config();
const Imap = require("imap-simple");
const { simpleParser } = require("mailparser");
const { db } = require("../db");
const crypto = require("crypto");

const config = {
  imap: {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASSWORD,
    host: process.env.IMAP_HOST || "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 10000,
  },
};

async function pollInbox() {
  let connection;
  try {
    console.log("[poller] Connecting to IMAP...");
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
    console.log("[poller] Found " + messages.length + " new messages");

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

        const tenant = db.prepare("SELECT id FROM tenants LIMIT 1").get();
        if (!tenant) continue;

        const emailId = crypto.randomUUID();
        db.prepare(
          `
          INSERT INTO emails (id, tenant_id, message_id, from_address, subject, body, received_at, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        ).run(
          emailId,
          tenant.id,
          messageId,
          from,
          subject,
          text.substring(0, 5000),
          Math.floor(Date.now() / 1000),
          "pending",
        );

        console.log("[poller] Saved: " + subject);
        processed++;
      } catch (msgErr) {
        console.error(
          "[poller] Skipped message (subject: " +
            subject +
            "): " +
            msgErr.message,
        );
        skipped++;
      }
    }

    console.log(
      "[poller] Processed " + processed + " messages, " + skipped + " skipped",
    );

    connection.end();
  } catch (err) {
    console.error("[poller] Error:", err.message);
    if (connection)
      try {
        connection.end();
      } catch (e) {}
  }
}

const INTERVAL = parseInt(process.env.POLL_INTERVAL_MS || "180000");
console.log("[poller] Starting, interval: " + INTERVAL + "ms");
pollInbox();
setInterval(pollInbox, INTERVAL);
