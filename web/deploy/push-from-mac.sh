#!/usr/bin/env bash
#
# 当服务器访问不了 GitHub 时，从本机把 web 目录同步上去并远程构建。
# 在本机 Mac 终端执行（会提示输入服务器 root 密码，可能要输 1～2 次）：
#
#   bash web/deploy/push-from-mac.sh
#
set -euo pipefail

HOST="${DEPLOY_HOST:-139.224.220.27}"
USER="${DEPLOY_USER:-root}"
REMOTE_APP="${DEPLOY_APP_DIR:-/var/www/yuhaipei}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WEB="${ROOT}/web"
CONTROL="${HOME}/.ssh/cm-yuhaipei-%r@%h:%p"

mkdir -p "${HOME}/.ssh"
chmod 700 "${HOME}/.ssh"

cleanup() {
  ssh -o ControlPath="$CONTROL" -O exit "${USER}@${HOST}" 2>/dev/null || true
}
trap cleanup EXIT

echo "==> 建立 SSH 会话（输入一次 root 密码即可）"
ssh -o ControlMaster=yes \
  -o ControlPath="$CONTROL" \
  -o ControlPersist=600 \
  -o StrictHostKeyChecking=accept-new \
  -fN "${USER}@${HOST}"

RSYNC_SSH="ssh -o ControlPath=${CONTROL}"

echo "==> 同步 ${WEB} → ${USER}@${HOST}:${REMOTE_APP}/web"
rsync -az --delete \
  -e "$RSYNC_SSH" \
  --exclude node_modules \
  --exclude .next \
  --exclude out \
  --exclude .env.local \
  --exclude .DS_Store \
  "${WEB}/" "${USER}@${HOST}:${REMOTE_APP}/web/"

echo "==> 远程安装依赖并构建（约 1～3 分钟，请等待）"
ssh -o ControlPath="$CONTROL" "${USER}@${HOST}" \
  "set -euo pipefail
   cd ${REMOTE_APP}/web
   if ! npm ci --registry https://registry.npmmirror.com; then
     echo '镜像源失败，回退官方源'
     npm ci --registry https://registry.npmjs.org
   fi
   NEXT_PUBLIC_BASE_PATH='' npm run build
   if [ ! -f .env.local ]; then
     echo '提示：尚未配置 DeepSeek 密钥'
   fi
   pm2 delete yuhaipei-portfolio 2>/dev/null || true
   pm2 start deploy/ecosystem.config.cjs
   pm2 save
   sleep 2
   curl -sS -o /dev/null -w '127.0.0.1:3000 → HTTP %{http_code}\n' http://127.0.0.1:3000/ || true
   pm2 list
  "

echo "完成。"
