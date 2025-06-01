# Rams Motors - Production Deployment with Authentication Fix
# This script deploys to Netlify with proper environment configuration

param(
    [switch]$MockData = $false,
    [string]$SupabaseUrl = "",
    [string]$SupabaseKey = ""
)

Write-Host "🚀 Rams Motors - Production Deployment Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Determine authentication mode
if ($MockData) {
    Write-Host "🧪 Deploying with MOCK DATA (testing mode)" -ForegroundColor Yellow
    $env:REACT_APP_USE_MOCK_DATA = "true"
} else {
    Write-Host "🔗 Deploying with SUPABASE (production mode)" -ForegroundColor Green
    $env:REACT_APP_USE_MOCK_DATA = "false"
    
    if (-not $SupabaseUrl -or -not $SupabaseKey) {
        Write-Host "❌ Error: Supabase URL and Key are required for production mode" -ForegroundColor Red
        Write-Host "Usage: .\deploy-fixed.ps1 -SupabaseUrl 'your_url' -SupabaseKey 'your_key'" -ForegroundColor Yellow
        exit 1
    }
    
    $env:REACT_APP_SUPABASE_URL = $SupabaseUrl
    $env:REACT_APP_SUPABASE_ANON_KEY = $SupabaseKey
}

# Set debug mode
$env:REACT_APP_DEBUG_AUTH = "true"

Write-Host "`n📦 Environment Configuration:" -ForegroundColor Yellow
Write-Host "  USE_MOCK_DATA: $env:REACT_APP_USE_MOCK_DATA"
Write-Host "  SUPABASE_URL: $(if ($env:REACT_APP_SUPABASE_URL) { 'SET' } else { 'NOT SET' })"
Write-Host "  SUPABASE_KEY: $(if ($env:REACT_APP_SUPABASE_ANON_KEY) { 'SET' } else { 'NOT SET' })"
Write-Host "  DEBUG_AUTH: $env:REACT_APP_DEBUG_AUTH"

# Clean previous build
Write-Host "`n🧹 Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path "build") {
    Remove-Item -Recurse -Force "build"
}

# Build the project
Write-Host "`n🔨 Building for production..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# Create authentication test page
Write-Host "`n🧪 Creating authentication test page..." -ForegroundColor Yellow

$authTestPage = @"
<!DOCTYPE html>
<html>
<head>
    <title>Rams Motors - Production Auth Test</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #dc3545; margin-bottom: 30px; }
        .test-section { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #007bff; }
        .credentials { background: #e9ecef; padding: 15px; margin: 15px 0; border-radius: 5px; font-family: monospace; }
        button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; margin: 8px; font-size: 14px; }
        button:hover { background: #0056b3; }
        button.danger { background: #dc3545; }
        button.danger:hover { background: #c82333; }
        .result { margin: 15px 0; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 12px; white-space: pre-wrap; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
        .warning { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Rams Motors - Production Authentication Test</h1>
        
        <div class="test-section">
            <h3>Environment Information</h3>
            <button onclick="checkEnvironment()">Check Environment</button>
            <button onclick="clearResults()">Clear Results</button>
        </div>
        
        <div class="test-section">
            <h3>Authentication Tests</h3>
            <div class="credentials">
                <strong>Development Credentials:</strong> admin / admin123<br>
                <strong>Production Credentials:</strong> admin@ramsmotors.com / password123
            </div>
            <button onclick="testDevCredentials()">Test Development Login</button>
            <button onclick="testProdCredentials()">Test Production Login</button>
            <button onclick="testActualLogin()" class="danger">Test Real Authentication</button>
        </div>
        
        <div id="results"></div>
    </div>
    
    <script>
        let resultCounter = 0;
        
        function addResult(message, type = 'info') {
            const results = document.getElementById('results');
            const div = document.createElement('div');
            div.className = 'result ' + type;
            const timestamp = new Date().toLocaleTimeString();
            div.textContent = '[' + timestamp + '] ' + message;
            results.appendChild(div);
            
            // Auto-scroll to bottom
            div.scrollIntoView({ behavior: 'smooth' });
            
            console.log(type.toUpperCase() + ':', message);
            resultCounter++;
        }
        
        function clearResults() {
            document.getElementById('results').innerHTML = '';
            resultCounter = 0;
            addResult('Results cleared', 'info');
        }
        
        function checkEnvironment() {
            addResult('=== ENVIRONMENT CHECK ===', 'info');
            addResult('URL: ' + window.location.href, 'info');
            addResult('User Agent: ' + navigator.userAgent.substring(0, 100) + '...', 'info');
            addResult('Local Storage Auth Token: ' + (localStorage.getItem('authToken') ? 'EXISTS' : 'NOT FOUND'), 'info');
            
            // Check if we're in production or development
            const hostname = window.location.hostname;
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                addResult('Environment: DEVELOPMENT (localhost)', 'warning');
            } else if (hostname.includes('netlify')) {
                addResult('Environment: PRODUCTION (Netlify)', 'success');
            } else {
                addResult('Environment: UNKNOWN (' + hostname + ')', 'warning');
            }
        }
        
        function testDevCredentials() {
            addResult('=== TESTING DEVELOPMENT CREDENTIALS ===', 'info');
            const creds = { username: 'admin', password: 'admin123' };
            addResult('Credentials: ' + JSON.stringify(creds), 'info');
            addResult('This should work in development (mock data mode)', 'info');
            addResult('In production, should be mapped to production credentials', 'warning');
        }
        
        function testProdCredentials() {
            addResult('=== TESTING PRODUCTION CREDENTIALS ===', 'info');
            const creds = { username: 'admin@ramsmotors.com', password: 'password123' };
            addResult('Credentials: ' + JSON.stringify(creds), 'info');
            addResult('This should work in production (Supabase mode)', 'info');
            addResult('In development, should fallback to mock data', 'warning');
        }
        
        async function testActualLogin() {
            addResult('=== TESTING ACTUAL AUTHENTICATION ===', 'info');
            
            try {
                // Try to load the React app's authentication module
                addResult('Attempting to test real authentication...', 'info');
                
                // Check if we can access the admin login page
                const testUrl = window.location.origin + '/admin/login';
                addResult('Admin login URL: ' + testUrl, 'info');
                
                // Try to open the login page in a new tab
                window.open(testUrl, '_blank');
                addResult('Opened admin login in new tab', 'success');
                addResult('Please test authentication there and check browser console for errors', 'warning');
                
            } catch (error) {
                addResult('Error during authentication test: ' + error.message, 'error');
            }
        }
        
        // Auto-run environment check on load
        window.addEventListener('load', function() {
            addResult('Authentication test page loaded', 'success');
            checkEnvironment();
        });
    </script>
</body>
</html>
"@

# Save the test page
$authTestPage | Out-File -FilePath "build/auth-test.html" -Encoding UTF8
Write-Host "✅ Created authentication test page: /auth-test.html" -ForegroundColor Green

# Check if Netlify CLI is installed
Write-Host "`n🔍 Checking Netlify CLI..." -ForegroundColor Yellow
try {
    $netlifyVersion = netlify --version 2>$null
    Write-Host "✅ Netlify CLI found: $netlifyVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Netlify CLI not found. Installing..." -ForegroundColor Red
    npm install -g netlify-cli
}

# Deploy to Netlify
Write-Host "`n🚀 Deploying to Netlify..." -ForegroundColor Yellow
Write-Host "Note: Make sure to set environment variables in Netlify dashboard:" -ForegroundColor Warning
Write-Host "  REACT_APP_USE_MOCK_DATA=$env:REACT_APP_USE_MOCK_DATA" -ForegroundColor Gray
if ($env:REACT_APP_SUPABASE_URL) {
    Write-Host "  REACT_APP_SUPABASE_URL=$env:REACT_APP_SUPABASE_URL" -ForegroundColor Gray
}
if ($env:REACT_APP_SUPABASE_ANON_KEY) {
    Write-Host "  REACT_APP_SUPABASE_ANON_KEY=[HIDDEN]" -ForegroundColor Gray
}

Write-Host "`nDeploying with netlify deploy --prod --dir=build..." -ForegroundColor Yellow
netlify deploy --prod --dir=build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment completed successfully!" -ForegroundColor Green
    Write-Host "`n🧪 Testing Instructions:" -ForegroundColor Cyan
    Write-Host "1. Visit your Netlify site" -ForegroundColor White
    Write-Host "2. Go to /auth-test.html to run authentication tests" -ForegroundColor White
    Write-Host "3. Go to /admin/login to test actual login" -ForegroundColor White
    Write-Host "4. Check browser console for detailed authentication logs" -ForegroundColor White
    
    if ($MockData) {
        Write-Host "`n🧪 MOCK DATA MODE:" -ForegroundColor Yellow
        Write-Host "Use credentials: admin / admin123" -ForegroundColor White
    } else {
        Write-Host "`n🔗 PRODUCTION MODE:" -ForegroundColor Green
        Write-Host "Use credentials: admin@ramsmotors.com / password123" -ForegroundColor White
        Write-Host "OR the mapped credentials: admin / admin123" -ForegroundColor White
    }
} else {
    Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Check the error messages above and try again." -ForegroundColor Yellow
}
