---
name: deploy-yuhaipei-aliyun
description: >-
  Deploy the yuhaipei portfolio from this Mac to the Aliyun lightweight server
  (yuhaipei.cn / 139.224.220.27) via rsync+SSH, and configure DeepSeek for the
  chatbot. Use when the user asks to 部署、上线、同步到阿里云、更新 yuhaipei.cn、
  push 到服务器, or set DEEPSEEK_API_KEY on production.
---

# 部署作品集到阿里云（yuhaipei.cn）

## 背景

- 站点跑在**轻量应用服务器**（不是 ECS）：`139.224.220.27`，域名 `yuhaipei.cn`
- 应用目录：`/var/www/yuhaipei/web`，进程名 `yuhaipei-portfolio`（PM2）
- 国内服务器直连 GitHub 常 TLS 失败，**默认用本机 rsync 直传**，不要依赖 `git pull`
- 密钥文件 `web/.env.local` **永不入库**；rsync 已排除该文件

## 一键更新网站（本机 Mac 终端）

```bash
bash web/deploy/push-from-mac.sh
```

会：建立 SSH 复用会话（输一次 root 密码）→ rsync `web/` → 远程 `npm ci` + `next build` → PM2 重启。成功标志：`127.0.0.1:3000 → HTTP 200`。

环境变量可覆盖（可选）：

- `DEPLOY_HOST`（默认 `139.224.220.27`）
- `DEPLOY_USER`（默认 `root`）
- `DEPLOY_APP_DIR`（默认 `/var/www/yuhaipei`）

## 配置 / 更新 DeepSeek（小机器人）

本机终端（把 `sk-...` 换成 `web/.env.local` 里的密钥）：

```bash
ssh -tt root@139.224.220.27 'cat > /var/www/yuhaipei/web/.env.local << "EOF"
DEEPSEEK_API_KEY=sk-你的密钥
DEEPSEEK_MODEL=deepseek-v4-pro
DEEPSEEK_BASE_URL=https://api.deepseek.com
EOF
chmod 600 /var/www/yuhaipei/web/.env.local
cd /var/www/yuhaipei/web
pm2 delete yuhaipei-portfolio
pm2 start deploy/ecosystem.config.cjs
pm2 save'
```

或在服务器上：`sudo bash /var/www/yuhaipei/web/deploy/setup-env.sh`

对话模型默认 `deepseek-v4-pro`，thinking 已在代码里关闭。

## 登录服务器（密码忘了 / Workbench 失败时）

1. 阿里云控制台 → **轻量应用服务器**（不是 ECS）
2. 重置密码后**必须重启**实例
3. 远程连接 → **使用其他方式登录** → **Workbench 密码登录**，用户名 `root`
4. 或本机：`ssh root@139.224.220.27`

不要点「一键连接」——那是 admin 免密通道，与 root 密码无关。

## 代理排查

| 现象 | 处理 |
|------|------|
| GitHub `GnuTLS recv error` | 用 `push-from-mac.sh`，别用 `update.sh` 直连 GitHub |
| `HTTP 000` / 站点挂了 | `pm2 list`；无进程则 `cd /var/www/yuhaipei/web && pm2 start deploy/ecosystem.config.cjs` |
| 小机器人报未配置 KEY | 写 `.env.local` 后必须 `pm2 start deploy/ecosystem.config.cjs`（ecosystem 才会读入 env） |
| HTTPS 443 连不上 | 当前可能只开了 80；先用 `http://yuhaipei.cn` |

## Agent 执行约定

1. 优先跑 `web/deploy/push-from-mac.sh`；需要交互密码时让用户在系统「终端」执行，不要静默失败。
2. 不要把 `DEEPSEEK_API_KEY` 写进 git 或 skill 正文。
3. 部署后用 `curl http://yuhaipei.cn/` 与 `POST /api/chat/` 做冒烟（缺 key 会返回 `MISSING_API_KEY`）。
