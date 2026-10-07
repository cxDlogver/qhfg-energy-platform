$ErrorActionPreference = 'Stop'
$taskCandidates = @((Get-Command node -All -ErrorAction SilentlyContinue).Source)
$taskCandidates += Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$taskRuntime = $null
foreach ($taskCandidate in ($taskCandidates | Select-Object -Unique)) {
    if (-not $taskCandidate -or -not (Test-Path -LiteralPath $taskCandidate)) { continue }
    $taskVersion = (& $taskCandidate --version).TrimStart('v')
    $taskParts = $taskVersion.Split('.')
    if ([int]$taskParts[0] -gt 22 -or ([int]$taskParts[0] -eq 22 -and [int]$taskParts[1] -ge 19)) {
        $taskRuntime = $taskCandidate
        break
    }
}
if (-not $taskRuntime) { throw 'Node >=22.19 is required. No compatible local Node was found.' }
$env:Path = "$(Split-Path -Parent $taskRuntime);$env:Path"
Write-Host "Using $taskRuntime"
Push-Location (Split-Path -Parent $PSScriptRoot)
try { & $taskRuntime scripts/dev.mjs } finally { Pop-Location }
