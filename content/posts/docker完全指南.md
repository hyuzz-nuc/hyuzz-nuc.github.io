---
title: "Docker + Docker Compose 完全指南（2026 版）"
date: 2026-03-27T14:58:00+08:00
draft: false
tags: ["Docker", "容器化", "DevOps", "部署"]
slug: "docker-setup-guide"
tags: ["docker", "效率工具","实战经验"]
categories: ["教程指南"]
---

❓ **引言**

你是不是也遇到过这些问题：本地开发环境配置半天还是报错？换了台电脑所有依赖要重新装一遍？部署到服务器又是另一套配置，调试到崩溃？**环境不一致简直是开发者的噩梦！** 🤯

今天这篇 **指南**，就是来帮你彻底解决这个问题的。不管你是技术小白还是有一定经验的开发者，看完都能轻松上手，把复杂的环境配置变成一条命令的事。

> 👩‍🔬 **引用权威**
>
> 根据 **2025 年 Stack Overflow 开发者调查** 显示，超过 **75% 的专业开发者** 使用 Docker 进行开发和部署。Docker 官方数据也表明，全球已有 **超过 1800 万开发者** 在使用 Docker 容器化技术。
>
> 为什么这么多开发者和企业选择 Docker？答案很简单：**"一次构建，到处运行"**。无论你是在 Windows、Mac 还是 Linux 上开发，无论是在本地测试还是部署到云端，Docker 都能保证环境完全一致，彻底告别"在我电脑上明明能跑"的尴尬。💡

🏆 **案例实践**

**案例一：小张的前端项目部署血泪史**

小张是个前端开发者，他的项目需要 Node.js 18、npm 9 和特定的构建工具。每次新同事入职，配置环境就要花半天时间。更惨的是，部署到服务器时，因为服务器 Node 版本是 16，各种报错让他崩溃。

后来他用 Docker 写了一个 `Dockerfile`，新同事只需要执行 `docker-compose up`，3 分钟环境就配好了。部署到服务器也是同样的命令，**再也没出现过环境不一致的问题**。

**案例二：创业公司的微服务部署**

一家创业公司有 5 个微服务，分别用 Python、Node.js、Go 开发，还需要 MySQL、Redis、RabbitMQ 等中间件。以前部署要写几十页的文档，还要专人维护。

使用 Docker Compose 后，所有服务配置都写在一个 `docker-compose.yml` 文件里，**新成员入职第一天就能独立部署整个系统**，运维成本降低了 80%。🎯

> 哈哈哈这是我编的，但实际上痛点确实是这样的 😁

📚 **技术理论解读**

> **Docker 到底是什么？**
> 简单来说，Docker 就是一个**超级集装箱**。想象一下，你的应用代码、运行环境、依赖包、配置文件全部打包进一个标准化的"集装箱"里。这个集装箱可以在任何支持 Docker 的地方运行，就像真正的海运集装箱可以在任何港口装卸一样。
![docker示例图](posts\docker-完全指南\image.png)
**核心概念就三个**：

1. **镜像（Image）**：相当于集装箱的"模板"，包含了运行应用需要的一切
2. **容器（Container）**：镜像运行起来的实例，就像模板生产出来的实际集装箱
3. **仓库（Registry）**：存放镜像的地方，Docker Hub 是最大的公共仓库

> **为什么 Docker 能解决环境问题？**
> 传统方式安装软件，依赖关系错综复杂，很容易冲突。Docker 通过**容器隔离**，每个应用运行在独立的环境中，互不干扰。就像给每个应用配了一个独立的"小房间"，房间里有什么你说了算。🏠

🛠️ **核心技术详解**

### **一、Windows 安装与配置**

**步骤 1：下载 Docker Desktop**

访问 Docker 官网（docker.com），下载 Docker Desktop for Windows。

**步骤 2：启用 WSL 2**

Docker Desktop 需要 WSL 2（Windows Subsystem for Linux）。以管理员身份打开 PowerShell，执行：

```powershell
wsl --install
wsl --set-default-version 2
#重启电脑后继续安装。
```

**步骤 3：安装 Docker Desktop**

运行下载的安装程序，按提示完成安装。安装完成后，Docker Desktop 会自动启动。

**步骤 4：验证安装**

打开 PowerShell，执行：

```powershell
docker --version
docker-compose --version
```

看到版本号就说明安装成功了！✅

> **⚠️ 避雷提醒 1**：安装前确保 BIOS 已开启虚拟化（VT-x/AMD-V），否则 Docker 无法启动。

### **二、Linux 安装与配置**

**Ubuntu/Debian 系统**：

```bash
# 1. 更新系统
sudo apt update

# 2. 安装依赖
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# 3. 添加 Docker 官方 GPG 密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 4. 添加 Docker 仓库
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list

# 5. 安装 Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# 6. 启动 Docker
sudo systemctl enable docker
sudo systemctl start docker

# 7. 验证安装
docker --version
```

**CentOS/RHEL 系统**：

```bash
# 1. 安装 yum 工具
sudo yum install -y yum-utils

# 2. 添加 Docker 仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 3. 安装 Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io

# 4. 启动 Docker
sudo systemctl enable docker
sudo systemctl start docker
```

> **⚠️ 避雷提醒 2**：国内服务器建议配置 Docker 镜像源，否则拉取镜像极慢。编辑 `/etc/docker/daemon.json`：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://mirror.ccs.tencentyun.com"
  ]
}
```

### **三、Docker 常用命令速查**

**镜像操作**：

```bash
# 搜索镜像
docker search nginx

# 拉取镜像
docker pull nginx:latest

# 查看本地镜像
docker images

# 删除镜像
docker rmi <镜像 ID>
```

**容器操作**：

```bash
# 运行容器
docker run -d -p 80:80 --name my-nginx nginx

# 查看运行中的容器
docker ps

# 查看所有容器（包括已停止）
docker ps -a

# 停止容器
docker stop <容器名>

# 启动已停止的容器
docker start <容器名>

# 删除容器
docker rm <容器名>

# 进入容器内部
docker exec -it <容器名> bash

# 查看容器日志
docker logs <容器名>
```

**清理操作**：

```bash
# 删除所有已停止的容器
docker container prune

# 删除所有未使用的镜像
docker image prune

# 一键清理所有未使用的资源
docker system prune
```

### **四、Docker Compose 详解**

**Docker Compose 是什么？**

简单说，Docker 一次只能运行一个容器，而 **Docker Compose 可以同时运行****多个容器**。比如你的项目需要 Web 服务器 + 数据库 + 缓存，用 Docker Compose 只需要一个命令就能全部启动。

**安装 Docker Compose**：

```bash
# Linux/Mac
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Windows Docker Desktop 已内置，无需单独安装

# 验证
docker-compose --version
```

**docker-compose.yml 文件结构**：

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - db
  
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: yourpassword
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:
```

**常用命令**：

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs

# 重新构建并启动
docker-compose up -d --build

# 重启某个服务
docker-compose restart web
```

### **五、实战案例：部署 WordPress**

**第一步：创建项目目录**

```bash
mkdir wordpress-docker
cd wordpress-docker
```

**第二步：创建 docker-compose.yml**

```yaml
version: '3.8'

services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress123
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wordpress-data:/var/www/html
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress123
      MYSQL_ROOT_PASSWORD: root123
    volumes:
      - db-data:/var/lib/mysql

volumes:
  wordpress-data:
  db-data:
```

**第三步：启动服务**

```bash
docker-compose up -d
```

**第四步：访问 WordPress**

浏览器打开 `http://localhost:8080`，按提示完成 WordPress 安装即可！🎉

### **六、避雷指南与最佳实践**

**常见坑点及解决方案**：

1. **权限问题**：Linux 下 Docker 命令需要 sudo，可以将用户加入 docker 组：

```bash
sudo usermod -aG docker $USER
```

2. **端口冲突**：确保要映射的端口没有被占用，可以用 `netstat -ano | findstr :端口号` 检查。
3. **数据丢失**：容器删除后数据会丢失，**重要数据一定要用卷（Volume）持久化**。
4. **镜像过大**：使用多阶段构建减小镜像体积，选择轻量级基础镜像（如 alpine）。
5. **容器无法启动**：先用 `docker logs <容器名>` 查看错误信息，90% 的问题都能从日志中找到答案。

**最佳实践建议**：

- ✅ 使用具体的镜像版本号（如 `nginx:1.25`），不要用 `latest`
- ✅ 敏感信息（密码、密钥）用环境变量或配置文件，不要硬编码
- ✅ 定期清理未使用的镜像和容器，释放磁盘空间
- ✅ 生产环境使用 Docker Swarm 或 Kubernetes 进行编排
- ✅ 编写清晰的 Dockerfile 注释，方便团队协作

📈 **技术与实践价值**

学会 Docker 能给你带来什么？

- **工作效率提升**：新环境配置从几小时缩短到几分钟，部署流程标准化，减少人为错误。
- **职业竞争力增强**：根据招聘网站数据，**70% 以上的互联网企业** 要求开发者掌握 Docker 技能。掌握 Docker 是成为 DevOps 工程师的必备条件。
- **项目可维护性提高**：环境配置文档化（Dockerfile 和 docker-compose.yml），新成员快速上手，降低团队沟通成本。
- **成本降低**：容器化可以提高服务器资源利用率，同样的硬件可以运行更多应用，直接降低云服务成本。

无论你是想提升工作效率，还是为职业发展加分，Docker 都是值得投入时间学习的技术。💪

📋 **结论**

Docker 和 Docker Compose 已经彻底改变了软件开发和部署的方式。通过这篇文章，你应该已经掌握了：

- ✅ Docker 的核心概念和工作原理
- ✅ Windows 和 Linux 平台的安装配置方法
- ✅ 常用的 Docker 和 Docker Compose 命令
- ✅ 实战部署 WordPress 的完整流程
- ✅ 常见坑点的解决方案和最佳实践

> **记住，技术学习的最佳方式就是动手实践**。现在就在你的电脑上安装 Docker，试着运行第一个容器，你会惊讶地发现原来环境配置可以如此简单！
> **关注我，获取更多技术干货和实战教程**。下次我们聊聊如何用 Docker 部署你的个人项目，让部署变得像发朋友圈一样简单！🚀

> ❓ **互动问题**
> 你在使用 Docker 时遇到过哪些坑？或者最想用 Docker 部署什么项目？欢迎在评论区留言分享，我会挑选有代表性的问题专门写文章解答！👇
![](/posts/docker-完全指南/image1.png)
---

**本文链接：** https://hyuzz-nuc.github.io/posts/docker-setup-guide/

**未经作者禁止转载！**