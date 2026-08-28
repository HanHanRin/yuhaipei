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
    body: "带领团队面向银行对公客户经理设计行业景气度分析工具，将多智能体流程产品化为「取数-归纳-打分-评级-生成研报」闭环；八个维度评分均可点击回溯原始证据。小组获优秀英才奖团队，个人获评委特别奖「小金喵」。",
    mediaVariant: "showcase",
    mediaCredit: "决赛产品原型与展示海报 · 八维景气研究面板为核心",
    media: [
      {
        src: "/portfolio/cmb/cmb-eight-dim.webp",
        alt: "行业景气八维研究面板界面",
        label: "八维研究面板",
        objectPosition: "left top",
      },
      {
        src: "/portfolio/cmb/cmb-poster.webp",
        alt: "招商银行金融训练营第 8 组产品展示海报",
        label: "总海报",
        fit: "contain",
      },
      {
        src: "/portfolio/cmb/cmb-canvas.webp",
        alt: "对公智能营销工作台的营销方案画布策略生成界面",
        label: "方案画布",
        objectPosition: "left top",
      },
      {
        src: "/portfolio/cmb/cmb-report.webp",
        alt: "行业景气完整研报中的雷达图与证据链界面",
        label: "研报证据链",
        objectPosition: "left top",
      },
      {
        src: "/portfolio/cmb/cmb-copilot.webp",
        alt: "客户经理数字外脑的营销 Copilot 问答浮窗界面",
        label: "营销 Copilot",
        objectPosition: "left top",
      },
    ],
  },
  {
    id: "opc",
    tag: "社区",
    title: "OPC AI 创业者社区",
    note: "调研与方案 · 空间设计 · 小程序与传播落地",
    body: "围绕张江数字游民 OPC 生态社区，将共享办公、社群交流与内容传播组织为连续的空间体验。我负责问卷调研与总结报告、建筑规划设计、AIGC 工作流搭建，以及小程序功能设计与需求提出。项目获《新民晚报》报道。",
    mediaVariant: "showcase",
    mediaCredit: "《新民晚报》报道 / 社区小程序 / 空间效果图",
    media: [
      {
        src: "/portfolio/opc/opc-press-full.webp",
        alt: "新民晚报关于张江数字游民 OPC 生态社区的整版报道",
        label: "《新民晚报》报道",
        fit: "contain",
      },
      {
        src: "/portfolio/opc/opc-mini-1.webp",
        alt: "OPC 社区小程序社区首页与房源预订界面",
        label: "社区首页",
        objectPosition: "center top",
      },
      {
        src: "/portfolio/opc/opc-mini-3.webp",
        alt: "OPC 社区小程序市集与服务界面",
        label: "社群服务",
        objectPosition: "center top",
      },
      {
        src: "/portfolio/opc/opc-mini-2.webp",
        alt: "OPC 社区小程序个人中心与事业服务界面",
        label: "游民档案",
        objectPosition: "center top",
      },
      {
        src: "/portfolio/opc/opc-render.webp",
        alt: "OPC AI 创业者社区木质共享空间效果图",
        label: "空间方案",
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
