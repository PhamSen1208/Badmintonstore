# Run this script as Administrator to restore the settings changed on 2026-06-22.
$ErrorActionPreference = 'Continue'

$backupDir = Split-Path -Parent $MyInvocation.MyCommand.Path
reg.exe import (Join-Path $backupDir 'user-run.reg')
reg.exe import (Join-Path $backupDir 'startup-approved.reg')
reg.exe import (Join-Path $backupDir 'game-config-store.reg')
reg.exe import (Join-Path $backupDir 'game-dvr.reg')

$automaticServices = @(
    'MSOLAP$MSSQLSERVER22',
    'MSSQL$MSSQLSERVER01',
    'MSSQL$SQLEXPRESS',
    'MSSQLSERVER',
    'PostgreSQL_For_Odoo',
    'SQLAgent$MSSQLSERVER22',
    'SQLPBDMS$MSSQLSERVER22',
    'SQLPBENGINE$MSSQLSERVER22',
    'SQLTELEMETRY',
    'SQLTELEMETRY$MSSQLSERVER01',
    'SQLTELEMETRY$MSSQLSERVER22',
    'SQLTELEMETRY$SQLEXPRESS',
    'SSASTELEMETRY$MSSQLSERVER22'
)

foreach ($name in $automaticServices) {
    Set-Service -Name $name -StartupType Automatic -ErrorAction Continue
}

Write-Host 'Settings restored. Restart Windows to return to the previous startup state.'
