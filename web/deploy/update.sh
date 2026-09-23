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

# 国内服务器直连 GitHub 常 TLS 超时；先试 origin，失败再换镜像。
fetch_ok=0
if git fetch --depth 1 origin main; then
  git reset --hard origin/main
  fetch_ok=1
else
  echo "origin 拉取失败，尝试 GitHub 镜像…"
  for mirror in \
    "https://ghfast.top/https://github.com/HanHanRin/yuhaipei.git" \
    "https://gitclone.com/github.com/HanHanRin/yuhaipei.git" \
    "https://mirror.ghproxy.com/https://github.com/HanHanRin/yuhaipei.git"
  do
    echo "  → ${mirror}"
    if git fetch --depth 1 "$mirror" main; then
      git reset --hard FETCH_HEAD
      fetch_ok=1
      break
    fi
  done
fi

if [ "$fetch_ok" -ne 1 ]; then
  echo "所有 Git 源均失败。可在本机执行 deploy/push-from-mac.sh 直传代码。" >&2
  exit 1
fi

cd "${APP_DIR}/web"
# npmmirror 偶发缺包时回退官方源
if ! npm ci --registry https://registry.npmmirror.com; then
  echo "镜像源缺包，回退官方 npm 源重试"
  npm ci --registry https://registry.npmjs.org
fi
NEXT_PUBLIC_BASE_PATH="" npm run build

# 若尚未放置密钥，聊天接口会提示未配置（见 .env.example）
if [ ! -f .env.local ]; then
  echo "提示：${APP_DIR}/web/.env.local 不存在，AI 分身对话在公网将不可用。"
  echo "      请执行：sudo bash ${APP_DIR}/web/deploy/setup-env.sh"
fi

pm2 reload deploy/ecosystem.config.cjs --update-env || pm2 start deploy/ecosystem.config.cjs

sleep 3
curl -sS -o /dev/null -w "127.0.0.1:3000 → HTTP %{http_code}\n" http://127.0.0.1:3000/
