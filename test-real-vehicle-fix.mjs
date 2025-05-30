// Test real vehicle creation with the fixed field mapping
import 'dotenv/config';

// Mock React environment for Supabase
global.window = {};
global.document = {};

async function testVehicleCreation() {
  console.log('🚗 Testing Real Vehicle Creation with Fixed Field Mapping');
  console.log('=======================================================');
  
  try {
    // Dynamically import the service
    const { default: supabaseVehicleService } = await import('./src/services/supabaseVehicleService.js');
    
    const testVehicle = {
      make: 'TEST',
      model: 'Field Mapping Fixed',
      year: 2024,
      price: 99999,
      mileage: 1,
      transmission: 'Manual',
      bodyStyle: 'Hatchback',  // inventory page format  
      fuelType: 'Electric',
      color: 'Purple',         // single color field that was causing issues
      isAvailable: true,
      description: 'Test vehicle to verify color field mapping fix'
    };
    
    console.log('📝 Creating vehicle with data:', testVehicle);
    console.log('🔍 Note: color field should map to exterior_color in database');
    
    const result = await supabaseVehicleService.createVehicle(testVehicle);
    
    if (result.success) {
      console.log('✅ SUCCESS: Vehicle created successfully!');
      console.log('🆔 Created vehicle ID:', result.data.id);
      console.log('🎨 Color field in response:', result.data.color);
      console.log('🎨 Exterior color in response:', result.data.exteriorColor);
      
      // Clean up - delete the test vehicle
      console.log('🧹 Cleaning up test vehicle...');
      const deleteResult = await supabaseVehicleService.deleteVehicle(result.data.id);
      
      if (deleteResult.success) {
        console.log('✅ Test vehicle deleted successfully');
      } else {
        console.log('⚠️  Warning: Failed to delete test vehicle:', deleteResult.error);
      }
      
      console.log('\n🎉 Field mapping fix verified! The color field issue is resolved.');
      return true;
      
    } else {
      console.log('❌ FAILED: Vehicle creation failed');
      console.log('Error:', result.error);
      
      if (result.error.includes('color')) {
        console.log('🔍 Still seeing color field errors - the fix may not be complete');
      }
      return false;
    }
    
  } catch (error) {
    console.log('❌ FAILED: Exception during test');
    console.log('Error:', error.message);
    
    if (error.message.includes('color')) {
      console.log('🔍 Color field error detected in exception');
    }
    return false;
  }
}

testVehicleCreation()
  .then(success => {
    console.log(success ? '\n✅ Test completed successfully!' : '\n❌ Test failed!');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n💥 Test crashed:', error);
    process.exit(1);
  });
