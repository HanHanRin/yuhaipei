# 余海沛 · AI 产品经理作品集

一个纵向叙事的个人求职网页。五幕结构：封面 → 关于 → 作品 → 图像 → 联系。

线上地址：https://hanhanrin.github.io/yuhaipei/

## 技术栈

- Next.js 16（App Router）+ React 19
- Tailwind CSS v4 + 一份手写的 `globals.css`（当前视觉基本都在这里）
- TypeScript

## 本地开发

**最省事（推荐）**：在 Finder 里双击上一级目录的 `双击预览作品集.command`，会自动启动并打开浏览器。关掉终端窗口或按 `Ctrl+C` 即停止。

也可用终端：

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 生产构建
npm run lint
```

Node 版本要求 `>=20.9.0`。

> 不要指望「双击某个 .html」看完整动态效果。本站是 Next.js + React，切幕、画廊、手势都依赖本地服务；纯 HTML 离线打开只会变成缺样式/缺脚本的半成品。GitHub Pages 上的线上地址同样是完整动态页：https://hanhanrin.github.io/yuhaipei/

## 两套构建目标

同一份代码支持两种部署方式，靠环境变量切换。

**GitHub Pages（当前线上）** — 纯静态托管，没有服务端。

```bash
STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/yuhaipei npm run build
# 产物在 out/
```

推到 `main` 后由 `.github/workflows/deploy.yml` 自动构建发布，不用手工传文件。

页面所有交互——切幕转场、弧形画廊、复制按钮、键盘与手势导航——都是浏览器里跑的 React 代码，静态导出不影响它们。受影响的只有需要服务器的能力：API 路由和 Next 的图片优化服务。

**Node 服务器（阿里云，备案后启用）** — 不设 `STATIC_EXPORT`，走标准构建，那时才能跑 `/api/chat` 这类接口。站点在域名根目录，`NEXT_PUBLIC_BASE_PATH` 留空。

### basePath 的两个坑

项目页挂在 `/yuhaipei` 下，站内直链都要带前缀。有两处不会自动加：

1. 手写的 `<a href="/...">`
2. `next/image` 在 `unoptimized` 模式下输出的就是原始 src

代码里用 `asset()` 统一拼接。加新图片或新直链时记得走它，否则线上 404。

## 目录结构

```
src/
  app/
    layout.tsx          站点元信息 + AI 分身挂载
    page.tsx            首页入口
    portfolio-demo.tsx  五幕主组件（待拆分到 components/sections）
    globals.css         全站样式（含桌宠/聊天面板）
    api/chat/           本地/Node 部署时的 LLM 代理（静态导出构建会排除）
  components/
    ai-avatar/          右下角桌宠 + 聊天面板
    sections/           各幕组件（规划中）
  lib/ai-avatar/        system prompt、流式客户端、类型
public/                 图片、简历 PDF、claude-pet.png、.nojekyll
```

## 改造路线

当前是 V1：单页、五幕、无后端。后续按这个顺序推进。

- **P1 结构**：把 `portfolio-demo.tsx` 拆到 `components/sections/`；滚轮劫持改成原生滚动 + 锚点分幕；幕布切场改用 GSAP，只在点击导航时触发；进场动画换成 IntersectionObserver。
- **P2 深度**：定义统一的案例数据结构，给元规 / 行业景气研究 / 搭小财 各做一个 `/works/[slug]` 详情页，内容按「背景 → 我的角色与决策 → 技术范式 → 成果 → 反思」组织。
- **P3 AI 分身（本地已可用）**：右下角桌宠 + `/api/chat` 代理国内大模型。GitHub Pages 静态站仍无服务端聊天；阿里云 Node 部署后可公网启用。
- **P4 人格层**：可拖拽的爱好卡牌、书架、留言板。
- **P5 打磨**：移动端断点、`prefers-reduced-motion` 兜底、中文展示字体、SEO。

## 本地 AI 分身

右下角桌宠（临时借用 [cyj-personal-web](https://github.com/ChenYanjun-hub/cyj-personal-web) 外观）可回答履历/项目相关问题。

```bash
cp .env.example .env.local
# 编辑 .env.local，填入 DEEPSEEK_API_KEY
npm run dev   # 不要设 STATIC_EXPORT；双击「双击预览作品集.command」同样可以
```

密钥只存在服务端。GitHub Pages 构建会排除 `src/app/api`，线上只能看到桌宠 UI，聊天需本地或后续阿里云 Node 部署。

## 待办

- [ ] `public/resume/` 里的简历 PDF 含手机号与照片，公开下载前需要换成脱敏版
- [ ] 阿里云服务器 + 域名 + ICP 备案，用于承载 P3 的 AI 分身公网对话
- [ ] 替换临时借用的桌宠立绘与面板样式为自有资产
