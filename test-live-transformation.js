const { createClient } = require('@supabase/supabase-js');
const { getAllVehicles } = require('./src/services/supabaseVehicleService.js');

// Test the live transformation in the application
async function testLiveTransformation() {
  console.log('Testing live vehicle data transformation...\n');
  
  try {
    // Get vehicles using the service
    console.log('Fetching vehicles using getAllVehicles service...');
    const vehicles = await getAllVehicles();
    
    console.log(`\nFound ${vehicles.length} vehicles\n`);
    
    // Test each vehicle
    vehicles.forEach((vehicle, index) => {
      console.log(`Vehicle ${index + 1}:`);
      console.log(`  ID: ${vehicle.id}`);
      console.log(`  Make/Model: ${vehicle.make} ${vehicle.model}`);
      console.log(`  Year: ${vehicle.year}`);
      console.log(`  Price: $${vehicle.price}`);
      console.log(`  Images: ${vehicle.images ? vehicle.images.length : 0} found`);
      
      if (vehicle.images && vehicle.images.length > 0) {
        vehicle.images.forEach((img, imgIndex) => {
          console.log(`    Image ${imgIndex + 1}:`);
          console.log(`      URL: ${img.url ? img.url.substring(0, 50) + '...' : 'MISSING'}`);
          console.log(`      Is Primary: ${img.isPrimary}`);
          console.log(`      Display Order: ${img.displayOrder}`);
          console.log(`      Alt Text: ${img.altText || 'N/A'}`);
        });
      } else {
        console.log('    ❌ NO IMAGES FOUND');
      }
      
      console.log(`  Videos: ${vehicle.videos ? vehicle.videos.length : 0} found`);
      console.log('');
    });
    
    // Test specific scenarios
    console.log('\n=== TESTING SPECIFIC SCENARIOS ===\n');
    
    // Find vehicle with images
    const vehicleWithImages = vehicles.find(v => v.images && v.images.length > 0);
    if (vehicleWithImages) {
      console.log('✅ Found vehicle with images:');
      console.log(`   Vehicle: ${vehicleWithImages.make} ${vehicleWithImages.model}`);
      console.log(`   Images: ${vehicleWithImages.images.length}`);
      console.log(`   First image URL: ${vehicleWithImages.images[0].url}`);
      
      // Test the URL format expected by components
      const expectedUrl = vehicleWithImages.images[0].url;
      if (expectedUrl && expectedUrl.includes('supabase')) {
        console.log('✅ Image URL format looks correct for Supabase');
      } else {
        console.log('❌ Image URL format may be incorrect');
      }
    } else {
      console.log('❌ No vehicles with images found');
    }
    
    // Check for the vehicle that had 5 images
    const vehicleWithMultipleImages = vehicles.find(v => v.images && v.images.length > 1);
    if (vehicleWithMultipleImages) {
      console.log(`\n⚠️  Found vehicle with ${vehicleWithMultipleImages.images.length} images:`);
      console.log(`   Vehicle: ${vehicleWithMultipleImages.make} ${vehicleWithMultipleImages.model}`);
      vehicleWithMultipleImages.images.forEach((img, i) => {
        console.log(`   Image ${i + 1}: ...${img.url ? img.url.substring(img.url.length - 30) : 'MISSING'}`);
      });
    }
    
  } catch (error) {
    console.error('Error testing live transformation:', error);
    console.error('Stack trace:', error.stack);
  }
}

testLiveTransformation();
