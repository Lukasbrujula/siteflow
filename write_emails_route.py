content = open('src/api/routes/emails.js', 'w')
content.write("""const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { db } = require('../../db');

function requireAuth(req, res, next) {
  const sessionId = req.cookies?.session;
  if (!sessionId) return res.status(401).json({ error: 'Not authenticated' });
  const now = Math.floor(Date.now() / 1000);
  const session = db.prepare('SELECT * FROM sessions WHERE id = ? AND expires_at > ?').get(sessionId, now);
  if (!session) return res.status(401).json({ error: 'Session expired' });
  const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(session.tenant_id);
  if (!tenant) return res.status(401).json({ error: 'Tenant not found' });
  req.tenant = tenant;
  next();
}

// GET /api/emails — list all emails for tenant
router.get('/', requireAuth, (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT id, from_address, subject, received_at, classification, sentiment, urgency, status, created_at FROM emails WHERE tenant_id = ?';
    const params = [req.tenant.id];
    if (status) { query += ' AND status = ?'; params.push(status); }
    query += ' ORDER BY received_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    const emails = db.prepare(query).all(...params);
    res.json({ emails });
  } catch(err) {
    console.error('[emails] list error:', err);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// GET /api/emails/:id — get single email with draft
router.get('/:id', requireAuth, (req, res) => {
  try {
    const email = db.prepare('SELECT * FROM emails WHERE id = ? AND tenant_id = ?').get(req.params.id, req.tenant.id);
    if (!email) return res.status(404).json({ error: 'Email not found' });
    res.json({ email });
  } catch(err) {
    res.status(500).json({ error: 'Failed to fetch email' });
  }
});

// PATCH /api/emails/:id/draft — update draft reply
router.patch('/:id/draft', requireAuth, (req, res) => {
  try {
    const { draft_reply } = req.body;
    if (!draft_reply) return res.status(400).json({ error: 'draft_reply required' });
    const email = db.prepare('SELECT * FROM emails WHERE id = ? AND tenant_id = ?').get(req.params.id, req.tenant.id);
    if (!email) return res.status(404).json({ error: 'Email not found' });
    db.prepare('UPDATE emails SET draft_reply = ? WHERE id = ?').run(draft_reply, req.params.id);
    db.prepare('INSERT INTO audit_logs (id, tenant_id, action, detail, ip) VALUES (?, ?, ?, ?, ?)').run(
      require('crypto').randomUUID(), req.tenant.id, 'draft_edited', req.params.id, req.ip
    );
    res.json({ message: 'Draft updated' });
  } catch(err) {
    res.status(500).json({ error: 'Failed to update draft' });
  }
});

// POST /api/emails/:id/send — approve and send reply
router.post('/:id/send', requireAuth, async (req, res) => {
  try {
    const email = db.prepare('SELECT * FROM emails WHERE id = ? AND tenant_id = ?').get(req.params.id, req.tenant.id);
    if (!email) return res.status(404).json({ error: 'Email not found' });
    if (!email.draft_reply) return res.status(400).json({ error: 'No draft to send' });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email.from_address,
      subject: 'Re: ' + email.subject,
      text: email.draft_reply
    });

    db.prepare('UPDATE emails SET status = ? WHERE id = ?').run('sent', email.id);
    db.prepare('INSERT INTO audit_logs (id, tenant_id, action, detail, ip) VALUES (?, ?, ?, ?, ?)').run(
      require('crypto').randomUUID(), req.tenant.id, 'email_sent', email.id, req.ip
    );

    res.json({ message: 'Email sent' });
  } catch(err) {
    console.error('[emails] send error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// POST /api/emails/:id/archive — archive email
router.post('/:id/archive', requireAuth, (req, res) => {
  try {
    const email = db.prepare('SELECT * FROM emails WHERE id = ? AND tenant_id = ?').get(req.params.id, req.tenant.id);
    if (!email) return res.status(404).json({ error: 'Email not found' });
    db.prepare('UPDATE emails SET status = ? WHERE id = ?').run('archived', email.id);
    res.json({ message: 'Archived' });
  } catch(err) {
    res.status(500).json({ error: 'Failed to archive' });
  }
});

module.exports = router;
""")
content.close()
print('done')
