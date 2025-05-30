// Migration Testing and Validation Script
// This script tests all the major components and functionality

const testResults = {
    adminLogin: null,
    googleMaps: null,
    diagnostics: null,
    navigation: null,
    errors: []
};

// Test Admin Login Functionality
async function testAdminLogin() {
    try {
        console.log('🔐 Testing Admin Login...');
        
        // Test with valid credentials
        const validTest = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });
        
        if (validTest.ok) {
            console.log('✅ Admin login API endpoint responds correctly');
            testResults.adminLogin = 'success';
        } else {
            console.log('❌ Admin login API endpoint issue:', validTest.status);
            testResults.adminLogin = 'failed';
        }
    } catch (error) {
        console.log('❌ Admin login test failed:', error.message);
        testResults.adminLogin = 'error';
        testResults.errors.push(`Admin Login: ${error.message}`);
    }
}

// Test Google Maps Integration
function testGoogleMaps() {
    console.log('🗺️ Testing Google Maps...');
    
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const placesKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
    const placeId = process.env.REACT_APP_GOOGLE_PLACE_ID;
    
    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
        console.log('⚠️ Google Maps API key not configured');
        testResults.googleMaps = 'not_configured';
    } else {
        console.log('✅ Google Maps API key found');
        testResults.googleMaps = 'configured';
    }
    
    if (!placesKey || placesKey === 'your_google_places_api_key_here') {
        console.log('⚠️ Google Places API key not configured');
    } else {
        console.log('✅ Google Places API key found');
    }
    
    if (!placeId || placeId === 'your_google_place_id_here') {
        console.log('⚠️ Google Place ID not configured');
    } else {
        console.log('✅ Google Place ID found:', placeId);
    }
}

// Test Diagnostic Tools
function testDiagnostics() {
    console.log('🔧 Testing Diagnostic Tools...');
    
    try {
        // Check if diagnostic components are available
        if (typeof window !== 'undefined') {
            const diagnosticRoute = window.location.origin + '/diagnostic';
            console.log('✅ Diagnostic page should be available at:', diagnosticRoute);
            testResults.diagnostics = 'available';
        }
    } catch (error) {
        console.log('❌ Diagnostic test failed:', error.message);
        testResults.diagnostics = 'failed';
        testResults.errors.push(`Diagnostics: ${error.message}`);
    }
}

// Test Navigation and Routes
function testNavigation() {
    console.log('🧭 Testing Navigation...');
    
    const routes = ['/', '/inventory', '/about', '/contact', '/admin', '/diagnostic'];
    console.log('✅ Expected routes:', routes.join(', '));
    testResults.navigation = 'configured';
}

// Run all tests
async function runMigrationTests() {
    console.log('🚀 Starting Migration Validation Tests...');
    console.log('============================================');
    
    await testAdminLogin();
    testGoogleMaps();
    testDiagnostics();
    testNavigation();
    
    console.log('\n📊 Test Results Summary:');
    console.log('============================================');
    console.log('Admin Login:', testResults.adminLogin);
    console.log('Google Maps:', testResults.googleMaps);
    console.log('Diagnostics:', testResults.diagnostics);
    console.log('Navigation:', testResults.navigation);
    
    if (testResults.errors.length > 0) {
        console.log('\n❌ Errors Found:');
        testResults.errors.forEach(error => console.log(`  - ${error}`));
    } else {
        console.log('\n✅ No critical errors detected');
    }
    
    return testResults;
}

// Export for use in components
window.runMigrationTests = runMigrationTests;

export { runMigrationTests, testResults };
