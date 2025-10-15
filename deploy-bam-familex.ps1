param(
  [switch]$IncludeExtras
)

Write-Host "🚀 Deploying BAM FamiLex AI Platform..." -ForegroundColor Cyan

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error "Docker is not installed. Please install Docker Desktop."; exit 1
}

$envPath = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envPath)) {
  Write-Host "📝 Creating .env from .env.example (update secrets after)" -ForegroundColor Yellow
  Copy-Item (Join-Path $PSScriptRoot ".env.example") $envPath
}

New-Item -ItemType Directory -Force -Path (Join-Path $PSScriptRoot "data\init") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $PSScriptRoot "config\synapse") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $PSScriptRoot "config\jitsi") | Out-Null

$composeCmd = "docker compose up -d --build"
if ($IncludeExtras) {
  $composeCmd = "docker compose --profile extras up -d --build"
}

Write-Host "📦 Starting services with Docker Compose..." -ForegroundColor Cyan
Push-Location $PSScriptRoot
Invoke-Expression $composeCmd
Pop-Location

Write-Host "✅ Deployment started. Services will be available shortly:" -ForegroundColor Green
Write-Host "   Frontend:      http://localhost:3000"
Write-Host "   API:           http://localhost:3001"
Write-Host "   MinIO Console: http://localhost:9001"
Write-Host "   DocuSeal:      http://localhost:3002"
Write-Host "   Cal.com:       http://localhost:3003"
Write-Host "   Umami:         http://localhost:3004"

# Initialize Matrix Synapse config if missing
$synapseConfig = Join-Path $PSScriptRoot "config\synapse\homeserver.yaml"
if (-not (Test-Path $synapseConfig)) {
  Write-Host "💬 Initializing Matrix Synapse config..." -ForegroundColor Cyan
  docker compose exec matrix-synapse bash -lc "python -m synapse.app.homeserver -c /data/homeserver.yaml --generate-config --server-name $env:SYNAPSE_SERVER_NAME --report-stats $env:SYNAPSE_REPORT_STATS || true"
}
