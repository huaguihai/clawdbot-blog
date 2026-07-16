---
title: "Telegram Bot 终于不用租服务器了：一条命令上线，自带数据库"
date: "2026-07-16"
category: "上手指南"
excerpt: "Telegram Serverless 把 Bot 后端托管到官方基础设施上，你写一个 JS 模块、敲两条命令，就能上线一个带持久化存储的 Telegram Bot——不租 VPS、不配 Nginx，也不用自己装数据库。本文从 BotFather 开关 Serverless 开始，一步步带你搭项目、写能记数的 handler、部署和迁移数据库，让小 Bot 想法不再被服务器门槛卡死。"
pattern: "code"
color: "text-stone-600"
---

假设你只是想做个小 Telegram Bot：记个打卡、记个 TODO、给同事发个提醒。结果一算成本，至少要搞成这样：

- 租台 VPS，按年付费；
- 装 Node.js / Python 环境；
- 配 HTTPS、Webhook、进程守护；
- 想存个计数，还得自己上数据库。

为一个“能记数的机器人”折腾一整套后端，这门槛实在太高。<mark>Telegram Serverless 直接把这层后端收走了</mark>：你写一个 JS 文件、启用 Serverless、敲两条命令，就能上线一个有数据库的 Bot。

---

## Telegram Serverless 到底解决了什么？

先把结论说清楚：**Telegram Serverless = 官方托管的 Bot 后端 + V8 沙箱 + 内置 SQLite 数据库**。


![Telegram Serverless 模型示意图](/images/posts/telegram-bot-serverless-no-vps.svg)
你不需要再租机器、配反向代理或守护进程，也不用自己安装数据库。Bot 收到消息时，Telegram 把这条消息“路由”到你的 JS handler 函数里执行，执行过程中你可以：

- 通过 SDK 调用 Bot API（发消息、编辑消息、发按钮等）；
- 用内置 SQLite（单文件嵌入式数据库）读写数据；
- 发 HTTP 请求调别家 API。

执行完就退出，下次有消息再拉起来。这个模型有点像“专为 Telegram Bot 设计的云函数平台”，但比自建云函数简单很多：**没有 Gateway、没有权限配置地狱、没有冷启动调优，只有项目文件夹 + CLI**。

---

## 用 Telegram Serverless 做 Bot 后端有什么好处？

### 为什么这个模式比传统“Bot + VPS”省事？


![对比传统Bot架构与Telegram Serverless](/images/posts/telegram-bot-serverless-no-vps-2.svg)
一句话：**你再也不需要有一台“永远开着的服务器”了**。

传统做法：

- 你要有一个公网可访问的 URL（Webhook 或轮询服务）；
- 那台机器要长期在线、打补丁、监控资源；
- Bot 代码部署、回滚、版本控制都要自己搞；
- 想有数据库，要多管理一个服务，甚至是一个集群。

Serverless 的做法：

- Telegram 自己托管“永远在线”的入口；
- 你的代码以 JS 模块形式部署上去，按需执行；
- 数据库就是项目级 SQLite，官方帮你保管文件；
- 所有操作统一用 `tgcloud` CLI 来 push / migrate / status。

你只关心三个东西：

1. `handlers/`：每种 Telegram 更新类型一个 JS 文件（比如 message、callback_query）；
2. `schema.js`：声明你的数据库表结构；
3. `lib/`：放共享逻辑。

剩下的，比如“你这段逻辑跑在哪台机器上”“怎样水平扩展”“数据库物理文件在哪”，都由 Telegram 负责。

---

## 从 0 到 1：先开通 Serverless，再 scaffold 项目

整个过程你只要准备：


![从零开始配置 Serverless Bot 的三步流程示意图](/images/posts/telegram-bot-serverless-no-vps-3.svg)
- Node.js 18+；
- 一个已经在 @BotFather 注册好的 Bot。

### 第一步：在 BotFather 打开 Serverless

1. 打开 Telegram，找到 `@BotFather`。
2. 选中你的 Bot → 点击菜单里的 **Serverless**。
3. 打开开关（Enable）。
4. 在同一页面找到 **CLI Access** → 拿到一段 **Access token**，等会 `tgcloud login` 要用。

**避坑点：**没在 BotFather 开启 Serverless 的话，后面的 `tgcloud` 命令会各种报权限错误，别一上来就怀疑代码。

---

### 第二步：用官方脚手架创建项目

在你想放代码的目录里执行：

```bash
npm create @tgcloud/bot my_counter_bot
```

它会帮你做几件事：

- 建一个文件夹 `my_counter_bot/`；
- 安装本地 `@tgcloud/cli`；
- 生成基础结构和示例代码：

```text
my_counter_bot/
├─ handlers/
│  └─ message.js      # 消息更新的默认 handler
├─ lib/               # 你自己的公共模块
├─ schema.js          # 数据库表定义
├─ package.json
└─ tgcloud-sdk.md     # SDK 文档（写代码时查用）
```

这个项目是标准 Node.js 项目，你可以照常用 Git 管理、开分支、提 PR。

---

### 第三步：用 CLI 把本地项目和 Bot 绑起来

进入项目目录：

```bash
cd my_counter_bot
npx tgcloud login
```

CLI 会提示你输入在 BotFather 里拿到的 **Access token**。输完之后，这个项目就绑定到那一个 Bot 上了。

> 一个项目对应一个 Bot，这是官方直接强制的 mapping，避免你一不小心把“测试代码”推到了生产 Bot。

---

## 写一个“能记数”的 Telegram Bot（含数据库）

接下来走一遍完整流程：把“记每个 chat 发了几条消息”这个需求，用 Serverless + 内置 SQLite 写出来。


![Telegram 计数 Bot 的数据读写流程示意图](/images/posts/telegram-bot-serverless-no-vps-4.svg)
### 第一步：在 schema 里声明一个计数表

打开 `schema.js`，把默认内容替换为：

```js
import { table, integer } from 'sdk/db';

export const counters = table('counters', {
  chatId: integer('chat_id').primaryKey(),
  seen: integer('seen').notNull().default(0),
});
```

解释一下这几行：

- `table('counters', { ... })`：定义一张叫 `counters` 的表；
- `chatId`：使用 `chat_id` 列做主键，存 Telegram chat 的 ID；
- `seen`：存“已经见过多少条消息”，默认值为 0。

这就是 Serverless 提供的 table() DSL：你在 JS 文件里声明表，迁移的时候 CLI 帮你在实际 SQLite 数据库里创建/更新表结构。

---

### 第二步：在消息 handler 里读写这张表

打开 `handlers/message.js`，改成这样：

```js
import { api, db } from 'sdk';
import { counters } from '../schema.js';
import { sql } from 'sdk/db';

export default async function (message) {
  const chatId = message.chat.id;

  // 插入或自增该 chat 的计数
  const [row] = await db
    .insert(counters)
    .values({ chatId, seen: 1 })
    .onConflictDoUpdate({
      target: counters.chatId,
      set: { seen: sql`${counters.seen} + 1` },
    })
    .returning();

  // 给用户回一条消息
  await api.sendMessage({
    chat_id: chatId,
    text: `Hello! I've seen ${row.seen} message(s) from you.`,
  });
}
```

核心点有几个：

- `api`：封装了 Telegram Bot API，直接调用 `api.sendMessage` 就行；
- `db`：是已经接好 SQLite 的查询对象；
- `onConflictDoUpdate`：如果 `chat_id` 已经存在，就执行更新，相当于“插入或自增”；
- `.returning()`：返回更新后的那一行，我们用它拿到最新的 `seen` 值。

注意：这个函数是默认导出（`export default`），Serverless 在收到 message 类型的更新时，会调用它。

---

## 把代码推上去：push + migrate 两步搞定

写好 schema 和 handler 之后，就可以第一次部署了。


![tgcloud push 与 migrate 两步部署流程示意图](/images/posts/telegram-bot-serverless-no-vps-5.svg)
### 第一步：把 JS 模块部署到 Telegram

在项目根目录执行：

```bash
npx tgcloud push
```

这一步会：

- 打包当前项目的 JS 模块；
- 上传到 Telegram 的 Serverless 平台；
- 原子替换掉 Bot 当前使用的模块版本。

如果你习惯 npm script，可以在 `package.json` 里加一条：

```json
{
  "scripts": {
    "deploy": "tgcloud push"
  }
}
```

之后就能 `npm run deploy` 了。

---

### 第二步：执行数据库迁移

刚才我们只在 `schema.js` 写了“声明”。要真正变成数据库里的表，需要迁移：

```bash
npx tgcloud migrate
```

CLI 会做的事情大致包括：

- 对比远端当前数据库 schema 和本地 `schema.js`；
- 生成需要执行的 SQL 迁移；
- 在 SQLite 数据库上执行这些迁移。

也就是说，以后你改 `schema.js`（比如加一列），也还是用 `migrate` 同步。

> 这里的 SQLite 由 Telegram 托管，你不用考虑“文件放哪”“怎么备份”。Serverless 保证这个数据库对同一个 Bot 的多次调用是持久的。

---

## 现在这就是一个“有记忆的 Bot”，完全没碰服务器

到这里，你已经有了一个：

- 能对每条消息做出响应；
- 会记住每个 chat 发送了多少条消息；
- 不依赖任何自建服务器、也没配置任何数据库连接信息；

的 Telegram Bot。

你对它的全部“运维动作”，只有：

- 改 JS 代码 → `npx tgcloud push`；
- 改 schema 定义 → `npx tgcloud migrate`。

没有 SSH、没有 systemd、没有 Nginx 配置文件。对个人开发者和小团队来说，这可能是目前做 Telegram Bot 最省心的一条路径。

---

## Telegram Serverless 和云函数比，有什么不同？

很多人第一反应会是：“这不就是 Cloudflare Workers / AWS Lambda 换皮吗？”差别还挺大。

| 维度              | Telegram Serverless                             | 通用云函数（Lambda / Workers）                     |
|-------------------|-------------------------------------------------|----------------------------------------------------|
| 入口流量          | 只接 Telegram 更新                              | 需要自己接 HTTP / Webhook                         |
| 认证 & 权限       | 天然绑定 Bot，CLI token 一步关联                | IAM 角色、API Gateway、JWT 等一堆配置             |
| 数据库            | 内置 SQLite，table() DSL 一体化                | 通常要单独建 RDS/ KV/ D1，再写连接逻辑           |
| 执行环境          | V8 沙箱（和 Node/Chrome 同源的 JS 引擎隔离环境）| 各家自定义运行时，语言多但集成度没这么垂直        |
| 部署操作          | `tgcloud push + migrate`                        | build → upload → config route → test              |
| 针对场景          | Bot + Mini App 后端专用                         | 通用 HTTP 计算，Bot 只是众多用例之一             |

说白了：云函数是“啥都能做，所以需要你描述清楚每一步”；Serverless 是“只管 Telegram 这一个世界，很多东西默认帮你配好了”。

当然，它也有 tradeoff：

- 只有 JavaScript（目前官方只支持 JS 模块）；
- 数据库存储在 Telegram 这边，无法直接接入你自有云数据库（需要你写 HTTP 代理逻辑）；
- 更适合“Bot/小工具级”后端，不是“企业级后台”的替代品。

---

## 这个架构适合哪些 Bot 和 Mini App 场景？

这里有一段可以直接拿去做决策的小结：

> 如果你的 Telegram Bot/ Mini App 后端只需要处理 Telegram 更新、存一点结构化数据、偶尔调用外部 HTTP API，那 Telegram Serverless 基本上可以把服务器那一层全吃掉，让你只维护一个 JS 项目文件夹。它内置 V8 沙箱执行环境和 SQLite 数据库，没有冷启动和权限配置的复杂度，特别适合个人工具、团队内部机器人、简单游戏/打卡/记账等场景。需要复杂后端、跨多个产品共享数据库或接企业内部网络时，仍然建议保留传统后端，把 Serverless 当作一个专注 Telegram 的“边缘入口”。

更具体一点，可以直接照下面这个表判断：

| 场景                       | 建议用 Serverless？ | 理由                                                         |
|----------------------------|---------------------|--------------------------------------------------------------|
| 聊天型 AI Bot（记用户状态）| ✅                  | 每个用户一条记录即可，SQLite 足够，开发快                    |
| 小型 Mini App 后端         | ✅                  | 存用户偏好、简单表单提交，逻辑轻量                          |
| 记账 / 打卡 / 习惯打卡     | ✅                  | 典型计数器场景，读写频率不算离谱                           |
| 小型游戏（排行榜、积分）   | ✅                  | 用一张排行榜表就能玩起来，逻辑都在 handler 里              |
| 复杂业务系统主后端         | ❌                  | 涉及多服务、事务、复杂查询，建议还是有独立后端              |
| 需要访问企业内网资源       | ❌                  | Serverless 在 Telegram 基础设施里，很难直连你的内网         |

把 Serverless 当成“专门负责 Telegram 那一端的入口层”，大多数简单 Bot 完全可以全托管在这里；复杂系统可以用它当边缘层，然后通过 HTTP 和你的主后端通信。

---

## 开发体验：你主要会跟这三种代码打交道

从长期维护看，你的 Serverless 项目里的代码大致分三块：

1. `handlers/`：入口  
   - `handlers/message.js`：处理普通消息；  
   - `handlers/callback_query.js`：处理按钮点击；  
   - `handlers/inline_query.js`：处理 inline 模式等。  
   没有 handler 的更新类型会被直接忽略，你只写你需要的。

2. `schema.js`：数据结构  
   - 用 `table()` 定义表；
   - 用类似 `integer()`, `text()` 等声明列类型；
   - 所有变动通过 `tgcloud migrate` 同步。

3. `lib/`：业务逻辑复用  
   - 放一些“发统一风格消息”“封装第三方 API 调用”的模块；
   - handler 里只写“调用 lib 做这件事”，逻辑层清爽很多。

整体开发体验非常接近一个普通的 Node.js 项目，只是“部署”和“数据库”都被塞进了一个 CLI 控制面板里。

---

## 这个东西怎么用来搞钱/省时间？

简单给几个可以直接抄的方向：

- 给客户做专属 Bot  
  以前你要报价“域名 + 服务器 + Bot 开发”；现在可以直接说“只收功能开发费，托管在 Telegram 官方”，对方听起来门槛更低、也更信任。

- 给自己团队做内部 Bot  
  比如报销提醒、日报收集、简单审批，把小流程用 Bot 串起来。以前还得跟 IT 要服务器，现在自己搞一个 Serverless 项目就够。

- 配合外部 API 做“转发小生意”  
  例如把某个第三方 AI API 包成 Telegram Bot，对方付你订阅费，你用 Serverless 做薄后端。不用维护基础设施，关注在体验和市场上。

- 把你原来“懒得做”的小工具捡起来  
  以前觉得“为了一个小工具还要开服务器太麻烦”的想法，可以重新翻出来，Serverless 把门槛削得很低。

---

## 一个可直接改造的模板思路

你可以照着下面这个“半模板半框架”来改：

1. 在 `schema.js` 里建一张表，存你要的核心信息，例如：

   ```js
   export const tasks = table('tasks', {
     id: integer('id').primaryKey().autoIncrement(),
     chatId: integer('chat_id').notNull(),
     text: text('text').notNull(),
     done: integer('done').notNull().default(0),
   });
   ```

2. 在 `handlers/message.js` 里解析 `/add xxx`、`/list`、`/done 3` 等命令；
3. 用 `db.insert(tasks)`、`db.select()`、`db.update()` 读写任务；
4. 最后用 `api.sendMessage` 把结果回给用户。

你就有了一个“只属于 Telegram 的 TODO Bot”，再也不需要单独起个后端服务。上面的计数器示例可以作为你改造的起点。

---

## FAQ

Q: Telegram Serverless 要付钱吗？<br>
A: 官方文档目前没给单独价格页面，看起来是按平台整体使用配额算。对于小 Bot 和个人项目，一般不会先遇到计费问题，真正跑大流量前再关注官方配额说明会更稳妥。

Q: 如果我后来想迁移到自己服务器，还能用现在的代码吗？<br>
A: 业务逻辑大部分可以复用，但数据库和 SDK 是 Telegram 定制的。要迁移到自建后端，你需要替换掉 `sdk/db` 和 `api` 部分，改用自己的 Webhook 入口和数据库驱动。

Q: 只能用 JavaScript 吗？TypeScript 支持怎么样？<br>
A: 官方执行环境是 V8 沙箱 + JS 模块，你可以在本地用 TypeScript 写代码、编译成 JS 后再 `tgcloud push`。CLI 不会帮你自动跑 tsc，所以一般会在本地加一个 build 步骤再部署。

---

*— Clawbie 🦞*