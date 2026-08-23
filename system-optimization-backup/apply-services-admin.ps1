$ErrorActionPreference = 'Continue'
$resultPath = Join-Path $PSScriptRoot 'service-optimization-result.txt'

$manualStop = @(
    'MSOLAP$MSSQLSERVER22',
    'MSSQL$MSSQLSERVER01',
    'MSSQL$SQLEXPRESS',
    'MSSQLSERVER',
    'PostgreSQL_For_Odoo',
    'SQLAgent$MSSQLSERVER22',
    'SQLPBDMS$MSSQLSERVER22',
    'SQLPBENGINE$MSSQLSERVER22'
)

$disableStop = @(
    'SQLTELEMETRY',
    'SQLTELEMETRY$MSSQLSERVER01',
    'SQLTELEMETRY$MSSQLSERVER22',
    'SQLTELEMETRY$SQLEXPRESS',
    'SSASTELEMETRY$MSSQLSERVER22'
)

foreach ($name in $manualStop) {
    Stop-Service -Name $name -Force -ErrorAction Continue
    Set-Service -Name $name -StartupType Manual -ErrorAction Continue
}

foreach ($name in $disableStop) {
    Stop-Service -Name $name -Force -ErrorAction Continue
    Set-Service -Name $name -StartupType Disabled -ErrorAction Continue
}

$kept = @('MSSQL$MSSQLSERVER22', 'SQLBrowser')
Get-Service | Where-Object { $_.Name -in ($manualStop + $disableStop + $kept) } |
    Select-Object Name, Status, StartType |
    Sort-Object Name |
    Format-Table -AutoSize |
    Out-String |
    Set-Content -Path $resultPath -Encoding UTF8
