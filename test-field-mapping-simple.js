// Quick test for field mapping fix
// Tests the actual service layer to verify color field mapping works

import 'dotenv/config';
import { SupabaseVehicleService } from './src/services/supabaseVehicleService.js';

console.log('🧪 Field Mapping Test - Color Field Fix');
console.log('======================================');

async function testFieldMapping() {
  const vehicleService = new SupabaseVehicleService();
  
  console.log('\n🔧 Testing field transformations...');
  
  // Test frontend data with 'color' field (as used in forms)
  const frontendData = {
    make: 'Toyota',
    model: 'Test Car',
    year: 2023,
    price: 25000,
    mileage: 1000,
    transmission: 'Automatic',
    bodyStyle: 'Sedan',     // inventory page format
    fuelType: 'Gasoline',
    color: 'Blue',          // single color field (problem field)
    isAvailable: true,
    description: 'Test vehicle for field mapping'
  };
  
  console.log('📝 Original frontend data:', frontendData);
  
  // Transform to database format
  const dbData = vehicleService.transformToDatabase(frontendData);
  console.log('🗄️  Transformed to database format:', dbData);
  
  // Verify the mapping worked
  if (dbData.exterior_color && dbData.exterior_color === 'Blue') {
    console.log('✅ SUCCESS: color → exterior_color mapping works!');
  } else {
    console.log('❌ FAILED: color field not mapped correctly');
    console.log('Expected: exterior_color = "Blue"');
    console.log('Got:', { exterior_color: dbData.exterior_color, color: dbData.color });
    return false;
  }
  
  if (dbData.body_style && dbData.body_style === 'Sedan') {
    console.log('✅ SUCCESS: bodyStyle → body_style mapping works!');
  } else {
    console.log('❌ FAILED: bodyStyle field not mapped correctly');
    return false;
  }
  
  // Transform back from database format
  const frontendBack = vehicleService.transformFromDatabase(dbData);
  console.log('🔄 Transformed back to frontend format:', frontendBack);
  
  // Check backward compatibility
  if (frontendBack.color && frontendBack.color === 'Blue') {
    console.log('✅ SUCCESS: Backward compatibility - color field restored!');
  } else {
    console.log('❌ FAILED: Backward compatibility broken for color field');
    return false;
  }
  
  if (frontendBack.bodyStyle && frontendBack.bodyStyle === 'Sedan') {
    console.log('✅ SUCCESS: Backward compatibility - bodyStyle field restored!');
  } else {
    console.log('❌ FAILED: Backward compatibility broken for bodyStyle field');
    return false;
  }
  
  console.log('\n🎯 All field mapping tests passed!');
  return true;
}

async function testRealVehicleCreation() {
  console.log('\n🚗 Testing real vehicle creation...');
  
  const vehicleService = new SupabaseVehicleService();
  
  const testVehicle = {
    make: 'Test',
    model: 'Field Mapping',
    year: 2024,
    price: 1000,
    mileage: 1,
    transmission: 'Manual',
    bodyStyle: 'Hatchback',  // inventory page format
    fuelType: 'Electric',
    color: 'Red',           // single color field
    isAvailable: true,
    description: 'Test vehicle for field mapping verification'
  };
  
  try {
    console.log('📝 Creating vehicle with data:', testVehicle);
    const result = await vehicleService.addVehicle(testVehicle);
    
    if (result.success) {
      console.log('✅ SUCCESS: Vehicle created successfully!');
      console.log('🆔 Created vehicle ID:', result.vehicle.id);
      
      // Clean up - delete the test vehicle
      console.log('🧹 Cleaning up test vehicle...');
      await vehicleService.deleteVehicle(result.vehicle.id);
      console.log('✅ Test vehicle deleted');
      
      return true;
    } else {
      console.log('❌ FAILED: Vehicle creation failed');
      console.log('Error:', result.error);
      return false;
    }
    
  } catch (error) {
    console.log('❌ FAILED: Exception during vehicle creation');
    console.log('Error:', error.message);
    if (error.message.includes('color')) {
      console.log('🔍 This looks like the color field mapping issue!');
    }
    return false;
  }
}

async function runTests() {
  console.log('Starting comprehensive field mapping tests...\n');
  
  // Test 1: Field transformations
  const mappingTest = await testFieldMapping();
  
  // Test 2: Real database operations
  const creationTest = await testRealVehicleCreation();
  
  console.log('\n📊 Test Results:');
  console.log('================');
  console.log(`Field Mapping: ${mappingTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Vehicle Creation: ${creationTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (mappingTest && creationTest) {
    console.log('\n🎉 All tests passed! Field mapping fix is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Field mapping needs more work.');
  }
}

runTests().catch(console.error);
