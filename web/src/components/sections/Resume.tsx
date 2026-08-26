"use client";

import { asset } from "@/components/portfolio/data";

type Props = {
  slide: number;
};

/**
 * 简历章 · 参考 cyj About 双栏简历感：
 * 身份（照片+姓名）/ 教育 / 能力
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
                我把复杂问题整理成
                <em>可理解、可验证、可交付</em>
                的产品。
              </h3>
              <p>
                同济大学城市规划硕士在读。做过跨境电商 AI 客服质量闭环、垂类规范
                RAG、合同审查与街景多模态平台。习惯把模糊业务拆成可执行流程与可测量指标。
              </p>
              <p className="resume-hint">← → 浏览教育与能力</p>
            </div>
          </div>
        </article>

        {/* 教育 */}
        <article className="sec-panel resume-edu">
          <div className="resume-kicker">EDUCATION</div>
          <h2 className="resume-giant">EDU</h2>
          <div className="resume-block">
            <header>
              <strong>同济大学</strong>
              <span>2024.09 — 至今</span>
            </header>
            <p>城市规划 · 硕士在读（2027 届）</p>
          </div>
          <div className="resume-block">
            <header>
              <strong>同济大学</strong>
              <span>2018.09 — 2023.07</span>
            </header>
            <p>城市规划 · 本科</p>
            <small>2023–2024 于同昊建筑设计有限公司工作</small>
          </div>
        </article>

        {/* 能力 */}
        <article className="sec-panel resume-skills">
          <div className="resume-kicker">CAPABILITIES</div>
          <h2 className="resume-giant">SKILL</h2>
          <ul className="resume-skill-list">
            <li>
              <span>01</span>
              <div>
                <strong>产品定义</strong>
                <p>用户调研 / PRD / 原型 / 指标设计</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>AI 应用</strong>
                <p>RAG / Agent / Prompt / AI Workflow</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>质量闭环</strong>
                <p>模型评测 / Bad Case 归因 / 审查发送</p>
              </div>
            </li>
            <li>
              <span>04</span>
              <div>
                <strong>数据与工程</strong>
                <p>Python / SQL / 部署上线</p>
              </div>
            </li>
          </ul>
        </article>
      </div>
    </div>
  );
}
