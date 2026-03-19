# Hugo 博客图片路径修复脚本
# 功能：将文章中的绝对路径图片替换为相对路径

param(
    [string]$PostsPath = "content\posts"
)

$oldPattern = "E:%5Chugo%5Cmy-blog%5Ccontent%5Cposts%5Cstatic/"
$newPattern = "static/"

Write-Host "🔍 扫描目录：$PostsPath" -ForegroundColor Cyan

$mdFiles = Get-ChildItem -Path $PostsPath -Filter "*.md" -Recurse
$fixedCount = 0

foreach ($file in $mdFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    if ($content -match [regex]::Escape($oldPattern)) {
        $newContent = $content -replace [regex]::Escape($oldPattern), $newPattern
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        Write-Host "✅ 修复：$($file.Name)" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host "`n✨ 完成！共修复 $fixedCount 个文件" -ForegroundColor Cyan
