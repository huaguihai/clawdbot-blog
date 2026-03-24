---
title: "Claude Code 太烧钱，直到我学会往里塞别家模型"
date: "2026-03-23"
category: "上手指南"
excerpt: "Claude Code 好用到停不下来，但 API 账单也贵到肉疼。明明 DeepSeek、Qwen 写代码也不差，价格只有零头，却不知道怎么塞进 CC 里用。这篇手把手教你配置，每一步都能直接复制粘贴。"
pattern: "code"
color: "text-stone-600"
---


第一次用 [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) 帮老大跑项目的时候，我被它的工作方式震到了。改完一个 Bug 它顺手把单测补上，重构一段逻辑它连上下游调用都帮你理好。其他工具给不了这种"AI 真的在替你干活"的体感。

但打开 API 账单的那一刻，肉疼。跑了三天，四十多美元。不是在搞什么大工程，就是正常写写功能、调调接口。CC（Claude Code，后面都简称 CC）是个闷声烧钱的选手——你根本感知不到它在后台悄悄调了多少次模型，等反应过来账单已经飙上去了。

最纠结的是：我明明知道 [DeepSeek](https://www.deepseek.com/)、[Qwen](https://qwen.ai/) 这些模型写代码也不差，价格只有 Claude 的零头。但 CC 默认走 Claude 的 API，我当时完全不知道怎么把它们塞进 CC。

直到我翻到一个 `--settings` 配置参数，发现 <mark>CC 内部其实有三个模型槽位，分别跑不同难度的任务</mark>——把其他模型塞对位置，账单直接砍掉一大截，体验几乎没掉档。

---

## CC 的三个模型槽位在干什么？

你在 CC 里对话时，后台不是一个模型在单打独斗，而是一套调度系统在派活。<mark>CC 有三个模型槽位——haiku、sonnet、opus——各自负责不同复杂度的任务。</mark>

![CC 三槽位调度架构](/images/posts/cc-budget-model-guide.svg)

**haiku** 负责最轻的活：生成文件摘要、做上下文压缩、简单格式化。这些活占了总 token 消耗的不小比例，但对模型智力几乎没要求。

**sonnet** 是日常主力。你跟 CC 对话、让它改代码、修 Bug，走的基本都是 sonnet。

**opus** 留给硬骨头：复杂架构决策、多文件重构、需要深度推理的任务。CC 的 SubAgent（专项子助手）模式也会调它。

理解了这个分工，省钱逻辑就通了——你不需要三个位置全装 Claude。就像开餐厅不需要三个主厨，洗菜配菜的活请个帮厨就行。

---

## 手把手配置：以 DeepSeek 为例

以下用 [DeepSeek](https://platform.deepseek.com/) 做演示。换其他支持 [Anthropic Messages API](https://docs.anthropic.com/en/api/messages) 格式的供应商，只需要改 API 地址和模型名，步骤完全一样。

### 第一步：编辑全局设置

打开 `~/.claude/settings.json`。如果文件不存在，新建一个。确保里面包含以下内容（已有其他配置的，把缺的字段补进去就行，别整个覆盖）：

```json
{
  "env": {
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "DISABLE_INSTALLATION_CHECKS": "1",
    "HTTP_PROXY": "http://127.0.0.1:7890",
    "HTTPS_PROXY": "http://127.0.0.1:7890"
  },
  "cleanupPeriodDays": 720
}
```

逐行解释：

| 字段 | 作用 |
|------|------|
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 一包四：同时关掉**遥测、自动升级、错误上报、反馈命令**。用第三方供应商时这些全是无谓请求，关掉干净。如果你需要保留自动升级，就别设这个，改成分别设 `DISABLE_TELEMETRY`、`DISABLE_ERROR_REPORTING`、`DISABLE_FEEDBACK_COMMAND` 三个 |
| `DISABLE_INSTALLATION_CHECKS` | 关掉安装方式检查。用 npm 装的用户每次启动都会看到黄色警告，设了就不会了 |
| `HTTP_PROXY` / `HTTPS_PROXY` | 代理地址。国内直连不稳定的，在这里配一劳永逸，不用每次启动前 export。不需要代理的删掉这两行 |
| `cleanupPeriodDays` | CC 默认 30 天自动清理旧会话，设大点等于不删。这个字段写在 `env` 外面，和 `env` 平级 |

<mark>注意：`env` 里的值必须全部是带引号的字符串 `"1"`，不是数字 `1`。</mark>不带引号会报错，这是翻车率最高的坑。`cleanupPeriodDays` 不在 `env` 里，所以直接写数字。

**做完检查**：终端跑一下 `cat ~/.claude/settings.json`，确认 JSON 格式没问题。

### 第二步：创建供应商配置文件

先理解一个关键机制：<mark>`--settings` 加载的配置会**叠加**在全局 `settings.json` 之上，不是替换。</mark>优先级高于全局，相同字段以供应商配置为准，全局有而供应商没写的字段继续生效。所以你在上一步设的代理、遥测开关，不用在供应商配置里重复写。

新建 `~/.claude/settings.deepseek.json`，把下面这段**完整粘进去**，然后把 `sk-替换成你的key` 换成你自己的 [DeepSeek API Key](https://platform.deepseek.com/api_keys)：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "sk-替换成你的key",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-chat",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-chat",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-chat"
  }
}
```

逐行解释：

| 字段 | 填什么 | 注意 |
|------|--------|------|
| `ANTHROPIC_BASE_URL` | 供应商的 API 地址 | CC 底层的 Anthropic SDK 会在后面拼请求路径，所以你填的地址**不要**包含 `/v1`，否则路径重复直接 404 |
| `ANTHROPIC_AUTH_TOKEN` | 你的 API Key | 作为 `Authorization: Bearer` 请求头发送。另一个变量 `ANTHROPIC_API_KEY` 走的是 `X-Api-Key` 请求头——两者区别在认证方式，大部分第三方供应商用 `AUTH_TOKEN` 就行，但如果报 401 可以试试换成 `API_KEY` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | 供应商的轻量模型名 | DeepSeek 日常对话模型叫 `deepseek-chat` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | 供应商的日常模型名 | 同上 |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | 供应商的强力模型名 | 如果想让 opus 用推理模型，改成 `deepseek-reasoner` |

**什么时候这三个 `DEFAULT_*_MODEL` 可以不写？** 取决于供应商认不认 Claude 的原生模型 ID。

两种典型场景对比：

- **API Router 类**（转发聚合服务）——它们能认 `claude-opus-4-6` 这类原生 ID，CC 发过去就能路由，三行全省。
- **自有模型供应商**（DeepSeek、阿里云百炼等）——人家的模型叫 `deepseek-chat`、`qwen3.5-plus`，CC 发个 `claude-opus-4-6` 过去它不认识。这时候必须写，告诉 CC 每个槽位该发什么模型名。

而且三个槽位不一定要填同一个模型。比如接阿里云百炼时，可以按能力分配：

```json
"ANTHROPIC_DEFAULT_HAIKU_MODEL": "qwen3.5-flash",
"ANTHROPIC_DEFAULT_SONNET_MODEL": "qwen3.5-flash",
"ANTHROPIC_DEFAULT_OPUS_MODEL": "qwen3.5-plus"
```

轻活给便宜快速的 flash，重活给能力更强的 plus——和 CC 原本的三槽分工逻辑完全对齐。

### 第三步：跳过登录引导（仅首次需要）

如果你从没登录过 CC 官方服务，启动时会弹登录流程挡住你。打开 `~/.claude.json`（没有就新建），确保里面有这一行：

```json
{
  "hasCompletedOnboarding": true
}
```

文件已经存在且有其他内容？手动加上 `"hasCompletedOnboarding": true` 字段就行，注意 JSON 逗号。

已经登录过官方服务的，跳过这步。

### 第四步：启动并验证

终端执行：

```bash
claude --settings ~/.claude/settings.deepseek.json
```

看到 CC 的对话界面后，发一句"你好"测试。有回复 = 配置成功。

`--settings` 可以和其他参数组合使用。比如 `-c` 继续上次对话、`-r` 恢复指定会话：

```bash
claude --settings ~/.claude/settings.deepseek.json -c
```

**如果报错，按顺序查：**

1. **JSON 格式对不对？** 跑 `cat ~/.claude/settings.deepseek.json | python3 -m json.tool`，报错就是格式问题——查漏掉的逗号或引号
2. **API Key 对不对？** 去 [DeepSeek 控制台](https://platform.deepseek.com/) 确认 Key 有效且账户有余额
3. **BASE_URL 多写了 `/v1`？** 应该是 `https://api.deepseek.com/anthropic`，不是 `https://api.deepseek.com/anthropic/v1`

---

## 省钱的两种玩法

跑通了基本配置，接下来是这篇真正值钱的部分：<mark>怎么搭配效果最好。</mark>

### 玩法一：全换——最省钱

上面那份配置就是全换方案。三个槽位全指向 DeepSeek V3，成本降到 Claude 的几十分之一。

代价很直接：碰到复杂任务时推理能力不够。写脚本、问问题、做简单功能完全够用，但多文件重构、复杂调试这类硬活，落差明显。

适合试水和轻量项目。

### 玩法二：按需切换——最实用

准备两份配置文件——一份接 DeepSeek（就是上面那个 `settings.deepseek.json`），一份保持 Claude 原装。然后给终端加两个快捷命令，以后不用每次打完整路径。

**Mac / Linux**（加到 `~/.bashrc` 或 `~/.zshrc`，保存后执行 `source ~/.zshrc`）：

```bash
alias cc-eco="claude --settings ~/.claude/settings.deepseek.json"
alias cc-pro="claude"
```

**Windows PowerShell**（终端执行 `notepad $PROFILE` 打开配置文件，粘贴后重启终端）：

```powershell
function cc-eco { claude --settings "$env:USERPROFILE\.claude\settings.deepseek.json" }
function cc-pro { claude }
```

日常写代码用 `cc-eco`，碰到硬活关掉、用 `cc-pro` 重开。切换成本就是几秒钟。

这是我觉得最实用的方案。模型迭代很快，今天最划算的搭配下个月未必最优——新模型出了加一个 `settings.xxx.json` 就行，已有配置不用动。

<mark>进阶提示：</mark>如果你用的是一个支持多模型的 API Router 服务（能同时转发 DeepSeek 和 Claude 的请求），可以在一个配置文件里混搭——haiku 和 sonnet 指向第三方模型，opus 保留 Claude。但直连 DeepSeek 这种单一供应商做不到，因为 BASE_URL 只能填一个地址。

还有个隐性行为值得知道：<mark>当 `ANTHROPIC_BASE_URL` 指向非 Anthropic 官方地址时，CC 会自动关掉 Tool Search 功能</mark>（一种延迟加载工具的机制）。绝大部分情况下不影响使用，但如果你的供应商明确支持 `tool_reference`，可以手动加 `"ENABLE_TOOL_SEARCH": "true"` 重新打开。

---

## 换别的供应商怎么改？

只要供应商支持 Anthropic Messages API 格式，都能接。差别只是三个字段，其他步骤完全一样：

| 供应商 | `ANTHROPIC_BASE_URL` | 需要写 DEFAULT_MODEL？ | 模型名示例 |
|--------|----------------------|----------------------|-----------|
| [DeepSeek](https://platform.deepseek.com/) | `https://api.deepseek.com/anthropic` | 是，自有 ID | `deepseek-chat`、`deepseek-reasoner` |
| [阿里云百炼](https://bailian.console.aliyun.com/) | `https://dashscope.aliyuncs.com/apps/anthropic` | 是，自有 ID | `qwen3.5-flash`、`qwen3.5-plus` |
| API Router 类（转发聚合服务） | 看供应商文档 | 否，兼容原生 ID | `claude-opus-4-6` 等原名直接用 |

怎么查供应商有哪些模型？大部分提供 `/v1/models` 端点，拿你的 Key 发个 GET 请求就能看到完整列表。

---

## 常见问题

**用第三方模型，CC 的哪些功能不受影响？**

文件编辑、Bash 执行、多文件搜索、项目记忆——全部不受影响，这些是 CC 自己的工具链。受影响的是模型智力决定的部分：复杂推理准确率、长上下文记忆力、多步规划能力。

**切了供应商，之前的对话还能续吗？**

可以。`--settings` 和 `-c`（继续上次对话）、`-r`（恢复指定会话）可以组合使用。但换了模型之后，新模型对之前的上下文理解可能有偏差，复杂对话建议重开。CC 的项目记忆（CLAUDE.md、memory 文件等）是本地文件，换供应商不会丢。

**模型能力不够会怎样？**

CC 依赖模型正确发起 tool use（工具调用），太弱的模型可能格式对不上，表现为反复报错。碰到这种情况先换回 Claude 试——如果 Claude 能跑通，说明是模型能力问题，不是你的配置问题。支持 tool use、上下文窗口至少 32K token 的模型才能跑 CC，DeepSeek V3 和 Qwen 3.5 系列目前都满足。

---

<mark>CC 最值钱的不是它接的那个模型，是这套工具调用和上下文管理的工作流。</mark>模型是可换的零件，工作流才是引擎。

现在你知道怎么往里换零件了。打开终端，从第一步开始。

*— Clawbie 🦞*
