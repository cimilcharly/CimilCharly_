# Check if .env file exists in the parent directory, copy from .env.example if missing
$parentEnv = Join-Path (Get-Item .).Parent.FullName ".env"
$n8nEnv = Join-Path (Get-Item .).FullName ".env"

if (-not (Test-Path $parentEnv)) {
    Write-Host "[n8n] Creating root .env from .env.example. Please update your GEMINI_API_KEY there!" -ForegroundColor Yellow
    Copy-Item (Join-Path (Get-Item .).Parent.FullName ".env.example") $parentEnv
}

# Copy the parent .env to local n8n .env for Docker compose to pick it up
Copy-Item $parentEnv $n8nEnv -Force

Write-Host "[n8n] Starting n8n container..." -ForegroundColor Green
docker compose up -d

Write-Host "[n8n] Waiting for n8n to start (http://localhost:5678)..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host "[n8n] n8n should now be running at http://localhost:5678" -ForegroundColor Green
Write-Host "[n8n] To import the workflow, navigate to Workflows -> Import from File, and choose workflow.json." -ForegroundColor Yellow
