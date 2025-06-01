# Debug Production Admin Edit Issue

# This script will check the production deployment and identify the issue
$productionUrl = "https://ramsmotors.netlify.app"

Write-Host "🔍 Debugging Production Admin Edit Vehicle Issue" -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Yellow

# Check if the site is accessible
try {
    $response = Invoke-WebRequest -Uri $productionUrl -UseBasicParsing
    Write-Host "✅ Production site is accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot access production site: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Check admin page
try {
    $adminResponse = Invoke-WebRequest -Uri "$productionUrl/admin" -UseBasicParsing
    Write-Host "✅ Admin page is accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot access admin page: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Next steps for debugging:" -ForegroundColor Cyan
Write-Host "1. Check browser console for JavaScript errors"
Write-Host "2. Verify API calls to Supabase are working"
Write-Host "3. Check if the vehicle data is being fetched"
Write-Host "4. Verify the transformation logic is deployed"
Write-Host ""
Write-Host "📱 Test in browser:"
Write-Host "1. Go to: $productionUrl/admin"
Write-Host "2. Login with admin credentials"
Write-Host "3. Try to edit a vehicle"
Write-Host "4. Check browser console for errors"
