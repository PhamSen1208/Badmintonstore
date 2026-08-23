$sid = 'S-1-5-21-2742367479-2130361446-1699893376-1001'
$backupDir = $PSScriptRoot
$regPath = "HKU\$sid\Software\NVIDIA Corporation\Global\ShadowPlay"
$psPath = "Registry::HKEY_USERS\$sid\Software\NVIDIA Corporation\Global\ShadowPlay\NVSPCAPS"

reg.exe export $regPath (Join-Path $backupDir 'nvidia-shadowplay-before.reg') /y | Out-Null
$off = [byte[]](0,0,0,0)
foreach ($name in @('RecEnabled','IsShadowPlayEnabled','IsShadowPlayEnabledUser','DwmDvrEnabledV1')) {
    Set-ItemProperty -Path $psPath -Name $name -Value $off -Type Binary
}

Get-Process -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -in @('NVIDIA Share','NVIDIA Web Helper')
} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 3
$values = Get-ItemProperty -Path $psPath
@(
    "RecEnabled=$([BitConverter]::ToInt32($values.RecEnabled,0))",
    "IsShadowPlayEnabled=$([BitConverter]::ToInt32($values.IsShadowPlayEnabled,0))",
    "ShareProcesses=$((Get-Process -Name 'NVIDIA Share' -ErrorAction SilentlyContinue).Count)"
) | Set-Content (Join-Path $backupDir 'nvidia-overlay-result.txt') -Encoding UTF8
