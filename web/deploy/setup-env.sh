#!/usr/bin/env bash
#
# 在服务器上写入 AI 分身密钥（不会进 git）。
#
#   sudo bash /var/www/yuhaipei/web/deploy/setup-env.sh
#
# 也可非交互：
#   sudo DEEPSEEK_API_KEY=sk-... bash /var/www/yuhaipei/web/deploy/setup-env.sh
#
set -euo pipefail

APP_DIR="/var/www/yuhaipei"
ENV_FILE="${APP_DIR}/web/.env.local"

if [ "$(id -u)" -ne 0 ]; then
  echo "需要 root 权限，请用 sudo 执行" >&2
  exit 1
fi

if [ -z "${DEEPSEEK_API_KEY:-}" ]; then
  if [ -t 0 ]; then
    printf "请粘贴 DeepSeek API Key（输入时不会回显）: "
    stty -echo
    IFS= read -r DEEPSEEK_API_KEY
    stty echo
    echo
  else
    echo "请设置 DEEPSEEK_API_KEY 后再运行，或在交互式终端执行本脚本。" >&2
    exit 1
  fi
fi

if [[ ! "$DEEPSEEK_API_KEY" =~ ^sk- ]]; then
  echo "密钥格式看起来不对（应以 sk- 开头），已中止，未改动现有文件。" >&2
  exit 1
fi

umask 077
cat > "$ENV_FILE" <<EOF
DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
DEEPSEEK_MODEL=deepseek-v4-pro
DEEPSEEK_BASE_URL=https://api.deepseek.com
EOF
chmod 600 "$ENV_FILE"

echo "已写入 ${ENV_FILE}（权限 600）"

cd "${APP_DIR}/web"
if pm2 describe yuhaipei-portfolio >/dev/null 2>&1; then
  # 必须走 ecosystem 文件 reload，才会重新读 .env.local
  pm2 reload deploy/ecosystem.config.cjs --update-env
else
  pm2 start deploy/ecosystem.config.cjs
fi

echo "完成。现在可以在 https://yuhaipei.cn 试对话。"
