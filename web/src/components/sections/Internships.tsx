"use client";

type Props = {
  slide: number;
};

const INTERNS = [
  {
    id: "azazie",
    company: "Azazie 网络科技有限公司",
    blurb: "跨境电商 · 全球化婚纱礼服与成衣零售",
    role: "AI 产品经理实习",
    dates: "2026.05 — 2026.07",
    focus: "跨境电商 AI 客服 Skill 质量闭环",
    points: [
      "将人工 SOP 转为可执行 AOP，拆解意图→查询→反馈→转人工路径",
      "负责 6 个已上线 Skill；相关场景工单占比超 40%",
      "准确率由 20%+ 提升至 70%+；命中/通过/发送全链路指标与 Bad Case 回归",
    ],
  },
  {
    id: "zhujie",
    company: "深圳逐界科技有限公司",
    blurb: "建筑规划垂类 AI 产品 · 项目制协作",
    role: "AI 产品经理实习（项目制）",
    dates: "2026.03 — 2026.04",
    focus: "建规景规范问答 + 合同 AI 审查",
    points: [
      "可追溯规范工作台：结论 + 原文 + 条文页码；检索 F1 0.305→0.521",
      "11 部规范 · ~2905 知识块 · 100 题评测 · 600+ Bad Case",
      "合同审查：解析→抽取→规则→风险→建议→人工复核闭环",
    ],
  },
  {
    id: "fudan",
    company: "复旦大学金融研究中心消费市场大数据实验室",
    blurb: "高校金融研究 · 消费与产业数据",
    role: "数据分析员（兼职实习）",
    dates: "2025.09 — 2025.11",
    focus: "产业链关键词与文旅数据整理",
    points: [
      "新能源 / 光伏 / 生物医药 / 数字经济等关键词体系",
      "370+ 场馆 · 3900+ 演出赛事记录整理",
      "50+ 页规划报告提炼为 35 页汇报；Coze 辅助文本处理",
    ],
  },
  {
    id: "tongji",
    company: "上海同济城市规划设计研究院 / 云舟识景",
    blurb: "规划设计院 · 城市更新与空间智能",
    role: "AI 产品与研究实习项目",
    dates: "2025.09 — 2026.01",
    focus: "街景语义多模态 AI 平台",
    points: [
      "踏勘流程重构为视觉感知→知识检索→推理生成",
      "SAM3 + Qwen3-VLM + Qwen3-LLM 职责拆分",
      "专家评审符合度超 85%；论文第二作者",
    ],
  },
] as const;

export default function Internships({ slide }: Props) {
  return (
    <div className="sec-intern">
      <div
        className="sec-rail"
        style={{ transform: `translateX(-${slide * 100}%)` }}
      >
        {INTERNS.map((item, index) => (
          <article className="sec-panel intern-panel" key={item.id}>
            <div className="intern-kicker">
              02 · INTERNSHIP / {String(index + 1).padStart(2, "0")}
            </div>
            <p className="intern-company-blurb">{item.blurb}</p>
            <h2 className="intern-company">{item.company}</h2>
            <div className="intern-role-row">
              <strong>{item.role}</strong>
              <span>{item.dates}</span>
            </div>
            <h3 className="intern-focus">{item.focus}</h3>
            <ul className="intern-points">
              {item.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
