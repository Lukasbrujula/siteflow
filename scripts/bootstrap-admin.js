require('dotenv').config();
const { db, initDb } = require('../src/db');
const { randomUUID } = require('crypto');

const args = process.argv.slice(2);
const emailArg = args.find(a => a.startsWith('--email='));
const email = emailArg ? emailArg.split('=')[1] : process.env.ADMIN_EMAIL;

if (!email) {
  console.error('Usage: node scripts/bootstrap-admin.js --email=admin@firma.de');
  process.exit(1);
}

initDb();

const existing = db.prepare('SELECT id FROM tenants WHERE email = ?').get(email);
if (existing) {
  console.log('Admin already exists:', email);
  process.exit(0);
}

const id = randomUUID();
db.prepare('INSERT INTO tenants (id, email, role) VALUES (?, ?, ?)').run(id, email, 'admin');
console.log('Admin created:', email);
console.log('They can now log in at your domain with OTP.');
