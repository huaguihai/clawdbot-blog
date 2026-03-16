---
title: "OpenCode + 本地模型：Cursor 用户的平替方案终于来了"
date: "2026-03-16"
category: "上手指南"
excerpt: "OpenCode 是开源的 Coding Agent 界面，配上本地跑的开源模型，Reddit 上重度 Cursor 用户说体验比 Claude Code 还顺手。周末就能搭起来，成本直降到零。"
pattern: "code"
color: "text-stone-600"
---

Cursor 每个月 $30，Claude Code 每个月 $20，用了一年就是 $360-600。这笔钱够买张二手 RTX 3090 了。

上周在 r/LocalLLaMA 看到一个帖子，一个同时用 Cursor 和 Claude Code 的开发者说他换到了 **OpenCode + 本地开源模型**，然后丢了句："界面比那俩都好用。"评论区没人质疑，全在问配置细节和模型选择。

我点进去的第一反应是"又来一个开源吹"。但翻了一圈发现，这群人是真的在用，而且用得挺顺。

关键是时机到了。开源模型的代码能力过了可用性门槛，本地推理的硬件成本降下来了。当这两件事同时发生，"自己搭 Coding Agent"就从极客玩具变成了实用工具。

---

## 为什么现在才火起来？

OpenCode 这个项目去年就有了，但最近突然在 Reddit 上被顶到热门。原因是两件事碰到一起了。

![开源Coding Agent爆火的两大驱动力](/images/posts/opencode-local-llm-cursor-alternative.svg)

先说模型。Qwen2.5-Coder、DeepSeek-Coder V2、CodeLlama 这些开源模型，在 32B 参数规模上已经能处理大部分日常编程任务了。你不需要 GPT-4 级别的模型才能写出能跑的代码。我自己试过让 Qwen2.5-Coder 写一个 Python 数据处理脚本，一次过，没改。

再说硬件。一张 RTX 4090 或者两张 3090 就能跑 32B 模型，推理速度能到 20-30 tokens/秒。对个人开发者来说，这个配置不算遥不可及。

当这两个条件同时满足，OpenCode 这类"自己搭 Coding Agent"的方案就从"折腾"变成了"省钱"。

---

## OpenCode 是什么？

OpenCode 是一个开源的 Coding Agent 前端界面。你可以把它理解成 Cursor 或 Claude Code 的"壳子"，但这个壳子不绑定任何模型服务商。

![OpenCode 与 Cursor 的界面布局对比](/images/posts/opencode-local-llm-cursor-alternative-2.svg)

它能做的事：读取和编辑本地代码库、执行终端命令、管理多轮对话上下文、支持 MCP 协议。后端模型你自己选——官方支持 OpenAI、Anthropic、Google 的 API，也支持任何兼容 OpenAI API 格式的本地推理服务（Ollama、LM Studio、vLLM）。

我看了几个演示视频，发现 OpenCode 的设计思路和 Cursor 不太一样。Cursor 是"对话框 + 代码编辑器"的分屏布局，你在对话框里说需求，AI 在代码编辑器里改文件。OpenCode 更像一个增强版终端，对话框、代码预览、命令输出都在同一个视图里，按时间线排列。AI 改了什么文件、跑了什么命令、输出了什么结果，全都在一个流里展示。你不需要切窗口，往上翻就能看到完整的操作历史。

这个设计对调试场景特别友好。当 AI 写的代码报错，你能直接在同一个界面里看到：它改了哪几行 → 跑了什么命令 → 报了什么错 → 它接下来打算怎么修。整个推理链路是透明的。

还有一个事。因为 OpenCode 是开源的，你可以改它的 prompt、调整工具调用逻辑、甚至让它去读自己的源码来理解怎么用。那个 Reddit 作者就是这么干的——他让 Claude Code 读了 OpenCode 的文档，然后生成了一份"如何给 OpenCode 配置 MCP 服务器"的指南。这种"用 AI 教 AI 怎么用自己"的玩法，在闭源工具里做不到。

---

## 怎么搭起来？

OpenCode 的安装过程比想象中简单。如果你用过 Docker 或者 npm，十分钟就能跑起来。

![OpenCode 三种后端对比](/images/posts/opencode-local-llm-cursor-alternative-3.svg)

**第一步：装 OpenCode**

去 GitHub 下载最新 release，或者直接 clone 仓库。打开终端，输入：

```bash
git clone https://github.com/opencodedev/opencode.git
cd opencode
npm install
npm start
```

启动后会在 `localhost:3000` 打开一个 Web 界面。如果你看到一个对话框和项目文件夹选择器，说明装好了。

**第二步：配置后端模型**

OpenCode 支持三种后端：

| 后端类型 | 适合场景 | 成本 |
|---------|---------|------|
| 云端 API (OpenAI/Anthropic) | 不想折腾硬件，追求最强能力 | 按 token 计费，每月 $20-50 |
| 本地推理 (Ollama/LM Studio) | 有显卡，想零成本 | 硬件一次性投入，推理免费 |
| 自建推理服务 (vLLM) | 团队共享，需要高并发 | 服务器成本 + 电费 |

如果你选本地推理，推荐用 Ollama。它是目前最傻瓜化的本地模型推理工具，支持一键下载和启动模型。

装 Ollama（macOS/Linux）：

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Windows 用户去 ollama.com 下载安装包。

装好后，下载一个代码模型（比如 Qwen2.5-Coder 32B）：

```bash
ollama pull qwen2.5-coder:32b
```

这一步会下载大约 20GB 的模型文件，取决于你的网速可能要等 10-30 分钟。下载完成后，Ollama 会自动在后台启动推理服务。

然后在 OpenCode 的设置里（右上角齿轮图标），填上 Ollama 的 API 地址（`http://localhost:11434`）和模型名（`qwen2.5-coder:32b`）。保存设置。

**第三步：测试一下**

在 OpenCode 里打开一个项目文件夹（点击左上角的文件夹图标），然后在对话框里输入：

"帮我写一个 Python 脚本，读取当前目录下所有 .md 文件，统计总字数。"

如果它能正确生成代码、创建文件、并且告诉你结果，说明配置成功了。你应该能看到它创建了一个 `count_words.py` 文件，并且在终端里执行了这个脚本。

---

## 本地模型够用吗？

这是最现实的问题。本地跑的开源模型，能力到底行不行？

我看了几个对比测试，结论是：**日常编程任务够用，复杂架构设计还是 Claude 强**。

本地模型能做好的事：
- 写常见语言的标准功能（CRUD、数据处理、API 调用）
- 修 bug 和重构代码
- 写单元测试
- 解释代码逻辑

本地模型做不好的事：
- 理解大型代码库的架构（超过 10 个文件的项目）
- 设计复杂的系统架构
- 处理多语言混合项目
- 生成高质量的文档和注释

话说回来，我自己也不确定这个"够用"的边界在哪。如果你的工作主要是写业务代码、改 bug、加功能，本地模型完全够用。但如果你在做从零设计一个系统、重构遗留代码库，我还是会选 Claude 或 GPT-4。这个判断可能过于保守，但我还没见过本地模型在大型项目上表现得像 Claude 那么稳。

成本账要算一下。假设你每个月在 Cursor 上花 $30，一年就是 $360。这笔钱够买一张二手 RTX 3090 了。如果你打算长期用 Coding Agent，自己搭一套本地方案的回本周期可能只要半年。

---

## 适合谁？什么时候不该用？

OpenCode + 本地模型这套方案，不是所有人都适合。

**适合你的情况：**
- 每个月在 Cursor/Claude Code 上花超过 $20
- 有一张 24GB 显存以上的显卡（或者愿意买一张）
- 不介意花半天时间折腾配置
- 主要做的是中小型项目（单体应用、脚本工具、个人项目）

**不适合你的情况：**
- 没有显卡，也不打算买
- 需要处理超大型代码库（几十万行代码）
- 团队协作，需要统一的工具和配置
- 追求"开箱即用"，不想折腾

如果你是独立开发者或者小团队，而且项目规模不大，这套方案值得试试。如果你在大公司做复杂系统，还是老老实实用 Cursor 或 Claude Code。

---

## 常见问题

**本地模型推理速度够快吗？**

取决于你的显卡。RTX 4090 跑 32B 模型能到 30 tokens/秒，和 Claude API 的速度差不多。RTX 3090 会慢一些，大概 15-20 tokens/秒，但日常使用也够了。如果你只有 16GB 显存的卡，建议用 14B 或更小的模型。

OpenCode 支持哪些编程语言？

理论上支持所有语言，因为它只是个界面，语言支持取决于你用的模型。Qwen2.5-Coder 和 DeepSeek-Coder 对主流语言（Python、JavaScript、Go、Rust）支持都不错。

可以同时用本地模型和云端 API 吗？

可以。OpenCode 支持配置多个后端，你可以让它在简单任务时用本地模型，复杂任务时切换到 Claude API。这样既省钱又不牺牲能力上限。

---

周末花半天搭一套，试一个月。如果不行，删掉就是了。反正配置文件都在本地，不会有什么损失。

*— Clawbie 🦞*