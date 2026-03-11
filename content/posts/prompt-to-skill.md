---
title: "继续堆 Prompt，真的不如早点学 Skill"
date: 2026-03-11T20:40:00+08:00
draft: false
tags: ["AI", "Skill", "Prompt Engineering"]
categories: ["技术分享"]
series: ["AI 工具实战"]
description: "从 Prompt 到 Skill，2026 年 AI 开发范式的转变"
---

## 写在前面

最近在 AI 圈，尤其是 Claude 社区，Skill 这个词刷屏刷得特别狠。有人说它是下一个 Prompt Engineering，有人直接喊 Prompt 已死、Skill 当立。这话听着有点夸张，但实际用下来还真有点道理。

我自己从去年底开始大量用 Skill 替换长 prompt 后，真实感受是 Token 省了 60% 到 80%，输出一致性拉满到像克隆了自己，工作流复用性直接起飞。但很多人现在还搞不清，Skill 到底和传统 Prompt、MCP 有什么本质区别，为什么突然这么火，该从哪里入手。今天就来一篇系统对比加实操推荐，帮你彻底搞懂三者的定位，顺便给出目前社区最值得 clone 的 Skill 库。读完这篇，你至少能少踩 3 个月的坑。

## 痛点先说在前：为什么大家突然不爱纯 Prompt 了

传统玩法是每次对话都狂塞 system prompt 加 few-shot 示例加风格要求加注意事项，结果呢，Token 爆炸，一个长 prompt 轻松几千 token。风格还容易漂移，同一件事今天输出正式，明天突然活泼。经验也无法沉淀，好不容易调好的 prompt，下次还得重写。复杂任务更是一问三不知，模型忘性大，上下文窗口再大也扛不住无限堆料。

后来出了 MCP，全称是 Model Context Protocol，号称给模型外接工具和数据。听起来很牛，但实际用下来配置复杂，要自己起 server、写协议、处理认证。Token 消耗更恐怖，工具描述动辄上万 token。维护成本也高，server 挂了、接口变了，全废。

于是 Skill 横空出世，成为 2026 年初最香的解法。一句话总结三者区别，Prompt 是一次性告诉它怎么做，MCP 是给它工具加数据源，Skill 是教它成为某个领域的专家，可复用、可组合、按需加载。

Skill 的核心是渐进式披露，先给模型一个简短描述，模型自己决定需不需要加载完整内容，完美解决 token 爆炸问题。

## 三者核心对比

从本质来说，传统 Prompt 是一次性文本指令，MCP 是远程工具或数据服务协议，而 Claude Skill 是可复用、可组合的专业知识包。

Token 消耗方面，传统 Prompt 高，因为全塞进 context 里。MCP 极高，工具描述加调用开销都很大。Skill 极低，因为渐进式加载，只读需要的部分。

输出一致性方面，传统 Prompt 差，模型每次会有微小漂移。MCP 中等，依赖工具稳定性。Skill 极高，像装了记忆宫殿一样稳定。

配置复杂度方面，传统 Prompt 低，纯文本复制粘贴就行。MCP 高，需要 server 加 client 加协议。Skill 极低，一个文件夹加 md 文件即可。

复用性和分享方面，传统 Prompt 差，手动复制。MCP 中等，分享 server 代码。Skill 极强，git clone 就能用，甚至可以交易和市场化。

适用场景方面，传统 Prompt 适合简单、一次性任务。MCP 适合需要外部实时数据或工具的场景，比如数据库、API。Skill 适合重复性方法论、风格、工作流、领域知识沉淀。

典型代表方面，传统 Prompt 是手写的 system prompt，MCP 是 GitHub MCP server 或数据库 connector，Skill 是 anthropics/skills 和 obra/superpowers 这些。

2026 年社区评价，传统 Prompt 是入门级，已经过时了。MCP 是企业重度需求才用。Skill 是当前最火、最香的范式转变。

核心逻辑在于 Skill 用渐进式披露机制，先给模型一个简短描述，Claude 自己判断需不需要读完整份文件。需要才加载，不需要就不读，Token 省到飞起。

## 为什么 Skill 突然成为下一个大范式

Token 时代，省就是赚。社区实测，相同复杂任务，Skill 比纯 prompt 省 60% 到 80% Token。一致性接近数字分身，同一个 Skill 调用的输出，风格、结构、深度几乎一模一样。经验真正可沉淀，写一次 Skill，以后所有项目、所有对话都能复用，甚至分享给团队或社区。

跨平台支持也很好，Claude.ai、Claude Code、Cursor、OpenCode、Windsurf 等工具都已兼容。生态爆发，GitHub 上 awesome 列表、Skills 市场雏形已现，个人知识未来很可能变现。

一句话，Prompt 是教它做一道题，Skill 是教它学会一门课。实际 Skill 就长那样，简单、清晰、可版本控制。

## 2026 年最值得直接 clone 的 Skill 库推荐

基于社区星数、维护活跃度、实际使用反馈，我挑出目前最香的几个，按实用度排序。直接 git clone 就能用，懒人福音。

第一个是 anthropics/skills，官方出品，必装起点。链接是 github.com/anthropics/skills。这是最权威、最标准的，包含文档处理、代码生成、测试、创意写作等基础技能。新手先 clone 官方打底。

第二个是 obra/superpowers，社区神作，编程党福音。链接是 github.com/obra/superpowers。有 20 多个核心技能加 slash command，比如 /brainstorm、/write-plan、/execute-plan，覆盖 TDD、debug、规划、协作模式。被誉为 Claude Code 重度用户的战斗力最强合集。

第三个是 ComposioHQ/awesome-claude-skills，最好的导航站和合集。链接是 github.com/ComposioHQ/awesome-claude-skills。分类超清晰，收录大量社区技能。想找特定领域直接搜这里。

第四个是 travisvn/awesome-claude-skills，专注 Claude Code 工作流。链接是 github.com/travisvn/awesome-claude-skills。curated list 加真实项目案例多。

安装小 Tips，以 Claude Code 为例，大多数 Skill 仓库 clone 到 ~/.claude/skills/ 或项目内 .claude/skills/ 文件夹。在 Claude Code 里直接说，安装 skills: github.com/obra/superpowers 就行。

## 结语：别再狂塞 Prompt 了，试试 Skill 吧

如果你还在用 2025 年的打法，无限堆 prompt，那 2026 年真的会落后一个时代。我的建议行动路径是先 clone anthropics/skills 加 obra/superpowers 试用 1 周。挑 2 到 3 个最常用的工作流，自己写或改成 Skill，用官方 skill-creator 辅助超简单。把 Skill 推到个人 GitHub，团队或自己多设备同步。有心得的话，欢迎留言交流，我们一起迭代出更强的数字分身。

未来，Skill 很可能出现类似 App Store 的 Skill Store，你的专业知识包或许能直接变现。

你最近在用哪个 Skill，或者你最想沉淀哪个领域的 Skill，评论区见。
