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
import Internships, {
  INTERNSHIPS,
  internshipProjectSlides,
} from "@/components/sections/Internships";
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
  const [internship, setInternship] = useState(0);
  const [curtain, setCurtain] = useState<CurtainState>({
    phase: "idle",
    direction: "down",
    target: 0,
  });

  const busyRef = useRef(false);
  const navLockRef = useRef(false);
  const navLockTimerRef = useRef(0);
  const pageRef = useRef(page);
  const slideRef = useRef(slide);
  const internshipRef = useRef(internship);
  const timersRef = useRef<number[]>([]);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  /** 横/竖 wheel 累积 · 同 portfolio-demo handleGalleryWheel / cyj 画廊 */
  const wheelHorizRef = useRef({
    distance: 0,
    timer: 0,
    locked: false,
    lastStep: 0,
  });
  const wheelVertRef = useRef({
    distance: 0,
    timer: 0,
    locked: false,
    lastStep: 0,
  });

  const NAV_LOCK_MS = 420;
  const WHEEL_IDLE_MS = 140;
  const WHEEL_THRESH_X = 90;
  const WHEEL_THRESH_Y = 56;
  const TOUCH_THRESH_X = 70;
  const TOUCH_THRESH_Y = 56;

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    slideRef.current = slide;
  }, [slide]);

  useEffect(() => {
    internshipRef.current = internship;
  }, [internship]);

  const chapter = chapters[page]!;
  const theme = chapter.theme;
  const guideSlides =
    page === 2 ? internshipProjectSlides(internship) : chapter.slides;

  const clearTimers = () => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
  };

  const engageNavLock = () => {
    navLockRef.current = true;
    window.clearTimeout(navLockTimerRef.current);
    wheelHorizRef.current.distance = 0;
    wheelVertRef.current.distance = 0;
    navLockTimerRef.current = window.setTimeout(() => {
      navLockRef.current = false;
      wheelHorizRef.current.distance = 0;
      wheelVertRef.current.distance = 0;
    }, NAV_LOCK_MS);
  };

  const consumeWheelAxis = (
    axis: {
      distance: number;
      timer: number;
      locked: boolean;
      lastStep: number;
    },
    delta: number,
    threshold: number,
    onStep: (step: number) => void,
  ) => {
    if (axis.locked) {
      const opposite =
        axis.lastStep !== 0 && Math.sign(delta) !== axis.lastStep;
      if (!opposite) return;
      axis.locked = false;
      axis.lastStep = 0;
      axis.distance = 0;
      window.clearTimeout(axis.timer);
    }

    window.clearTimeout(axis.timer);
    axis.timer = window.setTimeout(() => {
      axis.distance = 0;
      axis.locked = false;
      axis.lastStep = 0;
    }, WHEEL_IDLE_MS);

    axis.distance += delta;
    if (Math.abs(axis.distance) < threshold) return;

    const step = axis.distance > 0 ? 1 : -1;
    axis.distance = 0;
    axis.locked = true;
    axis.lastStep = step;
    onStep(step);
  };

  const goPage = useCallback(
    (nextRaw: number) => {
      const next = clamp(nextRaw, 0, chapters.length - 1);
      if (next === pageRef.current || busyRef.current) return;
      const currentPage = pageRef.current;

      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        pageRef.current = next;
        const nextInternship =
          next === 2 && currentPage > 2 ? INTERNSHIPS.length - 1 : 0;
        setPage(next);
        setSlide(0);
        slideRef.current = 0;
        if (next === 2) {
          setInternship(nextInternship);
          internshipRef.current = nextInternship;
        }
        engageNavLock();
        return;
      }

      const direction = next > currentPage ? "down" : "up";
      const nextInternship =
        next === 2 && currentPage > 2 ? INTERNSHIPS.length - 1 : 0;
      busyRef.current = true;
      engageNavLock();
      clearTimers();
      setCurtain({ phase: "cover", direction, target: next });

      timersRef.current.push(
        window.setTimeout(() => {
          pageRef.current = next;
          setPage(next);
          setSlide(0);
          slideRef.current = 0;
          if (next === 2) {
            setInternship(nextInternship);
            internshipRef.current = nextInternship;
          }
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
      const max =
        pageRef.current === 2
          ? internshipProjectSlides(internshipRef.current).length - 1
          : chapters[pageRef.current]!.slides.length - 1;
      const next = clamp(nextRaw, 0, max);
      if (next === slideRef.current) return;
      slideRef.current = next;
      setSlide(next);
      engageNavLock();
    },
    [],
  );

  const goInternship = useCallback((nextRaw: number) => {
    const next = clamp(nextRaw, 0, INTERNSHIPS.length - 1);
    if (next === internshipRef.current) return;
    internshipRef.current = next;
    slideRef.current = 0;
    setInternship(next);
    setSlide(0);
    engageNavLock();
  }, []);

  const goVertical = useCallback(
    (step: number) => {
      if (pageRef.current !== 2) {
        goPage(pageRef.current + step);
        return;
      }

      const nextInternship = internshipRef.current + step;
      if (nextInternship >= 0 && nextInternship < INTERNSHIPS.length) {
        goInternship(nextInternship);
        return;
      }

      goPage(pageRef.current + step);
    },
    [goInternship, goPage],
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
      if (busyRef.current || navLockRef.current) {
        event.preventDefault();
        return;
      }

      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX < 1 && absY < 1) return;

      // 主轴：横向优先于纵向（便于在章内扫子页）
      if (absX > absY && absX > 8) {
        event.preventDefault();
        if (navLockRef.current) return;
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
      if (navLockRef.current) return;
      consumeWheelAxis(
        wheelVertRef.current,
        event.deltaY,
        WHEEL_THRESH_Y,
        goVertical,
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (inAiAvatar(event.target)) return;
      if (busyRef.current) return;

      if (["ArrowDown", "PageDown"].includes(event.key)) {
        event.preventDefault();
        goVertical(1);
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goVertical(-1);
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
        goVertical(1);
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
  }, [goPage, goSlide, goVertical, WHEEL_THRESH_X, WHEEL_THRESH_Y, WHEEL_IDLE_MS]);

  useEffect(
    () => () => {
      clearTimers();
      window.clearTimeout(navLockTimerRef.current);
    },
    [],
  );

  const onTouchStart = (event: React.TouchEvent) => {
    const t = event.touches[0];
    if (!t) return;
    touchRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start || busyRef.current || navLockRef.current) return;
    const t = event.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < TOUCH_THRESH_X && Math.abs(dy) < TOUCH_THRESH_Y) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) < TOUCH_THRESH_X) return;
      goSlide(slideRef.current + (dx < 0 ? 1 : -1));
    } else {
      goVertical(dy < 0 ? 1 : -1);
    }
  };

  return (
    <div
      className={`pf-shell theme-${theme}`}
      data-chapter={chapter.id}
      data-page={page}
      data-slide={slide}
      data-internship={page === 2 ? internship : undefined}
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
          <Internships
            company={internship}
            project={slide}
            onCompanySelect={goInternship}
          />
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

      {guideSlides.length > 1 ? (
        <>
          <button
            type="button"
            className="pf-arrow pf-arrow-prev"
            onClick={() => goSlide(slideRef.current - 1)}
            disabled={slide === 0}
            aria-label="上一页"
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M15 5 8 12l7 7" />
            </svg>
          </button>
          <button
            type="button"
            className="pf-arrow pf-arrow-next"
            onClick={() => goSlide(slideRef.current + 1)}
            disabled={slide === guideSlides.length - 1}
            aria-label="下一页"
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </>
      ) : null}

      <BottomGuide
        slides={guideSlides}
        active={slide}
        onSelect={goSlide}
        theme={theme}
      />

      <div className="pf-hint" aria-hidden>
        <span>VERT</span>
        <i />
        <span>{page === 2 ? "实习" : "章"}</span>
        <span className="pf-hint-gap">HORIZ</span>
        <i />
        <span>{page === 2 ? "项目" : "页"}</span>
      </div>

      <div
        className={`pf-curtain phase-${curtain.phase} dir-${curtain.direction}`}
        style={{ background: chapters[curtain.target]?.color ?? chapter.color }}
        aria-hidden
      />
    </div>
  );
}
