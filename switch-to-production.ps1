# Switch to Production Mode for Demo

Write-Host "🚀 Switching to Production Mode for Demo" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Step 1: Update API service to use Supabase
Write-Host "`n🔧 Step 1: Updating API Service" -ForegroundColor Cyan

# Backup current API service
Copy-Item "src\services\api.js" "src\services\api-backup.js" -Force
Write-Host "✅ Backed up current API service to api-backup.js" -ForegroundColor Green

# Replace with production version
Copy-Item "src\services\api-production.js" "src\services\api.js" -Force
Write-Host "✅ Switched to production API service" -ForegroundColor Green

# Step 2: Update environment for production
Write-Host "`n🌍 Step 2: Setting Production Environment" -ForegroundColor Cyan

# Check if .env exists and has Supabase credentials
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "REACT_APP_SUPABASE_URL=https://") {
        Write-Host "✅ Supabase URL configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Supabase URL needs configuration" -ForegroundColor Yellow
    }
    
    if ($envContent -match "REACT_APP_SUPABASE_ANON_KEY=.{40,}") {
        Write-Host "✅ Supabase key configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Supabase key needs configuration" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ .env file missing - run update-env.ps1 first" -ForegroundColor Red
    exit 1
}

# Step 3: Build for production
Write-Host "`n🔨 Step 3: Building for Production" -ForegroundColor Cyan
Write-Host "Running npm run build..." -ForegroundColor Gray

npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Production build completed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Check errors above." -ForegroundColor Red
    exit 1
}

# Step 4: Verify build
Write-Host "`n✔️ Step 4: Verifying Build" -ForegroundColor Cyan
if (Test-Path "build\index.html") {
    Write-Host "✅ Build output verified" -ForegroundColor Green
    $buildSize = (Get-ChildItem "build" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "📦 Build size: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "❌ Build output missing" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎯 PRODUCTION MODE ACTIVATED!" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host "✅ API service switched to Supabase"
Write-Host "✅ Production build ready in 'build' folder"
Write-Host "✅ Ready for Netlify deployment"

Write-Host "`n🚀 NEXT STEPS FOR DEMO:" -ForegroundColor Yellow
Write-Host "1. Deploy to Netlify: .\deploy-netlify.ps1"
Write-Host "2. Test your demo site"
Write-Host "3. Share the URL for tomorrow's demo!"

Write-Host "`n💡 TIP: Your demo will use real Supabase database!" -ForegroundColor Cyan
