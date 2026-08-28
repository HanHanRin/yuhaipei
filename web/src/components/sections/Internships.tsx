"use client";

import type { SlideMeta } from "@/components/portfolio/data";
import EditorialMedia, {
  type EditorialMediaItem,
  type EditorialMediaVariant,
} from "@/components/portfolio/EditorialMedia";

type InternshipProject = SlideMeta & {
  focus: string;
  points: readonly string[];
  media?: readonly EditorialMediaItem[];
  mediaVariant?: EditorialMediaVariant;
  mediaCredit?: string;
};

type Internship = {
  id: string;
  shortName: string;
  company: string;
  blurb: string;
  intro: string;
  role: string;
  dates: string;
  companyMedia?: readonly EditorialMediaItem[];
  companyMediaCredit?: string;
  projects: readonly InternshipProject[];
};

export const INTERNSHIPS: readonly Internship[] = [
  {
    id: "azazie",
    shortName: "Azazie",
    company: "Azazie 网络科技有限公司",
    blurb: "跨境电商 · 全球化婚纱礼服与成衣零售",
    intro:
      "面向全球婚礼场景的 DTC 礼服电商，以按需定制、包容尺码和线上服务体验连接不同市场的消费者。",
    role: "AI 产品经理实习",
    dates: "2026.05 — 2026.07",
    companyMediaCredit: "品牌场景参考 · AZAZIE 官网截图 · 2026.08",
    companyMedia: [
      {
        src: "/portfolio/azazie/azazie-bridal-home.webp",
        alt: "AZAZIE 官网婚纱礼服系列页面截图",
        label: "BRAND CONTEXT",
        objectPosition: "center top",
      },
    ],
    projects: [
      {
        id: "customer-service",
        title: "智能客服",
        focus: "跨境电商 AI 客服 Skill 质量闭环",
        points: [
          "将客服培训与真实话术沉淀为 SOP，再转为 AI 可执行 AOP",
          "按意图识别→场景判断→信息查询→结果反馈→异常兜底→转人工拆解 Skill 路径",
          "负责 6 个已上线 Skill，相关场景工单占比超 40%，回答准确率由 20%+ 提升至 70%+",
        ],
      },
      {
        id: "quality-platform",
        title: "质检平台",
        focus: "从“生成回复”到“实际发送”的全链路质量观测",
        points: [
          "用命中率、准确率、通过率、发送率观察进入场景→正确回复→通过审查→实际发送",
          "参与 Skill 指标观察面板，把问题按意图、路径、规则、接口、边界与表达质量归因",
          "建立 Bad Case 回归与机器人审查机制，拦截不合格回复并优先异常兜底 / 转人工",
        ],
        mediaVariant: "dashboard",
        mediaCredit: "内部平台界面 · 仅用于个人作品集展示",
        media: [
          {
            src: "/portfolio/azazie/quality-inspection.webp",
            alt: "Azazie AI 质检平台总览界面",
            label: "AI 质检",
            objectPosition: "left top",
          },
          {
            src: "/portfolio/azazie/quality-analysis.webp",
            alt: "Azazie 质检平台分类分析看板",
            label: "分析看板",
            objectPosition: "left top",
          },
          {
            src: "/portfolio/azazie/quality-assistant.webp",
            alt: "Azazie 质检平台 AI 助手回答界面",
            label: "AI 助手",
            objectPosition: "left top",
          },
        ],
      },
      {
        id: "workflow-automation",
        title: "工作流自动化",
        focus: "跨部门 AI Workflow 与服务体验调研",
        points: [
          "基于 n8n 为视频投放部门搭建视频自动抽帧审核工作流",
          "完成 4 家语音客服竞品、8 轮全盘测试并输出报告",
          "参与 AIGC 宣传图辅助生产工具，将零散人工步骤组织为可复用流程",
        ],
      },
    ],
  },
  {
    id: "zhujie",
    shortName: "逐界",
    company: "深圳逐界科技有限公司",
    blurb: "建筑规划垂类 AI 产品 · 项目制协作",
    intro:
      "聚焦建筑、规划与景观专业流程的垂直 AI 团队，以项目制协作把行业知识转化为可验证的产品工作流。",
    role: "AI 产品经理实习（项目制）",
    dates: "2026.03 — 2026.04",
    projects: [
      {
        id: "canon-qa",
        title: "建规景问答助手",
        focus: "可追溯的建筑规划规范 RAG 工作台",
        points: [
          "110+ 份问卷 / 访谈，将产品定义为“结论 + 规范原文 + 条文页码 + 适用条件”",
          "11 部规范、约 2905 知识块、100 题分层测试集，按拆解 / 检索 / 生成三层评测",
          "检索 F1 由 0.305 提升至 0.521，累计 600+ Bad Case，完成前后台 MVP 与部署",
        ],
        mediaVariant: "citations",
        mediaCredit: "产品原型 · 引用、原文与质量评测",
        media: [
          {
            src: "/portfolio/yuangui/yuangui-citations.webp",
            alt: "建规景问答助手带规范引用的回答界面",
            label: "引用式回答",
            objectPosition: "left top",
          },
          {
            src: "/portfolio/yuangui/yuangui-source.webp",
            alt: "建规景问答助手规范 PDF 原文预览",
            label: "原文溯源",
            objectPosition: "left top",
          },
          {
            src: "/portfolio/yuangui/yuangui-evaluation.webp",
            alt: "建规景问答助手评估系统界面",
            label: "评测系统",
            objectPosition: "left top",
          },
        ],
      },
      {
        id: "contract-review",
        title: "合同审查助手",
        focus: "企业购销合同 AI 审查与人工复核闭环",
        points: [
          "搭建文档解析→条款抽取→规则匹配→风险判断→建议生成→人工复核链路",
          "支持买卖方双立场、快速 / 精细双模式与结构化风险报告",
          "10 份合同 × DeepSeek / Doubao / Qwen 共 30 次专项评测，形成快速初筛 + 精细主审 + 规则库 / 人工兜底分工",
        ],
      },
    ],
  },
  {
    id: "fudan",
    shortName: "复旦",
    company: "复旦大学金融研究中心消费市场大数据实验室",
    blurb: "高校金融研究 · 消费与产业数据",
    intro:
      "面向消费市场与产业研究的高校实验室，强调多源数据治理、结构化分析与研究成果表达。",
    role: "数据分析员（兼职实习）",
    dates: "2025.09 — 2025.11",
    projects: [
      {
        id: "industry-data",
        title: "产业与文旅数据",
        focus: "产业链关键词与文旅数据整理",
        points: [
          "主导新能源、光伏、生物医药、数字经济等产业链关键词体系",
          "基于高德地图 API 等整理 370+ 场馆信息与 3900+ 演出赛事记录",
          "将 50+ 页规划报告提炼为 35 页汇报，使用 Coze 工作流辅助文本处理",
        ],
      },
    ],
  },
  {
    id: "tongji",
    shortName: "同济院",
    company: "上海同济城市规划设计研究院 / 云舟识景",
    blurb: "规划设计院 · 城市更新与空间智能",
    intro:
      "依托规划设计与城市更新场景，把空间数据、现场认知与多模态模型连接到专业决策流程。",
    role: "AI 产品与研究实习项目",
    dates: "2025.09 — 2026.01",
    projects: [
      {
        id: "streetscape-ai",
        title: "街景语义多模态平台",
        focus: "城市更新街景语义多模态 AI 平台",
        points: [
          "将踏勘→识别→统计→诊断→成文重构为视觉感知→知识检索→推理生成",
          "拆分 SAM3 分割、Qwen3-VLM 视觉描述、Qwen3-LLM 知识增强推理职责",
          "专家评审与现场踏勘结论符合度超 85%；相关论文第二作者",
        ],
      },
    ],
  },
] as const;

export const internshipProjectSlides = (companyIndex: number) =>
  INTERNSHIPS[companyIndex]?.projects ?? INTERNSHIPS[0].projects;

type Props = {
  company: number;
  project: number;
  onCompanySelect: (index: number) => void;
};

export default function Internships({
  company,
  project,
  onCompanySelect,
}: Props) {
  return (
    <div className="sec-intern">
      <div
        className="intern-company-track"
        style={{ transform: `translateY(-${company * 100}%)` }}
      >
        {INTERNSHIPS.map((item, companyIndex) => (
          <div
            className="intern-company-page"
            key={item.id}
            aria-hidden={companyIndex !== company}
          >
            <div
              className="intern-project-track"
              style={{
                transform: `translateX(-${
                  companyIndex === company ? project * 100 : 0
                }%)`,
              }}
            >
              {item.projects.map((itemProject, projectIndex) => (
                <article
                  className="sec-panel intern-panel"
                  key={itemProject.id}
                  aria-hidden={
                    companyIndex !== company || projectIndex !== project
                  }
                >
                  <div
                    className={`intern-layout${
                      itemProject.media ? " has-project-media" : ""
                    }`}
                  >
                    <header className="intern-company-header">
                      <div className="intern-kicker">
                        02 · INTERNSHIP /{" "}
                        {String(companyIndex + 1).padStart(2, "0")}
                      </div>
                      <p className="intern-company-blurb">{item.blurb}</p>
                      <h2 className="intern-company">{item.company}</h2>
                      <div className="intern-role-row">
                        <strong>{item.role}</strong>
                        <span>{item.dates}</span>
                      </div>
                      <p className="intern-company-intro">{item.intro}</p>
                      {item.companyMedia && !itemProject.media ? (
                        <div className="intern-company-media">
                          <EditorialMedia
                            items={item.companyMedia}
                            variant="company"
                            credit={item.companyMediaCredit}
                            compact
                          />
                        </div>
                      ) : null}
                    </header>

                    <div className="intern-project-stage">
                      {itemProject.media && itemProject.mediaVariant ? (
                        <div className="intern-project-media">
                          <EditorialMedia
                            items={itemProject.media}
                            variant={itemProject.mediaVariant}
                            credit={itemProject.mediaCredit}
                            compact
                          />
                        </div>
                      ) : null}
                      <div className="intern-project-copy">
                        <div className="intern-project-meta">
                          <span>PROJECT</span>
                          <i>
                            {String(projectIndex + 1).padStart(2, "0")} /{" "}
                            {String(item.projects.length).padStart(2, "0")}
                          </i>
                        </div>
                        <h3 className="intern-focus">{itemProject.focus}</h3>
                        <ul className="intern-points">
                          {itemProject.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      <nav className="intern-company-nav" aria-label="实习经历">
        {INTERNSHIPS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={index === company ? "is-active" : ""}
            onClick={() => onCompanySelect(index)}
            aria-current={index === company ? "true" : undefined}
          >
            <i>{String(index + 1).padStart(2, "0")}</i>
            <span>{item.shortName}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
