---
title: "Anthropic 实战解读：构建高效 Agent 的正确姿势"
date: 2026-06-07T10:00:00+08:00
draft: false
description: "Anthropic 官方工程博客深度解读：从增强型 LLM 到五种 Workflow 模式，再到自主 Agent，一文搞懂 Agentic 系统的设计哲学"
slug: "anthropic-building-effective-agents"
tags: ["AI Agent", "Anthropic"]
categories: ["技术分享"]
---

2024 年 12 月，Anthropic 发布了一篇工程博客《Building Effective Agents》。这篇文章不是纸上谈兵，而是基于他们与数十个团队合作的实战经验，总结出的一套 Agent 设计方法论。

读完之后我最大的感受是：**Anthropic 在劝你「别用 Agent」**。

准确地说，他们在劝你：**先用最简单的方案，只有简单方案不够用时，才逐步增加复杂度**。这跟我在[上一篇文章](/posts/when-not-to-use-agent/)里说的「别什么场景都上 Agent」是一个意思，但 Anthropic 说得更系统、更有层次。

---

## 一、先搞清楚：什么是 Agentic 系统？

「Agent」这个词，每个人理解都不一样。有人觉得必须是完全自主的系统才叫 Agent，有人觉得按预设流程跑的也算。

Anthropic 给了一个清晰的分类：**所有这些都叫 Agentic 系统，但分两种**：

| 类型 | 特点 | 控制权 |
|------|------|--------|
| **Workflow** | LLM 和工具通过**预定义代码路径**编排 | 人在代码里控制流程 |
| **Agent** | LLM **自主决定**流程和工具使用 | LLM 自己控制流程 |

简单说：**Workflow 是你画好路线图让 LLM 走，Agent 是给 LLM 一个目标让它自己找路**。

---

## 二、最核心的原则：简单优先

Anthropic 开篇就亮明态度：

> Agentic systems often trade latency and cost for better task performance, and you should consider when this tradeoff makes sense.

翻译成人话：**Agent 用延迟和成本换性能，你得想清楚这个交换值不值**。

他们给了一个决策路径：

1. **先试单次 LLM 调用** + 检索和上下文示例 → 大多数场景这就够了
2. 不够？→ 用 **Workflow**（预定义流程，可控可预测）
3. 还不够？→ 才考虑 **Agent**（自主决策，灵活但不可控）

这个思路跟软件工程里的 YAGNI 原则（You Aren't Gonna Need It）一模一样——**别提前加复杂度，等真的需要时再加**。

---

## 三、基础积木：增强型 LLM（Augmented LLM）

所有 Agentic 系统的基础单元都是同一个东西：**增强型 LLM**。

就是给 LLM 加上三种能力：

- **检索（Retrieval）**：从外部知识库找信息
- **工具（Tools）**：调用 API、执行代码、操作文件
- **记忆（Memory）**：记住上下文和历史交互

Anthropic 特别强调两点：

1. **针对你的场景定制这些能力**，不要拿来就用
2. **给 LLM 提供清晰、文档化的接口**，让它知道怎么用这些能力

他们还提到了 Model Context Protocol（MCP），这是一个让开发者用简单客户端实现就能接入第三方工具生态的协议。

---

## 四、五种 Workflow 模式详解

这是文章的核心部分。Anthropic 总结了五种在生产环境中常见的 Workflow 模式，**从简单到复杂排列**。

### 4.1 提示链（Prompt Chaining）

**一句话**：把任务拆成固定步骤，上一步的输出是下一步的输入。

```
输入 → LLM A → gate → LLM B → gate → LLM C → 输出
```

**适用场景**：任务可以干净地拆成固定子任务。

**典型例子**：
- 先生成营销文案，再翻译成另一种语言
- 先写文档大纲，检查大纲是否满足要求，再根据大纲写文档

**关键点**：中间可以加 **gate（检查点）**，用程序验证中间结果是否在正轨上。这比让一个 LLM 一次搞定更可靠，因为每步的子任务更简单，LLM 出错的概率更低。

### 4.2 路由分发（Routing）

**一句话**：先分类，再分发到专门的处理流程。

```
输入 → 分类器 → 流程 A / 流程 B / 流程 C
```

**适用场景**：不同类型的输入需要不同的处理方式。

**典型例子**：
- 客服系统：一般问题、退款请求、技术支持走不同流程
- 简单问题用小模型（Claude Haiku 4.5），难题用大模型（Claude Sonnet 4.5）

**关键点**：**分类的准确度决定整个系统的效果**。如果分类错了，后面再好的流程也白搭。

### 4.3 并行化（Parallelization）

**一句话**：多个 LLM 同时干活，结果汇总。

两种变体：
- **分段（Sectioning）**：把任务拆成独立子任务并行执行
- **投票（Voting）**：同一个任务跑多次，综合多个结果

```
输入 → [LLM A | LLM B | LLM C] → 聚合 → 输出
```

**适用场景**：子任务互相独立，或者需要多视角提高置信度。

**典型例子**：
- 分段：一个模型处理用户请求，另一个并行检查内容是否合规
- 投票：多个 prompt 分别审查代码漏洞，任何一个发现问题就标记

**关键点**：**子任务之间必须真的独立**。如果有依赖关系，就不能并行。

### 4.4 编排-执行（Orchestrator-Workers）

**一句话**：一个中心 LLM 动态拆任务，分配给 worker 执行，再汇总结果。

```
输入 → Orchestrator（动态拆解）→ Worker 1 / Worker 2 / ... → 汇总 → 输出
```

**跟并行化的区别**：并行化的子任务是**预定义**的，编排-执行的子任务是**动态决定**的。Orchestrator 根据具体输入来决定需要几个 worker、每个 worker 做什么。

**适用场景**：无法预先知道需要多少子任务的复杂任务。

**典型例子**：
- 代码修改：根据任务描述决定要改几个文件、每个文件怎么改
- 多源搜索：根据搜索结果动态决定要不要继续搜

**关键点**：灵活性强，但**开销比并行化更大**（因为多了一次 Orchestrator 的调用）。

### 4.5 评估-优化（Evaluator-Optimizer）

**一句话**：一个 LLM 生成，另一个 LLM 评估给反馈，循环迭代。

```
输入 → LLM 生成 → LLM 评估 → 反馈 → 再生成 → ... → 满意 → 输出
```

**适用场景**：有明确评估标准，且迭代优化能带来可衡量的提升。

**判断标准**：
1. 当人给出反馈时，LLM 的输出能明显改善
2. LLM 自己能提供有价值的反馈

**典型例子**：
- 文学翻译：翻译 LLM 可能漏掉细微含义，评估 LLM 可以指出
- 复杂搜索：需要多轮搜索和分析，评估者决定是否继续

**关键点**：**没有明确评估标准就别用这个模式**，否则会陷入无限循环。

---

## 五、Agent：当 Workflow 不够用时

终于说到 Agent 了。但 Anthropic 的态度很明确：**Agent 是最后的选择**。

### Agent 的特点

- LLM **自主决定**使用什么工具、走什么路径
- 根据环境反馈（工具调用结果、代码执行结果）**动态调整**策略
- 可以在检查点暂停，**请求人类反馈**
- 通常有**停止条件**（最大迭代次数等）来保持控制

### Agent 的实现其实很简单

Anthropic 说了一句很关键的话：

> Agents can handle sophisticated tasks, but their implementation is often straightforward. They are typically just LLMs using tools based on environmental feedback in a loop.

**Agent 的实现通常很简单：就是 LLM 在循环里根据环境反馈使用工具**。复杂的是工具的设计和文档，不是 Agent 本身的逻辑。

### 适用场景

- **开放式问题**：无法预测需要多少步、走什么路径
- **需要灵活决策**：每一步做什么取决于上一步的结果
- **可信环境**：Agent 的自主性意味着高成本和错误累积的风险

### Anthropic 自己的 Agent 实践

1. **编码 Agent**：解决 SWE-bench 任务，根据 PR 描述修改多个文件
2. **计算机使用 Agent**：Claude 直接操作电脑完成任务

---

## 六、工具设计：被忽视的关键

Anthropic 专门用了一个附录来讲工具设计，这说明**工具设计的重要性被严重低估了**。

### 核心原则：ACI 跟 HCI 一样重要

> Think about how much effort goes into human-computer interfaces (HCI), and plan to invest just as much effort in creating good agent-computer interfaces (ACI).

**人机交互（HCI）花了多少心思，Agent-计算机交互（ACI）就该花多少心思**。

### 工具设计的具体建议

1. **站在模型的角度想**：看工具描述和参数，用法是否一目了然？如果你需要想半天，模型也一样
2. **参数命名要直观**：把工具文档当成给初级开发者写的 docstring
3. **防呆设计（Poka-yoke）**：改参数设计让模型不容易犯错
4. **大量测试**：在工作台跑很多示例输入，看模型犯什么错，然后迭代

### 一个真实的例子

Anthropic 在做 SWE-bench Agent 时发现：**模型在使用相对路径时会出错**（因为 Agent 离开了根目录后路径就变了）。

解决方案很简单：**把工具改成只接受绝对路径**。改完之后模型就再没出过错。

> We actually spent more time optimizing our tools than the overall prompt.

**他们花在优化工具上的时间，比优化 prompt 还多**。这说明了工具设计的重要性。

### 工具格式选择

Anthropic 还给了一些格式选择的建议：

- 给模型**足够的 token 去「思考」**，别让它写到一半卡住
- 格式尽量**接近互联网上自然出现的文本**（模型训练数据里见过的）
- 避免**格式开销**：比如让模型精确计算行数来写 diff，或者在 JSON 里转义代码

---

## 七、框架：用还是不用？

Anthropic 对框架的态度很务实：

**框架的好处**：简化底层任务（调用 LLM、定义和解析工具、链式调用），上手快。

**框架的坏处**：
- 多了一层抽象，**调试更难**（prompt 和响应被遮住了）
- 诱惑你**加不必要的复杂度**

**Anthropic 的建议**：

1. **先用 LLM API 直接写**：很多模式几行代码就能实现
2. **如果用框架，必须理解底层代码**：对底层假设的错误理解是客户最常犯的错
3. **上生产时考虑减少抽象层**：框架帮你起步，但不一定帮你到终点

---

## 八、两个最佳落地场景

Anthropic 在附录中分享了两个 Agent 落地最有价值的场景。

### 8.1 客服支持

客服是 Agent 的天然场景，因为：

- 对话流程自然，同时需要访问外部信息和执行操作
- 可以集成工具查询客户数据、订单历史、知识库
- 退款、更新工单等操作可以程序化处理
- **成功与否可以明确衡量**（用户定义的解决标准）

有意思的是，一些公司已经采用**按成功解决收费**的定价模式，说明他们对 Agent 的效果有信心。

### 8.2 编码 Agent

软件开发是另一个天然场景：

- 代码方案可以通过**自动化测试验证**
- Agent 可以用测试结果作为反馈**迭代优化**
- 人类审查仍然关键，确保方案符合更广泛的系统需求

---

## 总结：Anthropic 的三条核心原则

整篇文章可以浓缩成三句话：

1. **保持简单**：Agent 设计越简单越好，别搞花里胡哨的
2. **保持透明**：让 Agent 的规划步骤显式可见，方便调试和信任
3. **精心设计 ACI**：工具文档和测试要像人机交互一样认真对待

最后用 Anthropic 自己的话收尾：

> Success in the LLM space isn't about building the most sophisticated system. It's about building the right system for your needs.

**LLM 领域的成功不在于构建最复杂的系统，而在于构建最适合你需求的系统。**

这话说得真到位。与其追求最酷的 Agent 架构，不如老老实实从最简单的方案开始，**只在复杂度能带来可衡量的改进时才加复杂度**。

---

## 参考链接

1. [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
2. [Anthropic Cookbook - 示例实现](https://github.com/anthropics/anthropic-cookbook)
3. [Model Context Protocol](https://modelcontextprotocol.io/)

---

**未经作者禁止转载！**

---

**本文链接：** https://hyuzz-nuc.github.io/posts/anthropic-building-effective-agents/

**未经作者禁止转载！**