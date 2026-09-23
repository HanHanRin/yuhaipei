# 知识文档清单（给人看）

> 事实来源：`resume-2026.9`（第一优先）、面试口述稿 `story-0916`（第二优先）、各项目机制拆解 MD（仅补机制，不引用其中过时日期）。
> 冲突时以更靠前来源为准。所有对外表达遵循隐私边界：只给邮箱 + GitHub，不主动提供手机号 / 微信。

## 概览文档（默认注入）

| 文件 | 用途 |
|------|------|
| `profile.md` | 身份、ToB/ToC 定位、转型叙事、三点核心优势 |
| `education.md` | 硕士（智慧城市方向）与荣誉、本科、同昊职业实践（连续工作，非空窗） |
| `experience.md` | 实习经历时间线总览（公司 / 角色 / 时间 / 一句话），细节见公司分档 |
| `projects.md` | 项目索引与一句话定位，细节见项目分档 |
| `skills.md` | 技能关键词（英语 / 软件 / AI / 产品方法） |
| `contact-privacy.md` | 公开联系方式与隐私边界 |
| `faq.md` | 高频问答与 JD 匹配指引 |

## 经历细节文档（按公司关键词加载）

| 文件 | 用途 | 触发关键词 |
|------|------|-----------|
| `experience-azazie.md` | Azazie 电商 AI 客服 / 质检 / 视频审核 / KOL STAR | azazie、艾哲、客服、质检、视频审核、kol、csat |
| `experience-zhujie.md` | 逐界建规景 RAG + 合同审查 STAR | 逐界、元规、建规景、合同、合同审查 |
| `experience-yunzhou.md` | 云舟识景街景语义分析平台 STAR | 云舟、街景、同济院、识景 |
| `experience-fudan.md` | 复旦金融研究中心数据分析 STAR | 复旦 |
| `experience-feishu-fde.md` | 字节跳动飞书 FDE「审序」广告合规检查 STAR | 飞书、fde、字节、合规、审序、广告 |

## 项目细节文档（按项目关键词加载）

| 文件 | 用途 | 触发关键词 |
|------|------|-----------|
| `projects-cmb.md` | 招行训练营行业景气度智能研究 STAR | 招行、招商、景气、小金喵、训练营 |
| `projects-opc.md` | 张江数字游民 OPC 社区 + 乡村数字游民研究 STAR | opc、游民、乡村、张江 |
| `projects-sp-app.md` | 基于 SP 法的恋爱交友 App 选择偏好研究 STAR | 交友、sp、恋爱 |

维护说明：新增文档需同步 `manifest.ts`（`KnowledgeDocId` / `DOC_FILES` / `INTENT_ROUTES`）与 `router-skill.md` 的意图路由表。
