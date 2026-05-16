# 路特 AI 公司 v0.2 · 母婴跨境 DTC 演示站

> **4 天 · 184 员工 · 1 个 UV-C 消毒柜**
>
> 从 idea 到合规通过的真实 SKU 商品页，全程 AI 工作室自主完成。

---

## 🌐 在线访问

**演示站**：[https://zjgulai.github.io/lute-ai-company-demo/](https://zjgulai.github.io/lute-ai-company-demo/)

**预计上线**：M5 完成后（2026-05-19 前）

---

## 📐 站点结构（7 章探险日记）

| § | 章节 | 主题 |
|---|---|---|
| 首页 | Cover | 4 天 · 184 员工 · 1 SKU 全景 |
| §1 | 起源 | 路特 AI 公司 v0.2 · 184 员工 14 部门 · C-Suite 治理 |
| §2 | 选品 | SOP-A 选品流 · 北美 + 欧洲 · UV-C 真空带发现 |
| §3 | 上架 | SOP-B 7 步 · Day 2 戏剧性 PIVOT · Day 1 vs Day 4 生图对比 |
| §4 | 自进化 | 3 轮 prompt 升级 · OMO/Brand Guardian/Sisyphus |
| §5 | 生图实验室 | image-to-image reference + Vision LM 选优 · +42% 质量 |
| §6 | 法规雷区 | Legal Audit 双审 · UV vs Steam 法规非传递 |
| §7 | 路线图 | NurtureLoop 立项 · SaaS 化 · 全自动化未来 |

---

## ✨ 6 大可交互可视化

1. **Day 1 vs Day 4 生图对比滑块** — 6/10 → 8.5/10 质量曲线
2. **memory 知识图谱可交互** — 64 节点 + 121 关系 force-directed graph
3. **184 员工 × 7 SOP 步 Sankey** — 14 部门分工可视化
4. **Shopify mockup iframe 嵌入** — 53KB 真实商品页 + Legal 修订 annotation
5. **git 时间轴 horizontal scroll** — 20+ commit 真实开发轨迹
6. **3 轮自进化状态机动画** — PROPOSED → APPROVED → APPLIED

---

## 🛠️ 技术栈

| 类别 | 技术 |
|---|---|
| 静态站 | 纯 HTML + CSS + Vanilla JS（零构建） |
| 图表 | Cytoscape.js (memory graph) + D3.js v7 + d3-sankey |
| 滑块 | img-comparison-slider web component |
| 动画 | GSAP timeline + CSS scroll-snap |
| 字体 | Source Serif 4 + Inter + JetBrains Mono |
| 部署 | GitHub Pages + GH Action |

---

## 📊 数据资产（`data/` 目录）

| 文件 | 内容 | 大小 |
|---|---|---|
| `memory.json` | aim-memory 完整导出 · 64 entity + 121 relation | 87KB |
| `agents.json` | 184 员工 metadata · 14 部门 · 21 demo 高亮 | 80KB |
| `commits-agent_agents.json` | 业务工作树 commit 时间轴 | 5KB |
| `commits-agents.json` | Agents 仓 commit 时间轴 | 2KB |
| `sop-b-flow.json` | SOP-B 7 步 + 流向 + 14 部门色板 | 6KB |

---

## 🎨 设计系统

高端 editorial 风格（Stripe Press / Anthropic）：

```css
--bg-primary:       #fafaf8;   /* 暖白纸调 */
--accent-warm:      #d49a6a;   /* Warm Amber */
--accent-sage:      #8fa68c;   /* Sage Dust (品牌色) */
--font-display:     'Source Serif 4', Georgia, serif;
--font-body:        'Inter', sans-serif;
--font-mono:        'JetBrains Mono', Menlo, monospace;
```

---

## 📅 里程碑

| M | 描述 | 状态 |
|---|---|---|
| M1 | 数据导出 + 仓初始化 | ✅ 完成 |
| M2 | 设计系统 + 首页 + §1 起源 | ⏳ 等开工 |
| M3 | §2-§3 + Day1/4 滑块 + mockup iframe + git 时间轴 | 待 |
| M4 | §4-§6 + memory 图谱 + Sankey + 状态机动画 | 待 |
| M5 | §7 + credits + 优化 + 部署上线 | 待 |

---

## 🔗 相关仓库

- 员工档案库：[`zjgulai/AI_Company_Person`](https://github.com/zjgulai/AI_Company_Person)（184 员工 prompt）
- 业务工作树：`zjgulai/Agent_agents` (private)（v0.2 项目文件）
- 演示站（本仓）：`zjgulai/lute-ai-company-demo`（公开）

---

## 📝 设计文档

完整网站计划详见业务工作树仓的 `.sisyphus/plans/【网站计划】路特AI公司演示站-2026-05-16.md`。

---

**起草**：Sisyphus（COO）2026-05-16
**编排**：路特（CEO）
