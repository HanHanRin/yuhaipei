"use client";

import { useState } from "react";
import { RESUME_PATH } from "@/components/portfolio/data";

const EMAIL = "2352202496@qq.com";
const PHONE = "184-3708-8052";

export default function Closing() {
  const [notice, setNotice] = useState("");

  const copy = async (value: string, label: string) => {
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
    setNotice(`${label}已复制`);
    window.setTimeout(() => setNotice(""), 1800);
  };

  return (
    <div className="sec-closing">
      <div className="closing-kicker">05 · CLOSING / 总结</div>
      <h2 className="closing-title">
        LET&apos;S MAKE
        <br />
        <span>THE COMPLEX</span>
        <br />
        CLEAR.
      </h2>
      <p className="closing-lead">
        如果你需要一个既能做研究，也能把想法变成产品的人，
        <strong>欢迎和我聊聊。</strong>
      </p>
      <div className="closing-links">
        <div className="closing-row">
          <span>EMAIL</span>
          <button
            type="button"
            className="closing-value"
            onClick={() => copy(EMAIL, "邮箱")}
          >
            {EMAIL}
          </button>
        </div>
        <div className="closing-row">
          <span>PHONE</span>
          <button
            type="button"
            className="closing-value"
            onClick={() => copy(PHONE, "手机号")}
          >
            {PHONE}
          </button>
        </div>
        <div className="closing-row">
          <span>RESUME</span>
          <a href={RESUME_PATH} download>
            下载简历
          </a>
        </div>
        <div className="closing-row">
          <span>GITHUB</span>
          <a
            href="https://github.com/HanHanRin"
            target="_blank"
            rel="noreferrer"
          >
            HanHanRin
          </a>
        </div>
      </div>
      <p className="closing-note">点击邮箱或手机号即可复制。</p>
      {notice ? (
        <p className="closing-toast" role="status">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
