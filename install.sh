#!/bin/bash
set -e

echo "================================"
echo " SiteFlow Installation"
echo "================================"
echo ""

# Check we are root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

# Collect config
read -p "Company domain (e.g. email.firma.de): " DOMAIN
read -p "Admin email address: " ADMIN_EMAIL
read -p "Company inbox (IMAP/SMTP user): " IMAP_USER
read -s -p "Gmail app password: " IMAP_PASSWORD
echo ""
read -p "Siteware API token: " SITEWARE_TOKEN

# Generate secrets
ENCRYPTION_KEY=$(openssl rand -hex 32)
SESSION_SECRET=$(openssl rand -hex 32)

echo ""
echo "Installing dependencies..."
apt update -qq && apt install -y -qq git nodejs npm caddy
npm install -g pm2 > /dev/null

echo "Setting up SiteFlow..."
mkdir -p /opt/siteflow
cd /opt/siteflow

# Clone if not already cloned
if [ ! -f package.json ]; then
  git clone https://github.com/Lukasbrujula/siteware-frontend.git /tmp/siteflow-src
  cp -r /tmp/siteflow-src/. .
fi

npm install > /dev/null

# Write .env
cat > .env << ENVEOF
DOMAIN=$DOMAIN
ADMIN_EMAIL=$ADMIN_EMAIL
IMAP_HOST=imap.gmail.com
IMAP_USER=$IMAP_USER
IMAP_PASSWORD=$IMAP_PASSWORD
SMTP_HOST=smtp.gmail.com
SMTP_USER=$IMAP_USER
SMTP_PASSWORD=$IMAP_PASSWORD
SMTP_PORT=587
SITEWARE_API_TOKEN=$SITEWARE_TOKEN
SITEWARE_TRIAGE_AGENT_ID=69a793b549b400eda5ba1d28
SITEWARE_REPLY_AGENT_ID=69a79a7474b96c80ef1a84e2
ENCRYPTION_KEY=$ENCRYPTION_KEY
SESSION_SECRET=$SESSION_SECRET
PORT=3000
NODE_ENV=production
POLL_INTERVAL_MS=180000
SESSION_DURATION_DAYS=7
DATA_RETENTION_DAYS=90
ENVEOF

echo "Copying frontend..."
cp -r /tmp/siteflow-src/dist/* /opt/siteflow/public/ 2>/dev/null || true

echo "Starting services..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash

echo "Configuring Caddy..."
cat > /etc/caddy/Caddyfile << CADDY
$DOMAIN {
    reverse_proxy localhost:3000
}
CADDY
systemctl restart caddy

echo "Bootstrapping admin..."
node scripts/bootstrap-admin.js --email $ADMIN_EMAIL

echo ""
echo "================================"
echo " Installation complete!"
echo " Go to: https://$DOMAIN"
echo "================================"
