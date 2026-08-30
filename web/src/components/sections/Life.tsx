"use client";

import Image from "next/image";
import { asset } from "@/components/portfolio/data";

type Props = {
  slide: number;
};

type Feature = {
  src: string;
  alt: string;
  caption: string;
  /** 竖版书影用 portrait，横版现场照用 landscape */
  shape: "portrait" | "landscape";
  title: string;
  meta?: string;
  note: string[];
};

type GalleryImage = {
  src: string;
  alt: string;
};

type LifeSlideBase = {
  id: string;
  label: string;
  title: string;
  hint: string;
};

type LifeSlide = LifeSlideBase &
  (
    | {
        kind: "feature";
        feature: Feature;
      }
    | {
        kind: "gallery";
        description: string;
        images: readonly GalleryImage[];
      }
  );

const LIFE: readonly LifeSlide[] = [
  {
    id: "books",
    label: "BOOKSHELF",
    title: "我喜欢的书",
    hint: "我读 Agent 的起点，不在 AI 圈，在一本城市规划教材里",
    kind: "feature",
    feature: {
      src: "/portfolio/life/book-multiagent.webp",
      alt: "《多代理人模拟：原理及城市规划应用》书籍封面",
      caption: "朱玮 编著 · 中国建筑工业出版社",
      shape: "portrait",
      title: "多代理人模拟：原理及城市规划应用",
      meta: "MULTI-AGENT SIMULATION",
      note: [
        "导师的这本书，是我最喜欢的一本。它让我第一次看见：个体各自决策，城市却会长出整体的秩序。",
        "那时它叫多代理人模拟，如今我们叫它 Agent。从研究人口流动到设计 AI 产品，我做的其实是同一件事——把复杂系统拆成能被推演、也能被验证的单元。",
      ],
    },
  },
  {
    id: "film",
    label: "CINEMA",
    title: "我热爱的电影",
    hint: "好电影提出的问题，往往比它给的答案更耐放",
    kind: "feature",
    feature: {
      src: "/portfolio/life/film-ikiru.webp",
      alt: "《生之欲》致敬插画：雪夜里独自坐在秋千上的老人",
      caption: "原创致敬插画 · 黑泽明《生之欲》(1952)",
      shape: "portrait",
      title: "生之欲 · 黑泽明",
      meta: "IKIRU / 1952",
      note: [
        "一个被宣告了期限的人，用最后的日子问了一个最朴素的问题：怎么过，才算真的活过。",
        "他给的答案是——珍重活在世上的每一个日子。",
      ],
    },
  },
  {
    id: "photo",
    label: "OBSERVE",
    title: "我在追星现场",
    hint: "对 AI 的热情，最后都要落到「去现场看看」",
    kind: "feature",
    feature: {
      src: "/portfolio/life/amd-lisa-su.webp",
      alt: "在 AMD 开发者大会与 AMD 总裁苏姿丰的合影",
      caption: "AMD 开发者大会现场合影",
      shape: "landscape",
      title: "与 AMD 总裁苏姿丰合影",
      meta: "AMD DEVELOPER CONFERENCE",
      note: [
        "参与 AMD 开发者大会时，与 AMD 总裁苏姿丰（Lisa Su）的合影。",
        "我习惯往这样的现场跑：算力、模型与应用的真实进度，站在发布会和展台之间才看得清。做 AI 产品的人不该只在文档里想象技术——得知道这波浪潮此刻推到了哪里。",
      ],
    },
  },
  {
    id: "photography",
    label: "PHOTOGRAPHY",
    title: "我用镜头保留远方，也重新发现日常",
    hint: "远方让我出发，日常让我停下",
    kind: "gallery",
    description:
      "我是一名长期保持创作的摄影爱好者。题材从山野风景、城市建筑，到自然生态与人物肖像。拿着相机步履不停，是因为心里始终向往远方；而真正让我反复按下快门的，也常常是日常里稍纵即逝的光、秩序与情绪。摄影让我保持好奇，也训练我先观察、再判断。",
    images: [
      {
        src: "/portfolio/life/photography/mountain-clouds.webp",
        alt: "群山与云海在晨光中层层展开的风光摄影",
      },
      {
        src: "/portfolio/life/photography/canal-architecture.webp",
        alt: "江南水乡河道、石桥与白墙建筑的城市摄影",
      },
      {
        src: "/portfolio/life/photography/night-heron.webp",
        alt: "一只夜鹭停在水边枯木上的生态摄影",
      },
      {
        src: "/portfolio/life/photography/cherry-blossom-portrait.webp",
        alt: "樱花树下回眸微笑的人物肖像摄影",
      },
    ],
  },
];

export default function Life({ slide }: Props) {
  return (
    <div className="sec-life">
      <div
        className="sec-rail"
        style={{ transform: `translateX(-${slide * 100}%)` }}
      >
        {LIFE.map((item) => (
          <article
            className={`sec-panel life-panel${item.kind === "gallery" ? " life-photography-panel" : ""}`}
            key={item.id}
          >
            <div className="life-kicker">04 · LIFE / {item.label}</div>
            {item.kind === "gallery" ? (
              <div className="life-photography-layout">
                <div className="life-photography-copy">
                  <h2>{item.title}</h2>
                  <p className="life-hint">{item.hint}</p>
                  <p className="life-photography-description">
                    {item.description}
                  </p>
                </div>
                <div
                  className="life-photo-grid"
                  role="group"
                  aria-label="摄影作品选集"
                >
                  {item.images.map((photo, photoIndex) => (
                    <figure className="life-photo-tile" key={photo.src}>
                      <Image
                        src={asset(photo.src)}
                        alt={photo.alt}
                        fill
                        loading={photoIndex === 0 ? "eager" : "lazy"}
                        sizes="(max-width: 860px) 46vw, 28vw"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            ) : (
              <div className="life-layout">
                <div className="life-copy">
                  <h2>{item.title}</h2>
                  <p className="life-hint">{item.hint}</p>
                  <div className="life-feature-text">
                    {item.feature.meta ? (
                      <span className="life-feature-meta">
                        {item.feature.meta}
                      </span>
                    ) : null}
                    <h3>{item.feature.title}</h3>
                    {item.feature.note.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
                <figure className={`life-figure is-${item.feature.shape}`}>
                  <Image
                    src={asset(item.feature.src)}
                    alt={item.feature.alt}
                    fill
                    sizes="(max-width: 860px) 78vw, 34vw"
                  />
                  <figcaption>{item.feature.caption}</figcaption>
                </figure>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
