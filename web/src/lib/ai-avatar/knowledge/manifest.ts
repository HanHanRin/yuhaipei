/**
 * 知识库清单与意图路由表（代码侧，与 router-skill.md 保持同步）
 * ---------------------------------------------------------------
 * 新增文档：
 *  1. 在 docs/ 下放 md
 *  2. 加入 KnowledgeDocId 与 DOC_FILES
 *  3. 在 INTENT_ROUTES 增加意图或把文件挂到已有意图
 *  4. 同步改 knowledge/router-skill.md 里的表格
 *
 * 路由机制说明：
 *  - resolveIntents() 会收集「所有」命中的意图（可多选）。
 *  - docsForIntents() 按 INTENT_ROUTES 顺序合并去重，最多注入 MAX_DOCS_PER_REQUEST 份。
 *  - 因此把「更具体」的意图（含总览 + 细节文档）放在「更通用」意图之前，
 *    命中具体关键词时能优先把细节文档带上。
 */

export type KnowledgeDocId =
  // 概览文档
  | "profile"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "contact-privacy"
  | "faq"
  // 经历细节文档
  | "experience-azazie"
  | "experience-zhujie"
  | "experience-yunzhou"
  | "experience-fudan"
  | "experience-feishu-fde"
  // 项目细节文档
  | "projects-cmb"
  | "projects-opc"
  | "projects-sp-app";

export type IntentId =
  | "profile"
  | "education"
  | "experience"
  | "experience_azazie"
  | "experience_zhujie"
  | "experience_yunzhou"
  | "experience_fudan"
  | "experience_feishu_fde"
  | "projects"
  | "projects_cmb"
  | "projects_opc"
  | "projects_sp"
  | "skills"
  | "contact"
  | "faq"
  | "jd_match";

/** 文件名（相对于 knowledge/docs/） */
export const DOC_FILES: Record<KnowledgeDocId, string> = {
  profile: "profile.md",
  education: "education.md",
  experience: "experience.md",
  projects: "projects.md",
  skills: "skills.md",
  "contact-privacy": "contact-privacy.md",
  faq: "faq.md",
  "experience-azazie": "experience-azazie.md",
  "experience-zhujie": "experience-zhujie.md",
  "experience-yunzhou": "experience-yunzhou.md",
  "experience-fudan": "experience-fudan.md",
  "experience-feishu-fde": "experience-feishu-fde.md",
  "projects-cmb": "projects-cmb.md",
  "projects-opc": "projects-opc.md",
  "projects-sp-app": "projects-sp-app.md",
};

export type IntentRoute = {
  id: IntentId;
  /** 小写关键词；命中任一即选中该意图 */
  keywords: string[];
  docs: KnowledgeDocId[];
};

export const INTENT_ROUTES: IntentRoute[] = [
  {
    id: "jd_match",
    keywords: [
      "jd",
      "岗位匹配",
      "匹配分析",
      "招聘",
      "适不适合",
      "这个岗位",
      "job description",
    ],
    docs: ["profile", "experience", "projects", "skills"],
  },

  // —— 经历细节（更具体，放在通用 experience 之前）——
  {
    id: "experience_azazie",
    keywords: [
      "azazie",
      "艾哲",
      "客服",
      "csat",
      "质检",
      "视频审核",
      "kol",
      "拉黑",
      "skill",
    ],
    docs: ["experience", "experience-azazie"],
  },
  {
    id: "experience_zhujie",
    keywords: ["逐界", "元规", "建规景", "规范", "合同", "合同审查"],
    docs: ["experience", "experience-zhujie"],
  },
  {
    id: "experience_yunzhou",
    keywords: ["云舟", "识景", "街景", "同济院", "规划院"],
    docs: ["experience", "experience-yunzhou"],
  },
  {
    id: "experience_fudan",
    keywords: ["复旦"],
    docs: ["experience", "experience-fudan"],
  },
  {
    id: "experience_feishu_fde",
    keywords: ["飞书", "fde", "字节", "合规", "审序", "广告"],
    docs: ["experience", "experience-feishu-fde"],
  },
  {
    id: "experience",
    keywords: ["实习", "工作经历", "经历", "工作过"],
    docs: ["experience"],
  },

  // —— 项目细节（更具体，放在通用 projects 之前）——
  {
    id: "projects_cmb",
    keywords: ["招行", "招商", "景气", "训练营", "小金喵", "客户经理"],
    docs: ["projects", "projects-cmb"],
  },
  {
    id: "projects_opc",
    keywords: ["opc", "游民", "乡村", "张江", "社区"],
    docs: ["projects", "projects-opc"],
  },
  {
    id: "projects_sp",
    keywords: ["交友", "sp", "恋爱", "选择偏好"],
    docs: ["projects", "projects-sp-app"],
  },
  {
    id: "projects",
    keywords: ["项目", "作品集", "搭小财"],
    docs: ["projects"],
  },

  // —— 其他意图 ——
  {
    id: "education",
    keywords: [
      "学历",
      "教育",
      "同济",
      "硕士",
      "本科",
      "空窗",
      "职业实践",
      "同昊",
      "奖学金",
    ],
    docs: ["education"],
  },
  {
    id: "skills",
    keywords: [
      "技能",
      "会什么",
      "技术栈",
      "rag",
      "agent",
      "python",
      "英语",
      "雅思",
      "prompt",
      "workflow",
      "vibe",
      "coze",
      "n8n",
    ],
    docs: ["skills"],
  },
  {
    id: "contact",
    keywords: ["联系", "邮箱", "邮件", "微信", "手机", "电话", "怎么约", "约聊"],
    docs: ["contact-privacy"],
  },
  {
    id: "faq",
    keywords: ["迁移", "规划背景", "做过哪些 ai", "核心优势是什么"],
    docs: ["faq", "profile"],
  },
  {
    id: "profile",
    keywords: [
      "是谁",
      "简介",
      "定位",
      "核心优势",
      "一句话",
      "介绍一下",
      "自我介绍",
      "为什么选",
    ],
    docs: ["profile"],
  },
];

/** 未命中任何意图时的兜底文档（仅总览文档） */
export const FALLBACK_DOCS: KnowledgeDocId[] = [
  "profile",
  "experience",
  "projects",
  "skills",
];

/** 单次请求最多注入几份文档（不含路由 skill） */
export const MAX_DOCS_PER_REQUEST = 4;
