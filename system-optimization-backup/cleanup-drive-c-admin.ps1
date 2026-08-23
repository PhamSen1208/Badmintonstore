$ErrorActionPreference = 'Continue'
$logPath = Join-Path $PSScriptRoot 'cleanup-drive-c-result.txt'
$log = [System.Collections.Generic.List[string]]::new()

function Get-TreeBytes([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) { return [int64]0 }
    $item = Get-Item -LiteralPath $Path -Force
    if (-not $item.PSIsContainer) { return [int64]$item.Length }
    return [int64]((Get-ChildItem -LiteralPath $Path -Force -File -Recurse -ErrorAction SilentlyContinue |
        Measure-Object Length -Sum).Sum)
}

function Remove-ExactPath([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) { return }
    $resolved = (Resolve-Path -LiteralPath $Path).Path
    $allowed = @(
        'C:\Users\Admin\AppData\Roaming\Cursor\snapshots',
        'C:\Users\Admin\.nuget\packages',
        'C:\Users\Admin\AppData\Local\NuGet',
        'C:\Users\Admin\AppData\Local\npm-cache',
        'C:\Users\Admin\AppData\Local\Yarn',
        'C:\Users\Admin\AppData\Local\pip',
        'C:\Users\Admin\AppData\Local\CrashDumps',
        'C:\ProgramData\NVIDIA Corporation\Downloader',
        'C:\Users\Admin\AppData\Local\NVIDIA\DXCache',
        'C:\Users\Admin\AppData\Local\NVIDIA\GLCache',
        'C:\Users\Admin\AppData\Local\D3DSCache',
        'C:\Users\Admin\AppData\Local\SquirrelTemp',
        'C:\Users\Admin\AppData\Local\antigravity-updater',
        'C:\Users\Admin\AppData\Local\Microsoft\PowerToys\Updates',
        'C:\Users\Admin\AppData\Local\gitkraken\packages',
        'C:\Users\Admin\AppData\Roaming\ZaloData\media\update',
        'C:\Program Files (x86)\Rise of Kingdoms',
        'D:\Game\Rise of Kingdoms'
    )
    if ($allowed -notcontains $resolved) {
        $log.Add("SKIPPED unapproved path: $resolved")
        return
    }
    $before = Get-TreeBytes $resolved
    Remove-Item -LiteralPath $resolved -Force -Recurse -ErrorAction Continue
    $after = Get-TreeBytes $resolved
    $log.Add(('Removed {0:N3} GB | {1}' -f (($before - $after) / 1GB), $resolved))
}

function Clear-ExactDirectory([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) { return }
    $resolved = (Resolve-Path -LiteralPath $Path).Path.TrimEnd('\')
    $allowedRoots = @(
        'C:\Users\Admin\AppData\Local\Temp',
        'C:\Windows\Temp',
        'C:\Windows\SoftwareDistribution\Download',
        'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\Cache',
        'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\Code Cache',
        'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\GPUCache',
        'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\Service Worker\CacheStorage',
        'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\DawnCache',
        'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\DawnGraphiteCache',
        'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\DawnWebGPUCache'
    )
    if ($allowedRoots -notcontains $resolved) {
        $log.Add("SKIPPED unapproved directory: $resolved")
        return
    }
    $before = Get-TreeBytes $resolved
    foreach ($child in Get-ChildItem -LiteralPath $resolved -Force -ErrorAction SilentlyContinue) {
        $childPath = $child.FullName
        if ($childPath.StartsWith($resolved + '\', [System.StringComparison]::OrdinalIgnoreCase)) {
            Remove-Item -LiteralPath $childPath -Force -Recurse -ErrorAction SilentlyContinue
        }
    }
    $after = Get-TreeBytes $resolved
    $log.Add(('Cleared {0:N3} GB | {1}' -f (($before - $after) / 1GB), $resolved))
}

$freeBefore = (Get-PSDrive C).Free

# Remove the registered copy and the orphaned C: copy of Rise of Kingdoms.
$uninstaller = 'D:\Game\Rise of Kingdoms\unins000.exe'
if (Test-Path -LiteralPath $uninstaller) {
    Start-Process -FilePath $uninstaller -ArgumentList '/VERYSILENT','/SUPPRESSMSGBOXES','/NORESTART' -Wait
}
Remove-ExactPath 'D:\Game\Rise of Kingdoms'
Remove-ExactPath 'C:\Program Files (x86)\Rise of Kingdoms'

# Docker has no images, containers or volumes. Reset only its WSL data store.
$dockerCli = 'C:\Program Files\Docker\Docker\DockerCli.exe'
if (Test-Path -LiteralPath $dockerCli) { & $dockerCli -Shutdown 2>$null }
Start-Sleep -Seconds 5
wsl.exe --shutdown
Start-Sleep -Seconds 3
wsl.exe --unregister docker-desktop-data 2>&1 | ForEach-Object { $log.Add("WSL: $_") }

$dockerVhdx = 'C:\Users\Admin\AppData\Local\Docker\wsl\data\ext4.vhdx'
if (Test-Path -LiteralPath $dockerVhdx) {
    $resolvedVhdx = (Resolve-Path -LiteralPath $dockerVhdx).Path
    if ($resolvedVhdx -eq $dockerVhdx) {
        $vhdBytes = (Get-Item -LiteralPath $resolvedVhdx).Length
        Remove-Item -LiteralPath $resolvedVhdx -Force
        $log.Add(('Removed {0:N3} GB | {1}' -f ($vhdBytes / 1GB), $resolvedVhdx))
    }
}

# Explicitly approved snapshots and regenerable developer/application caches.
@(
    'C:\Users\Admin\AppData\Roaming\Cursor\snapshots',
    'C:\Users\Admin\.nuget\packages',
    'C:\Users\Admin\AppData\Local\NuGet',
    'C:\Users\Admin\AppData\Local\npm-cache',
    'C:\Users\Admin\AppData\Local\Yarn',
    'C:\Users\Admin\AppData\Local\pip',
    'C:\Users\Admin\AppData\Local\CrashDumps',
    'C:\ProgramData\NVIDIA Corporation\Downloader',
    'C:\Users\Admin\AppData\Local\NVIDIA\DXCache',
    'C:\Users\Admin\AppData\Local\NVIDIA\GLCache',
    'C:\Users\Admin\AppData\Local\D3DSCache',
    'C:\Users\Admin\AppData\Local\SquirrelTemp',
    'C:\Users\Admin\AppData\Local\antigravity-updater',
    'C:\Users\Admin\AppData\Local\Microsoft\PowerToys\Updates',
    'C:\Users\Admin\AppData\Local\gitkraken\packages',
    'C:\Users\Admin\AppData\Roaming\ZaloData\media\update'
) | ForEach-Object { Remove-ExactPath $_ }

@(
    'C:\Users\Admin\AppData\Local\Temp',
    'C:\Windows\Temp',
    'C:\Windows\SoftwareDistribution\Download',
    'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\Cache',
    'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\Code Cache',
    'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\GPUCache',
    'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\Service Worker\CacheStorage',
    'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\DawnCache',
    'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\DawnGraphiteCache',
    'C:\Users\Admin\AppData\Local\Microsoft\Edge\User Data\Profile 1\DawnWebGPUCache'
) | ForEach-Object { Clear-ExactDirectory $_ }

$log.Add('Running DISM StartComponentCleanup...')
DISM.exe /Online /Cleanup-Image /StartComponentCleanup | ForEach-Object { $log.Add("DISM: $_") }

$freeAfter = (Get-PSDrive C).Free
$log.Insert(0, ('Total C: space reclaimed: {0:N3} GB' -f (($freeAfter - $freeBefore) / 1GB)))
$log.Add(('C: free after cleanup: {0:N3} GB' -f ($freeAfter / 1GB)))
$log | Set-Content -LiteralPath $logPath -Encoding UTF8
