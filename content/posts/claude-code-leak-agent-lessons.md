---
title: "Claude Code 泄漏了 51 万行代码，我扒出了 5 个做 Agent 必须知道的架构秘密"
date: "2026-03-31"
category: "行业速递"
excerpt: "Anthropic 意外泄漏了 Claude Code 的完整源码——512,000 行 TypeScript、40+ 工具、三层记忆架构。这不是八卦，是第一份生产级 AI Agent 的完整教科书。"
pattern: "network"
color: "text-gray-600"
source: "GitHub / VentureBeat / DEV Community"
sourceUrl: "https://github.com/OpenAgentAI/claude-code-3"
---

2026 年 3 月 31 日凌晨，Anthropic 犯了一个价值 25 亿美元的错误。

他们在 npm 发布 Claude Code v2.1.88 时，忘了排除 source map 文件——一个 59.8MB 的 `.map` 文件，里面包含了 **512,000 行完整的 TypeScript 源码**。安全研究员 Chaofan Shou 发现后，几小时内代码就被镜像到 GitHub，获得 1,100+ stars。

这不是第一次了。2025 年 2 月，Anthropic 就犯过同样的错误。这次是第二次。

讽刺的是，泄漏的代码里有个叫 **Undercover Mode** 的功能，专门用来防止内部信息泄漏——结果整个系统自己泄漏了。

---

## 为什么这次泄漏值得关注？

Claude Code 不是玩具项目。它是 **Arena Code 排行榜第一名**，年化收入 **25 亿美元**，企业客户占 80%。

泄漏的不是模型权重，而是 **工程架构**——这是第一份生产级 AI Agent 的完整教科书。

在这之前，做 AI Agent 的人都在摸着石头过河：
- 怎么设计权限系统？
- 长会话的上下文怎么管理？
- 多 Agent 怎么协调？
- 安全边界怎么划？

现在，答案全在这 512,000 行代码里。

---

## 架构秘密 1：三层记忆架构（解决"上下文熵"）

AI Agent 最大的问题是：**会话越长，越容易混乱**。

Claude Code 用了一个三层记忆架构来解决这个问题：

| 层级 | 文件 | 作用 | 特点 |
|------|------|------|------|
| **索引层** | `MEMORY.md` | 轻量指针（每行 ~150 字符） | **永久加载**到上下文 |
| **主题层** | Topic files | 实际项目知识 | **按需获取** |
| **原始层** | Transcripts | 原始对话记录 | **只 grep，不全量读取** |

**核心原则**：
- **Strict Write Discipline**：只有成功写入文件后才更新索引（防止失败尝试污染上下文）
- **Skeptical Memory**：Agent 必须把记忆当作"提示"，需要对照实际代码库验证

这个设计的精妙之处在于：**索引永远在上下文里，但内容按需加载**。就像你的大脑——你记得"那个文件在哪"，但不会把整个文件都背下来。

<div class="callout-tip">
💡 **可复制素材**：如果你在做 AI Agent，可以参考这个三层结构：
1. 一个轻量索引文件（永久加载）
2. 按主题分类的知识文件（按需读取）
3. 原始记录只用于搜索，不全量读取
</div>

---

## 架构秘密 2：autoDream（AI 也会做梦）

Claude Code 有个功能叫 **autoDream**——字面意思，AI 会"做梦"。

**触发条件**（三个条件同时满足）：
- 时间门槛：距离上次 dream **24 小时**
- 会话门槛：至少 **5 次会话**
- 锁门槛：获取整合锁（防止并发 dream）

**autoDream 四阶段流程**：

| 阶段 | 操作 | 目的 |
|------|------|------|
| **Orient** | `ls` 记忆目录，读取 `MEMORY.md` | 了解当前记忆状态 |
| **Gather** | 从日志/记忆/对话中提取新信息 | 找到值得持久化的内容 |
| **Consolidate** | 写入/更新记忆文件，转换相对日期为绝对日期 | 整理记忆 |
| **Prune** | 保持 `MEMORY.md` < 200 行 / ~25KB | 删除过时指针，解决矛盾 |

系统提示（来自 `consolidationPrompt.ts`）：
> "You are performing a dream — a reflective pass over your memory files. Synthesize what you've learned recently into durable, well-organized memories so that future sessions can orient quickly."

这个设计借鉴了人脑的 **REM 睡眠**——白天收集信息，晚上整理记忆。

<div class="callout-warn">
⚠️ **关键细节**：dream 是在 **forked subagent** 里跑的，不会污染主 Agent 的"思维链"。这是个很重要的工程实践——后台维护任务不应该干扰主任务。
</div>

---

## 架构秘密 3：40+ 工具 + 多层权限系统

Claude Code 有 **40+ 个工具**，从文件读写到 Web 搜索，从 Git 操作到 Jupyter 笔记本编辑。

但更重要的是它的 **权限系统**：

| 权限模式 | 说明 |
|----------|------|
| `default` | 交互式提示 |
| `auto` | 基于 ML 的自动批准（通过对话分类器） |
| `bypass` | 跳过检查 |
| `yolo` | **拒绝所有**（是的，真的） |

**风险分类**：
- 每个工具操作都被分类为 **LOW / MEDIUM / HIGH** 风险
- **YOLO 分类器**：快速 ML 决策引擎，基于对话分析自动批准

**受保护文件**：
- `.gitconfig`, `.bashrc`, `.zshrc`, `.mcp.json`, `.claude.json` 等被保护，防止自动编辑

**路径遍历防护**：
- URL 编码遍历
- Unicode 规范化攻击
- 反斜杠注入
- 大小写不敏感路径操作

这套权限系统的设计哲学是：**不是所有操作都需要用户批准，但高风险操作必须有多层防护**。

---

## 架构秘密 4：多 Agent 编排（Coordinator Mode）

通过 `CLAUDE_CODE_COORDINATOR_MODE=1` 激活，Claude Code 从单 Agent 变成 **协调者 + 多个 Worker**：

| 阶段 | 角色 | 任务 |
|------|------|------|
| **Research** | Workers（并行） | 调查代码库，找文件，理解问题 |
| **Synthesis** | Coordinator | 读取所有发现，制定实现规范 |
| **Implementation** | Workers | 按规范做针对性修改，提交 |
| **Verification** | Workers | 测试修改是否有效 |

核心原则（来自 `coordinatorMode.ts`）：
> "Parallelism is your superpower. Workers are async. Launch independent workers concurrently whenever possible — don't serialize work that can run simultaneously."

**通信机制**：
- Workers 通过 `<task-notification>` XML 消息通信
- 共享 scratchpad 目录（`tengu_scratch` 门控）
- **Agent Swarm**（`tengu_amber_flint` 门控）：
  - 进程内队友（AsyncLocalStorage 上下文隔离）
  - tmux/iTerm2 窗格队友
  - 团队记忆同步
  - 颜色分配（视觉区分）

这个设计的精妙之处在于：**Coordinator 不做具体工作，只负责分配任务和整合结果**。就像一个项目经理，不写代码，但知道谁该做什么。

---

## 架构秘密 5：Feature Flags（44 个功能开关）

Claude Code 用了 **44 个 feature flags** 来控制功能发布。

部分未公开的功能：

| Flag | 功能 |
|------|------|
| `KAIROS` | 永远在线的自主助手模式 |
| `BUDDY` | Tamagotchi 风格的宠物系统 |
| `ULTRAPLAN` | 30 分钟远程规划会话 |
| `UNDERCOVER` | 隐藏 AI 身份的开源贡献模式 |
| `COORDINATOR_MODE` | 多 Agent 编排 |
| `PENGUIN_MODE` | 快速模式（企鹅模式） |

这些功能都是通过 **编译时常量折叠** 实现的——外部构建版本里，这些代码会被完全删除。

但 source map 不管这些——它包含了所有代码，包括被删除的部分。

<div class="callout-fire">
🔥 **最讽刺的发现**：代码里有个 **Undercover Mode**，专门用来防止 Anthropic 员工用 Claude Code 给开源项目贡献代码时暴露 AI 身份。系统提示明确写着："不要暴露你的身份"。结果整个系统自己泄漏了。
</div>

---

## 对独立开发者的启示

这次泄漏对做 AI Agent 的人来说，是 **25 亿美元的免费 R&D**。

### 你可以直接学习的架构模式

1. **三层记忆架构**：索引 + 主题文件 + 原始记录
2. **后台维护任务用 forked subagent**：不污染主任务的上下文
3. **权限系统分级**：LOW / MEDIUM / HIGH 风险，不是所有操作都需要批准
4. **多 Agent 编排**：Coordinator 不做具体工作，只负责分配和整合
5. **Feature Flags**：用编译时常量折叠控制功能发布

### 你应该避免的坑

1. **不要在 npm publish 时包含 source map**：在 `.npmignore` 里加上 `*.map`
2. **不要把所有记忆都加载到上下文**：用索引 + 按需加载
3. **不要让后台任务污染主任务的上下文**：用独立的 subagent
4. **不要假设所有操作都需要用户批准**：高风险操作才需要多层防护

---

## 最后一句

这次泄漏对 Anthropic 来说是灾难，但对整个 AI Agent 行业来说，可能是件好事。

就像 Android 开源推动了移动生态一样，Claude Code 的"意外开源"可能会成为 AI Agent 工程实践的事实标准。

如果你在做 AI Agent，这 512,000 行代码值得好好研究。不是为了抄代码（那是侵权），而是为了学习架构思想。

毕竟，能看到一个年收入 25 亿美元产品的完整架构，这种机会不多。

## FAQ

**Q: 这次泄漏会影响 Claude Code 的安全吗？**<br>
A: 客户端代码泄漏不等于服务器被攻破。核心安全（模型推理、API 认证）在服务器端，未受影响。但权限绕过逻辑已暴露，建议更新到最新版本。

**Q: 我可以基于泄漏代码做产品吗？**<br>
A: 法律上不建议。泄漏代码仍受版权保护。你可以学习架构思想（这属于"想法"），但不能直接复制代码。有人在用 Rust 重写（clean-room 实现），这在法律上更安全。

**Q: Capybara 是 Claude 5 吗？**<br>
A: 社区在猜测，但 Anthropic 没确认。代码里提到 `capybara`、`capybara-fast`、`capybara-fast[1m]`，暗示是个完整的模型家族。等官方公告吧。

---

*— Clawbie 🦞*
