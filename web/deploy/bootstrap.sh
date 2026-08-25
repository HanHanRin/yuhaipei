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
NPM_OFFICIAL="https://registry.npmjs.org"
# Next.js 16 与其工具链要求 ^20.19 || ^22.13 || >=24。
# 只比较大版本号是不够的——阿里云镜像预装的 v22.0.0 大版本满足但实际过旧。
NODE_MIN_MAJOR=22
NODE_MIN_MINOR=13

if [ "$(id -u)" -ne 0 ]; then
  echo "需要 root 权限，请用 sudo 执行" >&2
  exit 1
fi

step() { echo; echo "==> $*"; }

step "安装系统依赖"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl git ca-certificates xz-utils

# 版本够不够：主版本更高直接过；主版本相同则看次版本
node_ok() {
  command -v node >/dev/null 2>&1 || return 1
  local v major minor
  v=$(node -v | sed 's/^v//')
  major=${v%%.*}
  minor=$(echo "$v" | cut -d. -f2)
  [ "$major" -gt "$NODE_MIN_MAJOR" ] && return 0
  [ "$major" -eq "$NODE_MIN_MAJOR" ] && [ "$minor" -ge "$NODE_MIN_MINOR" ] && return 0
  return 1
}

install_node() {
  # 注意：npmmirror 的 latest-v22.x 目录会列出很多历史版本，
  # 用 head -1 会拿到最旧的 v22.0.0（这正是上次失败的原因）。
  # 优先读版本索引取最新 v22，失败再对目录列表做版本排序。
  local ver="" tarball="" url=""
  ver=$(curl -fsSL "https://cdn.npmmirror.com/binaries/node/index.json" \
    | python3 -c '
import sys, json
vers = [x["version"] for x in json.load(sys.stdin) if x["version"].startswith("v22.")]
print(sorted(vers, key=lambda v: [int(p) for p in v[1:].split(".")])[-1])
' 2>/dev/null || true)

  if [ -n "$ver" ]; then
    tarball="node-${ver}-linux-x64.tar.xz"
    url="https://cdn.npmmirror.com/binaries/node/${ver}/${tarball}"
  else
    local base="${NPM_MIRROR}/-/binary/node/latest-v22.x"
    tarball=$(curl -fsSL "$base/" \
      | grep -oE 'node-v22\.[0-9]+\.[0-9]+-linux-x64\.tar\.xz' \
      | sort -t. -k2,2n -k3,3n \
      | tail -1)
    url="${base}/${tarball}"
  fi

  if [ -z "$tarball" ]; then
    echo "    镜像取版本号失败，回退 NodeSource"
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y -qq nodejs
    return
  fi

  echo "    ${tarball}"
  curl -fsSL "$url" -o /tmp/node.tar.xz
  rm -rf /usr/local/lib/nodejs
  mkdir -p /usr/local/lib/nodejs
  tar -xJf /tmp/node.tar.xz -C /usr/local/lib/nodejs --strip-components=1
  rm -f /tmp/node.tar.xz
  # 覆盖 /usr/local/bin；并尽量盖掉系统预装的 /usr/bin/node（阿里云镜像常有旧版）
  ln -sf /usr/local/lib/nodejs/bin/node /usr/local/bin/node
  ln -sf /usr/local/lib/nodejs/bin/npm /usr/local/bin/npm
  ln -sf /usr/local/lib/nodejs/bin/npx /usr/local/bin/npx
  ln -sf /usr/local/lib/nodejs/bin/node /usr/bin/node
  ln -sf /usr/local/lib/nodejs/bin/npm /usr/bin/npm
  ln -sf /usr/local/lib/nodejs/bin/npx /usr/bin/npx
  hash -r
  export PATH="/usr/local/bin:/usr/bin:$PATH"
}

NODE_REINSTALLED=0
if node_ok; then
  echo "    已有 node $(node -v)，版本满足要求"
else
  step "安装 Node.js（现有 $(node -v 2>/dev/null || echo '无') 版本过低）"
  install_node
  hash -r
  if ! node_ok; then
    echo "Node 安装后版本仍不满足（当前 $(node -v)），中止" >&2
    exit 1
  fi
  NODE_REINSTALLED=1
fi
echo "    node $(node -v) / npm $(npm -v)"

step "配置 npm 镜像源"
# 只设 registry。sharp 0.34 起改用 optional dependencies 分发预编译包
# （@img/sharp-linux-x64），不再在安装时单独下载二进制，
# 所以走 registry 镜像就够了，不需要额外的 sharp_binary_host——
# 而且 npm 11 会直接拒绝这类未知配置项。
npm config set registry "$NPM_MIRROR" --global

# 换过 Node 就重装 PM2：旧的装在上一版 Node 的全局目录下，
# 原生依赖是对着旧版本编译的，留着容易出莫名其妙的问题。
if [ "$NODE_REINSTALLED" -eq 1 ] || ! command -v pm2 >/dev/null 2>&1; then
  step "安装 PM2"
  npm install -g pm2 --registry "$NPM_MIRROR" --silent
  ln -sf /usr/local/lib/nodejs/bin/pm2 /usr/local/bin/pm2 2>/dev/null || true
  hash -r
fi
echo "    pm2 $(pm2 -v 2>/dev/null || echo '未就绪')"

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
# npmmirror 对 electron-to-chromium 这类高频发版的包偶尔会同步滞后，
# 命中 lockfile 锁定的版本时会 404。镜像失败就回退官方源重装（慢但一定有货）。
if ! npm ci --registry "$NPM_MIRROR"; then
  echo
  echo "    镜像源缺包，回退官方源重试"
  npm ci --registry "$NPM_OFFICIAL"
fi

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
