---
title: "监控指标 P50 P95 P99详解：阿里 Grafana Prometheus 实战指南"
date: 2026-01-18T16:40:00+08:00
draft: false
description: "P50、P95、P99 到底是啥？Prometheus 怎么配置？Grafana 面板咋画？一篇讲清楚"
slug: "monitoring-metrics-p50-p95-grafana-prometheus"
tags: ["监控", "Prometheus", "Grafana", "P95", "运维"]
categories: ["技术分享"]
ShowToc: true
TocOpen: true
---

## 1 先说结论

要是你被老板问"接口响应时间多少"，别只说平均值！

| 指标 | 含义 | 使用场景 |
|------|------|----------|
| P50 | 50% 的请求比这个快 | 看整体水平 |
| P95 | 95% 的请求比这个快 | 看大多数用户体验 |
| P99 | 99% 的请求比这个快 | 看极端情况 |
| 平均值 | 容易被极端值拉偏 | 别太当真 |

**一句话：对外汇报用 P95，排查问题看 P99，日常监控 P50。**

---

## 2 P50 P95 到底是啥

### 2.1 别被名字忽悠了

P50、P95、P99 听起来高大上，其实就是**百分位数**。

**举个例子：**

假设你有 100 个请求，响应时间排序后是这样的：
```
1ms, 2ms, 3ms, ..., 50ms, ..., 95ms, ..., 100ms, 500ms, 1000ms
```

- **P50** = 第 50 个请求的响应时间 = 50ms（中位数）
- **P95** = 第 95 个请求的响应时间 = 100ms
- **P99** = 第 99 个请求的响应时间 = 500ms

**通俗说：**
- P50 就是"一半的请求比这个快"
- P95 就是"95% 的请求比这个快"
- P99 就是"99% 的请求比这个快"

---

### 2.2 为啥不用平均值

**因为平均值会骗人！**

**场景：** 100 个请求里，99 个都是 10ms，1 个是 10 秒。

```
平均值 = (99 × 10ms + 1 × 10000ms) / 100 = 101ms
P50 = 10ms
P95 = 10ms
P99 = 10000ms
```

你看，平均值 101ms，好像还行？但实际上有 1 个请求卡了 10 秒！

**P99 直接暴露问题：** 有 1% 的请求很慢，要查！

**记住：监控别只看平均值，P95/P99 才能反映真实体验。**

---

## 3 阿里系监控三件套

### 3.1 Prometheus：数据采集

**Prometheus** 就是个"数据采集器"，定期从你的服务里拉指标。

**核心概念：**

| 概念 | 含义 | 例子 |
|------|------|------|
| Metric | 指标名 | `http_request_duration_seconds` |
| Label | 标签 | `method="GET"`, `status="200"` |
| Sample | 采样值 | `0.123`（123ms） |
| Target | 采集目标 | `localhost:8080` |

**配置示例（prometheus.yml）：**

```yaml
global:
  scrape_interval: 15s  # 每 15 秒采集一次

scrape_configs:
  - job_name: 'my-app'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/actuator/prometheus'
```

**注意：** 阿里云的 ARMS Prometheus 配置略有不同，后面说。

---

### 3.2 Grafana：数据可视化

**Grafana** 就是个"画图表的"，把 Prometheus 采集的数据画成面板。

**Grafana 大屏示例：**

![Grafana 监控大屏](/posts/monitoring-metrics-p50-p95-grafana-prometheus/grafana-dashboard.svg)

> 上图：典型的 Grafana 监控面板，展示 P95/P99 响应时间曲线 + Top 5 慢接口

**Grafana 的 5 大优势：**

| 优势 | 说明 | 实际体验 |
|------|------|----------|
| 📊 插件丰富 | 支持 40+ 数据源 | Prometheus、MySQL、ES、阿里云都能接 |
| 🎨 面板美观 | 内置多种图表类型 | 折线图、柱状图、热力图、仪表盘随便选 |
| 🔔 告警灵活 | 支持多通知渠道 | 钉钉、企业微信、短信、邮件都能发 |
| 📱 移动端适配 | 响应式布局 | 手机上看监控也清晰 |
| 🔌 模板变量 | 动态筛选数据 | 一个面板看所有服务，不用重复画 |

**Grafana 使用技巧：**

**技巧 1：用模板变量动态筛选**

```promql
# 定义变量：$service
# 查询时自动替换
rate(http_server_requests_seconds_bucket{job="$service"}[5m])
```

这样画一个面板，切换变量就能看不同服务，不用重复画！

**技巧 2：用 Stat 面板展示当前值**

P95 响应时间用 Stat 面板，直接显示当前值，配上颜色阈值：
- 绿色：< 200ms
- 黄色：200-500ms
- 红色：> 500ms

一眼就能看到当前状态！

**技巧 3：用 Table 面板展示 Top N**

```promql
topk(10, rate(http_server_requests_seconds_count[5m]))
```

展示请求量最大的 10 个接口，快速定位热点。

**技巧 4：用 Heatmap 看分布**

```promql
rate(http_server_requests_seconds_bucket[5m])
```

热力图能看到响应时间的分布情况，比单纯看 P95 更直观。

**技巧 5：告警规则分组**

```yaml
# 按服务分组告警
groups:
  - name: api_alerts
    rules:
      - alert: 订单服务响应慢
        expr: histogram_quantile(0.95, rate(http_server_requests_seconds_bucket{service="order"}[5m])) > 0.5
        
      - alert: 支付服务响应慢
        expr: histogram_quantile(0.95, rate(http_server_requests_seconds_bucket{service="payment"}[5m])) > 0.3
```

不同服务设置不同阈值，核心服务告警更敏感！

**核心概念：**

| 概念 | 含义 |
|------|------|
| Dashboard | 仪表盘（一堆图表） |
| Panel | 单个图表 |
| Query | 查询语句（PromQL） |
| Variable | 变量（动态筛选） |

**常用 PromQL 查询：**

```promql
# P50 响应时间
histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))

# P95 响应时间
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# P99 响应时间
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))

# 平均值
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])
```

**解释：** `histogram_quantile` 是计算百分位数的函数，`rate` 是计算每秒速率。

---

### 3.3 阿里云 ARMS Prometheus

阿里云的 Prometheus 叫 **ARMS Prometheus**，配置简单不少。

**接入步骤：**

1. 登录阿里云控制台 → ARMS → Prometheus 监控
2. 创建 Prometheus 实例
3. 添加接入配置（选择 Kubernetes/ECS/其他）
4. 复制配置到你的应用

**阿里云特有功能：**

| 功能 | 说明 |
|------|------|
| 预设大盘 | 内置常用监控面板 |
| 智能告警 | AI 识别异常 |
| 日志关联 | 直接跳转到 SLS 日志 |
| 调用链 | 集成分布式追踪 |

**配置示例（阿里云）：**

```yaml
# 阿里云 Prometheus 配置
arms:
  endpoint: "tracing-analysis-dc-xxx.aliyuncs.com"
  app_id: "your-app-id"
```

---

## 4 实战：从 0 搭建监控

### 4.1 Spring Boot 集成 Prometheus

**第一步：加依赖**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

**第二步：配 endpoint**

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
```

**第三步：访问验证**

```bash
curl http://localhost:8080/actuator/prometheus
```

能看到一堆指标就对了！

---

### 4.2 Grafana 画 P95 面板

**第一步：添加数据源**

1. Grafana → Configuration → Data sources
2. Add data source → Prometheus
3. URL 填 `http://prometheus:9090`
4. Save & test

**第二步：创建 Dashboard**

1. Create → Dashboard
2. Add new panel
3. 写 PromQL：

```promql
histogram_quantile(0.95, 
  rate(http_server_requests_seconds_bucket{job="my-app"}[5m])
)
```

**第三步：配置面板**

| 配置项 | 值 |
|--------|-----|
| Title | 接口 P95 响应时间 |
| Unit | Seconds |
| Legend | `{{method}} - {{uri}}` |
| Alert | 超过 500ms 告警 |

**第四步：保存**

搞定！现在能看到每个接口的 P95 响应时间了。

**Grafana 面板配置技巧：**

**技巧 1：多面板对比**

- 第一行：P50/P95/P99 三个面板并排
- 第二行：请求量/QPS
- 第三行：错误率

一眼看清全貌！

**技巧 2：用 Annotations 标记事件**

```promql
# 部署事件标注
# 在面板上显示部署时间点，方便排查问题
```

**技巧 3：设置刷新间隔**

- 开发环境：30s
- 生产环境：1m
- 大屏展示：5s

别设太短，会增加 Prometheus 负担！

**技巧 4：导出导入 Dashboard**

画好的面板可以导出 JSON，分享给团队：
```bash
# 导出
Dashboard Settings → JSON Model → Copy to clipboard

# 导入
Create → Import → 粘贴 JSON
```

阿里云 ARMS 内置的预设大盘也能导出复用！

---

### 4.3 配置告警

**Prometheus 告警规则：**

```yaml
# alerting_rules.yml
groups:
  - name: api_alerts
    rules:
      - alert: 接口响应慢
        expr: histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "接口 {{ $labels.uri }} 响应慢"
          description: "P95 响应时间 {{ $value }}s，超过 500ms"
```

**阿里云 ARMS 告警：**

1. ARMS 控制台 → 告警管理 → 创建告警
2. 选择指标 → `http_server_requests_seconds`
3. 设置条件 → P95 > 500ms
4. 通知方式 → 钉钉/短信/邮件

---

## 5 常见坑提前避雷

### 5.1 P95 比平均值还小？

**正常！** 说明有极端慢的请求拉高了平均值。

**排查：** 看 P99 和最大值，找出慢请求。

---

### 5.2 数据不准

**可能原因：**

1. **采集间隔太长** - 改成 15s 或更短
2. **时间窗口太大** - `rate()[5m]` 改成 `rate()[1m]`
3. **Histogram 桶配置不当** - 调整桶范围

**解决方案：**

```yaml
# Spring Boot 配置
management:
  metrics:
    distribution:
      percentiles-histogram:
        http_server_requests: true
      slo:
        http_server_requests: 50ms,100ms,200ms,500ms,1s,5s
```

---

### 5.3 Grafana 面板加载慢

**原因：** 查询时间范围太大

**解决：**

1. 默认时间范围改成 1h
2. 用 `rate()[5m]` 而不是 `rate()[1h]`
3. 开启查询缓存

---

### 5.4 阿里云 ARMS 数据延迟

**正常现象：** 阿里云数据有 1-2 分钟延迟

**解决：** 告警规则 `for` 时间设长一点（5m 以上）

---

## 6 生产环境配置建议

### 6.1 Prometheus 配置

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'my-app'
    static_configs:
      - targets: ['app1:8080', 'app2:8080']
    metrics_path: '/actuator/prometheus'
    
    # 重试配置
    scrape_timeout: 10s
    honor_labels: true
```

### 6.2 Grafana 配置

```ini
# grafana.ini
[analytics]
reporting_enabled = false

[users]
allow_sign_up = false

[auth.anonymous]
enabled = false

[alerting]
enabled = true
execute_alerts = true
```

### 6.3 告警阈值建议

| 指标 | Warning | Critical |
|------|---------|----------|
| P50 响应时间 | > 200ms | > 500ms |
| P95 响应时间 | > 500ms | > 1s |
| P99 响应时间 | > 1s | > 5s |
| 错误率 | > 1% | > 5% |

---

## 7 最后总结

**核心要点：**

1. **P50/P95/P99 比平均值靠谱** - 不会被极端值拉偏
2. **Prometheus 采集 + Grafana 展示** - 标准搭配
3. **阿里云 ARMS 更简单** - 预设大盘 + 智能告警
4. **告警阈值要合理** - 别太敏感也别太迟钝

**一句话：监控别只看平均值，P95 才是用户体验的真实反映。**

---

**本文链接：** https://hyuzz-nuc.github.io/posts/monitoring-metrics-p50-p95-grafana-prometheus/

**未经作者禁止转载！**
