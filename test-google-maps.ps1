#!/usr/bin/env pwsh

# 🔐 SECURE GOOGLE MAPS API KEY SETUP TEST SCRIPT

Write-Host "🗺️ GOOGLE MAPS API KEY SETUP VERIFICATION" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local file found" -ForegroundColor Green
    
    # Check if it contains the API key (without showing the actual key)
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSy") {
        Write-Host "✅ Google Maps API key is configured in .env.local" -ForegroundColor Green
    } elseif ($envContent -match "REACT_APP_GOOGLE_MAPS_API_KEY=your_new_api_key_here") {
        Write-Host "⚠️  Please replace 'your_new_api_key_here' with your actual API key" -ForegroundColor Yellow
        Write-Host "   Edit .env.local and add your Google API key" -ForegroundColor Yellow
    } else {
        Write-Host "❌ No Google Maps API key found in .env.local" -ForegroundColor Red
        Write-Host "   Please add: REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key" -ForegroundColor Red
    }
} else {
    Write-Host "❌ .env.local file not found" -ForegroundColor Red
    Write-Host "   Please create .env.local and add your API key" -ForegroundColor Red
}

# Check .gitignore protection
if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore" -Raw
    if ($gitignoreContent -match "\.env\.local") {
        Write-Host "✅ .env.local is protected by .gitignore" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Consider adding .env.local to .gitignore for security" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🚀 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Add your new Google API key to .env.local" -ForegroundColor White
Write-Host "2. Restart your development server: npm start" -ForegroundColor White
Write-Host "3. Check browser console for Google Maps status logs" -ForegroundColor White
Write-Host "4. Visit http://localhost:3000 and http://localhost:3000/contact" -ForegroundColor White

Write-Host ""
Write-Host "🔍 DEBUGGING TIPS:" -ForegroundColor Cyan
Write-Host "- Open browser Developer Tools (F12)" -ForegroundColor White
Write-Host "- Check Console tab for Google Maps status messages" -ForegroundColor White
Write-Host "- Look for 🗺️ and ✅ emoji messages" -ForegroundColor White
Write-Host "- If you see ⚠️ or ❌, check your API key and restrictions" -ForegroundColor White
