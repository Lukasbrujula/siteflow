#!/bin/bash
set -euo pipefail

INSTALL_DIR="/opt/siteflow"

echo ""
echo "================================"
echo " SiteFlow Update"
echo "================================"

if [ ! -d "$INSTALL_DIR" ]; then
  echo "Error: $INSTALL_DIR does not exist. Run install.sh first."
  exit 1
fi
cd "$INSTALL_DIR"

if [ ! -f ".env" ]; then
  echo "Error: .env is missing. Re-run install.sh or restore from backup."
  exit 1
fi

echo "Pulling latest changes..."
git pull origin main

echo "Installing dependencies..."
npm install > /dev/null 2>&1

echo "Restarting services..."
pm2 restart app poller workflow jobs --update-env

echo "Waiting for services to start..."
sleep 5

HEALTH=$(curl -s -m 10 http://localhost:3000/api/health 2>/dev/null || echo '{"status":"unreachable"}')
echo "Health: $HEALTH"

echo ""
echo "================================"
echo " Update complete!"
echo "================================"
