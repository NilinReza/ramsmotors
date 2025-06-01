// Debug script to check the actual database schema
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkDatabaseSchema() {
  try {
    console.log('🔍 Checking Database Schema\n');
    
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Missing Supabase credentials');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First, let's see what tables exist
    console.log('📊 Testing basic vehicle query...');
    const { data: vehicles, error: vehicleError } = await supabase
      .from('vehicles')
      .select('*')
      .limit(1);
    
    if (vehicleError) {
      console.error('❌ Vehicle query error:', vehicleError);
      return;
    }
    
    if (vehicles && vehicles.length > 0) {
      console.log('✅ Vehicle table accessible');
      console.log('📋 Vehicle columns:', Object.keys(vehicles[0]));
    }
    
    // Now test the vehicle_images table
    console.log('\n📊 Testing vehicle_images table...');
    const { data: images, error: imageError } = await supabase
      .from('vehicle_images')
      .select('*')
      .limit(1);
    
    if (imageError) {
      console.error('❌ Vehicle images query error:', imageError);
      
      // Try alternative column names
      console.log('\n🔄 Trying alternative queries...');
      
      // Try with just url instead of image_url
      const { data: images2, error: error2 } = await supabase
        .from('vehicle_images')
        .select('id, url, public_id, display_order, created_at')
        .limit(1);
      
      if (error2) {
        console.error('❌ Alternative query 1 failed:', error2);
        
        // Try to get column info
        const { data: images3, error: error3 } = await supabase
          .from('vehicle_images')
          .select()
          .limit(1);
        
        if (error3) {
          console.error('❌ Basic vehicle_images query failed:', error3);
        } else if (images3 && images3.length > 0) {
          console.log('✅ Found vehicle_images columns:', Object.keys(images3[0]));
        }
      } else {
        console.log('✅ Alternative query worked! Columns:', Object.keys(images2[0]));
      }
    } else {
      console.log('✅ Vehicle images table accessible');
      if (images && images.length > 0) {
        console.log('📋 Vehicle images columns:', Object.keys(images[0]));
      } else {
        console.log('ℹ️ No images found in table');
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkDatabaseSchema();
