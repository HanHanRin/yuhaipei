import type { Metadata } from "next";
import PortfolioDemo from "./portfolio-demo";

export const metadata: Metadata = {
  title: "叙事型作品集 · 动效示例",
  description: "整幕转场、项目图像与弧形画廊的轻量作品集示例。",
};

export default function Home() {
  return <PortfolioDemo />;
}
