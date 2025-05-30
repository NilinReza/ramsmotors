#!/usr/bin/env pwsh
# 🔒 SECURE DEMO DEPLOYMENT SCRIPT
# This script ensures secure handling of sensitive environment variables

Write-Host "🔒 SECURE DEMO DEPLOYMENT FOR RAMS MOTORS" -ForegroundColor Red
Write-Host "==========================================" -ForegroundColor Red
Write-Host ""

# Security verification
Write-Host "🛡️  SECURITY VERIFICATION:" -ForegroundColor Cyan
Write-Host ""

# Check if .env is in .gitignore
if (Test-Path ".gitignore" -and (Select-String -Path ".gitignore" -Pattern "\.env" -Quiet)) {
    Write-Host "✅ .env file is protected in .gitignore" -ForegroundColor Green
} else {
    Write-Host "🚨 CRITICAL: .env not protected!" -ForegroundColor Red
    Write-Host "   Adding security protection now..." -ForegroundColor Yellow
    if (-not (Test-Path ".gitignore")) { New-Item ".gitignore" -ItemType File }
    Add-Content ".gitignore" "`n# Environment variables (NEVER commit these)`n.env`n.env.local"
    Write-Host "✅ Security: Added .env protection to .gitignore" -ForegroundColor Green
}

# Check current Git status
Write-Host ""
Write-Host "🔍 Checking Git status for any exposed secrets..." -ForegroundColor Cyan
$gitStatus = git status --porcelain 2>$null
if ($gitStatus -match "\.env") {
    Write-Host "🚨 WARNING: .env file is tracked by Git!" -ForegroundColor Red
    Write-Host "   This could expose your API keys!" -ForegroundColor Red
    Write-Host "   Run: git rm --cached .env" -ForegroundColor Yellow
} else {
    Write-Host "✅ No .env files in Git staging area" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 SECURE DEPLOYMENT PLAN:" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host "1. 🔐 Create secure environment variables locally"
Write-Host "2. 🌐 Deploy to Netlify with platform env variables"
Write-Host "3. 🔑 Configure API key restrictions"
Write-Host "4. ✅ Verify security of deployed site"
Write-Host ""

# Security checklist
Write-Host "📋 SECURITY CHECKLIST:" -ForegroundColor Yellow
Write-Host "=====================" -ForegroundColor Yellow
Write-Host "□ API keys restricted to specific domains"
Write-Host "□ Different keys for development vs production"
Write-Host "□ No secrets committed to Git repository"
Write-Host "□ Environment variables set in platform (not files)"
Write-Host "□ API usage monitoring enabled"
Write-Host ""

Write-Host "🚀 DEPLOYMENT STEPS:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""
Write-Host "STEP 1: Get Supabase credentials (FREE tier)"
Write-Host "   → Go to https://supabase.com"
Write-Host "   → Create new project"
Write-Host "   → Copy Project URL and anon key"
Write-Host ""
Write-Host "STEP 2: Get Cloudinary credentials (FREE tier)"
Write-Host "   → Go to https://cloudinary.com"
Write-Host "   → Create account"
Write-Host "   → Copy Cloud Name, API Key, API Secret"
Write-Host ""
Write-Host "STEP 3: Secure API Configuration"
Write-Host "   → Restrict Google Maps API to your domains"
Write-Host "   → Set up Cloudinary upload restrictions"
Write-Host "   → Enable Supabase Row Level Security"
Write-Host ""
Write-Host "STEP 4: Deploy to Netlify (FREE hosting)"
Write-Host "   → Build production version"
Write-Host "   → Deploy to Netlify"
Write-Host "   → Set environment variables in Netlify dashboard"
Write-Host "   → Get live URL: ramsmotors.netlify.app"
Write-Host ""

Write-Host "⚠️  SECURITY REMINDERS:" -ForegroundColor Red
Write-Host "======================" -ForegroundColor Red
Write-Host "• NEVER commit .env file to Git"
Write-Host "• ALWAYS use platform environment variables for production"
Write-Host "• RESTRICT API keys to specific domains only"
Write-Host "• MONITOR API usage for any suspicious activity"
Write-Host "• ROTATE keys regularly (every 90 days)"
Write-Host ""

Write-Host "🎉 RESULT:" -ForegroundColor Green
Write-Host "=========" -ForegroundColor Green
Write-Host "✅ Secure live demo at: ramsmotors.netlify.app"
Write-Host "✅ Real database with Supabase"
Write-Host "✅ Secure image hosting with Cloudinary"
Write-Host "✅ 100% FREE hosting"
Write-Host "✅ Production-ready security"
Write-Host ""

$proceed = Read-Host "Ready to proceed with secure deployment? (y/N)"
if ($proceed -eq "y" -or $proceed -eq "Y") {
    Write-Host "🚀 Starting secure deployment process..." -ForegroundColor Green
    Write-Host "First, let's update your environment variables securely." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Run: .\update-env.ps1" -ForegroundColor Yellow
} else {
    Write-Host "Deployment cancelled. Review security guide first." -ForegroundColor Yellow
}
