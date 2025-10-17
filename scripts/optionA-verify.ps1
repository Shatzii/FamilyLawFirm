param(
    [Parameter(Mandatory=$true)][string]$FrontendUrl,
    [Parameter(Mandatory=$true)][string]$BackendUrl,
    [int]$TimeoutSec = 12
)

$ErrorActionPreference = 'Stop'

function Get-Json($url) {
    try {
        $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec $TimeoutSec
        if ($resp.StatusCode -lt 200 -or $resp.StatusCode -ge 300) {
            throw "HTTP $($resp.StatusCode) from $url"
        }
        return ($resp.Content | ConvertFrom-Json)
    } catch {
        throw "Failed to GET $url : $($_.Exception.Message)"
    }
}

Write-Host "Verifying Option A deployment..." -ForegroundColor Cyan
Write-Host "Frontend: $FrontendUrl" -ForegroundColor DarkCyan
Write-Host "Backend : $BackendUrl" -ForegroundColor DarkCyan

$ok = $true

# 1) Backend root should return API JSON with status online
try {
    $apiRoot = Get-Json -url $BackendUrl
    if ($apiRoot.status -ne 'online') {
        Write-Warning "Backend root did not report status=online. Got: '$($apiRoot.status)'"
        $ok = $false
    } else {
        Write-Host "✔ Backend root online (version: $($apiRoot.version))" -ForegroundColor Green
    }
} catch {
    Write-Error $_
    $ok = $false
}

# 2) Frontend health should show backend up and the expected backendUrl
try {
    $health = Get-Json -url ("{0}/api/health" -f ($FrontendUrl.TrimEnd('/')))
    $backendStatus = $health.backend
    $reportedBackendUrl = $health.backendUrl

    if ($backendStatus -ne 'up') {
        Write-Warning "Frontend health reports backend '$backendStatus'"
        $ok = $false
    } else {
        Write-Host "✔ Frontend health: backend up" -ForegroundColor Green
    }

    if ($reportedBackendUrl -and ($reportedBackendUrl -ne $BackendUrl)) {
        Write-Warning "Frontend health backendUrl mismatch. Expected '$BackendUrl' but got '$reportedBackendUrl'"
        $ok = $false
    } elseif (-not $reportedBackendUrl) {
        Write-Warning "Frontend health didn't include backendUrl field"
        # not fatal, but helpful
    } else {
        Write-Host "✔ Frontend reports backendUrl = $reportedBackendUrl" -ForegroundColor Green
    }
} catch {
    Write-Error $_
    $ok = $false
}

if ($ok) {
    Write-Host "All checks passed. Option A looks healthy." -ForegroundColor Green
    exit 0
} else {
    Write-Host "One or more checks failed. See messages above." -ForegroundColor Yellow
    exit 1
}
