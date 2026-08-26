"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import BottomGuide from "./BottomGuide";
import { chapters, clamp } from "./data";
import Cover from "@/components/sections/Cover";
import Resume from "@/components/sections/Resume";
import Internships from "@/components/sections/Internships";
import Projects from "@/components/sections/Projects";
import Life from "@/components/sections/Life";
import Closing from "@/components/sections/Closing";

type CurtainState = {
  phase: "idle" | "cover" | "reveal";
  direction: "up" | "down";
  target: number;
};

/**
 * 二维作品集壳：竖向切章 × 横向切子页
 */
export default function PortfolioShell() {
  const [page, setPage] = useState(0);
  const [slide, setSlide] = useState(0);
  const [curtain, setCurtain] = useState<CurtainState>({
    phase: "idle",
    direction: "down",
    target: 0,
  });

  const busyRef = useRef(false);
  const pageRef = useRef(page);
  const slideRef = useRef(slide);
  const timersRef = useRef<number[]>([]);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  /** 横/竖 wheel 累积 · 同 portfolio-demo handleGalleryWheel / cyj 画廊 */
  const wheelHorizRef = useRef({ distance: 0, timer: 0, locked: false });
  const wheelVertRef = useRef({ distance: 0, timer: 0, locked: false });

  const WHEEL_IDLE_MS = 140;
  const WHEEL_THRESH_X = 48;
  const WHEEL_THRESH_Y = 56;

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    slideRef.current = slide;
  }, [slide]);

  const chapter = chapters[page]!;
  const theme = chapter.theme;

  const clearTimers = () => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
  };

  const consumeWheelAxis = (
    axis: { distance: number; timer: number; locked: boolean },
    delta: number,
    threshold: number,
    onStep: (step: number) => void,
  ) => {
    window.clearTimeout(axis.timer);
    axis.timer = window.setTimeout(() => {
      axis.distance = 0;
      axis.locked = false;
    }, WHEEL_IDLE_MS);

    if (axis.locked) return;

    axis.distance += delta;
    if (Math.abs(axis.distance) < threshold) return;

    const step = axis.distance > 0 ? 1 : -1;
    axis.distance = 0;
    axis.locked = true;
    onStep(step);
  };

  const goPage = useCallback(
    (nextRaw: number) => {
      const next = clamp(nextRaw, 0, chapters.length - 1);
      if (next === pageRef.current || busyRef.current) return;

      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        setPage(next);
        setSlide(0);
        return;
      }

      const direction = next > pageRef.current ? "down" : "up";
      busyRef.current = true;
      clearTimers();
      setCurtain({ phase: "cover", direction, target: next });

      timersRef.current.push(
        window.setTimeout(() => {
          setPage(next);
          setSlide(0);
          setCurtain({ phase: "reveal", direction, target: next });
        }, 320),
      );
      timersRef.current.push(
        window.setTimeout(() => {
          setCurtain({ phase: "idle", direction, target: next });
          busyRef.current = false;
        }, 700),
      );
    },
    [],
  );

  const goSlide = useCallback(
    (nextRaw: number) => {
      const max = chapters[pageRef.current]!.slides.length - 1;
      const next = clamp(nextRaw, 0, max);
      if (next === slideRef.current) return;
      setSlide(next);
    },
    [],
  );

  useEffect(() => {
    const inAiAvatar = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(
        target.closest(
          ".ai-avatar-panel, .ai-avatar-hint, .ai-avatar-petbtn",
        ),
      );

    const onWheel = (event: WheelEvent) => {
      if (inAiAvatar(event.target)) return;
      if (busyRef.current) {
        event.preventDefault();
        return;
      }

      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX < 1 && absY < 1) return;

      // 主轴：横向优先于纵向（便于在章内扫子页）
      if (absX > absY && absX > 8) {
        event.preventDefault();
        consumeWheelAxis(
          wheelHorizRef.current,
          event.deltaX,
          WHEEL_THRESH_X,
          (step) => goSlide(slideRef.current + step),
        );
        return;
      }

      if (absY <= absX || absY < 24) return;
      event.preventDefault();
      consumeWheelAxis(
        wheelVertRef.current,
        event.deltaY,
        WHEEL_THRESH_Y,
        (step) => goPage(pageRef.current + step),
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (inAiAvatar(event.target)) return;
      if (busyRef.current) return;

      if (["ArrowDown", "PageDown"].includes(event.key)) {
        event.preventDefault();
        goPage(pageRef.current + 1);
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goPage(pageRef.current - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goSlide(slideRef.current + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goSlide(slideRef.current - 1);
      }
      if (event.key === "Home") goPage(0);
      if (event.key === "End") goPage(chapters.length - 1);
      if (event.key === " ") {
        event.preventDefault();
        goPage(pageRef.current + 1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    const horiz = wheelHorizRef.current;
    const vert = wheelVertRef.current;
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(horiz.timer);
      window.clearTimeout(vert.timer);
    };
  }, [goPage, goSlide, WHEEL_THRESH_X, WHEEL_THRESH_Y, WHEEL_IDLE_MS]);

  useEffect(() => () => clearTimers(), []);

  const onTouchStart = (event: React.TouchEvent) => {
    const t = event.touches[0];
    if (!t) return;
    touchRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start || busyRef.current) return;
    const t = event.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 70 && Math.abs(dy) < 56) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) < 70) return;
      goSlide(slideRef.current + (dx < 0 ? 1 : -1));
    } else {
      goPage(pageRef.current + (dy < 0 ? 1 : -1));
    }
  };

  return (
    <div
      className={`pf-shell theme-${theme}`}
      data-chapter={chapter.id}
      data-page={page}
      data-slide={slide}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <header className="pf-topline">
        <button
          type="button"
          className="pf-wordmark"
          onClick={() => goPage(0)}
        >
          YU<span>·</span>HAIPEI
        </button>
        <div className="pf-telemetry" aria-label="所在地">
          <span className="pf-live-dot" />
          SHANGHAI · CN
        </div>
        <nav aria-label="主章节">
          {chapters.map((ch, index) => (
            <button
              key={ch.id}
              type="button"
              className={index === page ? "is-active" : ""}
              onClick={() => goPage(index)}
            >
              {ch.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="pf-stage">
        <section
          className={`pf-chapter${page === 0 ? " is-active" : ""}`}
          aria-hidden={page !== 0}
          data-active={page === 0}
        >
          <Cover onEnterResume={() => goPage(1)} />
        </section>
        <section
          className={`pf-chapter${page === 1 ? " is-active" : ""}`}
          aria-hidden={page !== 1}
          data-active={page === 1}
        >
          <Resume slide={slide} />
        </section>
        <section
          className={`pf-chapter${page === 2 ? " is-active" : ""}`}
          aria-hidden={page !== 2}
          data-active={page === 2}
        >
          <Internships slide={slide} />
        </section>
        <section
          className={`pf-chapter${page === 3 ? " is-active" : ""}`}
          aria-hidden={page !== 3}
          data-active={page === 3}
        >
          <Projects slide={slide} />
        </section>
        <section
          className={`pf-chapter${page === 4 ? " is-active" : ""}`}
          aria-hidden={page !== 4}
          data-active={page === 4}
        >
          <Life slide={slide} />
        </section>
        <section
          className={`pf-chapter${page === 5 ? " is-active" : ""}`}
          aria-hidden={page !== 5}
          data-active={page === 5}
        >
          <Closing />
        </section>
      </main>

      <aside className="pf-rail" aria-label="章节进度">
        {chapters.map((ch, index) => (
          <button
            key={ch.id}
            type="button"
            className={index === page ? "is-active" : ""}
            onClick={() => goPage(index)}
            aria-label={`前往${ch.label}`}
          >
            <span>{ch.short}</span>
            <i />
          </button>
        ))}
      </aside>

      <BottomGuide
        slides={chapter.slides}
        active={slide}
        onSelect={goSlide}
        theme={theme}
      />

      <div className="pf-hint" aria-hidden>
        <span>VERT</span>
        <i />
        <span>章</span>
        <span className="pf-hint-gap">HORIZ</span>
        <i />
        <span>页</span>
      </div>

      <div
        className={`pf-curtain phase-${curtain.phase} dir-${curtain.direction}`}
        style={{ background: chapters[curtain.target]?.color ?? chapter.color }}
        aria-hidden
      />
    </div>
  );
}
