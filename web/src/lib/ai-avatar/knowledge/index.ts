/**
 * 知识库路由 · 按用户意图加载 docs，拼 system prompt
 * ---------------------------------------------------------------
 * 雏形：关键词路由（零额外模型调用）。之后可换成 LLM 分类器，
 * 只需替换 resolveIntents()，manifest / docs 结构可不变。
 */

import fs from "node:fs";
import path from "node:path";
import {
  DOC_FILES,
  FALLBACK_DOCS,
  INTENT_ROUTES,
  MAX_DOCS_PER_REQUEST,
  type IntentId,
  type KnowledgeDocId,
} from "./manifest";

const KNOWLEDGE_DIR = path.join(process.cwd(), "src/lib/ai-avatar/knowledge");

function readUtf8(filePath: string): string {
  return fs.readFileSync(filePath, "utf8").trim();
}

function loadRouterSkill(): string {
  return readUtf8(path.join(KNOWLEDGE_DIR, "router-skill.md"));
}

function loadDoc(id: KnowledgeDocId): string {
  const file = DOC_FILES[id];
  return readUtf8(path.join(KNOWLEDGE_DIR, "docs", file));
}

/** 从用户问题解析意图（可多选） */
export function resolveIntents(userText: string): IntentId[] {
  const q = userText.toLowerCase();
  const hit: IntentId[] = [];
  for (const route of INTENT_ROUTES) {
    if (route.keywords.some((kw) => q.includes(kw.toLowerCase()))) {
      hit.push(route.id);
    }
  }
  return hit;
}

function docsForIntents(intents: IntentId[]): KnowledgeDocId[] {
  if (intents.length === 0) return [...FALLBACK_DOCS];

  const ordered: KnowledgeDocId[] = [];
  const seen = new Set<KnowledgeDocId>();
  for (const intent of intents) {
    const route = INTENT_ROUTES.find((r) => r.id === intent);
    if (!route) continue;
    for (const doc of route.docs) {
      if (seen.has(doc)) continue;
      seen.add(doc);
      ordered.push(doc);
      if (ordered.length >= MAX_DOCS_PER_REQUEST) return ordered;
    }
  }
  return ordered.length > 0 ? ordered : [...FALLBACK_DOCS];
}

export type BuiltKnowledgePrompt = {
  systemPrompt: string;
  intents: IntentId[];
  docs: KnowledgeDocId[];
};

/**
 * 根据最近一条用户消息构建 system prompt。
 * @param userText 用户最新问题；空则用兜底文档集
 */
export function buildKnowledgePrompt(userText: string): BuiltKnowledgePrompt {
  const intents = userText.trim() ? resolveIntents(userText) : [];
  const docs = docsForIntents(intents);

  const parts: string[] = [
    loadRouterSkill(),
    "",
    "============================================================",
    "本次注入的知识文档（唯一事实来源；未出现的细节不要编造）",
    "============================================================",
  ];

  for (const id of docs) {
    parts.push("", `----- 文档: ${DOC_FILES[id]} -----`, loadDoc(id));
  }

  return {
    systemPrompt: parts.join("\n"),
    intents,
    docs,
  };
}

/** JD 图匹配等需要较全档案时，注入全部主题文档 */
export function buildFullKnowledgePrompt(): BuiltKnowledgePrompt {
  const docs = Object.keys(DOC_FILES) as KnowledgeDocId[];
  const parts: string[] = [
    loadRouterSkill(),
    "",
    "============================================================",
    "完整知识文档（岗位匹配请严格对照）",
    "============================================================",
  ];
  for (const id of docs) {
    parts.push("", `----- 文档: ${DOC_FILES[id]} -----`, loadDoc(id));
  }
  return {
    systemPrompt: parts.join("\n"),
    intents: ["jd_match"],
    docs,
  };
}
