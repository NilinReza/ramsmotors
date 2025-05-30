# Netlify Deployment Script for Demo

Write-Host "🌐 Deploying to Netlify for Demo" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

# Check if build directory exists
if (Test-Path "build") {
    Write-Host "✅ Build directory found" -ForegroundColor Green
} else {
    Write-Host "❌ Build directory not found. Running npm run build..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build completed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n🚀 NETLIFY DEPLOYMENT OPTIONS:" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

Write-Host "`n📋 OPTION 1: Manual Drag & Drop (Fastest for demo)" -ForegroundColor Yellow
Write-Host "1. Go to https://netlify.com and sign up (FREE)"
Write-Host "2. Click 'Deploy manually'"
Write-Host "3. Drag and drop your 'build' folder"
Write-Host "4. Get instant URL like: ramsmotors.netlify.app"
Write-Host "5. ✅ Live in 30 seconds!"

Write-Host "`n🔧 OPTION 2: Netlify CLI (More professional)" -ForegroundColor Yellow
Write-Host "1. Install: npm install -g netlify-cli"
Write-Host "2. Login: netlify login"
Write-Host "3. Deploy: netlify deploy --prod --dir=build"

Write-Host "`n🎯 RECOMMENDED FOR DEMO TOMORROW:" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host "Use OPTION 1 (Drag & Drop) - it's the fastest!"
Write-Host ""
Write-Host "Steps:"
Write-Host "1. ✅ Your build folder is ready"
Write-Host "2. ✅ Go to netlify.com"
Write-Host "3. ✅ Drag & drop the 'build' folder"
Write-Host "4. ✅ Get your demo URL instantly"
Write-Host "5. ✅ Share the URL for tomorrow's demo"

Write-Host "`n📂 BUILD FOLDER STATUS:" -ForegroundColor Cyan
if (Test-Path "build") {
    $buildFiles = Get-ChildItem "build" -Recurse | Measure-Object | Select-Object -ExpandProperty Count
    Write-Host "✅ Build folder ready with $buildFiles files" -ForegroundColor Green
    Write-Host "📁 Location: $(Get-Location)\build" -ForegroundColor Gray
} else {
    Write-Host "❌ Build folder missing - run npm run build first" -ForegroundColor Red
}

Write-Host "`n🎉 AFTER DEPLOYMENT:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "✅ Your demo site will be live at ramsmotors.netlify.app"
Write-Host "✅ Works on any device/browser"
Write-Host "✅ HTTPS enabled automatically"
Write-Host "✅ Perfect for tomorrow's demo!"

Write-Host "`n💡 TIP: Bookmark your demo URL for easy access tomorrow!" -ForegroundColor Yellow
