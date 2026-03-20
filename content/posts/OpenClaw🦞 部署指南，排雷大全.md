---
title: "OpenClaw🦞 部署指南，排雷大全"
date: 2026-03-08T14:00:00+08:00
draft: false
description: "快让我看看是谁还不会配置小龙虾！"
---
## 一、前言

截止目前 OpenClaw 在 github 已经超 200k 的 stars✨，无疑是市面上最火最出圈的 AI 工具，极大的降低了程序员的门槛，可如今最大的门槛依然变成了如何安装小龙虾，甚至已经有人靠上门安装月入过万美元。这里给大家分享我在安装 OpenClaw 过程中所遇到的问题，相信大部分小伙伴卡在了此篇文章的某一步，让我们开始吧！

## 二、环境搭建

1. Node.js 版本必须是 22.0.0 及以上！这里是第一个坑，低于这个版本安装会报错，建议大家安装 22.0.0 以上的 LTS 版本，比较稳定，下载完成默认下一步即可。

下载地址：[Nodejs 官网](https://nodejs.cn/en/download)

![](/posts/openclaw-bu-shu-zhi-nan-pai-lei-da-quan/PjYobgV7JodTI5xSPvycI6Y1ntb.png)

这里如果安装完成后依然不行，可能是老程序员安装了

**nvm**（Node Version Manager）用于管理 Node.js 版本的命令行工具，部分朋友卸载后可以成功启动，可以试试

1. Git  [git 官网](https://git-scm.com/?hl=zh-cn) git 大概率不会出什么问题

以上就是前置要求，准备就绪，配置好环境变量后使用 node -v 和 git --version 检查一下版本

## 三、OpenClaw 安装全步骤

一定要用管理员模式运行 powershell！否则会报错

### 3.1 步骤

1. 右键点击 powershell，选择[以管理员身份运行]
2. 切换国内镜像源，防止超时报错

```
npm config set registry HTTPS://registry.npmmirror.com
```

1. 执行安装命令，openclaw -v 验证，出现版本号即安装完成

```
npm install -g openclaw@latest
```

![](/posts/openclaw-bu-shu-zhi-nan-pai-lei-da-quan/OXslbXmYroancMxOX6OcEdBrnah.png)

#### 3.1.1 如何选择

确定版本没有问题后

```
openclaw onboard #
```

确认免责声明:选择 yes

安装模式:选择 Quickstart

模型提供商:选择 Skip

启用的模型:All

默认模型:选择 Keep current

这里全部选择 skip for now，待会再配

![](/posts/openclaw-bu-shu-zhi-nan-pai-lei-da-quan/GeBTbbx98oJh4OxM49FcYilnnOf.png)

### 3.2 报错

#### 3.2.1 operation not permitted 报错 3221225477 解决方案

1. 降级 Node.js
   Node.js v24 目前与 node-llama-cpp 不兼容。 换回 LTS 版本。

卸载 Node.js：控制面板 -> 程序和功能 -> 卸载 Node.js

重要：检查并删除残留文件夹：

```
C:\Program Files\nodejs
C:\Users\wzc\AppData\Roaming\npm
C:\Users\wzc\AppData\Roaming\npm-cache
```

安装 Node.js v22 LTS (最稳定)

1. 彻底清除环境变量

打开环境变量，删除用户变量和系统变量有关 nodejs 一切的配置

1. 删除 nvm  nodejs 包管理器，不知道这个为什么会影响，但是有它就不行，卸载了就好了，注意如果有项目正在使用 nodejs 现版本运行，谨慎删除 ⚠️

#### 3.2.2 disconnected (1008): unauthorized: gateway token missing

```
开启
openclaw gateway --port 18789 --verbose
关闭
openclaw gateway stop
```

报错原因：是因为你的浏览器 UI 缺少网关认证令牌，导致无法连接到已经运行的 OpenClaw Gateway 服务

解决方案：

**方法一：在 UI 中手动配置令牌（推荐）**

1. **获取令牌**
   在终端执行以下命令，获取网关令牌：

```bash
openclaw config get gateway.auth.token
```

1. 或者直接查看配置文件：

```bash
grep -A1 '"token"' ~/.openclaw/openclaw.json
```

1. **在 UI 中粘贴令牌**
   - 打开左侧菜单，进入 `Control` -> `Overview` 页面。
   - 找到 **Gateway Access Panel**（网关访问面板）区域。
   - 将上一步获取的令牌粘贴到对应的输入框中，保存设置。
   - 刷新页面，连接应该会恢复正常。

**方法二：使用带令牌的 URL 直接访问（快速解决）**

在终端执行以下命令，它会自动生成并打开一个包含认证令牌的 URL：

```bash
openclaw dashboard
```

这个 URL 会自动完成认证，无需手动输入令牌。

启动之后从 cmd 入口进去 UI 即可，发送消息有回复则证明配置完成，显示健康状态正常

![](/posts/openclaw-bu-shu-zhi-nan-pai-lei-da-quan/YQIObt2DqomFyWxWLPlcV6kkn7e.png)

### 3.3 配置 API Key

点击[阿里云 CodingPlan](https://bailian.console.aliyun.com/cn-beijing/?tab=coding-plan#/efm/index) -> coding plan（你的 apiKey 也在此界面，注意保护） -> 我的订阅 -> 使用指南 -> 快速开始 -> 选择 openclaw 进行部署

![](/posts/openclaw-bu-shu-zhi-nan-pai-lei-da-quan/HDAHb2fJloFzA9xjaHUczGjhnhc.png)

## 四、结尾

到这所有的配置已经完成，快和你的小龙虾激情 vibe coding 吧 🦞，欢迎在评论区进行讨论

---

**未经作者禁止转载！**

---

**本文链接：** https://hyuzz-nuc.github.io/posts/openclaw-bu-shu-zhi-nan-pai-lei-da-quan/

**未经作者禁止转载！**