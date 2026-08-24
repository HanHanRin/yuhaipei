import type { NextConfig } from "next";

/*
  两套构建目标共用这一份配置：

  1. GitHub Pages（当前）：STATIC_EXPORT=1，产出纯静态文件到 out/。
     页面所有交互（切幕、画廊、复制）都是浏览器里的 React 代码，
     静态导出不影响它们；受影响的只有需要服务器的能力——
     API 路由和 Next 的图片优化服务。

  2. 阿里云（备案下来之后）：不设 STATIC_EXPORT，走标准 Node 构建，
     那时才能跑 /api/chat 这类服务端接口。

  basePath 是因为 GitHub Pages 项目页挂在 /<仓库名> 下，
  站内所有资源都要带这个前缀，否则全部 404。
*/
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  basePath,
  // Pages 上没有服务器跑图片优化，只能直出原图（图片已提前压过）
  images: { unoptimized: isStaticExport },
  // 导出成 xxx/index.html，避免直接访问子路径时 404
  trailingSlash: true,
  // 让客户端代码也能读到前缀，用于拼接 <a href> 这类不会被自动加前缀的链接
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
