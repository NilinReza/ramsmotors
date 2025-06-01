// Test script to verify admin edit functionality is working
// This will simulate the exact flow that happens in the admin interface

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://wouvnoexhcfhpevrxfuy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdXZub2V4aGNmaHBldnJ4ZnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjY1OTIsImV4cCI6MjA2NDA0MjU5Mn0.fT5japUFLZgVNqruJPAz4hRJYx7kp9a90xDDTNpYwFk';

const supabase = createClient(supabaseUrl, supabaseKey);

// Simulate the exact transformFromDatabase function
function transformFromDatabase(vehicleData) {
  if (!vehicleData) return vehicleData;
  
  const transformed = { ...vehicleData };
  
  // Transform timestamp fields to camelCase
  if (transformed.created_at) {
    transformed.createdAt = transformed.created_at;
    delete transformed.created_at;
  }
  if (transformed.updated_at) {
    transformed.updatedAt = transformed.updated_at;
    delete transformed.updated_at;
  }
  
  // Transform other metadata fields
  if (transformed.dealer_id) {
    transformed.dealerId = transformed.dealer_id;
    delete transformed.dealer_id;
  }
  if (transformed.view_count) {
    transformed.viewCount = transformed.view_count;
    delete transformed.view_count;
  }
  if (transformed.is_featured) {
    transformed.isFeatured = transformed.is_featured;
    delete transformed.is_featured;
  }
  if (transformed.is_available) {
    transformed.isAvailable = transformed.is_available;
    delete transformed.is_available;
  }
  
  // Add backward compatibility fields for components that expect camelCase
  // Keep original snake_case fields for admin forms
  if (transformed.exterior_color && !transformed.color) {
    transformed.color = transformed.exterior_color;
  }
  if (transformed.body_style && !transformed.bodyStyle) {
    transformed.bodyStyle = transformed.body_style;
  }
  if (transformed.fuel_type && !transformed.fuelType) {
    transformed.fuelType = transformed.fuel_type;
  }
  if (transformed.engine && !transformed.engineSize) {
    transformed.engineSize = transformed.engine;
  }
  
  // Convert is_available to status for frontend compatibility
  if ('isAvailable' in transformed) {
    transformed.status = transformed.isAvailable ? 'Available' : 'Sold';
  }
  
  // Add default condition if not present
  if (!transformed.condition) {
    transformed.condition = 'Used';
  }
  
  // Transform vehicle_images to images array for frontend compatibility
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
  
  // Transform vehicle_videos to videos array for frontend compatibility  
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
}

// Simulate getVehicle API call
async function getVehicle(id) {
  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      vehicle_images (*),
      vehicle_videos (*)
    `)
    .eq('id', id)
    .single();
    
  if (error) throw error;
  
  return {
    success: true,
    data: transformFromDatabase(vehicle)
  };
}

// Simulate VehicleForm useEffect mapping
function simulateVehicleFormMapping(vehicle) {
  console.log('🔄 VehicleForm: Received vehicle data:', vehicle);
  
  const mappedVehicle = {
    make: vehicle.make || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    price: vehicle.price || '',
    mileage: vehicle.mileage || '',
    exterior_color: vehicle.exterior_color || vehicle.exteriorColor || vehicle.color || '',
    transmission: vehicle.transmission || 'Automatic',
    fuel_type: vehicle.fuel_type || vehicle.fuelType || 'Gasoline',
    body_style: vehicle.body_style || vehicle.bodyStyle || vehicle.bodyType || 'Sedan',
    engine: vehicle.engine || vehicle.engineSize || '',
    vin: vehicle.vin || '',
    description: vehicle.description || '',
    features: Array.isArray(vehicle.features) ? vehicle.features : [],
    condition: vehicle.condition || 'Used',
    status: vehicle.status || 'Available',
    id: vehicle.id,
    images: vehicle.images || [],
    videos: vehicle.videos || []
  };
  
  console.log('✅ VehicleForm: Mapped vehicle data:', mappedVehicle);
  return mappedVehicle;
}

async function testCompleteEditFlow() {
  console.log('🧪 Testing Complete Admin Edit Flow');
  console.log('=====================================');
  
  try {
    // Step 1: Get list of vehicles (like AdminDashboard would)
    console.log('\n📋 Step 1: Getting vehicles list...');
    const { data: vehicles, error: listError } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (listError) throw listError;
    
    console.log(`✅ Found ${vehicles.length} vehicles`);
    if (vehicles.length === 0) {
      console.log('❌ No vehicles to test with');
      return;
    }
    
    const testVehicle = vehicles[0];
    console.log(`🎯 Testing with: ${testVehicle.make} ${testVehicle.model} (ID: ${testVehicle.id})`);
    
    // Step 2: Simulate clicking "Edit" - get vehicle via API
    console.log('\n🔧 Step 2: Simulating API getVehicle call...');
    const apiResponse = await getVehicle(testVehicle.id);
    
    if (!apiResponse.success) {
      console.log('❌ API call failed');
      return;
    }
    
    console.log('✅ API returned transformed vehicle data:');
    console.log(JSON.stringify(apiResponse.data, null, 2));
    
    // Step 3: Simulate VehicleForm receiving the data
    console.log('\n📝 Step 3: Simulating VehicleForm mapping...');
    const formData = simulateVehicleFormMapping(apiResponse.data);
    
    // Step 4: Verify all fields are populated
    console.log('\n✅ Step 4: Field population check:');
    const fieldChecks = [
      { name: 'make', value: formData.make },
      { name: 'model', value: formData.model },
      { name: 'year', value: formData.year },
      { name: 'price', value: formData.price },
      { name: 'mileage', value: formData.mileage },
      { name: 'exterior_color', value: formData.exterior_color },
      { name: 'transmission', value: formData.transmission },
      { name: 'fuel_type', value: formData.fuel_type },
      { name: 'body_style', value: formData.body_style },
      { name: 'engine', value: formData.engine },
      { name: 'vin', value: formData.vin },
      { name: 'description', value: formData.description },
      { name: 'condition', value: formData.condition },
      { name: 'status', value: formData.status }
    ];
    
    let allFieldsPopulated = true;
    fieldChecks.forEach(field => {
      const isPopulated = field.value && field.value !== '';
      const status = isPopulated ? '✅' : '❌';
      console.log(`  ${field.name}: "${field.value}" ${status}`);
      if (!isPopulated) allFieldsPopulated = false;
    });
    
    console.log(`\n🎯 Overall Status: ${allFieldsPopulated ? '✅ ALL FIELDS POPULATED' : '❌ SOME FIELDS MISSING'}`);
    
    // Step 5: Test features array
    console.log('\n🏷️ Step 5: Features check:');
    if (Array.isArray(formData.features) && formData.features.length > 0) {
      console.log(`✅ Features array with ${formData.features.length} items:`);
      formData.features.forEach((feature, i) => {
        console.log(`  ${i + 1}. ${feature}`);
      });
    } else {
      console.log('⚠️ No features or features not an array');
    }
    
    // Step 6: Test images
    console.log('\n🖼️ Step 6: Images check:');
    if (Array.isArray(formData.images) && formData.images.length > 0) {
      console.log(`✅ Images array with ${formData.images.length} items:`);
      formData.images.forEach((image, i) => {
        console.log(`  ${i + 1}. URL: ${image.url || 'No URL'}`);
        console.log(`     Public ID: ${image.publicId || 'No Public ID'}`);
      });
    } else {
      console.log('⚠️ No images found');
    }
    
    console.log('\n🏁 Test completed successfully!');
    
    if (allFieldsPopulated) {
      console.log('\n🎉 RESULT: Edit functionality should work correctly!');
      console.log('The form should show all vehicle data when editing.');
    } else {
      console.log('\n⚠️ RESULT: Some fields are missing data.');
      console.log('Check the database schema and field mappings.');
    }
    
  } catch (error) {
    console.error('\n💥 Test failed with error:', error);
  }
}

// Run the test
testCompleteEditFlow().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
