/**
 * Claude 机甲虎吉祥物 · 木偶式动画 sprite
 * ---------------------------------------------------------------
 * 临时借用自 ChenYanjun-hub/cyj-personal-web（外观后续可替换）。
 * 纯展示组件：根据 state 切换 CSS 动画类。
 * 动画定义在 globals.css 的 .claude-pet 区块。
 * 状态：idle 待机 / hello 打招呼 / talk 说话 / think 思考 / sleep 睡觉 / error 出错
 */

export type PetState = "idle" | "hello" | "talk" | "think" | "sleep" | "error";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${BASE_PATH}${path}`;

export default function ClaudePet({
  state = "idle",
  className = "",
}: {
  state?: PetState;
  className?: string;
}) {
  return (
    <span className={`claude-pet state-${state} ${className}`} aria-hidden>
      <span className="claude-pet-shadow" />
      {/* 装饰性 sprite，alt 留空（外层按钮已有 aria-label） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="claude-pet-sprite"
        src={asset("/claude-pet.png")}
        alt=""
        draggable={false}
      />
    </span>
  );
}
