---
title: "Claude Code 不是聊天框：搭好工作台，让它自己干活"
date: "2026-03-19"
category: "上手指南"
excerpt: "Claude Code 用对了能一轮过，用错了来回改五遍。差距不在 prompt 技巧，在于你有没有花十分钟搭好工作台。一份 CLAUDE.md、两个子代理、一条 git hook，可复制的完整配置都在这了。"
pattern: "code"
color: "text-stone-600"
---

同一个任务——给一个 Express 项目加限流中间件——我用 Claude Code 跑了两次。

第一次，它上来就问：用什么限流算法？状态存哪？阈值多少？要不要区分路由？我一个个回答完，它写了一版代码。跑起来发现没考虑集群场景，Redis 连接也没复用项目里现成的 client。又改了两轮，四十分钟。

第二次，它打开项目直接动手，没问一个问题。令牌桶、Redis、100/min、复用现有 client——全对。写完之后它自动调了一个 reviewer 子代理检查代码风格，发现一个变量命名不符合项目规范，自己改了。提交前 git hook 跑了 lint 和测试，全过。十二分钟。

两次之间我没换模型，没改 prompt 风格。唯一的区别：第二次之前我花了十分钟，给项目搭了一个"工作台"。

---

## 为什么你的 Claude Code 老是问蠢问题？

Claude Code 有 1M 上下文窗口，能读完一个中型项目的全部代码。但"读得到"和"知道该怎么做"是两回事。

代码能告诉它函数怎么写的，告诉不了它"我们为什么选 Redis 而不是 Memcached"、"错误处理统一用 AppError 类"、"所有 API 响应字段用 snake_case"。这些是项目的隐性知识——老员工都知道，新人头两周踩坑才学会的东西。

Claude Code 每次打开都是"新员工入职第一天"。你不给它入职手册，它就只能靠猜。猜不准就问你，问多了你烦，它也慢。

解决办法是 CLAUDE.md——在项目根目录放一个纯文本文件，Claude Code 每次启动自动读取。不是 README（那是给人看的），是给 Agent 看的行为指南。它记录的是项目里那些"代码看不出来但必须知道"的隐性知识，写一份 30 到 50 行的 CLAUDE.md，等于给 Agent 做了一次永久性入职培训。

该写什么？三类信息就够：

**项目上下文**：技术栈、关键架构决策、文件结构约定。重点写代码里看不出来的"为什么"——"用 Redis 做缓存是因为要支持多实例部署"、"tests/e2e/ 下的测试需要先启动 docker-compose"。

**行为规则**：代码风格、命名规范、禁止事项。"API 响应用 snake_case"、"不用 any 类型"、"commit message 用 conventional commits 格式"。

**工作流指令**：改代码前先跑测试、不要自动 push、PR 描述必须包含改动原因。

这些东西平时都在你脑子里，Claude Code 不知道。写下来一次，以后每次它打开项目都自动加载。

---

## 一个 Agent 从头干到尾，谁都扛不住

CLAUDE.md 解决了"不了解项目"的问题。但还有一个瓶颈：一个 Agent 同时负责理解需求、写代码、审查质量、跑测试，就像让一个人同时当产品经理、程序员和 QA。不是不行，但顾此失彼是常态。

Claude Code 支持子代理（SubAgent，专项助手）——在 `.claude/agents/` 目录下用 TOML（一种简单的配置文件格式）定义配置，每个子代理只做一件事。

![Claude Code 工作台三层架构：CLAUDE.md + 子代理 + Git Hooks](/images/posts/claude-code-workspace.svg)

我给老大的项目配了两个：

**explorer** — 专门扫描代码库，不改任何文件，只输出分析报告。接手新项目或者不确定某个模块怎么工作时，先让它跑一遍。

**reviewer** — 专门做代码审查。Claude Code 写完代码后调它，检查 bug、安全漏洞、命名规范。它和写代码的主 Agent 是"两个脑子"，一个负责干活，一个负责挑毛病。

用的时候直接在 prompt 里引用名字就行："让 explorer 看看 auth 模块的调用链"、"写完之后让 reviewer 帮我查一遍"。两个子代理可以并行工作，互不干扰。

有个省钱技巧：explorer 只读代码不需要强推理，用轻量模型就够了；reviewer 需要判断力，用中等模型；主 Agent 写复杂逻辑时才上最强模型。按任务强度分配模型，成本能压下来不少。

---

## Agent "好心办坏事"怎么防？

Agent 写代码有个通病：它觉得自己改好了，信心满满地提交，但实际上引入了类型错误或者破坏了现有测试。CLAUDE.md 里写了"改完跑测试"，但它不一定每次都听话——"建议"和"强制"是两回事。

最靠谱的护栏是老朋友 **git hook**。在项目里配一个 pre-commit hook，不管是谁提交——人还是 Agent——都先自动跑 lint（代码格式和质量检查）和测试。不通过就拒绝提交，Claude Code 收到失败信号会自己去修，然后重新尝试提交。

这招的好处是不需要任何 Claude Code 专属配置。Git hook 是 git 的标准功能，Claude Code 提交代码走的就是正常的 `git commit`，hook 自动触发。你哪天换成 Cursor 或者 Codex，这套护栏照样管用。

如果项目已经用了 husky 或 lint-staged 之类的工具，那你连这步都省了——已有的 hook 对 Agent 同样有效。如果还没有，最简单的做法是在项目里加一个 pre-commit 脚本，内容就是你平时手动跑的那些检查命令。

说实话，这不是什么新鲜招数。但我观察到一个现象：很多人的项目本来就有 pre-commit hook，但用 Claude Code 的时候会让它跳过（加 `--no-verify` 参数），觉得"反正它写的应该没问题"。这等于主动拆掉了护栏。别这么干——Agent 的代码和人写的代码一样，都需要被检查。

---

## 十分钟搭好一个真实项目的工作台

说了原理，来跑一个完整流程。假设你有一个 Node.js 项目，想让 Claude Code 从"聊天对象"变成"干活搭档"。

**第一步：写 CLAUDE.md（3 分钟）**

在项目根目录创建文件，写最关键的二三十行：

```markdown
# 项目概览
Express + TypeScript API 服务，PostgreSQL 数据库，Redis 缓存。

# 开发规则
- 接口命名用 snake_case
- 错误处理统一用 AppError 类（src/utils/errors.ts）
- 新接口必须有集成测试
- commit message 格式：type(scope): description

# 常用命令
- 跑测试：npm test
- 只跑单元测试：npm run test:unit
- lint 检查：npm run lint
- 启动开发环境：docker-compose up -d && npm run dev
```

不用写得完美。先覆盖最常问的问题，后续 Claude Code 踩了什么坑，追加进去。这个文件会越用越聪明。

做完这步验证一下：打开 Claude Code，问它"这个项目的测试怎么跑"。如果它直接回答 `npm test` 而不是反问你，说明 CLAUDE.md 生效了。

**第二步：配子代理（3 分钟）**

创建 `.claude/agents/` 目录，放一到两个配置文件。不需要复杂的设定，几行就够：

```toml
# .claude/agents/reviewer.toml
[agent]
name = "reviewer"
instructions = """
你是代码审查专家。检查代码时关注：
1. 潜在的 bug 和边界情况
2. 安全漏洞（注入、未授权访问）
3. 是否符合项目的命名规范和错误处理约定
给出具体、可操作的修改建议。不要自己改代码。
"""
```

别贪多，一个 reviewer 就能覆盖大部分场景。explorer 可以后续需要时再加。

**第三步：确认 git hook 就位（2 分钟）**

如果项目已经有 pre-commit hook（用 husky 或者手写的 `.git/hooks/pre-commit`），检查一下它是否包含 lint 和测试。如果还没有，最快的办法是在 `.git/hooks/pre-commit` 里写一行 `npm test`，然后 `chmod +x`。

这一步的投入产出比最高。两分钟配置，能省你无数次手动回滚。

**第四步：跑一个任务验证（2 分钟）**

打开 Claude Code，给它一个你熟悉的小任务——这样你能判断结果质量。观察两件事：它还有没有问蠢问题？提交前有没有被 hook 拦截？两个都达标，工作台搭好了。

---

这套东西不复杂。CLAUDE.md 是个文本文件，子代理是几行 TOML 配置，git hook 是标准的 shell 脚本。三样加起来不超过五十行。但我之前用 Claude Code 两个月都没配过，原因很简单——能用就不想折腾，直到痛到不得不改。

那个四十分钟改限流的晚上就是我的"不得不改"时刻。配完工作台之后，同类任务基本一轮过。不是每次都这么顺——遇到跨模块的复杂改动还是要来回两三轮——但起码不用回答一堆"你们用什么框架"的问题了。

如果你现在就想试，最低成本的起步是：先写一份 CLAUDE.md。就这一个文件，效果立竿见影。子代理和 git hook 可以之后慢慢加。

---

## 常见问题

**Q: CLAUDE.md 和 README 有什么区别？**

README 是给人类看的项目介绍，CLAUDE.md 是给 AI Agent 看的行为指南。README 说"这个项目是什么"，CLAUDE.md 说"在这个项目里该怎么做"——代码规范、测试命令、工作流约束。

**Q: 子代理会不会大幅增加 token 消耗？**

会增加，但可控。给审查类子代理分配轻量模型，只让主 Agent 用大模型。合理分配后，总成本比让一个大模型反复修改往往还便宜——因为一轮过比改三轮省 token。

**Q: 不用 Claude Code 用其他编码工具，这套思路还管用吗？**

CLAUDE.md 是 Claude Code 专属的，但同类工具都有类似机制——Codex 的 `codex.md`、Cursor 的 `.cursorrules`。子代理各家也都在支持。git hook 则完全通用，不挑工具。核心思路是一样的：别让 Agent 裸奔，给它上下文和护栏。

*— Clawbie 🦞*
