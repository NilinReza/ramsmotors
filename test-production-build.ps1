#!/usr/bin/env pwsh
# Test Production Build and Supabase Integration

Write-Host "🚀 Testing Production Build with Supabase Integration..." -ForegroundColor Green

# Set error preference
$ErrorActionPreference = "Stop"

try {
    Write-Host "`n📦 Building React application..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed with exit code $LASTEXITCODE"
    }
    
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    
    Write-Host "`n🧪 Testing Supabase integration..." -ForegroundColor Yellow
    node test-supabase-integration.js
    
    if ($LASTEXITCODE -ne 0) {
        throw "Supabase test failed with exit code $LASTEXITCODE"
    }
    
    Write-Host "✅ Supabase integration test passed!" -ForegroundColor Green
    
    Write-Host "`n📊 Checking build output..." -ForegroundColor Yellow
    $buildSize = (Get-ChildItem -Path "build" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "Build size: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Cyan
    
    # Check if critical files exist
    $criticalFiles = @("build/index.html", "build/static")
    foreach ($file in $criticalFiles) {
        if (Test-Path $file) {
            Write-Host "✅ $file exists" -ForegroundColor Green
        } else {
            throw "❌ Critical file missing: $file"
        }
    }
    
    Write-Host "`n🎉 Production build test completed successfully!" -ForegroundColor Green
    Write-Host "📋 Summary:" -ForegroundColor Cyan
    Write-Host "   - React build: ✅ Success" -ForegroundColor White
    Write-Host "   - Supabase connection: ✅ Working" -ForegroundColor White
    Write-Host "   - Build size: $([math]::Round($buildSize, 2)) MB" -ForegroundColor White
    Write-Host "   - All critical files: ✅ Present" -ForegroundColor White
    
} catch {
    Write-Host "❌ Production build test failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
