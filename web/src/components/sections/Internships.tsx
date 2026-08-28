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
    dates: "2026.05 — 至今",
    companyMediaCredit: "品牌场景参考 · AZAZIE 官网截图 · 2026.08",
    companyMedia: [
      {
        src: "/portfolio/azazie/azazie-bridal-home.webp",
        alt: "AZAZIE 官网婚纱礼服系列页面截图",
        label: "BRAND CONTEXT",
        objectPosition: "center center",
        fit: "contain",
      },
    ],
    projects: [
      {
        id: "customer-service",
        title: "智能客服",
        focus: "电商 AI 客服 Skill 体系建设与回复风控",
        points: [
          "按购物全流程拆解场景，负责售前引导、订单查询、退货退款、风控拉黑等 7 个 Skills，按「识别-拆解-路由」分发处理",
          "将客服业务逻辑落成 AI 可执行操作，依照 SOP 生成回复；Skills 全部评审上线，承接 40%+ 工单量",
          "设计三层漏斗式审核（工具/政策证据 + 路由准确 + 质量评分），负责场景 CSAT 由 60% 提升至约 90%",
        ],
      },
      {
        id: "quality-platform",
        title: "质检平台",
        focus: "供应链 AI 质检：退货、客评与工厂检验对齐",
        points: [
          "统一款号对齐退货损失、用户评价与工厂检验三类数据，定位异常款并优先高销高退货",
          "AI 归类问题原因后映射到质检 SOP 检查步骤，减少无差别质检投入",
          "首个退货数据模块已上线，打通从感知到生产端证据的质检闭环",
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
        focus: "跨部门 AI 提效工作流",
        points: [
          "解决投放素材人工逐条审核、达人合作跟进易遗漏的问题",
          "视频审核侧串联关键帧抽取、多模态模型审核与人工复审，按「自动通过 / 拦截 / 转人工」分流并回填任务表",
          "KOL 侧以状态机编排 7 条工作流，覆盖找人、发信、追发、回复识别、寄样与作品监测全链路；两条链路均已交付",
        ],
        mediaVariant: "flows",
        mediaCredit: "n8n 工作流编排 · 视频审核与 KOL 全链路",
        media: [
          {
            src: "/portfolio/azazie/n8n-video-review.webp",
            alt: "n8n 多国家视频审核自动化工作流画布",
            label: "视频审核",
          },
          {
            src: "/portfolio/azazie/n8n-kol-outreach.webp",
            alt: "n8n KOL 合作邮箱自动获取工作流画布",
            label: "达人触达",
          },
          {
            src: "/portfolio/azazie/n8n-kol-monitor.webp",
            alt: "n8n KOL 物流与发文监测工作流画布",
            label: "寄样与作品监测",
          },
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
          "将国标与地方规范建成 RAG 知识库，答案可回溯规范名、条文号与页码；落地快照浮窗等交互",
          "独立完成前后台并部署上线，覆盖 11 部规范、约 2900 个知识块",
          "检索准确率提升至 0.521，相对提升约 71%",
        ],
        mediaVariant: "citations",
        mediaCredit: "产品原型 · 引用式回答、原文溯源与智能助手",
        media: [
          {
            src: "/portfolio/yuangui/canon-citations.webp",
            alt: "建规景问答助手带规范引用与条文出处的回答界面",
            label: "引用式回答",
            objectPosition: "left top",
          },
          {
            src: "/portfolio/yuangui/canon-helper-chat.webp",
            alt: "建规景问答助手对话式检索界面",
            label: "问答助手",
            objectPosition: "left top",
          },
          {
            src: "/portfolio/yuangui/yuangui-source.webp",
            alt: "建规景问答助手规范 PDF 原文预览",
            label: "原文溯源",
            objectPosition: "left top",
          },
        ],
      },
      {
        id: "contract-review",
        title: "合同审查助手",
        focus: "企业购销合同 AI 审查与人工复核闭环",
        points: [
          "将合同初审拆为六段工作流，支持买方/卖方立场与快速/精细双模式",
          "按业务场景与用户身份设计差异化风险判定及建议，完成网页端 MVP 并部署",
          "以 10 份购销合同 × 3 个模型共 30 次评测确定选型策略",
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
    role: "AI 产品研究",
    dates: "2025.09 — 2026.01",
    projects: [
      {
        id: "streetscape-ai",
        title: "街景语义多模态平台",
        focus: "云舟识景街景 AI 分析平台",
        points: [
          "将规划师「实地踏勘-识别-统计-成文」重构为「图像识别-知识检索-报告生成」三段式工作流",
          "输出报告经专家评审，与现场实地踏勘结论符合度超 85%",
          "相关成果发表论文",
        ],
        mediaVariant: "poster",
        mediaCredit: "学术墙报 ·《大模型赋能的街区尺度街景语义智能分析研究》· 2026 中国城市规划年会",
        media: [
          {
            src: "/portfolio/tongji/streetscape-poster.webp",
            alt: "大模型赋能的街区尺度街景语义智能分析研究学术墙报",
            label: "学术墙报",
          },
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
                    }${
                      itemProject.mediaVariant === "poster"
                        ? " has-poster-media"
                        : ""
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
