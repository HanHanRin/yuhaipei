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

# 若尚未放置密钥，聊天接口会提示未配置（见 .env.example）
if [ ! -f .env.local ]; then
  echo "提示：${APP_DIR}/web/.env.local 不存在，AI 分身对话在公网将不可用。"
  echo "      请在服务器上创建该文件并填入 DEEPSEEK_API_KEY，然后 pm2 reload yuhaipei-portfolio"
fi

pm2 reload yuhaipei-portfolio --update-env || pm2 start deploy/ecosystem.config.cjs

sleep 3
curl -sS -o /dev/null -w "127.0.0.1:3000 → HTTP %{http_code}\n" http://127.0.0.1:3000/
