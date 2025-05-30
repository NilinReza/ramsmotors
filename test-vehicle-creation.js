// Simple test to create a vehicle and verify field mapping works
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test vehicle data with frontend field names
const testVehicleData = {
  make: 'Test',
  model: 'Vehicle',
  year: 2023,
  price: 25000,
  mileage: 10000,
  transmission: 'Automatic',
  bodyType: 'Sedan',  // Frontend field name
  fuelType: 'Gasoline', // Frontend field name
  exteriorColor: 'Blue', // Frontend field name
  interiorColor: 'Black', // Frontend field name
  engine: '2.0L',
  drivetrain: 'FWD',
  description: 'Test vehicle for field mapping verification',
  features: ['Air Conditioning', 'Bluetooth'],
  isAvailable: true, // Frontend field name
  isFeatured: false  // Frontend field name
};

// Field mapping
const FIELD_MAPPINGS = {
  bodyType: 'body_style',
  fuelType: 'fuel_type',
  exteriorColor: 'exterior_color',
  interiorColor: 'interior_color',
  isAvailable: 'is_available',
  isFeatured: 'is_featured'
};

function transformToDatabase(vehicleData) {
  const transformed = { ...vehicleData };
  
  Object.entries(FIELD_MAPPINGS).forEach(([frontendField, dbField]) => {
    if (frontendField in transformed) {
      transformed[dbField] = transformed[frontendField];
      delete transformed[frontendField];
    }
  });
  
  return transformed;
}

async function testVehicleCreation() {
  console.log('🧪 Testing Vehicle Creation with Field Mapping');
  console.log('===============================================');

  try {
    // Transform frontend data to database format
    const dbData = transformToDatabase(testVehicleData);
    
    console.log('\n📤 Original frontend data:');
    console.log(JSON.stringify(testVehicleData, null, 2));
    
    console.log('\n🔄 Transformed database data:');
    console.log(JSON.stringify(dbData, null, 2));

    // Add required database fields
    const vehicleToInsert = {
      ...dbData,
      dealer_id: 'ramsmotors',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('\n💾 Attempting to insert vehicle...');
    
    // Try to insert the vehicle
    const { data: vehicle, error: insertError } = await supabase
      .from('vehicles')
      .insert([vehicleToInsert])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      
      // Check if it's a field mapping issue
      if (insertError.message.includes('bodyType')) {
        console.error('🚨 FIELD MAPPING ISSUE: bodyType field still being sent to database!');
      } else if (insertError.message.includes('fuelType')) {
        console.error('🚨 FIELD MAPPING ISSUE: fuelType field still being sent to database!');
      } else {
        console.error('❓ Other database error:', insertError);
      }
      return;
    }

    console.log('✅ Vehicle created successfully!');
    console.log('Vehicle ID:', vehicle.id);
    
    // Verify the data was stored correctly
    console.log('\n🔍 Verifying stored data...');
    const { data: storedVehicle, error: selectError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicle.id)
      .single();

    if (selectError) {
      console.error('❌ Failed to retrieve stored vehicle:', selectError.message);
      return;
    }

    console.log('\n📥 Stored vehicle data:');
    console.log(JSON.stringify(storedVehicle, null, 2));

    // Check if all mapped fields are correct
    const fieldsToCheck = [
      { frontend: 'bodyType', db: 'body_style', expected: 'Sedan' },
      { frontend: 'fuelType', db: 'fuel_type', expected: 'Gasoline' },
      { frontend: 'exteriorColor', db: 'exterior_color', expected: 'Blue' },
      { frontend: 'interiorColor', db: 'interior_color', expected: 'Black' },
      { frontend: 'isAvailable', db: 'is_available', expected: true },
      { frontend: 'isFeatured', db: 'is_featured', expected: false }
    ];

    console.log('\n🔍 Field mapping verification:');
    let allFieldsCorrect = true;

    fieldsToCheck.forEach(({ frontend, db, expected }) => {
      const actualValue = storedVehicle[db];
      const isCorrect = actualValue === expected;
      console.log(`${isCorrect ? '✅' : '❌'} ${frontend} -> ${db}: ${actualValue} (expected: ${expected})`);
      if (!isCorrect) allFieldsCorrect = false;
    });

    if (allFieldsCorrect) {
      console.log('\n🎉 All field mappings are working correctly!');
    } else {
      console.log('\n⚠️ Some field mappings are not working as expected.');
    }

    // Clean up - delete the test vehicle
    console.log('\n🧹 Cleaning up test vehicle...');
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicle.id);

    if (deleteError) {
      console.warn('⚠️ Failed to delete test vehicle:', deleteError.message);
    } else {
      console.log('✅ Test vehicle cleaned up successfully');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testVehicleCreation();
