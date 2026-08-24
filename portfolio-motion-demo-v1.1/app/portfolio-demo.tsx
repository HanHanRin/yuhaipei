"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const scenes = [
  { id: "home", label: "封面", short: "00", color: "#f3efe5" },
  { id: "profile", label: "关于", short: "01", color: "#44500f" },
  { id: "work", label: "作品", short: "02", color: "#b85132" },
  { id: "gallery", label: "图像", short: "03", color: "#eee7d8" },
  { id: "contact", label: "联系", short: "04", color: "#14140f" },
] as const;

const projects = [
  {
    number: "01",
    title: "元规",
    subtitle: "专业规范问答工作台",
    image: "/canon-home.png",
    note: "知识检索 · 引用溯源 · 专家流程",
    className: "project-wide",
  },
  {
    number: "02",
    title: "行业景气研究",
    subtitle: "对公智能营销工作台",
    image: "/cmb-dashboard.png",
    note: "八维研判 · 机会雷达 · 报告生成",
    className: "",
  },
  {
    number: "03",
    title: "搭小财",
    subtitle: "对话式消费洞察助手",
    image: "/xiaocai-hero.png",
    note: "自然语言记账 · 周报 · 目标陪伴",
    className: "",
  },
] as const;

const gallery = [
  { title: "城市研究", label: "PLANNING", image: "/planning-works.png" },
  { title: "现场观察", label: "FIELD NOTE", image: "/opc-site-1.jpg" },
  { title: "规范产品", label: "PRODUCT", image: "/canon-home.png" },
  { title: "行业洞察", label: "RESEARCH", image: "/cmb-dashboard.png" },
  { title: "学术表达", label: "POSTER", image: "/academic-poster.png" },
] as const;

type CurtainState = {
  phase: "idle" | "cover" | "reveal";
  direction: "up" | "down";
  target: number;
};

function clampScene(value: number) {
  return Math.max(0, Math.min(scenes.length - 1, value));
}

function circularOffset(index: number, active: number, length: number) {
  let distance = index - active;
  if (distance > length / 2) distance -= length;
  if (distance < -length / 2) distance += length;
  return distance;
}

export default function PortfolioDemo() {
  const [current, setCurrent] = useState(0);
  const [activeCard, setActiveCard] = useState(0);
  const [copyNotice, setCopyNotice] = useState("");
  const [curtain, setCurtain] = useState<CurtainState>({
    phase: "idle",
    direction: "down",
    target: 0,
  });
  const busyRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const touchStartRef = useRef(0);
  const pointerFrameRef = useRef<number | null>(null);
  const galleryWheelRef = useRef({ distance: 0, timer: 0 });

  const goTo = useCallback(
    (target: number) => {
      const next = clampScene(target);
      if (next === current || busyRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) {
        setCurrent(next);
        return;
      }

      busyRef.current = true;
      const direction = next > current ? "down" : "up";
      setCurtain({ phase: "cover", direction, target: next });

      timersRef.current.push(
        window.setTimeout(() => {
          setCurrent(next);
          setCurtain({ phase: "reveal", direction, target: next });
        }, 410),
      );
      timersRef.current.push(
        window.setTimeout(() => {
          setCurtain({ phase: "idle", direction, target: next });
          busyRef.current = false;
        }, 880),
      );
    },
    [current],
  );

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 24) return;
      event.preventDefault();
      goTo(current + (event.deltaY > 0 ? 1 : -1));
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goTo(current + 1);
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goTo(current - 1);
      }
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(scenes.length - 1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [current, goTo]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const updatePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerFrameRef.current !== null) return;
    const x = event.clientX;
    const y = event.clientY;
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--pointer-x", `${x}px`);
      document.documentElement.style.setProperty("--pointer-y", `${y}px`);
      document.documentElement.style.setProperty(
        "--hero-x",
        `${(x / window.innerWidth - 0.5) * 18}px`,
      );
      document.documentElement.style.setProperty(
        "--hero-y",
        `${(y / window.innerHeight - 0.5) * 18}px`,
      );
      pointerFrameRef.current = null;
    });
  };

  const updateGlow = (
    event: ReactPointerEvent<HTMLElement>,
    element: HTMLElement,
  ) => {
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
  };

  const handleGalleryWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    const horizontal = event.deltaX;
    if (Math.abs(horizontal) <= Math.abs(event.deltaY) || Math.abs(horizontal) < 1) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const gesture = galleryWheelRef.current;
    gesture.distance += horizontal;
    window.clearTimeout(gesture.timer);
    gesture.timer = window.setTimeout(() => {
      gesture.distance = 0;
    }, 140);

    if (Math.abs(gesture.distance) < 48) return;

    const step = gesture.distance > 0 ? 1 : -1;
    gesture.distance = 0;
    setActiveCard((active) => (active + step + gallery.length) % gallery.length);
  };

  const copyContact = async (value: string, notice: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }
    setCopyNotice(notice);
    window.setTimeout(() => setCopyNotice(""), 1800);
  };

  return (
    <div
      className="portfolio-frame"
      data-scene={current}
      onPointerMove={updatePointer}
      onTouchStart={(event) => {
        touchStartRef.current = event.touches[0]?.clientY ?? 0;
      }}
      onTouchEnd={(event) => {
        const end = event.changedTouches[0]?.clientY ?? touchStartRef.current;
        const delta = touchStartRef.current - end;
        if (Math.abs(delta) > 55) goTo(current + (delta > 0 ? 1 : -1));
      }}
    >
      <header className="topline">
        <button className="wordmark" onClick={() => goTo(0)}>
          ZX<span>·</span>LAB
        </button>
        <div className="telemetry" aria-label="所在地与时间">
          <span className="live-dot" />
          SHANGHAI · CN
          <span>31.2304° N</span>
          <span className="desktop-only">121.4737° E</span>
        </div>
        <nav aria-label="主场景">
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              className={index === current ? "active" : ""}
              onClick={() => goTo(index)}
            >
              {scene.label}
            </button>
          ))}
        </nav>
      </header>

      <main>
        <section
          className={`scene hero-scene ${current === 0 ? "is-active" : ""}`}
          aria-hidden={current !== 0}
        >
          <div className="hero-grid" />
          <div className="hero-image" />
          <div className="hero-content">
            <p className="eyebrow reveal reveal-1">PORTFOLIO / 2026</p>
            <h1 className="reveal reveal-2">
              张醒
              <span>ZHANG XING</span>
            </h1>
            <p className="hero-claim reveal reveal-3">
              FROM COMPLEXITY
              <br />
              TO CLARITY.
            </p>
            <div className="hero-meta reveal reveal-4">
              <p>AI 产品 · 研究 · 体验设计</p>
              <button onClick={() => goTo(2)}>查看代表作品 ↘</button>
            </div>
          </div>
          <div className="hero-index">00 / 04</div>
          <div className="hero-coordinate">
            <span>X {String(Math.round((current + 1) * 17)).padStart(3, "0")}</span>
            <span>Y 072</span>
          </div>
        </section>

        <section
          className={`scene profile-scene ${current === 1 ? "is-active" : ""}`}
          aria-hidden={current !== 1}
        >
          <div className="section-kicker">01 · PROFILE / 关于</div>
          <h2 className="giant-title">ABOUT</h2>
          <div className="profile-layout">
            <article className="profile-intro reveal reveal-1">
              <p className="intro-label">一个跨越规划、研究与 AI 产品的人</p>
              <h3>
                我把复杂问题整理成
                <em>可理解、可验证、可交付</em>
                的产品。
              </h3>
              <p>
                这个示例暂时使用虚构身份文字，重点展示信息层级、颜色切场和内容进入方式。
                真正制作时，只需用你的经历和证据替换这里。
              </p>
            </article>
            <div className="skill-ledger reveal reveal-2">
              {[
                ["01", "产品定义", "需求洞察 / PRD / 原型"],
                ["02", "AI 应用", "RAG / Agent / 评测"],
                ["03", "研究能力", "访谈 / 分析 / 证据链"],
                ["04", "全栈交付", "设计 / 前端 / 部署"],
              ].map(([number, title, detail]) => (
                <div className="skill-row" key={number}>
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <small>{detail}</small>
                  <i>↗</i>
                </div>
              ))}
            </div>
          </div>
          <p className="vertical-note">SYSTEM THINKING · HUMAN JUDGEMENT</p>
        </section>

        <section
          className={`scene work-scene ${current === 2 ? "is-active" : ""}`}
          aria-hidden={current !== 2}
        >
          <div className="section-kicker">02 · SELECTED WORK / 作品</div>
          <h2 className="giant-title">WORKS</h2>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article
                className={`project-card ${project.className} reveal reveal-${index + 1}`}
                key={project.title}
                onPointerMove={(event) =>
                  updateGlow(event, event.currentTarget)
                }
              >
                <div className="project-visual">
                  <img src={project.image} alt={`${project.title}项目界面`} />
                  <span className="project-number">{project.number}</span>
                  <span className="project-open">OPEN ↗</span>
                </div>
                <div className="project-copy">
                  <h3>{project.title}</h3>
                  <p>{project.subtitle}</p>
                  <small>{project.note}</small>
                </div>
              </article>
            ))}
          </div>
          <p className="work-caption">
            每个项目使用真实界面作为证据，而不是装饰性样机。
          </p>
        </section>

        <section
          className={`scene gallery-scene ${current === 3 ? "is-active" : ""}`}
          aria-hidden={current !== 3}
        >
          <div className="section-kicker">03 · VISUAL ARCHIVE / 图像</div>
          <div className="gallery-heading">
            <p>点击卡片、下方按钮或双指左右滑动切换</p>
            <h2>五种观察世界的方式</h2>
          </div>
          <div
            className="arc-gallery"
            aria-label="项目图片画廊；可在卡片区域双指左右滑动切换"
            onWheel={handleGalleryWheel}
          >
            {gallery.map((item, index) => {
              const offset = circularOffset(index, activeCard, gallery.length);
              return (
                <button
                  className={`archive-card ${offset === 0 ? "active" : ""}`}
                  key={item.title}
                  style={{ "--offset": offset } as CSSProperties}
                  onClick={() => setActiveCard(index)}
                  aria-label={`查看${item.title}`}
                >
                  <img src={item.image} alt={item.title} />
                  <span className="archive-label">{item.label}</span>
                  <strong>{item.title}</strong>
                  <small>{String(index + 1).padStart(2, "0")} / 05</small>
                </button>
              );
            })}
          </div>
          <div className="gallery-controls">
            <button
              aria-label="上一张"
              onClick={() =>
                setActiveCard(
                  (activeCard - 1 + gallery.length) % gallery.length,
                )
              }
            >
              ←
            </button>
            <div>
              <span>{String(activeCard + 1).padStart(2, "0")}</span>
              <i />
              <span>05</span>
            </div>
            <button
              aria-label="下一张"
              onClick={() => setActiveCard((activeCard + 1) % gallery.length)}
            >
              →
            </button>
          </div>
        </section>

        <section
          className={`scene contact-scene ${current === 4 ? "is-active" : ""}`}
          aria-hidden={current !== 4}
        >
          <div className="section-kicker">04 · CONTACT / 下一步</div>
          <h2 className="contact-title">
            LET&apos;S MAKE
            <br />
            <span>THE COMPLEX</span>
            <br />
            CLEAR.
          </h2>
          <div className="contact-grid">
            <p>
              如果你需要一个既能做研究，也能把想法变成产品的人，
              <strong>欢迎和我聊聊。</strong>
            </p>
            <div className="contact-links">
              <div className="contact-row">
                <span>TEL/WeChat</span>
                <a
                  className="contact-value"
                  href="weixin://dl/add"
                  onClick={() =>
                    copyContact("18437088052", "号码已复制，请在微信中粘贴")
                  }
                >
                  18437088052
                </a>
                <button
                  className="contact-action copy"
                  onClick={() =>
                    copyContact("18437088052", "电话号码已复制")
                  }
                  aria-label="复制电话号码"
                  title="复制电话号码"
                >
                  复制
                </button>
              </div>
              <div className="contact-row">
                <span>EMAIL</span>
                <a className="contact-value" href="mailto:2352202496@qq.com">
                  2352202496@qq.com
                </a>
                <button
                  className="contact-action copy"
                  onClick={() => copyContact("2352202496@qq.com", "邮箱已复制")}
                  aria-label="复制邮箱"
                  title="复制邮箱"
                >
                  复制
                </button>
              </div>
              <div className="contact-row">
                <span>RESUME</span>
                <a
                  className="contact-value"
                  href="/resume/余海沛_AI产品经理简历带照片_v1.2.pdf"
                  download
                >
                  下载个人简历
                </a>
                <a
                  className="contact-action"
                  href="/resume/余海沛_AI产品经理简历带照片_v1.2.pdf"
                  download
                  aria-label="下载个人简历"
                >
                  下载
                </a>
              </div>
              <div className="contact-row">
                <span>GITHUB</span>
                <a
                  className="contact-value"
                  href="https://github.com/DIYUSICOOKIE"
                  target="_blank"
                  rel="noreferrer"
                >
                  查看代码仓库
                </a>
                <a
                  className="contact-action"
                  href="https://github.com/DIYUSICOOKIE"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="打开 GitHub 主页"
                >
                  跳转
                </a>
              </div>
            </div>
            <p className={`copy-toast ${copyNotice ? "visible" : ""}`} role="status">
              {copyNotice}
            </p>
          </div>
          <div className="contact-orbit orbit-one" />
          <div className="contact-orbit orbit-two" />
        </section>
      </main>

      <aside className="scene-rail" aria-label="场景进度">
        {scenes.map((scene, index) => (
          <button
            key={scene.id}
            className={index === current ? "active" : ""}
            onClick={() => goTo(index)}
            aria-label={`前往${scene.label}`}
          >
            <span>{scene.short}</span>
            <i />
          </button>
        ))}
      </aside>

      <div className="bottom-controls">
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          aria-label="上一幕"
        >
          ↑
        </button>
        <button
          className="next-button"
          onClick={() => goTo(current === scenes.length - 1 ? 0 : current + 1)}
        >
          {current === scenes.length - 1 ? "返回封面" : "下一幕"} ↓
        </button>
      </div>

      <div className="usage-hint">
        <span>SCROLL</span>
        <i />
        <span>切换场景</span>
      </div>

      <div className="custom-cursor" aria-hidden="true">
        <i />
      </div>

      <div
        className={`scene-curtain ${curtain.phase} ${curtain.direction}`}
        style={{ background: scenes[curtain.target].color }}
        aria-hidden="true"
      >
        <div>
          <span>{scenes[curtain.target].short}</span>
          <strong>{scenes[curtain.target].label}</strong>
        </div>
      </div>
    </div>
  );
}
