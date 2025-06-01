// Debug Image Display Issue - Detailed Analysis
import { supabase } from './src/services/supabaseClient.js';

console.log('🔍 DEBUGGING IMAGE DISPLAY ISSUE');
console.log('='.repeat(50));

// Test 1: Check actual Supabase data structure
async function testSupabaseVehicleData() {
  console.log('\n📊 Testing Supabase Vehicle Data Structure:');
  
  try {
    // Get vehicles with images included
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_images(*)
      `)
      .limit(3);

    if (error) {
      console.error('❌ Supabase query error:', error);
      return;
    }

    console.log(`✅ Retrieved ${vehicles?.length || 0} vehicles from Supabase`);
    
    if (vehicles && vehicles.length > 0) {
      const firstVehicle = vehicles[0];
      console.log('\n📋 First Vehicle Structure:');
      console.log('Vehicle fields:', Object.keys(firstVehicle));
      console.log('Images field type:', typeof firstVehicle.vehicle_images);
      console.log('Images field value:', firstVehicle.vehicle_images);
      
      // Check if images exist
      if (firstVehicle.vehicle_images) {
        console.log(`✅ Found ${firstVehicle.vehicle_images.length} images for first vehicle`);
        if (firstVehicle.vehicle_images.length > 0) {
          const firstImage = firstVehicle.vehicle_images[0];
          console.log('First image structure:', Object.keys(firstImage));
          console.log('Image URL field:', firstImage.url || firstImage.image_url);
        }
      } else {
        console.log('❌ No images found for first vehicle');
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing Supabase data:', error);
  }
}

// Test 2: Check transformation logic
async function testTransformationLogic() {
  console.log('\n🔄 Testing Data Transformation Logic:');
  
  // Simulate raw Supabase data
  const rawSupabaseData = {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 28500,
    vehicle_images: [
      {
        id: 1,
        url: 'https://example.com/image1.jpg',
        image_url: 'https://example.com/image1.jpg',
        is_primary: true
      },
      {
        id: 2,
        url: 'https://example.com/image2.jpg', 
        image_url: 'https://example.com/image2.jpg',
        is_primary: false
      }
    ]
  };
  
  console.log('📥 Raw Supabase data structure:', Object.keys(rawSupabaseData));
  console.log('📥 Raw images field:', rawSupabaseData.vehicle_images);
  
  // What the frontend expects
  const expectedFrontendStructure = {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 28500,
    images: [
      {
        url: 'https://example.com/image1.jpg',
        publicId: 'some-id'
      }
    ]
  };
  
  console.log('\n📤 Expected frontend structure:', Object.keys(expectedFrontendStructure));
  console.log('📤 Expected images field:', expectedFrontendStructure.images);
  
  // Check if transformation is needed
  console.log('\n⚠️ TRANSFORMATION ISSUE IDENTIFIED:');
  console.log('- Supabase returns: vehicle_images[]');
  console.log('- Frontend expects: images[]');
  console.log('- Image URL field might be: url vs image_url');
}

// Test 3: Check actual service implementation
function testServiceImplementation() {
  console.log('\n🔧 Service Implementation Analysis:');
  console.log('The issue is likely in the transformFromDatabase method');
  console.log('It needs to convert vehicle_images -> images');
  console.log('And ensure the correct URL field is used');
}

// Run all tests
async function runAllTests() {
  await testSupabaseVehicleData();
  await testTransformationLogic();
  testServiceImplementation();
  
  console.log('\n🎯 RECOMMENDED FIXES:');
  console.log('1. Update transformFromDatabase to handle vehicle_images -> images');
  console.log('2. Ensure correct image URL field mapping');
  console.log('3. Test image display in components');
}

runAllTests();
