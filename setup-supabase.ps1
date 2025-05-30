# Supabase Database Setup Script

Write-Host "📊 Setting up Supabase Database" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

Write-Host "`n🔧 SUPABASE SETUP INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "1. Go to your Supabase project dashboard"
Write-Host "2. Click on 'SQL Editor' in the left sidebar"
Write-Host "3. Copy and paste the following SQL schema:"
Write-Host ""

Write-Host "📋 SQL SCHEMA TO RUN IN SUPABASE:" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

# Read and display the schema
if (Test-Path "database\supabase-schema.sql") {
    $schema = Get-Content "database\supabase-schema.sql" -Raw
    Write-Host $schema -ForegroundColor Gray
    
    Write-Host "`n📋 SCHEMA FILE LOCATION:" -ForegroundColor Cyan
    Write-Host "File: database\supabase-schema.sql"
    Write-Host "You can copy this entire file content to Supabase SQL Editor"
} else {
    Write-Host "❌ Schema file not found at database\supabase-schema.sql" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎯 AFTER RUNNING THE SCHEMA:" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host "1. ✅ Tables will be created (vehicles, admin_users, etc.)"
Write-Host "2. ✅ Sample data will be inserted"
Write-Host "3. ✅ Admin user will be created (admin/admin123)"
Write-Host "4. ✅ Sample vehicles will be added"
Write-Host "5. ✅ Your database will be ready for the demo!"

Write-Host "`n🔐 ADMIN CREDENTIALS FOR DEMO:" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "Username: admin"
Write-Host "Password: admin123"

Write-Host "`n✅ Next: Run npm run build after database setup" -ForegroundColor Green
