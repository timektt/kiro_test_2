# Community Platform Deployment Script (PowerShell)
# This script handles the deployment process for production

param(
    [switch]$SkipTests = $false
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Check if required environment variables are set
$requiredVars = @("DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL")
foreach ($var in $requiredVars) {
    if (-not (Get-Item "Env:$var" -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Error: $var environment variable is not set" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Environment variables validated" -ForegroundColor Green

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci --only=production
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Run database migrations
Write-Host "🗄️ Running database migrations..." -ForegroundColor Yellow
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Build the application
Write-Host "🏗️ Building application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Run tests (optional, can be skipped)
if (-not $SkipTests) {
    Write-Host "🧪 Running tests..." -ForegroundColor Yellow
    npm run test:ci
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Application is ready to serve traffic" -ForegroundColor Cyan