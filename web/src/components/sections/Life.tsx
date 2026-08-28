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

type LifeSlide = {
  id: string;
  label: string;
  title: string;
  hint: string;
  feature: Feature;
};

const LIFE: readonly LifeSlide[] = [
  {
    id: "books",
    label: "BOOKSHELF",
    title: "我喜欢的书",
    hint: "我读 Agent 的起点，不在 AI 圈，在一本城市规划教材里",
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
];

export default function Life({ slide }: Props) {
  return (
    <div className="sec-life">
      <div
        className="sec-rail"
        style={{ transform: `translateX(-${slide * 100}%)` }}
      >
        {LIFE.map((item) => (
          <article className="sec-panel life-panel" key={item.id}>
            <div className="life-kicker">04 · LIFE / {item.label}</div>
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
          </article>
        ))}
      </div>
    </div>
  );
}
