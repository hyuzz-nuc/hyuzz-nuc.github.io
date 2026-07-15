---
title: "AI 四大范式：Chatbot、Workflow、Agent、Multi-Agent 一次搞懂"
date: 2026-05-20T10:30:00+08:00
draft: false
description: "从 Chatbot 到 Multi-Agent，AI 应用的四个发展阶段，说透它们的核心区别和适用场景"
slug: "ai-four-paradigms-chatbot-workflow-agent-multi-agent"
tags: ["AI", "架构设计", "技术选型"]
categories: ["技术分享"]
ShowToc: true
TocOpen: true
---

## 前言：AI 应用到底分几种？

现在 AI 这么火，但你有没有发现，大家嘴里的「AI 应用」其实差别巨大？

有人说的是 ChatGPT 那种聊天框，有人说的是 Dify 拖拽出来的工作流，有人吹的是 AutoGPT 那种全自动 Agent，还有人在搞什么多 Agent 协作⋯⋯

**这四个东西，根本不是一个物种。**

今天就一次性说透：Chatbot、Workflow、Agent、Multi-Agent 到底有什么区别？什么时候该用哪个？

![](/posts/ai-four-paradigms/evolution.svg)

---

## 一、Chatbot：一问一答的「对话机器人」

### 1.1 什么是 Chatbot？

Chatbot 是最基础的 AI 应用形态，核心就四个字：**一问一答**。

用户发一条消息，AI 回一条消息，完事。没有工具、没有规划、没有自主决策能力。

你日常用的 ChatGPT、Claude、Gemini，本质上都是 Chatbot。

### 1.2 Chatbot 能做什么？

- 回答知识性问题（「Java 的 HashMap 和 ConcurrentHashMap 有什么区别？」）
- 翻译、润色、改写文本
- 写代码、解释代码
- 头脑风暴、提供建议

### 1.3 Chatbot 的局限

**最大的问题：它只能「说」，不能「做」。**

你让它帮你订个机票？不行。你让它查一下数据库里的数据？也不行。它没有手没有脚，只能输出文字。

> 就像一个只会纸上谈兵的军师，分析得头头是道，但永远无法亲自上阵。

### 1.4 典型代表

| 产品 | 特点 |
|------|------|
| ChatGPT | OpenAI 出品，最流行的通用 Chatbot |
| Claude | Anthropic 出品，长上下文能力强 |
| Gemini | Google 出品，多模态支持好 |
| Kimi | 月之暗面出品，中文长文处理强 |

---

## 二、Workflow：按部就班的「工作流」

### 2.1 什么是 Workflow？

Workflow 在 Chatbot 的基础上加了一个关键能力：**工具调用**。

但和 Agent 不同的是，Workflow 的执行路径是**预先定义好的**。人设计流程，AI 按流程走，每一步做什么、什么时候调用什么工具，都是提前安排好的。

> 就像一条流水线，每个工位的工序都固定好了，AI 就是流水线上的工人，按步骤操作。

### 2.2 Workflow 能做什么？

- RAG 知识库问答：检索文档 → 组装 Prompt → 生成回答
- 内容生成流水线：搜集素材 → 生成大纲 → 写正文 → 润色
- 客服工单处理：意图识别 → 查询知识库 → 生成回复 → 人工审核
- 数据分析报告：读取数据 → 统计分析 → 生成图表 → 输出报告

### 2.3 Workflow 的优势

1. **可控性强**：每一步都是人设计的，不会跑偏
2. **可复现**：同样的输入，走同样的流程，结果稳定
3. **易调试**：哪一步出问题，定位很清楚
4. **成本低**：不需要复杂的推理，Token 消耗少

### 2.4 Workflow 的局限

**最大的问题：不能处理意外情况。**

流程是死的，现实是活的。如果用户的需求不在预设流程范围内，Workflow 就傻眼了。它没有「思考」的能力，只会按部就班地执行。

> 就像一个只会照着菜谱做菜的厨师，如果少了某个食材，他就不知道怎么办了。

### 2.5 典型代表

| 产品 | 特点 |
|------|------|
| Dify | 开源 LLM 应用开发平台，可视化编排 |
| Coze | 字节跳动出品，插件生态丰富 |
| n8n | 通用工作流自动化，支持 400+ 集成 |
| LangFlow | LangChain 的可视化版本 |

---

## 三、Agent：能自主决策的「智能体」

### 3.1 什么是 Agent？

Agent 是 Workflow 的进化版，核心区别就一个词：**自主**。

> 根据 OpenAI 应用研究主管 Lilian Weng 的定义，Agent = LLM + 记忆 + 规划 + 工具使用 [1]

Agent 不再需要人提前设计好每一步，而是**自己决定**该做什么、调用什么工具、下一步怎么走。它会：

1. **感知**：理解用户的需求和当前环境
2. **规划**：制定行动方案，分解为多个步骤
3. **行动**：选择并调用合适的工具执行
4. **反思**：观察执行结果，决定是继续、调整还是结束

![](/posts/ai-four-paradigms/agent-architecture.svg)

### 3.2 Agent 的核心能力

**ReAct 模式**（Reasoning + Acting）是 Agent 最常见的运行模式 [2]：

```
思考：用户想要查询北京的天气，我需要调用天气 API
行动：调用 weather_api(city="北京")
观察：北京今天 28°C，晴，东南风 3 级
思考：已经获取到天气信息，可以回答用户了
行动：返回天气信息给用户
```

这个「思考→行动→观察」的循环，就是 Agent 和 Workflow 的根本区别。Workflow 是人设计循环，Agent 是**自己设计循环**。

### 3.3 Agent 能做什么？

- 自主完成研究任务：搜索资料 → 分析 → 总结报告
- 自动化编程：理解需求 → 设计方案 → 写代码 → 测试 → 修复
- 复杂数据分析：理解问题 → 选择方法 → 执行分析 → 解释结果
- 自主浏览网页：搜索 → 点击 → 提取信息 → 整理

### 3.4 Agent 的局限

1. **不可控**：自主决策意味着可能跑偏，甚至做出意想不到的事
2. **成本高**：每次推理都要消耗 Token，循环次数不可预测
3. **不稳定**：同样的输入，可能走完全不同的路径，结果不一致
4. **调试难**：你很难知道它为什么会做出某个决策

> 就像一个聪明的实习生，能力很强但偶尔会自作主张。你需要给他足够的空间，也要做好 he 出错的准备。

### 3.5 典型代表

| 产品 | 特点 |
|------|------|
| AutoGPT | 最早的自主 Agent，全自动执行任务 |
| CrewAI | 多角色 Agent 框架，角色定义清晰 |
| LangChain Agent | 最流行的 Agent 开发框架 |
| OpenAI Assistants API | OpenAI 官方 Agent API |

---

## 四、Multi-Agent：团队协作的「多智能体系统」

### 4.1 什么是 Multi-Agent？

Multi-Agent 是 Agent 的进阶形态：**多个 Agent 组成团队，分工协作完成复杂任务。**

如果说 Agent 是一个全能型选手，那 Multi-Agent 就是一个专业团队。每个 Agent 扮演不同角色，有各自的专长和工具，通过协作完成单 Agent 无法搞定的复杂任务。

![](/posts/ai-four-paradigms/multi-agent-architecture.svg)

### 4.2 Multi-Agent 的核心机制

**1. 角色分工**

每个 Agent 有自己的角色定义、专业领域和可用工具。就像真实的团队一样，产品经理不需要会写代码，开发工程师不需要会做设计。

**2. 通信机制**

Agent 之间需要交换信息。常见的通信方式有：

| 通信方式 | 说明 | 适用场景 |
|----------|------|----------|
| 直接消息 | Agent 之间直接发送消息 | 简单协作 |
| 共享记忆 | 所有 Agent 读写同一块记忆区 | 信息共享 |
| 黑板系统 | 发布-订阅模式，Agent 关注感兴趣的事件 | 松耦合协作 |
| 编排器 | 中心节点统一调度 | 结构化协作 |

**3. 协作模式**

- **顺序模式**：A 做完交给 B，B 做完交给 C（流水线）
- **并行模式**：A、B、C 同时做，结果汇总（并发执行）
- **辩论模式**：A、B 各出方案，C 做评判（对抗优化）
- **层级模式**：主 Agent 分配任务，子 Agent 执行（管理-执行）

### 4.3 Multi-Agent 能做什么？

- **软件开发全流程**：产品经理 → 架构师 → 开发 → 测试，一条龙
- **研究报告**：资料搜集员 → 数据分析师 → 撰稿人 → 审校员
- **投资决策**：行业研究员 → 财务分析师 → 风险评估员 → 投资顾问
- **游戏开发**：策划 → 美术 → 程序 → 音效

### 4.4 Multi-Agent 的局限

1. **系统复杂度高**：Agent 之间的通信、协调、冲突处理都是难题
2. **成本爆炸**：N 个 Agent 同时运行，Token 消耗是单 Agent 的 N 倍以上
3. **调试地狱**：一个 Agent 出错，可能引发连锁反应
4. **一致性难保证**：多个 Agent 的输出风格、标准可能不统一
5. **过度设计风险**：很多任务其实不需要多 Agent，单 Agent 或 Workflow 就够了

> 就像组建一个团队，人多力量大，但沟通成本也大。不是所有任务都需要一个团队，有时候一个人干更高效。

### 4.5 典型代表

| 产品 | 特点 |
|------|------|
| MetaGPT | 模拟软件公司的多 Agent 框架 |
| AutoGen | 微软出品，灵活的 Multi-Agent 对话框架 |
| CrewAI | 角色+目标驱动的 Multi-Agent 系统 |
| LangGraph | LangChain 旗下，基于图的状态机 Agent |

---

## 五、四大范式核心对比

| 维度 | Chatbot | Workflow | Agent | Multi-Agent |
|------|---------|----------|-------|-------------|
| **自主性** | 无 | 无 | 有 | 有 |
| **工具使用** | 无 | 预定义 | 自主选择 | 各自选择 |
| **规划能力** | 无 | 人预设 | 自主规划 | 协作规划 |
| **可控性** | 高 | 最高 | 中 | 低 |
| **灵活性** | 低 | 低 | 高 | 最高 |
| **成本** | 低 | 中 | 高 | 最高 |
| **复杂度** | 低 | 中 | 高 | 最高 |
| **适用场景** | 问答/对话 | 标准化流程 | 开放性任务 | 复杂系统 |
| **出错风险** | 低 | 最低 | 中 | 高 |

### 一句话总结

- **Chatbot**：能说不能做，适合问问题
- **Workflow**：按流程走，适合标准化任务
- **Agent**：自己想自己干，适合开放性任务
- **Multi-Agent**：组团干活，适合复杂系统

---

## 六、怎么选？决策指南

选哪个不是越高级越好，而是**看需求**：

### 6.1 选 Chatbot 的场景

- 只需要对话式问答
- 不需要 AI 执行实际操作
- 成本敏感，追求低 Token 消耗
- 示例：知识问答、文案生成、代码辅助

### 6.2 选 Workflow 的场景

- 任务流程固定、标准化
- 需要高可控性和稳定性
- 需要对接多个外部系统/API
- 示例：RAG 知识库、客服机器人、数据处理流水线

### 6.3 选 Agent 的场景

- 任务开放，路径不确定
- 需要 AI 自主判断和决策
- 任务需要多步推理和工具调用
- 示例：研究助手、自动化编程、数据分析

### 6.4 选 Multi-Agent 的场景

- 任务非常复杂，单人无法完成
- 需要多角色、多视角协作
- 任务可以自然分解为多个子任务
- 示例：软件开发全流程、复杂研究报告、投资决策

### 6.5 重要提醒

> **不要为了用 Agent 而用 Agent，不要为了用 Multi-Agent 而用 Multi-Agent。**

很多场景下，Workflow 就够了。Agent 的不可控性和高成本不是闹着玩的。先从最简单的方案开始，不够用再升级。

---

## 参考链接

1. [Lilian Weng - LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) — OpenAI 应用研究主管，Agent 领域最权威的综述文章
2. [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — Agent 核心推理模式的原始论文
3. [LangChain Documentation](https://python.langchain.com/docs/) — 最流行的 Agent 开发框架
4. [MetaGPT: The Multi-Agent Framework](https://github.com/geekan/MetaGPT) — 多 Agent 软件开发框架
5. [AutoGen: Enabling Next-Gen LLM Applications](https://microsoft.github.io/autogen/) — 微软多 Agent 对话框架
6. [Dify - LLM Application Development Platform](https://dify.ai/) — 工作流+Agent 一体化平台
7. [Andrew Ng - AI Agent Design Patterns](https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/) — 吴恩达 Agent 设计模式课程

---

**未经作者禁止转载！**

---

**本文链接：** https://hyuzz-nuc.github.io/posts/ai-four-paradigms-chatbot-workflow-agent-multi-agent/

**未经作者禁止转载！**
