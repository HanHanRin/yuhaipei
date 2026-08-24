import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "叙事型作品集 · 动效示例 V1.1",
  description: "一个用于观察页面切换和图片展示方式的轻量作品集原型。",
  icons: {
    icon: "/favicon.svg",
  },
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
