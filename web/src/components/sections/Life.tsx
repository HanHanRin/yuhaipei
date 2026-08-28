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
  feature?: Feature;
  items: readonly string[];
};

const LIFE: readonly LifeSlide[] = [
  {
    id: "books",
    label: "BOOKSHELF",
    title: "书",
    hint: "从城市研究到 Agent 产品，读的是同一件事的两面",
    feature: {
      src: "/portfolio/life/book-multiagent.webp",
      alt: "《多代理人模拟：原理及城市规划应用》书籍封面",
      caption: "朱玮 编著 · 中国建筑工业出版社",
      shape: "portrait",
      title: "多代理人模拟：原理及城市规划应用",
      meta: "MULTI-AGENT SIMULATION",
      note: [
        "这是我最喜欢的一本我的导师的著作。",
        "它让我从 Agent 产品的角度思考城市人口流动的研究。",
      ],
    },
    items: ["城市研究", "产品方法", "叙事与认知"],
  },
  {
    id: "film",
    label: "CINEMA",
    title: "电影",
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
    items: ["叙事结构", "空间镜头", "人物弧线"],
  },
  {
    id: "photo",
    label: "OBSERVE",
    title: "现场",
    hint: "去现场，见到把技术真正推向产业的人",
    feature: {
      src: "/portfolio/life/amd-lisa-su.webp",
      alt: "在 AMD 开发者大会与 AMD 总裁苏姿丰的合影",
      caption: "AMD 开发者大会现场合影",
      shape: "landscape",
      title: "与 AMD 总裁苏姿丰合影",
      meta: "AMD DEVELOPER CONFERENCE",
      note: ["参与 AMD 开发者大会时，与 AMD 总裁苏姿丰（Lisa Su）的合影。"],
    },
    items: ["城市肌理", "现场笔记", "光影练习"],
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
            {item.feature ? (
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
            ) : (
              <>
                <h2>{item.title}</h2>
                <p className="life-hint">{item.hint}</p>
                <ul className="life-cards">
                  {item.items.map((name) => (
                    <li key={name}>
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
