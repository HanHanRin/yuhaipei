"use client";

/**
 * 聊天气泡内的轻量 Markdown 渲染（加粗、标题、列表等）。
 * 仅用于助手消息；用户消息保持纯文本。
 */

import ReactMarkdown from "react-markdown";

export default function ChatMarkdown({ text }: { text: string }) {
  if (!text) return null;
  return (
    <ReactMarkdown
      components={{
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
