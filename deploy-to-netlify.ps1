# RamsMotors Netlify Deployment Script
# This script prepares your application for deployment to fix the F5 refresh issue

Write-Host "🚗 RamsMotors - Netlify Deployment Preparation" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Check if we're in the right directory
$projectRoot = "C:\Users\nilin\ramsmotors"
if (-not (Test-Path "$projectRoot\package.json")) {
    Write-Host "❌ Error: Please run this script from the RamsMotors project directory" -ForegroundColor Red
    exit 1
}

Set-Location $projectRoot

Write-Host "📂 Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host "🔍 Verifying build folder..." -ForegroundColor Yellow

# Check build folder exists and has critical files
if (-not (Test-Path "build\_redirects")) {
    Write-Host "❌ Missing _redirects file in build folder" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "build\netlify.toml")) {
    Write-Host "❌ Missing netlify.toml file in build folder" -ForegroundColor Red
    exit 1
}

# Verify _redirects content
$redirectsContent = Get-Content "build\_redirects" -Raw
if ($redirectsContent -notlike "*index.html*200*") {
    Write-Host "❌ Invalid _redirects file content" -ForegroundColor Red
    Write-Host "Expected: /*    /index.html   200" -ForegroundColor Gray
    Write-Host "Found: $redirectsContent" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ Build folder is ready for deployment!" -ForegroundColor Green
Write-Host ""

# Get build folder size
$buildSize = (Get-ChildItem "build" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "📊 Build folder size: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Cyan

# Display deployment instructions
Write-Host ""
Write-Host "🚀 DEPLOYMENT INSTRUCTIONS" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "=" * 50 -ForegroundColor Cyan

Write-Host ""
Write-Host "OPTION 1: Manual Drag & Drop (Recommended)" -ForegroundColor Yellow
Write-Host "1. Open https://app.netlify.com in your browser" -ForegroundColor White
Write-Host "2. Find your RamsMotors site in the dashboard" -ForegroundColor White
Write-Host "3. Click on the site name to open it" -ForegroundColor White
Write-Host "4. Go to the 'Deploys' tab" -ForegroundColor White
Write-Host "5. Drag and drop the entire 'build' folder from:" -ForegroundColor White
Write-Host "   $projectRoot\build" -ForegroundColor Gray
Write-Host "6. Wait for deployment to complete (usually 1-2 minutes)" -ForegroundColor White
Write-Host ""

Write-Host "OPTION 2: Netlify CLI (Advanced)" -ForegroundColor Yellow
Write-Host "1. Install Netlify CLI: npm install -g netlify-cli" -ForegroundColor White
Write-Host "2. Login: netlify login" -ForegroundColor White
Write-Host "3. Deploy: netlify deploy --prod --dir=build" -ForegroundColor White
Write-Host ""

Write-Host "🧪 AFTER DEPLOYMENT - TESTING" -ForegroundColor Green -BackgroundColor Black
Write-Host "1. Visit your Netlify site URL" -ForegroundColor White
Write-Host "2. Navigate to different pages (Home, Inventory, Admin, etc.)" -ForegroundColor White
Write-Host "3. Press F5 (refresh) on each page - should NOT show 'Page Not Found'" -ForegroundColor White
Write-Host "4. Test deep links by copying URLs and opening in new browser tabs" -ForegroundColor White
Write-Host ""

Write-Host "🔧 WHAT WAS FIXED" -ForegroundColor Magenta -BackgroundColor Black
Write-Host "• Added _redirects file with SPA fallback rule" -ForegroundColor White
Write-Host "• Configured netlify.toml for proper routing" -ForegroundColor White
Write-Host "• Fixed all admin portal status filters" -ForegroundColor White
Write-Host "• Fixed inventory page filtering logic" -ForegroundColor White
Write-Host "• Added missing About page for navigation" -ForegroundColor White
Write-Host ""

Write-Host "📞 If you encounter any issues:" -ForegroundColor Red
Write-Host "• Check Netlify deploy logs for errors" -ForegroundColor White
Write-Host "• Ensure both _redirects and netlify.toml files are in the build" -ForegroundColor White
Write-Host "• Contact support if problems persist" -ForegroundColor White

Write-Host ""
Write-Host "✨ Ready to deploy! Your F5 refresh issue will be fixed after deployment." -ForegroundColor Green -BackgroundColor Black
