"use client";

import EditorialMedia, {
  type EditorialMediaItem,
  type EditorialMediaVariant,
} from "@/components/portfolio/EditorialMedia";

type Props = {
  slide: number;
};

type Project = {
  id: string;
  tag: string;
  title: string;
  note: string;
  body: string;
  media: readonly EditorialMediaItem[];
  mediaVariant: EditorialMediaVariant;
  mediaCredit: string;
};

const PROJECTS: readonly Project[] = [
  {
    id: "cmb",
    tag: "竞赛",
    title: "招商银行 · 行业景气度智能研究",
    note: "第 10 季数字金融训练营 · 优秀英才奖团队",
    body: "任务 2.2 主要负责人。两天内完成对公场景建模，将 Multi-Agent 流程产品化为「取数-归纳-打分-评级-研报生成」闭环；八维景气度、证据链溯源与报告导出。个人获高级认证与评委「小金喵」。",
    mediaVariant: "dashboard",
    mediaCredit: "决赛产品原型 · 八维评分 / 证据链 / 数据溯源",
    media: [
      {
        src: "/portfolio/cmb/cmb-overview.webp",
        alt: "招商银行行业景气度智能研究八维评分首页",
        label: "八维评分",
        objectPosition: "left top",
      },
      {
        src: "/portfolio/cmb/cmb-evidence.webp",
        alt: "行业景气完整研报中的雷达图与证据链界面",
        label: "研报证据链",
        objectPosition: "left top",
      },
      {
        src: "/portfolio/cmb/cmb-sources.webp",
        alt: "行业景气数据来源与行内外溯源界面",
        label: "数据溯源",
        objectPosition: "left top",
      },
    ],
  },
  {
    id: "opc",
    tag: "社区",
    title: "OPC AI 创业者社区",
    note: "空间场景 · 社群服务 · 传播落地",
    body: "围绕张江数字游民 OPC 生态社区，将共享办公、社群交流与内容传播组织为连续的空间体验。作品以空间效果图、现场参与和媒体报道共同呈现从设想到落地的过程。",
    mediaVariant: "collage",
    mediaCredit: "空间效果图 / 项目现场 /《新民晚报》报道",
    media: [
      {
        src: "/portfolio/opc/opc-render.webp",
        alt: "OPC AI 创业者社区木质共享空间效果图",
        label: "空间方案",
      },
      {
        src: "/portfolio/opc/opc-field.webp",
        alt: "OPC AI 创业者社区项目现场汇报照片",
        label: "现场参与",
      },
      {
        src: "/portfolio/opc/opc-press.webp",
        alt: "新民晚报关于张江数字游民 OPC 生态社区的报道",
        label: "媒体报道",
        objectPosition: "center top",
      },
    ],
  },
  {
    id: "yuangui",
    tag: "产品",
    title: "元规 · 专业规范问答工作台",
    note: "知识检索 · 引用溯源 · 专家流程",
    body: "垂类规范 RAG：把专业规范从翻 PDF 变成可检索、可溯源的问答工作台。对应逐界「建规景」实践中的调研、评测与部署闭环。",
    mediaVariant: "citations",
    mediaCredit: "产品原型 · 回答、原文与评测闭环",
    media: [
      {
        src: "/portfolio/yuangui/yuangui-citations.webp",
        alt: "元规专业规范问答助手带引用的回答界面",
        label: "引用式回答",
        objectPosition: "left top",
      },
      {
        src: "/portfolio/yuangui/yuangui-source.webp",
        alt: "元规规范原文 PDF 来源预览界面",
        label: "原文溯源",
        objectPosition: "left top",
      },
      {
        src: "/portfolio/yuangui/yuangui-evaluation.webp",
        alt: "元规问答质量评估体系界面",
        label: "评测系统",
        objectPosition: "left top",
      },
    ],
  },
  {
    id: "xiaocai",
    tag: "产品",
    title: "搭小财 · 对话式消费洞察",
    note: "自然语言记账 · 周报 · 目标陪伴",
    body: "以对话作为低门槛入口，把消费识别、每周复盘、储蓄目标与冷静消费串成持续陪伴。产品不只记录支出，也在关键消费节点提供可行动的反馈。",
    mediaVariant: "phones",
    mediaCredit: "移动端原型 · 从记账到目标陪伴",
    media: [
      {
        src: "/portfolio/xiaocai/xiaocai-ledger.webp",
        alt: "搭小财识别日常消费并自动记账的手机界面",
        label: "日常记账",
      },
      {
        src: "/portfolio/xiaocai/xiaocai-weekly.webp",
        alt: "搭小财每周消费周报手机界面",
        label: "每周周报",
      },
      {
        src: "/portfolio/xiaocai/xiaocai-goal.webp",
        alt: "搭小财设定大理旅行储蓄目标的手机界面",
        label: "旅行基金",
      },
      {
        src: "/portfolio/xiaocai/xiaocai-cooldown.webp",
        alt: "搭小财冷静按钮消费决策辅助手机界面",
        label: "冷静按钮",
      },
    ],
  },
];

export default function Projects({ slide }: Props) {
  return (
    <div className="sec-projects">
      <div
        className="sec-rail"
        style={{ transform: `translateX(-${slide * 100}%)` }}
      >
        {PROJECTS.map((item, index) => (
          <article className="sec-panel project-panel" key={item.id}>
            <div className="project-layout">
              <div className="project-copy">
                <div className="project-kicker">
                  03 · PROJECTS / {String(index + 1).padStart(2, "0")}
                </div>
                <span className="project-tag">{item.tag}</span>
                <h2>{item.title}</h2>
                <p className="project-note">{item.note}</p>
                <p className="project-body">{item.body}</p>
              </div>
              <div className="project-media-wrap">
                <EditorialMedia
                  items={item.media}
                  variant={item.mediaVariant}
                  credit={item.mediaCredit}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
