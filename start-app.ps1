# ================================================================
#  DREAM INTERPRETER – Start Script
#  Dobbeltklik på denne fil for at starte appen
# ================================================================

$host.UI.RawUI.WindowTitle = "Dream Interpreter Server"
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

Write-Host ""
Write-Host "  ================================================" -ForegroundColor Magenta
Write-Host "   🌙  Dream Interpreter starter op..." -ForegroundColor Cyan
Write-Host "  ================================================" -ForegroundColor Magenta
Write-Host ""

# Check .env file
if (-not (Test-Path ".env")) {
    Write-Host "  ❌ FEJL: .env filen mangler!" -ForegroundColor Red
    Write-Host "     Opret en .env fil i mappen: $projectDir" -ForegroundColor Yellow
    Read-Host "  Tryk Enter for at afslutte"
    exit 1
}

# Load .env
foreach ($line in Get-Content ".env") {
    if ($line -match "^([^#=]+)=(.*)$") {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

# Check required settings
if ($env:GEMINI_API_KEY -eq "din-gemini-api-nøgle-her" -or [string]::IsNullOrEmpty($env:GEMINI_API_KEY)) {
    Write-Host ""
    Write-Host "  ⚠️  ADVARSEL: GEMINI_API_KEY er ikke udfyldt!" -ForegroundColor Yellow
    Write-Host "     AI-tolkningsfunktionen virker ikke." -ForegroundColor Yellow
    Write-Host "     Hent en gratis nøgle på: https://aistudio.google.com/apikey" -ForegroundColor Cyan
    Write-Host "     og tilføj den til .env filen." -ForegroundColor Yellow
    Write-Host ""
}

if ($env:LOCAL_AUTH_PASSWORD -eq "skift-dette-til-dit-kodeord" -or [string]::IsNullOrEmpty($env:LOCAL_AUTH_PASSWORD)) {
    Write-Host "  ⚠️  ADVARSEL: LOCAL_AUTH_PASSWORD er ikke sat!" -ForegroundColor Yellow
    Write-Host "     Tilføj dit kodeord til .env filen." -ForegroundColor Yellow
    Write-Host ""
}

# Get local IP
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" } | Select-Object -First 1).IPAddress
if (-not $localIP) { $localIP = "localhost" }

Write-Host "  ✅ Starter server..." -ForegroundColor Green
Write-Host ""
Write-Host "  📱 Browser-adgang:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  📱 Telefon-adgang:  http://${localIP}:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "  (Luk dette vindue for at stoppe serveren)" -ForegroundColor DarkGray
Write-Host ""

# Start the server
npx tsx watch server/_core/index.ts
