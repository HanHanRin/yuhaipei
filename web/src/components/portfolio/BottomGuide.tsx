"use client";

import type { SlideMeta } from "./data";

type Props = {
  slides: readonly SlideMeta[];
  active: number;
  onSelect: (index: number) => void;
  theme: "light" | "dark";
};

/**
 * 当前章的子页导览小卡 · 底部横向条
 * 细边框短标签，不是圆角阴影大卡片墙。
 */
export default function BottomGuide({
  slides,
  active,
  onSelect,
  theme,
}: Props) {
  if (slides.length <= 1) {
    return (
      <div
        className={`pf-guide pf-guide-solo theme-${theme}`}
        aria-hidden
      >
        <span className="pf-guide-solo-label">{slides[0]?.title}</span>
      </div>
    );
  }

  return (
    <nav
      className={`pf-guide theme-${theme}`}
      aria-label="本章子页导览"
    >
      <div className="pf-guide-track">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`pf-guide-card${index === active ? " is-active" : ""}`}
            onClick={() => onSelect(index)}
            aria-current={index === active ? "true" : undefined}
          >
            <i>{String(index + 1).padStart(2, "0")}</i>
            <span>{slide.title}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
