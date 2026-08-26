"use client";

type Props = {
  onEnterResume: () => void;
};

export default function Cover({ onEnterResume }: Props) {
  return (
    <div className="sec-cover">
      <div className="sec-cover-grid" aria-hidden />
      <div className="sec-cover-body">
        <p className="sec-eyebrow reveal-in">PORTFOLIO / 2026</p>
        <h1 className="sec-cover-name reveal-in reveal-delay-1">
          余海沛
          <span>YU HAIPEI</span>
        </h1>
        <p className="sec-cover-claim reveal-in reveal-delay-2">
          FROM COMPLEXITY
          <br />
          TO CLARITY.
        </p>
        <div className="sec-cover-meta reveal-in reveal-delay-3">
          <p>AI 产品经理 · 大模型应用 · AI Workflow</p>
          <button type="button" onClick={onEnterResume}>
            查看简历 ↘
          </button>
        </div>
      </div>
      <div className="sec-cover-index" aria-hidden>
        00 / 05
      </div>
    </div>
  );
}
