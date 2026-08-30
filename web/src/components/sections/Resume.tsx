"use client";

import { asset } from "@/components/portfolio/data";

type Props = {
  slide: number;
};

const IDENTITY_STRENGTHS = [
  {
    label: "BAD CASE → ROOT CAUSE",
    title: "从失败案例找到真正问题",
    body: "拆解意图、流程、规则、接口与表达问题，用归因结果决定优化优先级，并通过同类场景回归验证。",
  },
  {
    label: "FROM INSIGHT TO SOLUTION",
    title: "把洞察变成可落地方案",
    body: "将模糊需求重构为可追溯、可评测的 Agent、Skill 或 Workflow，既提出新解法，也关注交付与质量边界。",
  },
  {
    label: "CROSS-DOMAIN GROWTH",
    title: "在跨领域中快速建立模型",
    body: "从城市规划到金融、电商与垂直 AI，快速理解新业务并完成交付；学习能力强，也保持足够的可塑性。",
  },
] as const;

const EDUCATION_TIMELINE = [
  {
    id: "undergraduate",
    index: "01",
    period: "2018.09 — 2023.07",
    title: "同济大学 · 城市规划本科",
    detailLabel: "COURSE",
    detail:
      "城市规划设计 · Python 编程 · 高等数学 · 统计学基础 · 地理信息技术",
    capability:
      "在城市、人口、交通与空间等多变量约束下训练系统分析与方案推演，建立基础编程、数据处理和复杂场景决策能力。",
  },
  {
    id: "practice",
    index: "02",
    period: "2023 — 2024",
    title: "同昊建筑设计有限公司 · 职业实践",
    detailLabel: "PROJECT",
    detail: "上海市崇明区城市规划 · 贵州省铜仁市城市规划",
    capability:
      "参与真实规划项目，与政府单位和多专业团队对接；完成问卷调研、数据分析与方案汇报，把调研证据转化为规划判断。这是一段连续的工作经历，而非履历空窗。",
  },
  {
    id: "postgraduate",
    index: "03",
    period: "2024.09 — 至今",
    title: "同济大学 · 城市规划硕士（2027 届）",
    detailLabel: "COURSE",
    detail:
      "统计学 · 数据分析 · 多代理人模拟原理与技术应用 · 空间行为分析方法 · 城市规划原理",
    capability:
      "深化统计推断、数据建模与多代理人模拟理解，学习把数学模型、行为数据和空间证据用于真实决策，形成“问题拆解—建模分析—验证结论”的完整方法。",
  },
] as const;

/**
 * 简历章 · 身份定位 / 教育与能力成长路径
 */
export default function Resume({ slide }: Props) {
  return (
    <div className="sec-resume">
      <div
        className="sec-rail"
        style={{ transform: `translateX(-${slide * 100}%)` }}
      >
        {/* 身份 */}
        <article className="sec-panel resume-portrait">
          <div className="resume-kicker">01 · RESUME / 个人简历</div>
          <div className="resume-split">
            <aside className="resume-id">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="resume-photo"
                src={asset("/portrait.jpg")}
                alt="余海沛"
              />
              <h2>
                余海沛
                <span>YU HAIPEI</span>
              </h2>
              <p className="resume-role">AI Product Manager</p>
              <p className="resume-loc">上海 · Shanghai</p>
            </aside>
            <div className="resume-about">
              <p className="resume-label">ABOUT ME</p>
              <h3>
                从城市系统到 AI 产品，我一直在做同一件事：
                <em>把复杂场景拆成可验证、可落地的决策路径。</em>
              </h3>
              <p className="resume-transition">
                城市规划训练让我习惯在多目标、多约束和不完整信息中寻找可解释的解决路径。转向产品，不是离开原有专业，而是希望把系统分析、数据判断与方案落地的长处，投入迭代更快、价值更可衡量的真实业务。
              </p>
              <ul className="resume-strengths">
                {IDENTITY_STRENGTHS.map((strength) => (
                  <li key={strength.label}>
                    <span>{strength.label}</span>
                    <strong>{strength.title}</strong>
                    <p>{strength.body}</p>
                  </li>
                ))}
              </ul>
              <p className="resume-hint">← → 浏览教育与能力成长路径</p>
            </div>
          </div>
        </article>

        {/* 教育与能力 */}
        <article className="sec-panel resume-growth">
          <div className="resume-kicker">EDUCATION × CAPABILITY</div>
          <h2 className="resume-giant">GROWTH</h2>
          <header className="resume-growth-heading">
            <p className="resume-label">FROM LEARNING TO PRACTICE</p>
            <h2>一条没有空窗的成长路径</h2>
            <p>
              五年本科、一年职业实践，再回到硕士阶段深化方法：能力不是突然转向，而是在真实问题中持续生长。
            </p>
          </header>
          <div className="resume-timeline-wrap">
            <div className="resume-timeline-arrow" aria-hidden />
            <ol className="resume-timeline">
              {EDUCATION_TIMELINE.map((stage) => (
                <li
                  className={stage.id === "practice" ? "is-practice" : ""}
                  key={stage.id}
                >
                  <div className="resume-timeline-index">{stage.index}</div>
                  <span className="resume-timeline-period">{stage.period}</span>
                  <h3>{stage.title}</h3>
                  <div className="resume-timeline-detail">
                    <span>{stage.detailLabel}</span>
                    <p>{stage.detail}</p>
                  </div>
                  <div className="resume-timeline-detail is-capability">
                    <span>CAPABILITY</span>
                    <p>{stage.capability}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </article>
      </div>
    </div>
  );
}
