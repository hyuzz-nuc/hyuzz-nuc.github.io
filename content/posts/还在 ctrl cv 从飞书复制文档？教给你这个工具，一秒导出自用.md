---
title: "还在 ctrl cv 从飞书复制文档？教给你这个工具，一秒导出自用"
date: 2026-03-07T14:00:00+08:00
draft: false
description: "好用的工具分享！"
slug: "feishu-export-tool-guide"
tags: ["飞书", "效率工具"]
categories: ["工具推荐"]
---

## 导引

### 为什么选择飞书？

在日常工作中，对于程序员来说，md 格式的文档阅读起来是极其好用的。还在大学时期，经导员推荐 Typora 就一直在使用，md 独有的格式在学习中无疑是个好帮手，无论是前期规划还是后期复盘，逻辑清晰和一目了然的文档谁能不爱。直到进入到了工作中，繁琐的犹如命令行一样的格式，让每一次构思都会被这些格式打断，十分不方便，于是飞书一个/解决所有问题的便捷性很快收到了我的青睐。

![](/posts/hai-zai-ctrl-cv-cong-fei-shu-fu-zhi-wen-dang-jiao-gei-ni-zhe-ge-gong-ju-yi-miao-dao-chu-zi-yong/IY4ibU4gzoVceLxo5L5cobLInbw.png)

### 痛点

然而，飞书唯一的痛就是不能直接导出 md，从而不能导出 pdf，word 等等，很是令人头疼，经常要 ctrl cv！十分麻烦！对经常使用飞书的团队无疑是极好的，但是对于个人来说就不那么友好了。

![](/posts/hai-zai-ctrl-cv-cong-fei-shu-fu-zhi-wen-dang-jiao-gei-ni-zhe-ge-gong-ju-yi-miao-dao-chu-zi-yong/D94xbW1Qho1qUlxIEMYchBennMh.png)

## feishu2md 介绍

于是我上网找此类工具，还真发现了一个开源好工具，配置起来也不难

这是一个下载飞书文档为 Markdown 文件的工具，使用 Go 语言实现。

[GitHub 链接，feishu2md](https://github.com/Wsine/feishu2md)

[一日一技 | 我开发的这款小工具，轻松助你将飞书文档转为 Markdown](https://sspai.com/post/73386)

## 快速上手

### 1️⃣ 配置 API 凭证（首次使用）

去飞书<u>开发者后台</u> 创建企业自建应用

- 这里的应用名称和应用描述可以随便填写：

![](/posts/hai-zai-ctrl-cv-cong-fei-shu-fu-zhi-wen-dang-jiao-gei-ni-zhe-ge-gong-ju-yi-miao-dao-chu-zi-yong/JGEabyDsKowZ54xIxfWcr5J9nif.png)

- 创建完成后点击左侧权限管理-> 开通权限，之后勾选以下几个权限：
- （重要）打开权限管理，开通以下必要的权限（可点击以下链接参考 API 调试台-> 权限配置字段）可以直接搜索后面的权限 id

  - <u>获取文档基本信息</u>，「查看新版文档」权限 `docx:document:readonly`
  - <u>获取文档所有块</u>，「查看新版文档」权限 `docx:document:readonly`
  - <u>下载素材</u>，「下载云文档中的图片和附件」权限 `docs:document.media:download`
  - <u>获取文件夹中的文件清单</u>，「查看、评论、编辑和管理云空间中所有文件」权限 `drive:file:readonly`
  - <u>获取知识空间节点信息</u>，「查看知识库」权限 `wiki:wiki:readonly`

![](/posts/hai-zai-ctrl-cv-cong-fei-shu-fu-zhi-wen-dang-jiao-gei-ni-zhe-ge-gong-ju-yi-miao-dao-chu-zi-yong/Vvf8bXqtjoN8wXxXbTWcR4rAnxc.png)

- 点击确认开通权限后，用获取到的 **App ID** 和 **App Secret** 执行以下命令：

```
feishu2md config --appId <你的 APP_ID> --appSecret <你的 APP_SECRET>
```

### 2️⃣ 下载单个文档

```bash
feishu2md dl "https://xxx.feishu.cn/docx/DOCNxxxxxxxxx"
```

### 3️⃣ 批量下载文件夹

```bash
feishu2md dl --batch -o output_folder "https://xxx.feishu.cn/drive/folder/FOLxxxxxxxxx"
```

### 4️⃣ 批量下载知识库

```bash
feishu2md dl --wiki -o output_folder "https://xxx.feishu.cn/wiki/settings/123456789"
```

## 使用技巧

这里建议使用 `-o` 参数指定输出目录，不然会很难找！

举例：前面是我的 feishu2md 的具体路径，也可以切换到实际路径下直接使用 feishu2md 执行，效果相同

```bash
# 下载到 E:\feishu2md\downloadFiles
D:\tools\feishu2md\feishu2md.exe dl -o "E:\feishu2md\downloadFiles" "https://xxx.feishu.cn/docx/xxx"
```

---

**未经作者禁止转载！**

---

**本文链接：** https://hyuzz-nuc.github.io/posts/feishu-export-tool-guide/

**未经作者禁止转载！**