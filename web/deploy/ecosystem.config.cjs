/*
  PM2 进程配置。
  用 .cjs 后缀是因为 package.json 里声明了 "type": "module"，
  而 PM2 读配置走的是 CommonJS。

  启动：pm2 start deploy/ecosystem.config.cjs
  重启：pm2 reload yuhaipei-portfolio
  开机自启：pm2 startup 之后再 pm2 save
*/
module.exports = {
  apps: [
    {
      name: "yuhaipei-portfolio",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/yuhaipei/web",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // 站点挂在域名/IP 根目录，不需要 GitHub Pages 那套子路径前缀
        NEXT_PUBLIC_BASE_PATH: "",
      },
      max_memory_restart: "600M",
      error_file: "/var/log/yuhaipei/error.log",
      out_file: "/var/log/yuhaipei/out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
