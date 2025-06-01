// Debug script to identify and fix the admin edit vehicle issue
console.log('🔍 Debugging Admin Edit Vehicle Issue');

// Test 1: Check which API service is being used
console.log('\n📋 Test 1: API Service Configuration');
console.log('----------------------------------');

const fs = require('fs');
const path = require('path');

try {
  const apiServicePath = path.join(__dirname, 'src', 'services', 'api.js');
  const apiContent = fs.readFileSync(apiServicePath, 'utf8');
  
  // Extract USE_MOCK_DATA configuration
  const mockDataMatch = apiContent.match(/const USE_MOCK_DATA = ([^;]+);/);
  if (mockDataMatch) {
    console.log('✅ USE_MOCK_DATA configuration found:', mockDataMatch[1]);
  }
  
  // Check environment variables that might affect it
  console.log('🔧 Environment check:');
  console.log('   - REACT_APP_USE_MOCK_DATA:', process.env.REACT_APP_USE_MOCK_DATA);
  console.log('   - REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL ? 'SET' : 'NOT_SET');
  
} catch (error) {
  console.log('❌ Error reading API service:', error.message);
}

// Test 2: Check VehicleForm field mapping issue
console.log('\n📋 Test 2: VehicleForm Field Mapping');
console.log('------------------------------------');

try {
  const vehicleFormPath = path.join(__dirname, 'src', 'admin', 'components', 'VehicleForm.jsx');
  const formContent = fs.readFileSync(vehicleFormPath, 'utf8');
  
  // Check if the fix was applied
  const hasProperMapping = formContent.includes('color: vehicle.color || vehicle.exteriorColor || \'\'');
  const hasVehicleHandling = formContent.includes('if (vehicle) {');
  const hasFieldMapping = formContent.includes('mappedVehicle');
  
  console.log('✅ VehicleForm field mapping checks:');
  console.log(`   - Proper color field handling: ${hasProperMapping ? '✅' : '❌'}`);
  console.log(`   - Vehicle prop handling: ${hasVehicleHandling ? '✅' : '❌'}`);
  console.log(`   - Field mapping logic: ${hasFieldMapping ? '✅' : '❌'}`);
  
} catch (error) {
  console.log('❌ Error checking VehicleForm:', error.message);
}

// Test 3: Check admin service vehicle retrieval
console.log('\n📋 Test 3: Admin Vehicle Service');
console.log('--------------------------------');

try {
  const adminServicePath = path.join(__dirname, 'src', 'admin', 'services', 'vehicleService.js');
  const adminContent = fs.readFileSync(adminServicePath, 'utf8');
  
  // Check getVehicle method
  const getVehicleMatch = adminContent.match(/async getVehicle\(id\)[^{]*\{[^}]*\}/);
  if (getVehicleMatch) {
    const getVehicleCode = getVehicleMatch[0];
    
    const callsSupabase = getVehicleCode.includes('supabaseVehicleService.getVehicle');
    const returnsData = getVehicleCode.includes('result.data');
    const hasErrorHandling = getVehicleCode.includes('catch');
    
    console.log('✅ Admin service getVehicle method:');
    console.log(`   - Calls Supabase service: ${callsSupabase ? '✅' : '❌'}`);
    console.log(`   - Returns data properly: ${returnsData ? '✅' : '❌'}`);
    console.log(`   - Has error handling: ${hasErrorHandling ? '✅' : '❌'}`);
  }
  
} catch (error) {
  console.log('❌ Error checking admin service:', error.message);
}

// Test 4: Check if Supabase transformation is working
console.log('\n📋 Test 4: Supabase Data Transformation');
console.log('--------------------------------------');

try {
  const supabaseServicePath = path.join(__dirname, 'src', 'services', 'supabaseVehicleService.js');
  const supabaseContent = fs.readFileSync(supabaseServicePath, 'utf8');
  
  // Check transformFromDatabase method
  const transformMatch = supabaseContent.match(/transformFromDatabase\(vehicleData\)[^{]*\{[\s\S]*?return transformed;/);
  if (transformMatch) {
    const transformCode = transformMatch[0];
    
    const hasColorCompatibility = transformCode.includes('transformed.color = transformed.exteriorColor');
    const hasFieldMappings = transformCode.includes('FIELD_MAPPINGS.fromDatabase');
    const hasStatusConversion = transformCode.includes('transformed.status');
    
    console.log('✅ Supabase transformation method:');
    console.log(`   - Color field compatibility: ${hasColorCompatibility ? '✅' : '❌'}`);
    console.log(`   - Field mappings applied: ${hasFieldMappings ? '✅' : '❌'}`);
    console.log(`   - Status conversion: ${hasStatusConversion ? '✅' : '❌'}`);
  }
  
} catch (error) {
  console.log('❌ Error checking Supabase service:', error.message);
}

// Recommendations
console.log('\n🔧 DEBUGGING RECOMMENDATIONS');
console.log('============================');

console.log('1. 🎯 Check Browser Console for Errors:');
console.log('   - Open DevTools → Console');
console.log('   - Look for API call errors');
console.log('   - Check for vehicle data structure');

console.log('\n2. 🔍 Check Network Tab:');
console.log('   - Monitor API calls when clicking edit');
console.log('   - Look for failed requests');
console.log('   - Check response data structure');

console.log('\n3. ⚙️ Verify API Mode:');
console.log('   - Check if using mock data or Supabase');
console.log('   - Look for "🧪 TESTING MODE" or "🔗 PRODUCTION MODE" in console');

console.log('\n4. 📋 Test Field Mapping:');
console.log('   - Add console.log in VehicleForm useEffect');
console.log('   - Log the vehicle prop received');
console.log('   - Log the mapped form data');

console.log('\n📊 Run this in browser console to check vehicle data:');
console.log('   apiService.getVehicle("1").then(result => console.log("Vehicle data:", result))');
