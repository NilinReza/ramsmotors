// Comprehensive Supabase Vehicle Service Test
import supabaseVehicleService from './src/services/supabaseVehicleService.js';

console.log('🚗 Starting Comprehensive Vehicle Service Test...');

async function runTests() {
  try {
    // Test 1: Get All Vehicles
    console.log('\n📋 Test 1: Getting all vehicles...');
    const vehiclesResult = await supabaseVehicleService.getVehicles();
    console.log(`✅ Found ${vehiclesResult.data?.length || 0} vehicles`);
    
    if (vehiclesResult.data && vehiclesResult.data.length > 0) {
      const firstVehicle = vehiclesResult.data[0];
      console.log(`   Sample: ${firstVehicle.year} ${firstVehicle.make} ${firstVehicle.model}`);
      
      // Test 2: Get Single Vehicle
      console.log('\n🔍 Test 2: Getting single vehicle...');
      const singleResult = await supabaseVehicleService.getVehicle(firstVehicle.id);
      console.log(`✅ Retrieved vehicle: ${singleResult.data?.make} ${singleResult.data?.model}`);
    }
    
    // Test 3: Get Vehicle Stats
    console.log('\n📊 Test 3: Getting vehicle statistics...');
    const statsResult = await supabaseVehicleService.getVehicleStats();
    console.log('✅ Vehicle stats:', {
      total: statsResult.total,
      available: statsResult.available,
      sold: statsResult.sold,
      pending: statsResult.pending
    });
    
    // Test 4: Search/Filter Vehicles
    console.log('\n🔎 Test 4: Testing vehicle filters...');
    const filteredResult = await supabaseVehicleService.getVehicles({
      make: 'Honda',
      isAvailable: true
    });
    console.log(`✅ Honda vehicles available: ${filteredResult.data?.length || 0}`);
    
    // Test 5: Demo Vehicle Initialization (should not add duplicates)
    console.log('\n🎬 Test 5: Testing demo vehicle initialization...');
    const initResult = await supabaseVehicleService.initializeDemoVehicles();
    console.log(`✅ Demo initialization result: ${initResult.message}`);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

runTests();
