#!/bin/bash
set -e

echo "================================"
echo " SiteFlow Update"
echo "================================"

cd /opt/siteflow

echo "Pulling latest frontend..."
rm -rf /tmp/siteflow-update
git clone https://github.com/Lukasbrujula/siteware-frontend.git /tmp/siteflow-update

echo "Updating frontend files..."
cp -r /tmp/siteflow-update/dist/* /opt/siteflow/public/

echo "Updating backend..."
cp -r /tmp/siteflow-update/src/* /opt/siteflow/src/
npm install > /dev/null

echo "Restarting services..."
pm2 restart app --update-env
pm2 restart poller --update-env
pm2 restart workflow --update-env
pm2 restart jobs --update-env

echo ""
echo "================================"
echo " Update complete!"
echo "================================"
