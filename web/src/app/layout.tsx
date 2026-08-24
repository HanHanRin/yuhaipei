import type { Metadata, Viewport } from "next";
import "./globals.css";

// metadata 里的 icons 不会自动带 basePath，部署到子路径时要自己拼。
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "余海沛 · AI 产品经理作品集",
  description:
    "同济大学城市规划硕士在读，AI 产品经理。RAG 应用、AI Workflow 与模型评测的项目实证。",
  icons: {
    icon: `${BASE_PATH}/favicon.svg`,
  },
};

// viewportFit: "cover" 让背景延伸到刘海与 Home Indicator 安全区之下，
// 否则移动端在这两块区域会保留系统默认底色，表现为整幕背景上下各有一条白边。
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
