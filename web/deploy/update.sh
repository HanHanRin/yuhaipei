#!/usr/bin/env bash
#
# 更新已部署的站点。在服务器上执行：
#   bash /var/www/yuhaipei/web/deploy/update.sh
#
set -euo pipefail

APP_DIR="/var/www/yuhaipei"

cd "$APP_DIR"
git fetch --depth 1 origin main
git reset --hard origin/main

cd "${APP_DIR}/web"
npm ci --silent
NEXT_PUBLIC_BASE_PATH="" npm run build

pm2 reload yuhaipei-portfolio

sleep 2
curl -sS -o /dev/null -w "localhost:3000 → HTTP %{http_code}\n" http://127.0.0.1:3000/
