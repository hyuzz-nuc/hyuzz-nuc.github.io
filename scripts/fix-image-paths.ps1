# Hugo 博客图片路径修复脚本
# 功能：检测错误图片路径 → 自动迁移图片到 static 目录 → 更新文章引用

param(
    [string]$PostsPath = "content\posts",
    [switch]$AutoCommit
)

$wrongPatterns = @(
    "E:%5Chugo%5Cmy-blog%5Ccontent%5Cposts%5Cstatic/",
    "E:\\hugo\\my-blog\\content\\posts\\static/",
    "content/posts/static/"
)

Write-Host "🔍 扫描目录：$PostsPath" -ForegroundColor Cyan

$mdFiles = Get-ChildItem -Path $PostsPath -Filter "*.md" -Recurse
$fixedCount = 0
$migratedImages = @{}

foreach ($file in $mdFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $modified = $false
    
    foreach ($pattern in $wrongPatterns) {
        if ($content -match [regex]::Escape($pattern)) {
            # 提取所有图片文件名
            $matches = [regex]::Matches($content, [regex]::Escape($pattern) + '([^/\s"]+)')
            
            if ($matches.Count -gt 0) {
                # 生成文章 slug（文件名去掉.md）
                $slug = $file.BaseName -replace '[^\w\s-]', '' -replace '\s+', '-' -replace '-+', '-'
                $targetDir = "static\posts\$slug"
                
                # 创建目标目录
                if (-not (Test-Path $targetDir)) {
                    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                }
                
                # 复制图片
                foreach ($match in $matches) {
                    $imageName = $match.Groups[1].Value
                    $sourcePath = "content\posts\static\$imageName"
                    $targetPath = "$targetDir\$imageName"
                    
                    if (Test-Path $sourcePath) {
                        Copy-Item $sourcePath $targetPath -Force
                        Write-Host "  📦 迁移图片：$imageName" -ForegroundColor Gray
                    }
                    
                    # 更新文章中的路径
                    $oldPath = "$pattern$imageName"
                    $newPath = "/posts/$slug/$imageName"
                    $content = $content -replace [regex]::Escape($oldPath), $newPath
                }
                
                $modified = $true
                $fixedCount++
                Write-Host "✅ 修复文章：$($file.Name) → /posts/$slug/" -ForegroundColor Green
            }
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    }
}

# 清理旧的 static 目录
$oldStaticDir = "content\posts\static"
if (Test-Path $oldStaticDir) {
    Remove-Item -Recurse -Force $oldStaticDir
    Write-Host "🗑️  清理旧目录：$oldStaticDir" -ForegroundColor Yellow
}

Write-Host "`n✨ 完成！共修复 $fixedCount 个文件" -ForegroundColor Cyan

if ($AutoCommit -and $fixedCount -gt 0) {
    Write-Host "`n🔄 执行 Git 提交..." -ForegroundColor Cyan
    git add .
    git commit -m "自动修复：图片路径迁移"
    Write-Host "✅ Git 提交完成" -ForegroundColor Green
}
