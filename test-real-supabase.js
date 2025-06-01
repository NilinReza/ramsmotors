// Quick test to verify actual Supabase data transformation
const path = require('path');

async function testRealSupabaseTransformation() {
  try {
    console.log('🔍 Testing Real Supabase Data Transformation\n');
    
    // We need to set up the environment variables first
    require('dotenv').config();
    
    // Create a simple Supabase client test
    const { createClient } = require('@supabase/supabase-js');
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Supabase credentials not found in environment');
      console.log('URL exists:', !!supabaseUrl);
      console.log('Key exists:', !!supabaseKey);
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('📡 Fetching one vehicle with images from Supabase...');    // First, let's check the actual schema of both tables
    console.log('🔍 Checking vehicle_images table schema...');
    const { data: imageSchemaData, error: imageSchemaError } = await supabase
      .from('vehicle_images')
      .select('*')
      .limit(1);
    
    if (imageSchemaError) {
      console.error('❌ vehicle_images schema check error:', imageSchemaError);
    } else if (imageSchemaData && imageSchemaData.length > 0) {
      console.log('✅ vehicle_images table columns:');
      console.log(Object.keys(imageSchemaData[0]));
      console.log('First record:', JSON.stringify(imageSchemaData[0], null, 2));
    }
    
    console.log('\n🔍 Checking vehicles table schema...');
    const { data: vehicleSchemaData, error: vehicleSchemaError } = await supabase
      .from('vehicles')
      .select('*')
      .limit(1);
    
    if (vehicleSchemaError) {
      console.error('❌ vehicles schema check error:', vehicleSchemaError);
    } else if (vehicleSchemaData && vehicleSchemaData.length > 0) {
      console.log('✅ vehicles table columns:');
      console.log(Object.keys(vehicleSchemaData[0]));
    }
      // Now try to get a vehicle that actually has images
    console.log('\n📡 Fetching vehicle with images using correct schema...');
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_images (*)
      `)
      .eq('id', 'a2b88133-0ddb-46dc-8ef7-83d115175e7f')  // Use a vehicle ID that has images
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase query error:', error);
      return;
    }
      if (!vehicles || vehicles.length === 0) {
      console.log('⚠️ No vehicles found in Supabase');
      return;
    }
    
    const vehicle = vehicles[0];
    console.log('✅ Retrieved vehicle from Supabase:');
    console.log('- ID:', vehicle.id);
    console.log('- Make:', vehicle.make);  // Now using correct field name
    console.log('- Model:', vehicle.model); // Now using correct field name
    console.log('- vehicle_images count:', vehicle.vehicle_images?.length || 0);
    
    if (vehicle.vehicle_images && vehicle.vehicle_images.length > 0) {
      console.log('- First image data:');
      console.log('  ', JSON.stringify(vehicle.vehicle_images[0], null, 2));
      
      // Test the transformation logic
      console.log('\n🔄 Testing transformation...');
      const transformed = {
        ...vehicle,
        images: vehicle.vehicle_images.map(img => ({
          id: img.id,
          url: img.url,
          publicId: img.public_id,
          displayOrder: img.sort_order || 0,
          isPrimary: img.is_primary,
          altText: img.alt_text,
          createdAt: img.created_at
        }))
      };
      delete transformed.vehicle_images;
      
      console.log('✅ Transformed images:');
      console.log('- images count:', transformed.images?.length || 0);
      if (transformed.images && transformed.images.length > 0) {
        console.log('- First transformed image:');
        console.log('  ', JSON.stringify(transformed.images[0], null, 2));
      }
    } else {
      console.log('⚠️ No images found for this vehicle');
      
      // Check if there are any vehicle_images at all
      console.log('\n🔍 Checking all vehicle_images...');
      const { data: allImages } = await supabase
        .from('vehicle_images')
        .select('vehicle_id, url')
        .limit(5);
      
      console.log('Total images in database:', allImages?.length || 0);
      if (allImages && allImages.length > 0) {
        console.log('Sample vehicle_ids with images:', 
          allImages.map(img => img.vehicle_id).slice(0, 3)
        );
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRealSupabaseTransformation();
