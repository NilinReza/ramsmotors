# SECURE Environment Variables Update Script for Demo Deployment
# 🔒 SECURITY NOTICE: This script handles sensitive data

Write-Host "🔒 SECURE Environment Update for Demo" -ForegroundColor Red
Write-Host "=====================================" -ForegroundColor Red
Write-Host ""
Write-Host "⚠️  SECURITY WARNINGS:" -ForegroundColor Yellow
Write-Host "   • This script will update your .env file with real API keys" -ForegroundColor Yellow
Write-Host "   • Ensure .env is in .gitignore (already verified ✅)" -ForegroundColor Yellow
Write-Host "   • Never commit or share your .env file" -ForegroundColor Yellow
Write-Host "   • Use different keys for production vs development" -ForegroundColor Yellow
Write-Host ""

# Security check - verify .gitignore
if (Select-String -Path ".gitignore" -Pattern "\.env" -Quiet) {
    Write-Host "✅ Security: .env is properly protected in .gitignore" -ForegroundColor Green
} else {
    Write-Host "🚨 SECURITY RISK: .env not found in .gitignore!" -ForegroundColor Red
    Write-Host "   Adding .env to .gitignore now..." -ForegroundColor Yellow
    Add-Content -Path ".gitignore" -Value "`n# Environment variables`n.env"
    Write-Host "✅ Fixed: Added .env to .gitignore" -ForegroundColor Green
}

Write-Host ""
$confirm = Read-Host "Continue with secure environment setup? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Setup cancelled for security." -ForegroundColor Yellow
    exit
}

# Prompt for Supabase credentials
Write-Host "`n📊 SUPABASE CONFIGURATION:" -ForegroundColor Cyan
$supabaseUrl = Read-Host "Enter your Supabase Project URL (from Supabase dashboard)"
$supabaseKey = Read-Host "Enter your Supabase Anon Key (from Supabase dashboard)"

# Prompt for Cloudinary credentials  
Write-Host "`n☁️ CLOUDINARY CONFIGURATION:" -ForegroundColor Cyan
$cloudinaryName = Read-Host "Enter your Cloudinary Cloud Name"
$cloudinaryKey = Read-Host "Enter your Cloudinary API Key"
$cloudinarySecret = Read-Host "Enter your Cloudinary API Secret"

# Prompt for Google Maps (optional for demo)
Write-Host "`n🗺️ GOOGLE MAPS (Optional for demo):" -ForegroundColor Yellow
$mapsKey = Read-Host "Enter Google Maps API Key (or press Enter to skip for now)"

# Create new .env file
$envContent = @"
# SUPABASE CONFIGURATION (PRODUCTION)
REACT_APP_SUPABASE_URL=$supabaseUrl
REACT_APP_SUPABASE_ANON_KEY=$supabaseKey

# CLOUDINARY CONFIGURATION (PRODUCTION)
REACT_APP_CLOUDINARY_CLOUD_NAME=$cloudinaryName
REACT_APP_CLOUDINARY_API_KEY=$cloudinaryKey
REACT_APP_CLOUDINARY_API_SECRET=$cloudinarySecret
REACT_APP_CLOUDINARY_UPLOAD_PRESET=ramsmotors_unsigned

# GOOGLE MAPS CONFIGURATION (OPTIONAL)
REACT_APP_GOOGLE_MAPS_API_KEY=$mapsKey
REACT_APP_GOOGLE_PLACES_API_KEY=$mapsKey
REACT_APP_GOOGLE_PLACE_ID=ChIJ_0SXZQDR1IkRbtlC6Htl68c

# PRODUCTION ENVIRONMENT
NODE_ENV=production
"@

# Backup existing .env
if (Test-Path ".env") {
    Copy-Item ".env" ".env.backup" -Force
    Write-Host "✅ Backed up existing .env to .env.backup" -ForegroundColor Green
}

# Write new .env file
Set-Content -Path ".env" -Value $envContent -Encoding UTF8
Write-Host "✅ Updated .env file with production credentials" -ForegroundColor Green

# Display summary
Write-Host "`n📋 CONFIGURATION SUMMARY:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "Supabase URL: $supabaseUrl" -ForegroundColor Gray
Write-Host "Cloudinary Cloud: $cloudinaryName" -ForegroundColor Gray
if ($mapsKey) {
    Write-Host "Google Maps: Configured" -ForegroundColor Gray
} else {
    Write-Host "Google Maps: Skipped (can add later)" -ForegroundColor Yellow
}

Write-Host "`n🚀 NEXT STEPS:" -ForegroundColor Green
Write-Host "1. Run database setup: .\setup-supabase.ps1"
Write-Host "2. Build the project: npm run build"
Write-Host "3. Deploy to Netlify: .\deploy-netlify.ps1"

Write-Host "`n✅ Environment configuration complete!" -ForegroundColor Green
