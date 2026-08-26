"use client";

import { asset } from "@/components/portfolio/data";

type Props = {
  slide: number;
};

const PROJECTS = [
  {
    id: "cmb",
    tag: "竞赛",
    title: "招商银行 · 行业景气度智能研究",
    note: "第 10 季数字金融训练营 · 优秀英才奖团队",
    body: "任务 2.2 主要负责人。两天内完成对公场景建模，将 Multi-Agent 流程产品化为「取数-归纳-打分-评级-研报生成」闭环；八维景气度、证据链溯源与报告导出。个人获高级认证与评委「小金喵」。",
    image: "/cmb-dashboard.png",
    alt: "行业景气度智能研究工作台界面",
  },
  {
    id: "opc",
    tag: "社区",
    title: "OPC AI 创业者社区",
    note: "内容待补 · 气氛图暂用现场照片",
    body: "此处预留给 OPC AI 创业者社区相关经历与产出。配图为临时现场图；若有产品截图或活动海报，放到 public 后可替换。",
    image: "/opc-site-1.jpg",
    alt: "OPC 相关现场气氛图（临时）",
    tempImage: true,
  },
  {
    id: "yuangui",
    tag: "产品",
    title: "元规 · 专业规范问答工作台",
    note: "知识检索 · 引用溯源 · 专家流程",
    body: "垂类规范 RAG：把专业规范从翻 PDF 变成可检索、可溯源的问答工作台。对应逐界「建规景」实践中的调研、评测与部署闭环。",
    image: "/canon-home.png",
    alt: "元规规范问答工作台界面",
  },
  {
    id: "xiaocai",
    tag: "产品",
    title: "搭小财 · 对话式消费洞察",
    note: "自然语言记账 · 周报 · 目标陪伴",
    body: "C 端对话式产品骨架：用自然语言完成记账与消费洞察，强调陪伴式目标管理。细节指标后续补全。",
    image: "/xiaocai-hero.png",
    alt: "搭小财产品界面",
  },
] as const;

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
              <div className="project-visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(item.image)} alt={item.alt} />
                {"tempImage" in item && item.tempImage ? (
                  <span className="project-visual-note">临时气氛图</span>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
