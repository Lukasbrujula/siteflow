require('dotenv').config();
const Imap = require('imap-simple');
const { db } = require('../db');
const crypto = require('crypto');

const config = {
  imap: {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASSWORD,
    host: process.env.IMAP_HOST || 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 10000,
  }
};

async function pollInbox() {
  let connection;
  try {
    console.log('[poller] Connecting to IMAP...');
    connection = await Imap.connect(config);
    await connection.openBox('INBOX');

    const since = new Date();
    since.setDate(since.getDate() - 1);

    const searchCriteria = ['UNSEEN', ['SINCE', since]];
    const fetchOptions = {
      bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'],
      markSeen: false
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log('[poller] Found ' + messages.length + ' new messages');

    for (const msg of messages) {
      const header = msg.parts.find(p => p.which === 'HEADER.FIELDS (FROM SUBJECT DATE)');
      const body = msg.parts.find(p => p.which === 'TEXT');

      const from = header?.body?.from?.[0] || '';
      const subject = header?.body?.subject?.[0] || '(no subject)';
      const dateStr = header?.body?.date?.[0] || '';
      const text = body?.body || '';
      const messageId = crypto.createHash('sha256').update(from + subject + dateStr).digest('hex');

      const existing = db.prepare('SELECT id FROM emails WHERE message_id = ?').get(messageId);
      if (existing) continue;

      const tenant = db.prepare('SELECT id FROM tenants LIMIT 1').get();
      if (!tenant) continue;

      const emailId = crypto.randomUUID();
      db.prepare(`
        INSERT INTO emails (id, tenant_id, message_id, from_address, subject, body, received_at, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(emailId, tenant.id, messageId, from, subject, text.substring(0, 5000), Math.floor(Date.now() / 1000), 'pending');

      console.log('[poller] Saved: ' + subject);
    }

    connection.end();
  } catch (err) {
    console.error('[poller] Error:', err.message);
    if (connection) try { connection.end(); } catch(e) {}
  }
}

const INTERVAL = parseInt(process.env.POLL_INTERVAL_MS || '180000');
console.log('[poller] Starting, interval: ' + INTERVAL + 'ms');
pollInbox();
setInterval(pollInbox, INTERVAL);
