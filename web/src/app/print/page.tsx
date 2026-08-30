import type { Metadata } from "next";
import PortfolioPrint from "@/components/portfolio/PortfolioPrint";

export const metadata: Metadata = {
  title: "余海沛 · 作品集 PDF 导出",
  robots: { index: false, follow: false },
};

export default function PrintPage() {
  return <PortfolioPrint />;
}
