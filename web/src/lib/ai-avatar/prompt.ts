/**
 * 系统提示词入口（兼容旧 import）
 * ---------------------------------------------------------------
 * 真正的知识在 knowledge/：
 *  - knowledge/router-skill.md  · 路由 skill
 *  - knowledge/docs/*.md        · 主题文档
 *  - knowledge/index.ts         · 按意图组装 prompt
 *
 * 聊天接口使用 buildKnowledgePrompt(userText) / buildFullKnowledgePrompt()。
 */

export {
  buildKnowledgePrompt,
  buildFullKnowledgePrompt,
} from "./knowledge";
