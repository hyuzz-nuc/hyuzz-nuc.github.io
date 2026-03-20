---
title: "使用 Hugo 搭建自己的专属博客？保姆级教程来了"
date: 2026-03-01T14:00:00+08:00
draft: false
description: "保姆级搭建博客，手把手教会你！"
slug: "hugo-blog-setup-guide"
tags: ["博客搭建", "教程指南"]
categories: ["教程指南"]
---


这里展示博主是如何搭建的，仅供参考~

> ## 技术栈

涉及到 github，各位科学上网即可

1. 静态站点生成器 [Hugo v0.157.0 (extended)下载地址](https://github.com/gohugoio/hugo/releases/tag/v0.157.0)
2. PaperMod 主题，这里的主题有很多大家可自行搜索喜爱的，这里提供本博客搭建使用的主题 [🎨 PaperMod 主题 下载地址](https://github.com/adityatelange/hugo-PaperMod)
3. 部署方式：GitHub Actions -> GitHub Pages,这种方式最为简单，免服务器配置，利用 GitHub 自带的工具即可，需要注册 GitHub，创建仓库/
4. Git [清华大学镜像 Git 下载（更快）](https://mirrors.tuna.tsinghua.edu.cn/github-release/git-for-windows/git/)

> ## 创建站点

选择对应的版本进行下载

![](/posts/shi-yong-hugo-da-jian-zi-ji-de-zhuan-shu-bo-ke-bao-mu-ji-jiao-cheng-lai-le/Hn8Jb12dDogUPrxtEJMcMa5snjf.png)

首先我们配置环境变量，复制你解压缩后的文件路径，搜索键入 env 进入系统环境的配置，在系统环境的 Path 路径下进入，这里以 E:\hugo 为例

![](/posts/shi-yong-hugo-da-jian-zi-ji-de-zhuan-shu-bo-ke-bao-mu-ji-jiao-cheng-lai-le/BBkhb65QyoPESYxCFHJcDk95nEY.png)

命令行输入 hugo version，出现如下界面则配置成功

![](/posts/shi-yong-hugo-da-jian-zi-ji-de-zhuan-shu-bo-ke-bao-mu-ji-jiao-cheng-lai-le/P8BqbMBuDo2FgaxWQmXcrAh8nNb.png)

接下来输入 hugo new site 你的站点名称 ，之后 cd 你的站点名称进入文件夹，hugo server 启动站点，默认是 localhost:1313，到这一步你的 hugo 基础配置已经搭建完毕！

> ## 配置主题

按照你喜欢的主题去 GitHub 下载资源包，将资源包解压到 themes 文件夹中，修改 hugo.toml 中 theme 的配置即可，是不是很简单？

![](/posts/shi-yong-hugo-da-jian-zi-ji-de-zhuan-shu-bo-ke-bao-mu-ji-jiao-cheng-lai-le/Dhw4bpEXPohxV8xPgf2cXJ5YnRh.png)

输入 hugo server,出现以下样式，说明配置已生效！

![](/posts/shi-yong-hugo-da-jian-zi-ji-de-zhuan-shu-bo-ke-bao-mu-ji-jiao-cheng-lai-le/MW8kbCr9hokiSpxTGj6cMeLdnNf.png)

> ## 项目结构

```
E:\hugo\my-blog/
├── content/posts/          # 博客文章放这里
├── static/images/          # 图片等静态资源
├── hugo.toml              # 站点配置
├── .github/workflows/
│   └── hugo.yml           # GitHub Actions 部署配置
└── .gitignore             # Git 忽略规则
```

> ## 创建你的文章

使用命令 hugo new content posts/你的文章名称

![](/posts/shi-yong-hugo-da-jian-zi-ji-de-zhuan-shu-bo-ke-bao-mu-ji-jiao-cheng-lai-le/NSvKbP0oxo6xgsxEA5NcdhITnFf.png)

Hugo 提供了 archetypes 功能，可以初始化一些模板，你也可以通过 Hugo 使用手册来看一下个性化定制参数，比如描述、标签、分类等等

[Hugo 快速入门中文站](https://gohugo.com.cn/getting-started/quick-start/)

![](/posts/shi-yong-hugo-da-jian-zi-ji-de-zhuan-shu-bo-ke-bao-mu-ji-jiao-cheng-lai-le/DIXxb9B6GoGPnixKBY8cELgJnA1.png)

之后编写完你的 md 文档，使用 hugo 命令即可上传你的文章！

> ## 部署到 GitHub Pages

参考官网链接：[Hugo 配置 GitHub](https://gohugo.io/host-and-deploy/host-on-github-pages/)，这里很详细，一共八个步骤，大家按照这里的 step 一个个点击去做就可以啦~

这里展示首次部署需要的命令,如下：

```
git init
git remote add origin git@github.com:your-github-username/your-github-project-name.git
git add .
git branch -M main
git commit -m "First commit"
git push origin main
```

之后上传完毕后，等待 1~2 分钟，GitHub Actions 会自动帮你部署好啦，这时候你只需访问你的博客地址，便可以欣赏你的杰作了！

---

**未经作者禁止转载！**

---

**本文链接：** https://hyuzz-nuc.github.io/posts/hugo-blog-setup-guide/

**未经作者禁止转载！**