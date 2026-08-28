"use client";

import { useState } from "react";
import { RESUME_PATH } from "@/components/portfolio/data";

export default function Closing() {
  const [notice, setNotice] = useState("");

  const copyEmail = async () => {
    const email = "2352202496@qq.com";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = email;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }
    setNotice("邮箱已复制");
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
          <a href="mailto:2352202496@qq.com">2352202496@qq.com</a>
          <button type="button" onClick={copyEmail}>
            复制
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
      <p className="closing-note">
        手机号与微信不直接公开，邮件联系后由本人确认交换。
      </p>
      {notice ? (
        <p className="closing-toast" role="status">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
