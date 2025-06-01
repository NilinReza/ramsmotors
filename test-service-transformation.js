require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Test the service transformation by calling getVehicles method directly
async function testServiceTransformation() {
  console.log('Testing Supabase vehicle service transformation...\n');
  
  try {
    // Simulate the service's getVehicles method
    console.log('🔍 Fetching vehicles with images from database...');
    
    let query = supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_images (*),
        vehicle_videos (*)
      `)
      .eq('dealer_id', 'ramsmotors')
      .order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Database query error:', error);
      return;
    }

    console.log(`\nFound ${data.length} vehicles in database\n`);
    
    // Apply the same transformation that the service uses
    const transformFromDatabase = (vehicleData) => {
      if (!vehicleData) return null;
      
      const transformed = { ...vehicleData };
      
      // Field mapping (simplified version from service)
      const fieldMappings = {
        body_style: 'bodyType',
        fuel_type: 'fuelType', 
        exterior_color: 'exteriorColor',
        interior_color: 'interiorColor',
        is_available: 'isAvailable',
        is_featured: 'isFeatured',
        view_count: 'viewCount',
        created_at: 'createdAt',
        updated_at: 'updatedAt',
        dealer_id: 'dealerId'
      };
      
      Object.entries(fieldMappings).forEach(([dbField, frontendField]) => {
        if (dbField in transformed) {
          transformed[frontendField] = transformed[dbField];
          delete transformed[dbField];
        }
      });
      
      // Convert is_available to status
      if ('isAvailable' in transformed) {
        transformed.status = transformed.isAvailable ? 'Available' : 'Sold';
      }
      
      // Transform vehicle_images to images array
      if (transformed.vehicle_images && Array.isArray(transformed.vehicle_images)) {
        transformed.images = transformed.vehicle_images.map(img => ({
          id: img.id,
          url: img.url,
          publicId: img.public_id,
          displayOrder: img.sort_order || 0,
          isPrimary: img.is_primary,
          altText: img.alt_text,
          createdAt: img.created_at
        }));
        delete transformed.vehicle_images;
      }
      
      // Transform vehicle_videos to videos array  
      if (transformed.vehicle_videos && Array.isArray(transformed.vehicle_videos)) {
        transformed.videos = transformed.vehicle_videos.map(video => ({
          id: video.id,
          url: video.url,
          publicId: video.public_id,
          displayOrder: video.sort_order || 0,
          createdAt: video.created_at
        }));
        delete transformed.vehicle_videos;
      }
      
      return transformed;
    };
    
    // Transform each vehicle
    const transformedVehicles = data.map(vehicle => transformFromDatabase(vehicle));
    
    console.log('=== TRANSFORMATION RESULTS ===\n');
    
    transformedVehicles.forEach((vehicle, index) => {
      console.log(`Vehicle ${index + 1}:`);
      console.log(`  ID: ${vehicle.id}`);
      console.log(`  Make/Model: ${vehicle.make} ${vehicle.model}`);
      console.log(`  Year: ${vehicle.year}`);
      console.log(`  Price: $${vehicle.price}`);
      console.log(`  Status: ${vehicle.status}`);
      console.log(`  Images: ${vehicle.images ? vehicle.images.length : 0}`);
      
      if (vehicle.images && vehicle.images.length > 0) {
        vehicle.images.forEach((img, imgIndex) => {
          console.log(`    Image ${imgIndex + 1}:`);
          console.log(`      URL: ${img.url ? img.url.substring(0, 60) + '...' : 'MISSING'}`);
          console.log(`      Is Primary: ${img.isPrimary}`);
          console.log(`      Display Order: ${img.displayOrder}`);
        });
      } else {
        console.log('    ❌ NO IMAGES');
      }
      
      console.log(`  Videos: ${vehicle.videos ? vehicle.videos.length : 0}`);
      console.log('');
    });
    
    // Test UI expectations
    console.log('\n=== UI COMPATIBILITY TEST ===\n');
    
    const vehicleWithImages = transformedVehicles.find(v => v.images && v.images.length > 0);
    if (vehicleWithImages) {
      console.log('✅ Found vehicle with images for UI test:');
      console.log(`   Vehicle: ${vehicleWithImages.make} ${vehicleWithImages.model}`);
      console.log(`   Images count: ${vehicleWithImages.images.length}`);
      
      // Test the access pattern used by VehicleList (vehicle.images[0].url)
      const firstImageUrl = vehicleWithImages.images[0].url;
      console.log(`   First image URL: ${firstImageUrl}`);
      
      if (firstImageUrl && firstImageUrl.includes('cloudinary')) {
        console.log('✅ Image URL format is correct for UI components');
      } else {
        console.log('❌ Image URL format may be incorrect');
      }
      
      // Test the access pattern used by VehicleDetail (vehicle.images[currentImageIndex].url)
      vehicleWithImages.images.forEach((img, index) => {
        console.log(`   Image ${index}: ${img.url ? 'VALID' : 'MISSING'} URL`);
      });
      
    } else {
      console.log('❌ No vehicles with images found for UI test');
    }
    
  } catch (error) {
    console.error('Error in service transformation test:', error);
  }
}

testServiceTransformation();
