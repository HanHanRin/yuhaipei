#!/usr/bin/env bash
#
# 服务器首次部署。在服务器上执行一次：
#
#   sudo bash /var/www/yuhaipei/web/deploy/bootstrap.sh
#
# 之后更新站点用同目录下的 update.sh。
#
# 针对国内服务器做了适配：Node 二进制和 npm 依赖都走阿里云的 npmmirror，
# 不依赖 deb.nodesource.com 和 registry.npmjs.org（这两个在国内经常超时）。
#
set -euo pipefail

REPO="https://github.com/HanHanRin/yuhaipei.git"
APP_DIR="/var/www/yuhaipei"
LOG_DIR="/var/log/yuhaipei"
NPM_MIRROR="https://registry.npmmirror.com"
NODE_MIN=20

if [ "$(id -u)" -ne 0 ]; then
  echo "需要 root 权限，请用 sudo 执行" >&2
  exit 1
fi

step() { echo; echo "==> $*"; }

step "安装系统依赖"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl git ca-certificates xz-utils

node_major() {
  command -v node >/dev/null 2>&1 || { echo 0; return; }
  node -v | sed 's/v\([0-9]*\).*/\1/'
}

if [ "$(node_major)" -lt "$NODE_MIN" ]; then
  step "安装 Node.js（从 npmmirror 取二进制，国内速度快）"
  # latest-v22.x 是个稳定的目录地址，里面放着该大版本的最新构建
  TARBALL=$(curl -fsSL "${NPM_MIRROR}/-/binary/node/latest-v22.x/" \
    | grep -o 'node-v22\.[0-9.]*-linux-x64\.tar\.xz' | head -1)

  if [ -n "$TARBALL" ]; then
    echo "    ${TARBALL}"
    curl -fsSL "${NPM_MIRROR}/-/binary/node/latest-v22.x/${TARBALL}" -o /tmp/node.tar.xz
    rm -rf /usr/local/lib/nodejs
    mkdir -p /usr/local/lib/nodejs
    tar -xJf /tmp/node.tar.xz -C /usr/local/lib/nodejs --strip-components=1
    rm -f /tmp/node.tar.xz
    ln -sf /usr/local/lib/nodejs/bin/node /usr/local/bin/node
    ln -sf /usr/local/lib/nodejs/bin/npm /usr/local/bin/npm
    ln -sf /usr/local/lib/nodejs/bin/npx /usr/local/bin/npx
  else
    echo "    镜像取版本号失败，回退到 NodeSource"
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y -qq nodejs
  fi
fi
echo "    node $(node -v) / npm $(npm -v)"

step "配置 npm 镜像源"
npm config set registry "$NPM_MIRROR" --global
# sharp 的预编译二进制也走镜像，否则装依赖时会卡在下载上
npm config set sharp_binary_host "${NPM_MIRROR}/-/binary/sharp" --global
npm config set sharp_libvips_binary_host "${NPM_MIRROR}/-/binary/sharp-libvips" --global

if ! command -v pm2 >/dev/null 2>&1; then
  step "安装 PM2"
  npm install -g pm2 --silent
  ln -sf /usr/local/lib/nodejs/bin/pm2 /usr/local/bin/pm2 2>/dev/null || true
fi

step "拉取代码到 ${APP_DIR}"
mkdir -p "$LOG_DIR"
if [ -d "${APP_DIR}/.git" ]; then
  git -C "$APP_DIR" fetch --depth 1 origin main
  git -C "$APP_DIR" reset --hard origin/main
else
  rm -rf "$APP_DIR"
  git clone --depth 1 "$REPO" "$APP_DIR"
fi

cd "${APP_DIR}/web"

step "安装依赖"
npm ci

step "构建"
# 不设 STATIC_EXPORT，走标准 Node 构建，这样以后加 API 路由才跑得起来
NEXT_PUBLIC_BASE_PATH="" npm run build

step "启动进程"
pm2 delete yuhaipei-portfolio 2>/dev/null || true
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

echo
step "本机自检"
sleep 3
curl -sS -o /dev/null -w "    127.0.0.1:3000 → HTTP %{http_code}\n" http://127.0.0.1:3000/ || true

echo
echo "部署完成。"
echo "外网访问 http://<公网IP>:3000 之前，"
echo "记得在阿里云控制台的安全组里放行 3000 端口的入方向 TCP。"
