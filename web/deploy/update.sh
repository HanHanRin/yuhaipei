#!/usr/bin/env bash
#
# 更新已部署的站点。在服务器上执行：
#   sudo bash /var/www/yuhaipei/web/deploy/update.sh
#
set -euo pipefail

APP_DIR="/var/www/yuhaipei"

if [ "$(id -u)" -ne 0 ]; then
  echo "需要 root 权限，请用 sudo 执行" >&2
  exit 1
fi

cd "$APP_DIR"
git fetch --depth 1 origin main
git reset --hard origin/main

cd "${APP_DIR}/web"
npm ci
NEXT_PUBLIC_BASE_PATH="" npm run build

pm2 reload yuhaipei-portfolio

sleep 3
curl -sS -o /dev/null -w "127.0.0.1:3000 → HTTP %{http_code}\n" http://127.0.0.1:3000/
