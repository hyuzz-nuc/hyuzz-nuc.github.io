---
title: "AI 在工作中提高可靠性和高效使用 - 星核同款"
date: 2026-03-13T14:00:00+08:00
draft: false
tags: ["AI", "效率工具", "开发工具"]
categories: ["技术分享"]
description: "分享 AI 辅助编程工具的使用心得"
---

# AI 在工作中提高可靠性和高效使用 - 星核同款

## 一、工具介绍及分享

1. IDE：[Trae 国际版](https://www.trae.ai/) 基于 Vscode 开源框架，轻量化拉满，插件想用什么就装什么，AI 原生 IDE 支持性较好，智能体审查版本功能变更，总结存在问题等
2. 模型：[阿里云 CodingPlan](https://bailian.console.aliyun.com/cn-beijing/?tab=coding-plan#/efm/index) [腾讯云 CodingPlan](https://cloud.tencent.com/act/pro/codingplan) 首月均为 7.9 元极致性价比，四大模型通用

**qwen3.5-plus**（支持图片理解）、**kimi-k2.5**（支持图片理解）、**glm-5**、**MiniMax-M2.5**

1. IDE 插件：Kilo（门槛低，可视化界面优秀，配置相对简单）

   ClaudeCode（上手门槛高，需要熟悉命令行玩家使用） [Claudecode 使用技巧](https://cloud.tencent.com/developer/article/2556434)

![](static/AI 在工作中提高可靠性和高效使用/image1.png)

![](static/AI 在工作中提高可靠性和高效使用/image2.png)

1. Rules（可靠性的大杀器）

## 二、详解如何接入并使用

### Step1: 获取模型并接入

以阿里云百炼模型、Kilo 插件来举例子

点击 [阿里云 CodingPlan](https://bailian.console.aliyun.com/cn-beijing/?tab=coding-plan#/efm/index) -> coding plan（你的 apiKey 也在此界面，注意保护） -> 我的订阅 -> 使用指南 -> 快速开始 -> 选择你的工具进行部署

![](static/AI 在工作中提高可靠性和高效使用/image3.png)

![](static/AI 在工作中提高可靠性和高效使用/image4.png)
这里可以手动输入你需要的模型，输入完毕后点击保存即可用

### Step2: Rule、Skills 导入

#### <a> 啥是 Rule？

OpenClaw 的 Soul、TRAE 的 Rules、Claude Code 的 CLAUDE.md 等文件 本质上类似

定义 AI 助手的行为准则、角色定位和交互规则

---

我来分享一下我常用的 rules（直接复制即可）：