"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { asset, chapters } from "@/components/portfolio/data";
import "./botanical-cover.css";

type Props = { onNavigate: (chapter: number) => void; active: boolean };

export default function BotanicalCover({ onNavigate, active }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { reducedMotion.current = media.matches; };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const resetPosition = () => {
    root.current?.style.setProperty("--mx", "0px");
    root.current?.style.setProperty("--my", "0px");
  };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!active || paused || reducedMotion.current || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    root.current?.style.setProperty("--mx", `${(x - .5) * -84}px`);
    root.current?.style.setProperty("--my", `${(y - .5) * -60}px`);
  };

  return (
    <div ref={root} className={`botanical-cover${paused || !active ? " paused" : ""}`}
      onPointerMove={move} onPointerLeave={resetPosition}>
      <div className="landscape" aria-hidden="true" style={{ backgroundImage: `url("${asset("/portfolio/cover/botanical-sky.webp")}")` }} />
      <div className="shade" aria-hidden="true" />
      <div className="dust" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div>
      <header className="masthead">
        <span className="edition">PERSONAL PORTFOLIO <span>—</span> 2026</span>
        <button type="button" className="motion-toggle" aria-pressed={paused} aria-label={paused ? "启用动态效果" : "暂停动态效果"}
          onClick={() => { resetPosition(); setPaused(!paused); }}>
          <span className="motion-icon" aria-hidden>{paused ? "▷" : "Ⅱ"}</span>
          <span className="motion-label">{paused ? "启用动效" : "暂停动效"}</span>
        </button>
      </header>
      <aside className="index">
        <p className="index-label">EXPLORE <span>目录</span></p>
        <nav aria-label="封面目录">{chapters.map((chapter, index) => (
          <button key={chapter.id} type="button" className={`chapter${index === 0 ? " active" : ""}`}
            aria-current={index === 0 ? "page" : undefined} onClick={() => onNavigate(index)}>
            <span>{chapter.short}</span><span>{["序章", "关于我", "实习经历", "项目实践", "生活切片", "下一步"][index]}</span><i aria-hidden>↗</i>
          </button>
        ))}</nav>
        <span className="index-foot">A CURIOUS MIND.<br />A BUILDER AT HEART.</span>
      </aside>
      <div className="hero">
        <p className="eyebrow"><span /> IDEAS TAKE ROOT. POSSIBILITIES UNFOLD.</p>
        <h1>余海沛</h1><p className="roman-name">YU HAIPEI</p><div className="hero-rule" />
        <p className="role">产品经理 <span>/</span> FDE 工程师</p>
        <p className="specialty">AI 产品 · 大模型应用 · AI Workflow</p>
      </div>
      <div className="chapter-note">
        <span className="note-number">00 / INTRODUCTION</span>
        <h2>在复杂中，<br />找到清晰的方向。</h2>
        <p className="note-description">从理解问题，到让想法真正发生。</p>
        <button type="button" className="explore-button" onClick={() => onNavigate(1)}>探索我的世界 <span aria-hidden>↗</span></button>
      </div>
      <footer><p>FROM COMPLEXITY <em>to</em> CLARITY.</p><span className="footer-center">灵感生长，实践落地</span><span className="folio">PORTFOLIO <span>© 2026</span></span></footer>
    </div>
  );
}
