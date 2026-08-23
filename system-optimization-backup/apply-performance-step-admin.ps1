$ErrorActionPreference = 'Continue'
$backupDir = $PSScriptRoot
$sid = 'S-1-5-21-2742367479-2130361446-1699893376-1001'
$result = Join-Path $backupDir 'performance-step-result.txt'

reg.exe export 'HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management' (Join-Path $backupDir 'memory-management-before-pagefile.reg') /y | Out-Null
reg.exe export "HKU\$sid\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications" (Join-Path $backupDir 'background-access-before.reg') /y | Out-Null

$taskName = 'NvNodeLauncher_{B2FE1952-0186-46C3-BAEC-A80AA35AC5B8}'
$task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($task) {
    Export-ScheduledTask -TaskName $taskName | Set-Content (Join-Path $backupDir 'nvidia-node-launcher-task.xml') -Encoding Unicode
    Disable-ScheduledTask -TaskName $taskName | Out-Null
}

# Keep pagefile management per-drive, but place the only system-managed pagefile on SSD C:.
$computer = Get-CimInstance Win32_ComputerSystem
Set-CimInstance -InputObject $computer -Property @{ AutomaticManagedPagefile = $false } | Out-Null
$memoryKey = 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management'
Set-ItemProperty -Path $memoryKey -Name PagingFiles -Type MultiString -Value @('c:\pagefile.sys 0 0')

# Prevent optional Store apps from waking in the background. They can still be opened manually.
$backgroundRoot = "Registry::HKEY_USERS\$sid\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications"
$packages = @(
    'Microsoft.PowerAutomateDesktop_8wekyb3d8bbwe',
    'Microsoft.YourPhone_8wekyb3d8bbwe',
    'MicrosoftWindows.CrossDevice_cw5n1h2txyewy'
)
foreach ($package in $packages) {
    $path = Join-Path $backgroundRoot $package
    New-Item -Path $path -Force | Out-Null
    New-ItemProperty -Path $path -Name Disabled -PropertyType DWord -Value 1 -Force | Out-Null
    New-ItemProperty -Path $path -Name DisabledByUser -PropertyType DWord -Value 1 -Force | Out-Null
}

Get-Process -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -in @('PhoneExperienceHost','CrossDeviceService','PAD.Console.Host','PAD.AutomationServer','NVIDIA Share','NVIDIA Web Helper')
} | Stop-Process -Force -ErrorAction SilentlyContinue

$lines = [System.Collections.Generic.List[string]]::new()
$lines.Add('Pagefile registry:')
$lines.AddRange([string[]]((Get-ItemProperty $memoryKey).PagingFiles))
$lines.Add('')
$lines.Add('Background packages disabled:')
$lines.AddRange([string[]]$packages)
$lines.Add('')
$lines.Add("NVIDIA launcher task state: $((Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue).State)")
$lines.Add('Restart Windows to activate the pagefile change.')
$lines | Set-Content -LiteralPath $result -Encoding UTF8
