/**
 * 作品集二维导航 · 章节与子页元数据
 * 竖向切章、横向切子页；文案框架期可少字，后续再填肉。
 */

export type SlideMeta = {
  id: string;
  title: string;
};

export type ChapterMeta = {
  id: string;
  label: string;
  short: string;
  /** 章底色 / 幕布色 */
  color: string;
  /** 顶栏与文字主题：light 深色字，dark 浅色字 */
  theme: "light" | "dark";
  slides: SlideMeta[];
};

export const chapters: ChapterMeta[] = [
  {
    id: "cover",
    label: "封面",
    short: "00",
    color: "#f3efe5",
    theme: "light",
    slides: [{ id: "hero", title: "名片" }],
  },
  {
    id: "resume",
    label: "简历",
    short: "01",
    color: "#fbfaf6",
    theme: "light",
    slides: [
      { id: "portrait", title: "身份" },
      { id: "education", title: "教育" },
      { id: "skills", title: "能力" },
    ],
  },
  {
    id: "intern",
    label: "实习",
    short: "02",
    color: "#44500f",
    theme: "dark",
    slides: [
      { id: "azazie", title: "Azazie" },
      { id: "zhujie", title: "逐界" },
      { id: "fudan", title: "复旦" },
      { id: "tongji", title: "同济院" },
    ],
  },
  {
    id: "projects",
    label: "项目",
    short: "03",
    color: "#b85132",
    theme: "dark",
    slides: [
      { id: "cmb", title: "招行景气度" },
      { id: "opc", title: "OPC" },
      { id: "yuangui", title: "元规" },
      { id: "xiaocai", title: "搭小财" },
    ],
  },
  {
    id: "life",
    label: "爱好",
    short: "04",
    color: "#eee7d8",
    theme: "light",
    slides: [
      { id: "books", title: "书" },
      { id: "film", title: "电影" },
      { id: "photo", title: "摄影" },
    ],
  },
  {
    id: "closing",
    label: "总结",
    short: "05",
    color: "#14140f",
    theme: "dark",
    slides: [{ id: "next", title: "下一步" }],
  },
];

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${BASE_PATH}${path}`;
export const RESUME_PATH = asset("/resume/余海沛-中文简历2026.8.pdf");

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
