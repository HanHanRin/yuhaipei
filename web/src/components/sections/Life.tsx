"use client";

type Props = {
  slide: number;
};

const LIFE = [
  {
    id: "books",
    label: "BOOKSHELF",
    title: "书",
    hint: "封面轨占位 · 后续补书单与封面",
    items: ["城市研究", "产品方法", "叙事与认知"],
  },
  {
    id: "film",
    label: "CINEMA",
    title: "电影",
    hint: "片单占位 · 后续补海报与短评",
    items: ["叙事结构", "空间镜头", "人物弧线"],
  },
  {
    id: "photo",
    label: "OBSERVE",
    title: "摄影",
    hint: "影像占位 · 后续接入现场照片",
    items: ["城市肌理", "现场笔记", "光影练习"],
  },
] as const;

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
            <h2>{item.title}</h2>
            <p className="life-hint">{item.hint}</p>
            <ul className="life-cards">
              {item.items.map((name) => (
                <li key={name}>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
