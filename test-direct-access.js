require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Test direct database access and transformation
async function testDirectAccess() {
  console.log('Testing direct database access...\n');
  
  try {
    // Get vehicles with images directly from database
    console.log('Fetching vehicles with images from database...');
    
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_images(*)
      `)
      .limit(5);
    
    if (vehiclesError) {
      console.error('Error fetching vehicles:', vehiclesError);
      return;
    }
    
    console.log(`\nFound ${vehicles.length} vehicles\n`);
    
    vehicles.forEach((vehicle, index) => {
      console.log(`Vehicle ${index + 1}:`);
      console.log(`  ID: ${vehicle.id}`);
      console.log(`  Make/Model: ${vehicle.make} ${vehicle.model}`);
      console.log(`  Year: ${vehicle.year}`);
      console.log(`  Raw vehicle_images: ${vehicle.vehicle_images ? vehicle.vehicle_images.length : 0} found`);
      
      if (vehicle.vehicle_images && vehicle.vehicle_images.length > 0) {
        vehicle.vehicle_images.forEach((img, imgIndex) => {
          console.log(`    Raw Image ${imgIndex + 1}:`);
          console.log(`      URL: ${img.url ? img.url.substring(0, 50) + '...' : 'MISSING'}`);
          console.log(`      Is Primary: ${img.is_primary}`);
          console.log(`      Sort Order: ${img.sort_order}`);
          console.log(`      Alt Text: ${img.alt_text || 'N/A'}`);
        });
      } else {
        console.log('    ❌ NO IMAGES FOUND in vehicle_images');
      }
      console.log('');
    });
    
    // Test transformation manually
    console.log('\n=== MANUAL TRANSFORMATION TEST ===\n');
    
    const testVehicle = vehicles.find(v => v.vehicle_images && v.vehicle_images.length > 0);
    if (testVehicle) {
      console.log('Testing transformation on vehicle with images...');
      
      // Manual transformation like the service should do
      const transformedVehicle = {
        ...testVehicle,
        images: testVehicle.vehicle_images?.map(img => ({
          id: img.id,
          url: img.url,
          isPrimary: img.is_primary,
          altText: img.alt_text,
          displayOrder: img.sort_order,
          publicId: img.public_id,
          createdAt: img.created_at
        })) || []
      };
      
      delete transformedVehicle.vehicle_images;
      
      console.log('✅ Transformed vehicle:');
      console.log(`   Vehicle: ${transformedVehicle.make} ${transformedVehicle.model}`);
      console.log(`   Images: ${transformedVehicle.images.length}`);
      if (transformedVehicle.images.length > 0) {
        console.log(`   First image URL: ${transformedVehicle.images[0].url}`);
        console.log(`   First image isPrimary: ${transformedVehicle.images[0].isPrimary}`);
        console.log(`   First image displayOrder: ${transformedVehicle.images[0].displayOrder}`);
      }
    }
    
  } catch (error) {
    console.error('Error in direct access test:', error);
  }
}

testDirectAccess();
