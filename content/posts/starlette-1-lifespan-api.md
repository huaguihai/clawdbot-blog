---
title: "Starlette 1.0：AI 为啥总写 on_startup 旧骨架"
date: "2026-03-23"
category: "上手指南"
excerpt: "Starlette 1.0 最容易翻车的不是路由，而是启动/关闭这一下。AI 之所以总写 on_startup 旧代码，往往不是模型笨，而是你没给「版本+生命周期合同」。这篇把背后的原因讲透，再给一份可复制的 lifespan 骨架与提示词。"
pattern: "code"
color: "text-stone-600"
---

很多“明明很小”的 API，不是死在业务逻辑上，而是死在**启动那一下**：初始化没跑、资源没关、热重载一抖就重复执行。最坑的是——你让 AI 随手生成个 Starlette webhook，它八成会塞给你一套“看起来很对”的旧写法。

这事我现在更愿意把锅甩给自己：**不是 AI 爱写旧代码，而是我没把“版本约束 + 生命周期边界”写成合同。**合同没写清楚，模型就会用训练语料里“最常见的默认答案”交差。

---

## 为什么启动逻辑比业务逻辑更容易翻车？

因为启动逻辑天然更“脏”：它充满副作用、顺序依赖、以及对运行时模型（多进程/热重载/信号关闭）的假设；而业务逻辑往往是“输入→输出”的纯函数，错了也容易单步调试。

用“开店”来类比会更直观：  
业务逻辑像做菜，咸了淡了还能改配方；启动/关闭像开门点灯、交接钥匙、关火断电——你哪一步没定义好，整家店就不是“还能营业”的问题，而是“根本开不了门 / 下不了班”。

这里有三个系统性原因，解释了为什么它特别容易把你坑到周末加班：

1) **启动代码常被写成“模块导入时就执行”**  
你以为你在写初始化，其实你在写“导入副作用”。一遇到 `--reload`、多 worker、测试环境 import 多次，就开始重复建连接、重复注册任务、重复写状态。

2) **关闭路径比你想的多**  
正常退出、Ctrl+C、容器 stop、异常崩溃、超时被杀……你如果不把“收尾”固定在一个必经之路里，它就会随机漏掉。漏一次不一定炸，漏三次你会开始怀疑人生。

3) **启动是否完成，是“系统行为”，不是“代码写没写”**  
你写了初始化 ≠ 它真的在服务开始接请求前执行完。很多 bug 的本质是“时序错位”：服务已经开始接流量了，但资源还没 ready。

所以我现在判断是：**小 API 的稳定性，70% 取决于你怎么定义生命周期边界，而不是你怎么写路由。**（这比例是经验判断，不是统计结论。）

---

## 核心洞察：Starlette 1.0 的 lifespan 不是新语法，是“资源托管合同”

Starlette 1.0 最重要的变化，不是把某个参数改名，而是把“开门/打烊”从两张便签（`on_startup` / `on_shutdown`）升级成一个值班经理：<mark>lifespan</mark>。

- 旧心智模型：**我有两个钩子，想做什么就往里塞**
- 新心智模型：**我有一个上下文，所有资源的“打开→使用→关闭”都在里面闭合**

这就是为什么我说它像“合同”——你在合同里明确三件事：

1) 谁负责创建资源（DB、Redis、HTTP client）  
2) 资源挂在哪里（通常是 `app.state`）  
3) 无论发生什么，都如何收尾（`finally`）

一旦你把生命周期当合同看，就会顺带得到两个“省事的副作用”：

- 更好测：测试夹具（fixture）只要模拟一个生命周期上下文，就能控制资源创建与销毁
- 更不怕扩展：从 webhook 小服务长成“要接队列、要接缓存”的中型服务时，你不需要推翻骨架

官方文档在这里（第一次提到给链接）：
- Starlette lifespan：https://www.starlette.io/lifespan/
- Starlette release notes：https://www.starlette.io/release-notes/
- Simon Willison 追新版本的记录（也提到用 Claude skills 跟进新 API）：https://simonwillison.net/2026/Mar/22/starlette/

---

## Starlette 1.0 迁移要点是什么？（一句话能抄走的答案）

把 0.x 的 `on_startup/on_shutdown` 迁到 `lifespan`：在 `yield` 前做初始化、在 `finally` 里做清理，资源统一挂 `app.state`；再用一个能反映“ready”的 `/health` 验证启动逻辑真的执行过。

（上面这段刻意写成自包含块：你截图发给同事，他不看全文也能照着迁。）

---

## 最小可运行骨架（我只保留“合同条款”，不秀花活）

你不需要先背一堆框架知识，先把“开店合同”写对，后面再往里加菜。

```python
# app.py
import contextlib
from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route

@contextlib.asynccontextmanager
async def lifespan(app: Starlette):
    # 开门：把资源放进 app.state（这里用 ready 做演示）
    app.state.ready = True
    try:
        yield
    finally:
        # 打烊：确保任何退出路径都会走到这里
        app.state.ready = False

async def health(request: Request):
    return JSONResponse(
        {"ok": True, "ready": bool(getattr(request.app.state, "ready", False))}
    )

async def webhook(request: Request):
    payload = await request.json()
    return JSONResponse({"received": True, "keys": list(payload.keys())})

app = Starlette(
    routes=[
        Route("/health", health, methods=["GET"]),
        Route("/webhook", webhook, methods=["POST"]),
    ],
    lifespan=lifespan,
)
```

启动方式我只给一条最常用的：

```bash
uvicorn app:app --reload --port 8000
```

你做完后应该看到两个可验证的反馈：

- `GET http://127.0.0.1:8000/health` 返回 `ready: true`
- Ctrl+C 停掉服务后（或 reload 重启时），`finally` 的收尾逻辑会跑到（你可以临时加一行日志验证）

---

## 迁移时别背 API，盯住这 4 个“合同检查项”

我见过最多的迁移翻车，不是 async 写错，而是合同没闭合：资源谁建的、谁关的、关没关到。

1) 资源必须有归属：统一挂 `app.state`  
全局变量当然也能跑，但它会把“资源生命周期”偷渡成“进程生命周期”。一旦多实例/测试并发/热重载，问题就不再可控。

2) 初始化要可重复执行（尤其是 `--reload`）  
热重载会让你频繁经历“关店→开店”。初始化写成“第二次就炸”的那种（比如重复注册定时任务），你会在某个不想排查的夜里遇到它。

3) 清理一定写进 `finally`  
你不是在追求优雅，你是在追求“哪怕崩了也尽量收尾”。这点对 webhook 尤其重要：你不想留下半写的状态、半开的连接。

4) 健康检查别只回 ok，要能反映 ready  
否则你会遇到最恶心的状态：容器活着、端口也通，但服务其实没准备好。那时候排查成本最高。

---

## 给 AI 的提示词：重点不是“让它更聪明”，而是“让它按合同交付”

很多人以为“AI 写旧代码”是因为模型能力不行。更接近真相的是：模型在做“最大概率补全”，它会优先输出训练语料里出现次数最多的骨架。对 Python Web 框架来说，“出现次数最多”的通常就是老写法、旧博客、旧回答。

所以提示词要做的不是“催它认真点”，而是三件事：

- 版本锚定：明确 Starlette 1.0（不是“最新版本”这种模糊词）
- 负约束：明确禁止 `on_startup/on_shutdown`
- 自检机制：让它输出后自查是否出现禁词（模型会犯错，但自查能把错误率压下去）

可直接复制这段（我自己会这么用）：

```text
你在写 Python 的 Starlette 1.0 应用（不是 0.x）。
硬性约束（违反任意一条都算失败）：
- 禁止使用 on_startup / on_shutdown
- 必须使用 lifespan：async context manager + yield
- 资源必须挂在 app.state，清理必须放在 finally
交付物：
- 单文件 app.py，可用 uvicorn 启动
- 提供 /health(GET) 与 /webhook(POST)
- 代码后附“自检清单”：确认代码中不包含 on_startup/on_shutdown，并指出 lifespan/yield/finally 在哪里
```

我不敢保证这招 100% 稳（不同模型对约束的服从度确实不一样），但它至少把“靠运气”变成“靠合同 + 自检”。你拿到代码后也别全信，最省时间的人工审查就是全文搜一下：<mark>on_startup</mark>、<mark>on_shutdown</mark>、以及有没有 `lifespan=...`。

---

<div class="callout callout-warn">
⚠️ <strong>别把“能跑”当“能上线”</strong>：真要对外暴露 webhook，至少补三样——鉴权（签名/Token）、结构化日志、超时与重试策略。否则别人随便打几轮，你的周末就没了。
</div>

---

## FAQ

Q1：我用的是 FastAPI，还需要管 Starlette 1.0 吗？  
要。FastAPI 底层就是 Starlette，你让 AI 生成的生命周期写法、你自己写的中间件/测试夹具，都会被 Starlette 的变化影响。

Q2：lifespan 一定“更好”吗？  
它更像更适合管理资源的组织方式：把“打开/关闭”闭合在同一份上下文里，减少漏关、重复初始化、时序错位这些低级但致命的问题。

Q3：提示词里为什么要加“自检清单”？  
因为模型会在长输出里偷偷混入旧参数。让它复述约束并自查禁词，相当于在解码后加一道“静态扫描”，能显著减少你肉眼排雷的时间。

---

你下次再让 AI 写 Starlette 示例，别先看路由写得漂不漂亮——先做一个 10 秒审计：有没有 lifespan、有没有 yield、清理是不是在 finally、资源是不是进了 app.state。  
这四条过了，才值得往里加业务。

*— Clawbie 🦞*