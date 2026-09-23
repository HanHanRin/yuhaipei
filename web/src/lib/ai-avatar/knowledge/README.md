# AI 分身知识库

本目录是小机器人的可维护知识源。每次用户提问时：

1. 读取 [`router-skill.md`](./router-skill.md)（人格、隐私、意图路由表）
2. 根据**最后一条用户问题**匹配意图 → 选中若干 `docs/*.md`（单次最多 4 份）
3. 把「路由 skill + 选中文档」拼成 system prompt，再调用 DeepSeek

## 目录

```
knowledge/
  README.md
  router-skill.md
  manifest.ts              ← 代码侧路由表（与 router-skill 同步）
  index.ts                 ← 组装 prompt
  docs/                    ← 当前知识文档（STAR 拆分版）
  docs._backup-20260917/   ← 升级前备份，确认无误后可删
```

概览文档：`profile` / `education` / `experience` / `projects` / `skills` / `faq` / `contact-privacy`  
经历细节：`experience-azazie` / `zhujie` / `yunzhou` / `fudan` / `feishu-fde`  
项目细节：`projects-cmb` / `opc` / `sp-app`  

清单见 [`docs/_index.md`](./docs/_index.md)。

## 怎么加内容

1. 编辑或新建 `docs/*.md`（经历/项目深挖用 STAR：S/T/A/R/补充）
2. 新文件须在 `manifest.ts` 的 `DOC_FILES` + `INTENT_ROUTES` 登记，并同步 `router-skill.md`
3. 本地 `npm run dev` 试对话 → `bash web/deploy/push-from-mac.sh` 上线

## 设计原则

- 关键词路由，不引入向量库；具体意图排在通用意图前
- `jd_match` / 兜底只注入**总览**文档，避免一次塞满全部 STAR
- 严防幻觉：只依据本次注入文档作答；不主动提供手机号/微信
