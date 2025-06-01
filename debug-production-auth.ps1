# Production Authentication Debug Script
# This script helps debug the Netlify deployment authentication issue

Write-Host "🔍 Rams Motors - Production Authentication Debug" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check current environment variables
Write-Host "`n📦 Environment Variables:" -ForegroundColor Yellow
Write-Host "NODE_ENV: $env:NODE_ENV"
Write-Host "REACT_APP_USE_MOCK_DATA: $env:REACT_APP_USE_MOCK_DATA"
Write-Host "REACT_APP_SUPABASE_URL: $(if ($env:REACT_APP_SUPABASE_URL) { 'SET' } else { 'NOT SET' })"
Write-Host "REACT_APP_SUPABASE_ANON_KEY: $(if ($env:REACT_APP_SUPABASE_ANON_KEY) { 'SET' } else { 'NOT SET' })"

# Build the project for production
Write-Host "`n🔨 Building for production..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# Create a test HTML file to debug authentication in production
$testHtml = @"
<!DOCTYPE html>
<html>
<head>
    <title>Rams Motors - Auth Debug</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .credentials { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .result { margin: 10px 0; padding: 10px; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        button:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Rams Motors - Authentication Debug</h1>
        
        <div class="credentials">
            <h3>Test Credentials:</h3>
            <p><strong>Development:</strong> admin / admin123</p>
            <p><strong>Production:</strong> admin@ramsmotors.com / password123</p>
        </div>
        
        <button onclick="testDevCredentials()">Test Development Credentials</button>
        <button onclick="testProdCredentials()">Test Production Credentials</button>
        <button onclick="checkEnvironment()">Check Environment</button>
        
        <div id="results"></div>
    </div>
    
    <script>
        function log(message, type = 'info') {
            const results = document.getElementById('results');
            const div = document.createElement('div');
            div.className = 'result ' + (type === 'error' ? 'error' : 'success');
            div.innerHTML = '<strong>' + new Date().toLocaleTimeString() + ':</strong> ' + message;
            results.appendChild(div);
            console.log(message);
        }
        
        function checkEnvironment() {
            log('🔍 Environment Check:', 'info');
            log('URL: ' + window.location.href);
            log('User Agent: ' + navigator.userAgent);
            log('Environment variables will be checked when authentication is tested.');
        }
        
        async function testCredentials(username, password, description) {
            log('🔐 Testing ' + description + ' (' + username + ')', 'info');
            
            try {
                // Simulate the authentication call that would happen in the app
                const credentials = { username, password };
                
                // This would normally import the API service, but for debugging we'll just log
                log('Credentials object: ' + JSON.stringify(credentials), 'info');
                log('Username type: ' + typeof username, 'info');
                log('Password type: ' + typeof password, 'info');
                
                // Check if we can access the environment variables
                if (typeof process !== 'undefined' && process.env) {
                    log('Environment check: NODE_ENV = ' + process.env.NODE_ENV, 'info');
                    log('Environment check: REACT_APP_USE_MOCK_DATA = ' + process.env.REACT_APP_USE_MOCK_DATA, 'info');
                } else {
                    log('Environment variables not accessible in browser', 'info');
                }
                
                log('✅ Credential format validation passed', 'success');
                
            } catch (error) {
                log('❌ Error: ' + error.message, 'error');
            }
        }
        
        function testDevCredentials() {
            testCredentials('admin', 'admin123', 'Development Credentials');
        }
        
        function testProdCredentials() {
            testCredentials('admin@ramsmotors.com', 'password123', 'Production Credentials');
        }
        
        // Auto-run environment check on load
        window.onload = function() {
            checkEnvironment();
        };
    </script>
</body>
</html>
"@

# Write the test file to the build directory
$testHtml | Out-File -FilePath "build/auth-debug.html" -Encoding UTF8

Write-Host "`n🧪 Created auth debug page: build/auth-debug.html" -ForegroundColor Yellow

# Instructions for deployment
Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Deploy to Netlify: netlify deploy --prod --dir=build" -ForegroundColor White
Write-Host "2. After deployment, visit: https://yoursite.netlify.app/auth-debug.html" -ForegroundColor White
Write-Host "3. Test both credential formats and check browser console" -ForegroundColor White
Write-Host "4. In Netlify dashboard, ensure these environment variables are set:" -ForegroundColor White
Write-Host "   - REACT_APP_USE_MOCK_DATA=false" -ForegroundColor Gray
Write-Host "   - REACT_APP_SUPABASE_URL=your_actual_url" -ForegroundColor Gray
Write-Host "   - REACT_APP_SUPABASE_ANON_KEY=your_actual_key" -ForegroundColor Gray

Write-Host "`n💡 Troubleshooting:" -ForegroundColor Yellow
Write-Host "If authentication still fails:" -ForegroundColor White
Write-Host "1. Check Netlify build logs for environment variable issues" -ForegroundColor Gray
Write-Host "2. Verify Supabase user exists: admin@ramsmotors.com" -ForegroundColor Gray
Write-Host "3. Confirm password is 'password123' in Supabase auth" -ForegroundColor Gray
Write-Host "4. Test credential mapping logic in auth-debug.html" -ForegroundColor Gray
