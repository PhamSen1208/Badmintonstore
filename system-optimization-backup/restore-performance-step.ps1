# Run as Administrator, then restart Windows.
$backupDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sid = 'S-1-5-21-2742367479-2130361446-1699893376-1001'

reg.exe import (Join-Path $backupDir 'memory-management-before-pagefile.reg')
if (Test-Path (Join-Path $backupDir 'background-access-before.reg')) {
    reg.exe import (Join-Path $backupDir 'background-access-before.reg')
}
if (Test-Path (Join-Path $backupDir 'nvidia-shadowplay-before.reg')) {
    reg.exe import (Join-Path $backupDir 'nvidia-shadowplay-before.reg')
}

$taskName = 'NvNodeLauncher_{B2FE1952-0186-46C3-BAEC-A80AA35AC5B8}'
Enable-ScheduledTask -TaskName $taskName -ErrorAction Continue | Out-Null
Write-Host 'Previous settings restored. Restart Windows to reactivate the previous pagefile layout.'
