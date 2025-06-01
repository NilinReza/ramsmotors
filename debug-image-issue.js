// Debug Image Display Issue
// This script will help us identify the root cause of image display problems

console.log('🔍 Debugging Image Display Issue...');

// Test the current API configuration
import apiService from './src/services/api.js';

async function debugImageIssue() {
  try {
    console.log('📋 Checking API configuration...');
    
    // Get vehicles from the API
    const vehiclesResponse = await apiService.getVehicles();
    console.log('🚗 API Response:', vehiclesResponse);
    
    if (vehiclesResponse && vehiclesResponse.data) {
      const vehicles = vehiclesResponse.data;
      console.log(`📊 Found ${vehicles.length} vehicles`);
      
      // Check the structure of the first few vehicles
      vehicles.slice(0, 3).forEach((vehicle, index) => {
        console.log(`\n🔍 Vehicle ${index + 1} (${vehicle.make} ${vehicle.model}):`);
        console.log('   ID:', vehicle.id);
        console.log('   Images property:', vehicle.images);
        console.log('   Images type:', typeof vehicle.images);
        console.log('   Images length:', vehicle.images?.length || 'undefined');
        
        if (vehicle.images && vehicle.images.length > 0) {
          console.log('   First image structure:', vehicle.images[0]);
          console.log('   First image URL:', vehicle.images[0]?.url);
          console.log('   First image publicId:', vehicle.images[0]?.publicId);
        } else {
          console.log('   ❌ No images found');
        }
      });
      
      // Check if we're using mock or real data
      console.log('\n🔧 API Service Details:');
      console.log('   Using mock data:', process.env.USE_MOCK_DATA !== 'false');
      
    } else {
      console.log('❌ No vehicle data returned from API');
    }
    
  } catch (error) {
    console.error('❌ Error debugging image issue:', error);
  }
}

// Run the debug
debugImageIssue();
