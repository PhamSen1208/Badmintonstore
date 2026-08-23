$output = Join-Path $PSScriptRoot 'disk-system-analysis.txt'
$lines = [System.Collections.Generic.List[string]]::new()

$lines.Add('=== COMPONENT STORE ===')
$lines.AddRange([string[]](DISM.exe /Online /Cleanup-Image /AnalyzeComponentStore 2>&1))
$lines.Add('')
$lines.Add('=== SHADOW STORAGE ===')
$lines.AddRange([string[]](vssadmin.exe list shadowstorage 2>&1))
$lines.Add('')
$lines.Add('=== RESERVED STORAGE ===')
$lines.AddRange([string[]](DISM.exe /Online /Get-ReservedStorageState 2>&1))
$lines.Add('')
$lines.Add('=== RECYCLE BIN ===')
$bytes = (Get-ChildItem 'C:\$Recycle.Bin' -Force -File -Recurse -ErrorAction SilentlyContinue |
    Measure-Object Length -Sum).Sum
$lines.Add(('RecycleBinGB: {0:N3}' -f ($bytes / 1GB)))

$lines | Set-Content -LiteralPath $output -Encoding UTF8
