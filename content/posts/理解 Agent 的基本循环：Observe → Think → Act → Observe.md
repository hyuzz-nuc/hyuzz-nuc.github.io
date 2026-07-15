---
title: "理解 Agent 的基本循环：Observe → Think → Act → Observe"
date: 2026-05-27T10:00:00+08:00
draft: false
description: "拆解 Agent 最核心的运行机制，从 OODA 循环到 ReAct 模式，说透 Agent 为什么能自主决策"
slug: "agent-observe-think-act-loop"
tags: ["AI", "Agent", "架构设计"]
categories: ["技术分享"]
ShowToc: true
TocOpen: true
---

## 前言：Agent 为什么能「自己干」？

上一篇咱们聊了 AI 的四大范式，其中 Agent 最核心的特征就是**自主决策**。但「自主决策」这四个字说起来容易，到底是怎么实现的？

答案就在一个循环里：**Observe → Think → Act → Observe**。

这不是我发明的，这个模式有深远的渊源——从军事领域的 OODA 循环，到 AI 领域的 ReAct 模式，本质上都在说同一件事：**智能的本质就是「观察-思考-行动」的持续循环。**

今天就拆开这个循环，说透它到底怎么运转。

![](/posts/agent-ota-loop/ota-loop.svg)

---

## 一、源头：OODA 循环

### 1.1 什么是 OODA？

OODA 循环是美国空军上校约翰·博伊德（John Boyd）在 1950 年代提出的空战决策理论 [1]，四个字母分别代表：

| 步骤 | 英文 | 中文 | 核心动作 |
|------|------|------|----------|
| **O** | Observe | 观察 | 获取信息，感知环境 |
| **O** | Orient | 判断 | 分析信息，形成认知 |
| **D** | Decide | 决策 | 选择行动方案 |
| **A** | Act | 行动 | 执行决策 |

博伊德的核心观点是：**谁能更快地完成 OODA 循环，谁就能在对抗中占据优势。** 不是谁更强谁赢，而是谁转得更快谁赢。

### 1.2 OODA 和 Agent 的关系

OODA 循环虽然是军事理论，但完美对应了 AI Agent 的运行机制：

| OODA | Agent 对应 | 具体表现 |
|------|------------|----------|
| Observe | 感知 | 读取用户输入、工具返回结果、环境状态 |
| Orient | 推理 | LLM 分析信息、理解上下文 |
| Decide | 规划 | 选择下一步行动、决定调用什么工具 |
| Act | 执行 | 调用工具 API、生成输出 |

在 AI Agent 的实践中，Orient 和 Decide 通常合并为 **Think**（思考），因为 LLM 的推理过程本身就包含了判断和决策。所以 Agent 的循环简化为三步：**Observe → Think → Act**。

---

## 二、拆解三步循环

### 2.1 Observe：观察——Agent 的眼睛

Observe 是循环的起点，Agent 通过观察获取信息。信息来源有三个：

**1. 用户输入**

用户的原始请求，是 Agent 第一次观察的主要信息源。

```
用户：帮我查一下北京今天适不适合跑步
```

**2. 工具返回结果**

Agent 调用工具后，工具会返回结果，这是 Agent 在后续循环中需要观察的新信息。

```
天气 API 返回：北京 28°C，空气质量指数 85，东南风 3 级
```

**3. 环境状态**

Agent 运行过程中的上下文信息，包括已执行的步骤、历史记录、内存中的数据等。

```
历史记录：已调用天气 API 1 次，已调用空气质量 API 1 次
```

> 关键点：每次循环的 Observe 都不同。第一次观察的是用户输入，后续观察的是上一轮 Act 的结果。这就是「循环」的意义——**每一轮都基于新信息做决策**。

### 2.2 Think：思考——Agent 的大脑

Think 是循环的核心，也是 Agent 和 Workflow 的根本区别。Workflow 不需要思考（人已经帮它想好了），Agent 必须自己想。

Think 阶段做了三件事：

**1. 分析信息**

把 Observe 获取的信息和已有知识结合，理解当前状态。

```
当前信息：28°C，AQI 85，东南风 3 级
已有知识：AQI 0-50 优，51-100 良，101-150 轻度污染
分析：AQI 85 属于「良」，温度适中，但有轻微污染
```

**2. 制定计划**

决定下一步做什么。是继续调用工具获取更多信息？还是已经可以回答用户了？

```
计划：AQI 85 对跑步有影响，但需要确认具体建议
→ 调用健康建议 API，查询 AQI 85 时的运动建议
```

**3. 选择工具**

从可用工具列表中选择最合适的工具，并确定调用参数。

```
选择工具：health_advice_api
参数：{ aqi: 85, temperature: 28, activity: "running" }
```

> 关键点：Think 的质量取决于 LLM 的推理能力。GPT-4 级别的模型思考得更深，小模型可能想不清楚就乱调用工具。

### 2.3 Act：行动——Agent 的手脚

Act 是循环的执行阶段，把 Think 的决策变成实际行动。

Agent 常见的行动类型：

| 行动类型 | 说明 | 示例 |
|----------|------|------|
| **工具调用** | 调用外部 API 或函数 | 搜索、查询数据库、执行代码 |
| **信息检索** | 从知识库或文档中检索 | RAG 查询、向量搜索 |
| **内容生成** | 生成文本、代码等 | 写文章、生成代码 |
| **状态更新** | 修改内存或环境状态 | 保存中间结果、更新变量 |
| **最终回答** | 把结果返回给用户 | 任务完成，输出答案 |

> 关键点：Act 之后必须回到 Observe。因为行动会产生新信息（工具返回结果），Agent 需要观察这些新信息，才能决定下一步。

---

## 三、ReAct：思考与行动的交替

### 3.1 ReAct 模式详解

ReAct（Reasoning + Acting）是 Yao 等人在 2022 年提出的 Agent 推理框架 [2]，是 OTA 循环最经典的实现方式。

核心思想：**思考（Reasoning）和行动（Acting）交替进行，互相增强。**

![](/posts/agent-ota-loop/react-pattern.svg)

一个完整的 ReAct 流程如下：

```
Thought 1: 用户想知道北京适不适合跑步，我需要先查天气和空气质量
Action 1:  调用 weather_api(city="北京")
Obs 1:     北京 28°C，晴，东南风 3 级

Thought 2: 天气不错，但还需要查空气质量
Action 2:  调用 aqi_api(city="北京")
Obs 2:     AQI 85，良

Thought 3: AQI 85 属于良，对敏感人群有轻微影响，需要查一下运动建议
Action 3:  调用 health_api(aqi=85, temp=28, activity="跑步")
Obs 3:     建议减少户外长时间高强度运动

Thought 4: 已获取所有信息，可以综合回答了
Action 4:  返回最终答案
```

### 3.2 为什么不能只思考不行动？

**纯推理（Chain-of-Thought）** 的问题：LLM 只能基于已有知识推理，无法获取新信息。

```
❌ 纯推理模式：
Think: 北京今天可能很热，不适合跑步...（猜的，没有实际数据）
Answer: 北京今天太热了，不建议跑步（错误！实际 28°C 很适合）
```

### 3.3 为什么不能只行动不思考？

**纯行动（Act-only）** 的问题：没有推理指导，工具调用盲目，容易走错方向。

```
❌ 纯行动模式：
Action: 调用 weather_api(city="北京")      → 28°C 晴
Action: 调用 weather_api(city="上海")      → 30°C 多云（不需要！）
Action: 调用 weather_api(city="广州")      → 33°C 雨（更不需要！）
Action: 调用 stock_api(symbol="AAPL")     → 完全跑偏了...
```

### 3.4 ReAct 的优势

| 对比维度 | 纯推理（CoT） | 纯行动（Act-only） | ReAct |
|----------|---------------|-------------------|-------|
| 获取新信息 | ❌ 不能 | ✅ 能 | ✅ 能 |
| 推理规划 | ✅ 能 | ❌ 不能 | ✅ 能 |
| 方向可控 | ⚠️ 可能偏 | ❌ 容易偏 | ✅ 较可控 |
| 效率 | 高（不调工具） | 低（盲目调工具） | 中（按需调工具） |

---

## 四、循环什么时候停止？

Agent 不能一直转下去，必须有停止条件。常见的停止策略：

### 4.1 自然停止：任务完成

Agent 判断已经收集到足够信息，可以给出最终答案了。

```
Thought: 已获取天气（28°C 晴）和 AQI（85 良），信息足够
Action:  返回最终答案 → "北京今天温度适中..."
```

### 4.2 强制停止：达到最大步数

设置 `max_iterations`，超过就强制停止，防止无限循环。

```python
agent = Agent(max_iterations=10)  # 最多循环 10 次
```

### 4.3 超时停止：超过时间限制

设置总执行时间上限，超时则中断。

```python
agent = Agent(timeout_seconds=60)  # 最多执行 60 秒
```

### 4.4 异常停止：工具调用失败

工具调用出错且无法恢复时，Agent 决定停止。

```
Thought: 天气 API 返回 500 错误，重试 3 次仍然失败
Action:  返回部分答案 + 说明 API 暂时不可用
```

---

## 五、实际代码演示

用 LangChain 实现一个最简单的 OTA 循环 Agent：

```python
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import tool
from langchain_openai import ChatOpenAI

# 定义工具
@tool
def get_weather(city: str) -> str:
    """查询指定城市的天气"""
    # 实际场景中调用天气 API
    return f"{city}：28°C，晴，东南风 3 级"

@tool
def get_aqi(city: str) -> str:
    """查询指定城市的空气质量指数"""
    return f"{city}：AQI 85，良"

# 创建 Agent
llm = ChatOpenAI(model="gpt-4")
tools = [get_weather, get_aqi]
agent = create_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, max_iterations=5)

# 运行：自动执行 OTA 循环
result = agent_executor.invoke({
    "input": "北京今天适不适合跑步？"
})
print(result["output"])
```

运行时，Agent 内部自动执行 OTA 循环：

1. **Observe**: 收到「北京今天适不适合跑步？」
2. **Think**: 需要查天气和空气质量
3. **Act**: 调用 `get_weather("北京")`
4. **Observe**: 收到「28°C，晴，东南风 3 级」
5. **Think**: 还需要查 AQI
6. **Act**: 调用 `get_aqi("北京")`
7. **Observe**: 收到「AQI 85，良」
8. **Think**: 信息足够，可以回答了
9. **Act**: 返回最终答案

---

## 六、常见问题与最佳实践

### 6.1 Agent 陷入死循环怎么办？

**症状**：Agent 反复调用同一个工具，或在不同工具间来回跳转。

**解决**：
- 设置 `max_iterations` 限制循环次数
- 在 Prompt 中明确「不要重复相同的操作」
- 加入去重逻辑：如果连续两次 Action 相同，直接停止

### 6.2 Agent 选择了错误的工具怎么办？

**症状**：Agent 调用了不该调用的工具，或传了错误的参数。

**解决**：
- 工具描述要写清楚，包括适用场景和参数格式
- 在 Think 阶段加入自我检查：「这个工具适合当前情况吗？」
- 限制可用工具数量，不要给 Agent 太多选择

### 6.3 OTA 循环太慢怎么办？

**症状**：一个简单问题要循环 5-6 次，Token 消耗巨大。

**解决**：
- 优化 Prompt，让 Agent 尽量一次 Think 就规划好多步
- 使用「规划-执行」分离模式：先规划所有步骤，再批量执行
- 考虑是否真的需要 Agent，也许 Workflow 就够了

---

## 参考链接

1. [John Boyd - OODA Loop](https://en.wikipedia.org/wiki/OODA_loop) — 博伊德的 OODA 循环理论，Agent 循环的军事理论源头
2. [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — Yao et al., 2022，ReAct 模式原始论文
3. [Chain-of-Thought Prompting Elicits Reasoning](https://arxiv.org/abs/2201.11903) — Wei et al., 2022，CoT 推理模式原始论文
4. [Lilian Weng - LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) — Agent 架构最全面的综述
5. [LangChain ReAct Agent Documentation](https://python.langchain.com/docs/modules/agents/agent_types/react) — LangChain ReAct Agent 实现
6. [Andrew Ng - AI Agentic Design Patterns](https://www.deeplearning.ai/short-courses/) — 吴恩达 Agent 设计模式课程

---

**未经作者禁止转载！**

---

**本文链接：** https://hyuzz-nuc.github.io/posts/agent-observe-think-act-loop/

**未经作者禁止转载！**
