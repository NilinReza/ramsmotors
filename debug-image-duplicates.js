// Debug script to check for duplicate images and test current transformation
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function debugImageDuplicates() {
  try {
    console.log('🔍 Debugging Image Duplicates and Display Issues\n');
    
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check for duplicate images
    console.log('1️⃣ Checking for duplicate images in database...');
    const { data: allImages } = await supabase
      .from('vehicle_images')
      .select('*')
      .order('vehicle_id, sort_order');
    
    if (allImages) {
      console.log(`📊 Total images in database: ${allImages.length}`);
      
      // Group by vehicle_id to see distribution
      const imagesByVehicle = {};
      allImages.forEach(img => {
        if (!imagesByVehicle[img.vehicle_id]) {
          imagesByVehicle[img.vehicle_id] = [];
        }
        imagesByVehicle[img.vehicle_id].push(img);
      });
      
      console.log('📈 Images per vehicle:');
      Object.entries(imagesByVehicle).forEach(([vehicleId, images]) => {
        console.log(`  Vehicle ${vehicleId.substring(0, 8)}...: ${images.length} images`);
        if (images.length > 1) {
          console.log('    ⚠️ Multiple images detected:');
          images.forEach((img, idx) => {
            console.log(`      ${idx + 1}. ID: ${img.id.substring(0, 8)}..., URL: ${img.url.substring(0, 50)}...`);
          });
        }
      });
      
      // Check for identical URLs
      const urlCounts = {};
      allImages.forEach(img => {
        urlCounts[img.url] = (urlCounts[img.url] || 0) + 1;
      });
      
      const duplicateUrls = Object.entries(urlCounts).filter(([url, count]) => count > 1);
      if (duplicateUrls.length > 0) {
        console.log('\n🚨 DUPLICATE URLs found:');
        duplicateUrls.forEach(([url, count]) => {
          console.log(`  ${url}: ${count} times`);
        });
      } else {
        console.log('\n✅ No duplicate URLs found');
      }
    }
    
    // Test the actual service transformation
    console.log('\n2️⃣ Testing actual SupabaseVehicleService...');
    
    // Mock import the service (since we can't import ES modules directly)
    const fs = require('fs');
    const serviceCode = fs.readFileSync('./src/services/supabaseVehicleService.js', 'utf8');
    
    // Create a test to simulate the service call
    const { data: testVehicles } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_images (*),
        vehicle_videos (*)
      `)
      .limit(2);
    
    if (testVehicles && testVehicles.length > 0) {
      console.log(`📡 Retrieved ${testVehicles.length} vehicles for testing`);
      
      testVehicles.forEach((vehicle, idx) => {
        console.log(`\n🚗 Vehicle ${idx + 1}:`);
        console.log(`  ID: ${vehicle.id}`);
        console.log(`  Make/Model: ${vehicle.make} ${vehicle.model}`);
        console.log(`  Raw vehicle_images count: ${vehicle.vehicle_images?.length || 0}`);
        
        if (vehicle.vehicle_images && vehicle.vehicle_images.length > 0) {
          console.log('  Raw images:');
          vehicle.vehicle_images.forEach((img, imgIdx) => {
            console.log(`    ${imgIdx + 1}. ${img.url.substring(0, 60)}...`);
          });
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugImageDuplicates();
