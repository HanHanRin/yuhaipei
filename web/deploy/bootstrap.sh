#!/usr/bin/env bash
#
# 服务器首次部署。在服务器上以 root 执行一次即可。
#
#   curl -fsSL https://raw.githubusercontent.com/HanHanRin/yuhaipei/main/web/deploy/bootstrap.sh | bash
#
# 之后要更新站点，用同目录下的 update.sh。
#
set -euo pipefail

REPO="https://github.com/HanHanRin/yuhaipei.git"
APP_DIR="/var/www/yuhaipei"
LOG_DIR="/var/log/yuhaipei"
NODE_MAJOR=22

echo "==> 安装系统依赖"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl git ca-certificates

if ! command -v node >/dev/null 2>&1 || [ "$(node -v | sed 's/v\([0-9]*\).*/\1/')" -lt "$NODE_MAJOR" ]; then
  echo "==> 安装 Node.js ${NODE_MAJOR}"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y -qq nodejs
fi
echo "    node $(node -v) / npm $(npm -v)"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "==> 安装 PM2"
  npm install -g pm2 --silent
fi

echo "==> 拉取代码到 ${APP_DIR}"
mkdir -p "$LOG_DIR"
if [ -d "${APP_DIR}/.git" ]; then
  git -C "$APP_DIR" fetch --depth 1 origin main
  git -C "$APP_DIR" reset --hard origin/main
else
  rm -rf "$APP_DIR"
  git clone --depth 1 "$REPO" "$APP_DIR"
fi

cd "${APP_DIR}/web"

echo "==> 安装依赖"
npm ci --omit=dev --silent || npm ci --silent

echo "==> 构建"
# 不设 STATIC_EXPORT，走标准 Node 构建，这样以后加 API 路由才跑得起来
NEXT_PUBLIC_BASE_PATH="" npm run build

echo "==> 启动进程"
pm2 delete yuhaipei-portfolio 2>/dev/null || true
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

echo
echo "完成。本机自检："
sleep 2
curl -sS -o /dev/null -w "  localhost:3000 → HTTP %{http_code}\n" http://127.0.0.1:3000/ || true
echo
echo "外网访问 http://<公网IP>:3000 之前，记得在阿里云控制台的"
echo "安全组 / 防火墙里放行 3000 端口的入方向 TCP。"
