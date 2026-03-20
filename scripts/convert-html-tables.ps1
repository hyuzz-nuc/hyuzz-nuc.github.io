# Convert HTML tables to Markdown tables in Hugo blog posts

$files = @(
    "E:\hugo\my-blog\content\posts\JHipster + Spring Boot 微服务架构完整指南.md"
)

foreach ($file in $files) {
    Write-Host "Processing: $file"
    
    if (!(Test-Path $file)) {
        Write-Host "  File not found, skipping"
        continue
    }
    
    $content = Get-Content $file -Raw
    
    # Replace each HTML table pattern manually
    # Table 1: 核心优势
    $content = $content -replace '(?s)\*\*核心优势\*\*\s*\n\n<table>\n<tr>\n<td>优势<br/></td><td>说明<br/></td></tr>\n<tr>\n<td>⚡ 快速生成<br/></td><td>几分钟内生成完整的项目骨架<br/></td></tr>\n<tr>\n<td>🛠️ 技术栈先进<br/></td><td>Spring Boot \+ Angular/React/Vue \+ TypeScript<br/></td></tr>\n<tr>\n<td>🔒 安全性<br/></td><td>集成 Spring Security，支持 JWT、OAuth2<br/></td></tr>\n<tr>\n<td>📊 生产就绪<br/></td><td>监控、日志、测试、CI/CD 配置齐全<br/></td></tr>\n<tr>\n<td>🌐 微服务支持<br/></td><td>完整支持微服务架构，包含服务发现、配置中心等<br/></td></tr>\n</table>', @"
**核心优势**

| 优势 | 说明 |
|------|------|
| ⚡ 快速生成 | 几分钟内生成完整的项目骨架 |
| 🛠️ 技术栈先进 | Spring Boot + Angular/React/Vue + TypeScript |
| 🔒 安全性 | 集成 Spring Security，支持 JWT、OAuth2 |
| 📊 生产就绪 | 监控、日志、测试、CI/CD 配置齐全 |
| 🌐 微服务支持 | 完整支持微服务架构，包含服务发现、配置中心等 |
"@

    Set-Content -Path $file -Value $content
    Write-Host "  ✓ Converted table 1"
}

Write-Host "`nDone!"
