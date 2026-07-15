---
title: "手写一个最小 Agent：50 行代码搞懂工具调用循环"
date: 2026-06-15T10:00:00+08:00
draft: false
description: "从零手写一个最小 Agent，包含工具定义、tool call 解析、工具执行、最大步数和错误处理，50 行 Python 代码搞懂 Agent 的核心循环"
slug: "build-minimal-agent-from-scratch"
tags: ["AI Agent", "Python"]
categories: ["教程指南"]
---

看过 Anthropic 的《Building Effective Agents》之后，我们知道 Agent 的本质就是 **LLM 在循环里根据环境反馈使用工具**。

但说归说，不看代码总觉得心里没底。今天我们就从零手写一个最小 Agent，**50 行 Python 代码**搞懂 Agent 的核心循环。

---

## 一、Agent 到底在循环什么？

在上篇文章里我们画了 OTA 循环：Observe → Think → Act。翻译成代码就是：

1. **Observe**：拿到用户输入 + 历史对话
2. **Think**：调用 LLM，让它决定下一步做什么
3. **Act**：如果 LLM 要调用工具，执行工具并把结果喂回去
4. **重复**，直到 LLM 给出最终答案，或者达到最大步数

![](/posts/build-minimal-agent-from-scratch/agent-loop.svg)

就这么简单。所有 Agent 框架（LangChain、CrewAI、AutoGen⋯⋯）的核心都是这个循环，只是外面套了各种抽象层。

---

## 二、准备工作

### 2.1 环境

- Python 3.10+
- 只需要一个依赖：`openai`

```bash
pip install openai
```

### 2.2 API Key

你需要一个 OpenAI API Key（或者兼容 OpenAI 接口的其他服务，比如 DeepSeek、Moonshot 等）。

```bash
export OPENAI_API_KEY="sk-xxx"
# 如果用国内服务，还需要设置 base url
export OPENAI_BASE_URL="https://api.deepseek.com/v1"
```

---

## 三、定义工具

Agent 的能力来自工具。我们定义三个简单工具：

- **search**：模拟搜索（实际项目中替换成真搜索 API）
- **calculator**：计算数学表达式
- **read_file**：读取本地文件

```python
import json
import math

# ---- 工具实现 ----
def search(query: str) -> str:
    """模拟搜索，实际项目替换成真 API"""
    results = {
        "Python": "Python 是一种广泛使用的高级编程语言，由 Guido van Rossum 于 1991 年创建",
        "Agent": "AI Agent 是能自主感知环境、做出决策并执行动作的智能体",
        "天气": "今天北京晴，25°C；上海多云，28°C",
    }
    for key, val in results.items():
        if key in query:
            return val
    return f"未找到关于「{query}」的结果"

def calculator(expression: str) -> str:
    """安全计算数学表达式"""
    try:
        allowed = set("0123456789+-*/.() ")
        if not all(c in allowed for c in expression):
            return "错误：只支持数字和 +-*/ 运算符"
        return str(eval(expression))
    except Exception as e:
        return f"计算错误：{e}"

def read_file(filepath: str) -> str:
    """读取本地文件内容"""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()[:2000]  # 最多读 2000 字符
    except FileNotFoundError:
        return f"文件不存在：{filepath}"
    except Exception as e:
        return f"读取错误：{e}"

# ---- 工具注册表 ----
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search",
            "description": "搜索信息，获取知识。当需要查找你不确定的事实、数据或信息时使用。",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "搜索关键词"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculator",
            "description": "计算数学表达式。当需要精确计算时使用，如加减乘除。",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "数学表达式，如 2+3*4"}
                },
                "required": ["expression"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "读取本地文件内容。当需要查看文件内容时使用。",
            "parameters": {
                "type": "object",
                "properties": {
                    "filepath": {"type": "string", "description": "文件路径"}
                },
                "required": ["filepath"]
            }
        }
    }
]

TOOL_MAP = {
    "search": search,
    "calculator": calculator,
    "read_file": read_file,
}
```

工具定义分两部分：**工具实现**（Python 函数）和**工具声明**（JSON Schema，告诉 LLM 这个工具干什么、需要什么参数）。

这就是 Anthropic 说的 ACI（Agent-Computer Interface）——**工具描述写得好不好，直接决定 Agent 能不能正确使用工具**。

---

## 四、Agent 核心：50 行循环

核心代码就一个函数，包含完整循环、tool call 解析、最大步数和错误处理：

```python
from openai import OpenAI

client = OpenAI()  # 自动读取 OPENAI_API_KEY 和 OPENAI_BASE_URL

def agent(user_input: str, max_steps: int = 10) -> str:
    """最小 Agent：工具调用循环"""
    messages = [{"role": "user", "content": user_input}]

    for step in range(max_steps):
        print(f"--- Step {step + 1} ---")

        try:
            # Think：调用 LLM
            response = client.chat.completions.create(
                model="gpt-4o-mini",  # 可替换成其他模型
                messages=messages,
                tools=TOOLS,
                tool_choice="auto",
            )
        except Exception as e:
            return f"LLM 调用失败：{e}"

        choice = response.choices[0]
        message = choice.message

        # 把助手回复加入历史
        messages.append(message)

        # 如果没有工具调用，说明 LLM 给出了最终答案
        if not message.tool_calls:
            return message.content

        # Act：执行所有工具调用
        for tool_call in message.tool_calls:
            func_name = tool_call.function.name
            func_args = json.loads(tool_call.function.arguments)

            print(f"  调用工具：{func_name}({func_args})")

            try:
                result = TOOL_MAP[func_name](**func_args)
            except Exception as e:
                result = f"工具执行错误：{e}"

            print(f"  工具结果：{result[:100]}")

            # 把工具结果喂回 LLM
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": str(result),
            })

    return "⚠️ 达到最大步数限制，Agent 终止"
```

### 代码解读

| 步骤 | 代码 | 说明 |
|------|------|------|
| **Think** | `client.chat.completions.create(...)` | 把对话历史 + 工具定义发给 LLM |
| **判断** | `if not message.tool_calls` | LLM 没调工具 → 给出最终答案，循环结束 |
| **Act** | `TOOL_MAP[func_name](**func_args)` | 解析 tool call，执行对应工具 |
| **Observe** | `messages.append({"role": "tool", ...})` | 把工具结果喂回 LLM，进入下一轮 |
| **安全** | `max_steps` + `try/except` | 防止无限循环和崩溃 |

整个循环的流程就是：

```
用户输入 → LLM 思考 → 要调工具？→ 执行工具 → 结果喂回 → LLM 再思考 → ... → 最终答案
```

---

## 五、跑一下

```python
# 简单计算
print(agent("123 * 456 等于多少？"))

# 搜索 + 计算
print(agent("Python 是什么时候创建的？距今多少年了？"))

# 读取文件
print(agent("帮我看看 hugo.toml 的前几行内容"))
```

### 运行效果

```
--- Step 1 ---
  调用工具：calculator({"expression": "123 * 456"})
  工具结果：56088
--- Step 2 ---
123 * 456 等于 56088。

--- Step 1 ---
  调用工具：search({"query": "Python"})
  工具结果：Python 是一种广泛使用的高级编程语言，由 Guido van Rossum 于 1991 年创建
--- Step 2 ---
  调用工具：calculator({"expression": "2026 - 1991"})
  工具结果：35
--- Step 3 ---
Python 由 Guido van Rossum 于 1991 年创建，距今已经 35 年了。
```

看到了吗？第二个问题里，Agent **自动先搜索再计算**——它自己决定了需要两步：先查 Python 创建时间，再算差值。这就是 Agent 的「自主决策」。

---

## 六、三大平台的 Function Calling 对比

我们用的是 OpenAI 的 API 格式，其他平台也类似：

| 平台 | API 参数名 | Tool Call 格式 | 结果回传方式 |
|------|-----------|---------------|-------------|
| **OpenAI** | `tools` + `tool_choice` | `message.tool_calls` | `{"role": "tool", "tool_call_id": "..."}` |
| **Claude** | `tools` + `tool_choice` | `content block type: "tool_use"` | `{"role": "user", "content": [{"type": "tool_result", ...}]}` |
| **Gemini** | `tools` + `tool_config` | `function_call` part | `function_response` part |

核心流程都一样：**定义工具 → LLM 决定调哪个 → 执行 → 结果喂回**。区别只在 API 格式不同。

---

## 七、这个最小 Agent 缺什么？

这是能跑的最小实现，但离生产级还差得远：

| 缺失能力 | 说明 | 解决方案 |
|----------|------|---------|
| **并行工具调用** | OpenAI 支持一次调多个工具 | 遍历 `message.tool_calls` 已经处理了 |
| **流式输出** | 用户等的时候能看到过程 | 用 `stream=True` + SSE |
| **记忆** | 跨对话记住上下文 | 加 memory 模块 |
| **多轮对话** | 当前只支持单次问答 | 加 `while True` 循环接用户输入 |
| **安全沙箱** | `eval()` 和文件读取有风险 | 沙箱执行、权限控制 |
| **重试机制** | 网络超时、限流 | 指数退避重试 |

但 **理解核心循环不需要这些**。先搞懂 50 行的版本，再加功能才是正道。

---

## 总结

Agent 的核心就是三件事：

1. **定义工具**：告诉 LLM 有什么工具可用（JSON Schema）
2. **解析 tool call**：LLM 说要调哪个工具、传什么参数
3. **循环**：执行工具 → 结果喂回 → LLM 再思考 → 直到出答案

50 行代码，搞定。与其花时间学 LangChain 的抽象层，不如先把这几行代码跑通，**理解了底层逻辑，上面套什么框架都不怕**。

---

## 参考链接

1. [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
2. [Gemini API Function Calling](https://ai.google.dev/gemini-api/docs/function-calling)
3. [Claude Tool Use](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview)
4. [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)

---

**未经作者禁止转载！**

---

**本文链接：** https://hyuzz-nuc.github.io/posts/build-minimal-agent-from-scratch/

**未经作者禁止转载！**