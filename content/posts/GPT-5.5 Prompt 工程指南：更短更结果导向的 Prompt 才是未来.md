---
title: "GPT-5.5 Prompt 工程指南：更短、更结果导向的 Prompt 才是未来"
date: 2026-07-15T10:00:00+08:00
draft: false
description: "基于 OpenAI 官方 GPT-5.5 Prompt 指南，拆解新模型的 Prompt 最佳实践：结果优先、避免过程堆叠、合理设置推理强度"
slug: "gpt-5-prompt-engineering-guide"
tags: ["AI", "Prompt工程", "技术选型"]
categories: ["技术分享"]
ShowToc: true
TocOpen: true
---

## 前言：Prompt 工程的范式转变

如果你还在写那种「先做 A，再做 B，然后做 C，最后做 D」的超长 Prompt，你可能需要更新认知了。

OpenAI 官方发布了 GPT-5.5 的 Prompt 工程指南 [1]，核心观点一句话概括：

> **更短、结果优先的 Prompt 通常比过程繁重的 Prompt 堆栈效果更好。**

这意味着 Prompt 工程的范式正在从「手把手教模型每一步」转向「告诉模型目标，让它自己找路」。今天就来拆解这份指南的核心要点。

---

## 一、核心理念：定义目标，而非过程

### 1.1 GPT-5.5 的最佳使用方式

指南原文：

> GPT-5.5 works best when prompts define the outcome and leave room for the model to choose an efficient solution path.

**翻译成人话**：你只需要告诉模型「好结果长什么样」，让它自己决定怎么走到那个结果。

### 1.2 结果导向 vs 过程导向

| 风格 | 示例 | 适用场景 |
|------|------|----------|
| **过程导向**（旧） | 「先检查 A，再检查 B，然后比较所有字段，再思考所有可能的异常，然后决定调用哪个工具⋯⋯」 | 早期模型（GPT-3/4），需要手把手引导 |
| **结果导向**（新） | 「端到端解决客户问题。成功 = 做出资格判定 + 完成允许的操作 + 返回完整答案」 | GPT-5.5，模型自己会找最优路径 |

### 1.3 为什么旧 Prompt 在新模型上反而变差？

指南明确指出：

> Avoid carrying over every instruction from an older prompt stack. Legacy prompts often over-specify the process because earlier models needed more help staying on track. With GPT-5.5, that can add noise, narrow the model's search space, or lead to overly mechanical answers.

旧 Prompt 的问题是：
1. **增加噪音**：模型本来知道怎么做，你非要指挥每一步，反而干扰它
2. **缩小搜索空间**：过度限制过程，模型无法找到更优解法
3. **回答机械**：一步步照做，没有灵活性，答案像流水线产品

---

## 二、性格与协作风格：两个维度

### 2.1 Personality 控制说话方式

性格指令控制助手**怎么说话**：语气、亲和度、直接程度、正式感、幽默感、共情力。

**示例 — 稳态任务型助手**：

```markdown
# Personality
You are a capable collaborator: approachable, steady, and direct.
Assume the user is competent and acting in good faith.
Prefer making progress over stopping for clarification when the request is already clear enough.
Ask for clarification only when the missing information would materially change the answer.
Stay concise without becoming curt.
```

**示例 — 表达型协作助手**：

```markdown
# Personality
Adopt a vivid conversational presence: intelligent, curious, playful when appropriate.
Ask good questions when the problem is blurry, then become decisive once there is enough context.
Offer a real point of view rather than merely mirroring the user.
```

### 2.2 Collaboration Style 控制工作方式

协作风格控制助手**怎么工作**：何时提问、何时做假设、主动性如何、何时检查工作、如何处理不确定性。

### 2.3 关键原则

> Keep both short. Personality instructions should shape the user experience. Collaboration instructions should shape task behavior. Neither should replace clear goals, success criteria, tool rules, or stopping conditions.

**两者都要简短**。性格塑造体验，协作塑造行为，但都不能替代：
- 清晰的目标
- 成功标准
- 工具规则
- 停止条件

---

## 三、开场白（Preamble）：改善感知响应速度

### 3.1 问题：用户等太久

在流式应用中，GPT-5.5 可能花时间推理、规划、准备工具调用，然后才输出可见文本。用户看到的就是「转圈圈等半天」。

### 3.2 解决方案：让模型先说一句话

```markdown
Before any tool calls for a multi-step task, send a short user-visible update 
that acknowledges the request and states the first step. 
Keep it to one or two sentences.
```

**效果**：用户立刻看到「收到，我正在查询您的订单信息⋯⋯」，而不是盯着空白屏幕等 5 秒。

### 3.3 什么时候用？

- 任务需要多个步骤
- 需要工具调用
- 涉及长时间运行的 Agent 工作流

---

## 四、停止条件：告诉模型什么时候该停

### 4.1 为什么需要停止条件？

Agent 最常见的问题就是「不知道什么时候该停」——要么过早返回不完整的答案，要么过度搜索浪费 Token。

### 4.2 指南推荐的停止条件写法

```markdown
Resolve the user query in the fewest useful tool loops, but do not let 
loop minimization outrank correctness, accessible fallback evidence, 
calculations, or required citation tags for factual claims.

After each result, ask: Can I answer the user's core request now with 
useful evidence and citations for the factual claims? If yes, answer.

Define missing-evidence behavior: Use the minimum evidence sufficient 
to answer correctly, cite it precisely, then stop.
```

**翻译成人话**：
1. 用最少的工具循环解决用户问题——但**不能为了省步骤而牺牲正确性**
2. 每次得到结果后问自己：**我现在能回答用户的核心问题了吗？** 能就回答
3. 证据不够时：用**最少但足够**的证据，精确引用，然后停止

### 4.3 避免不必要的绝对规则

指南特别提醒：

> Avoid unnecessary absolute rules. Older prompts often use ALWAYS, NEVER, must, only to control model behavior. Use those words for true invariants, such as safety rules, required output fields, or actions that should never happen. For judgment calls, prefer decision rules instead.

**绝对规则**（ALWAYS/NEVER/must）只用于真正的不变量：
- ✅ 安全规则：「NEVER 泄露用户密码」
- ✅ 必需字段：「最终答案必须包含 completed_actions」
- ❌ 判断性决策：「ALWAYS 先搜索再回答」（应该用决策规则代替）

---

## 五、推理强度：不是越高越好

### 5.1 三个等级

GPT-5.5 支持三种推理强度：

| 等级 | 说明 | 适用场景 |
|------|------|----------|
| **low** | 快速响应，少推理 | 简单问答、格式转换、翻译 |
| **medium**（默认） | 平衡速度和质量 | 大多数日常任务 |
| **high** | 深度推理，慢但更准 | 复杂数学、多步推理、高精度需求 |

### 5.2 关键变化

> The old assumption — higher effort always means better results — no longer holds. Start with low or medium and only escalate when your evals show a measurable quality gap.

**旧观念**：推理强度越高越好 → **新现实**：从 low/medium 开始，只在评估显示有明显质量差距时才升级。

这跟前面「结果导向」的理念一脉相承：**不要过度工程化，够用就好**。

---

## 六、格式控制：让格式服务于理解

### 6.1 纯对话格式（默认）

> Let formatting serve comprehension. Use plain paragraphs as the default format for normal conversation, explanations, reports, documentation.

普通场景用自然段落就行，别动不动就搞复杂结构。

### 6.2 结构化格式（需要时）

> Use a consistent heading hierarchy and predictable structure to support automated parsing or product features like jump links.

需要自动解析或跳转链接时，才用结构化格式。

### 6.3 text.verbosity 参数

API 的 `text.verbosity` 默认是 `medium`；想要更短更简洁的回答，用 `low`。

---

## 七、迁移建议：从旧 Prompt 迁移到 GPT-5.5

### 7.1 迁移清单

| 旧 Prompt 习惯 | GPT-5.5 新做法 |
|----------------|---------------|
| 写超长的步骤指令 | 写目标结果 + 成功标准 |
| 用 ALWAYS/NEVER 控制一切 | 只对真正不变量用绝对规则，其他用决策规则 |
| 推理强度默认 high | 从 low/medium 开始，按需升级 |
| 过度指定输出格式 | 让格式服务于理解，默认用自然段落 |
| 没有停止条件 | 明确定义停止条件和缺失证据行为 |
| 没有 preamble | 多步任务加开场白，改善感知响应速度 |

### 7.2 自动迁移工具

OpenAI 提供了 Codex 迁移技能：

```bash
$ openai-docs migrate this project to gpt-5.5
```

---

## 参考链接

1. [OpenAI - GPT-5.5 Prompting Guide](https://developers.openai.com/api/docs/guides/prompt-guidance-gpt-5p6) — 本文章的主要参考来源
2. [OpenAI - Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering) — OpenAI 通用 Prompt 工程指南
3. [OpenAI - Reasoning Effort](https://platform.openai.com/docs/api-reference/responses) — API 推理强度参数文档
4. [Andrew Ng - Prompt Engineering for Developers](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/) — 吴恩达 Prompt 工程课程

---

**未经作者禁止转载！**

---

**本文链接：** https://hyuzz-nuc.github.io/posts/gpt-5-prompt-engineering-guide/

**未经作者禁止转载！**
