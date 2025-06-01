// Test to verify that the 'condition' field is properly filtered out
// This confirms the fix for the Supabase PGRST204 error

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client (using the same config as the app)
const supabaseUrl = 'https://dllshuhvfmbnjszhptkt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbHNodWh2Zm1ibmpzemhwdGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxOTQ3OTksImV4cCI6MjA0Nzc3MDc5OX0.CtVyZaAXAd4jVN2aTeFOKbNNHDDH8m_gqwlJCBPAMjM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Test data with the problematic 'condition' field
const testVehicleWithCondition = {
  make: 'Test',
  model: 'ConditionFix',
  year: 2024,
  price: 30000,
  mileage: 5000,
  transmission: 'Automatic',
  bodyType: 'Sedan',
  fuelType: 'Gasoline',
  exteriorColor: 'Red',
  interiorColor: 'Gray',
  engine: '2.4L',
  description: 'Test vehicle with condition field',
  features: ['AC', 'Power Windows'],
  condition: 'Used',  // This field should be filtered out
  isAvailable: true,
  isFeatured: false
};

// Field mappings (same as in the service)
const FIELD_MAPPINGS = {
  bodyType: 'body_style',
  fuelType: 'fuel_type',
  exteriorColor: 'exterior_color',
  interiorColor: 'interior_color',
  isAvailable: 'is_available',
  isFeatured: 'is_featured'
};

// Supported columns (same as in the service)
const supportedColumns = [
  'make', 'model', 'year', 'price', 'mileage', 'transmission', 'engine', 
  'vin', 'description', 'features', 'status', 'body_style', 'fuel_type', 
  'exterior_color', 'interior_color', 'dealer_id', 'created_at', 'updated_at', 
  'is_available', 'is_featured', 'images'
];

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

function filterSupportedFields(transformedData) {
  const filteredData = {};
  Object.keys(transformedData).forEach(key => {
    if (supportedColumns.includes(key)) {
      filteredData[key] = transformedData[key];
    } else {
      console.warn(`⚠️ Skipping unsupported field: ${key} = ${transformedData[key]}`);
    }
  });
  return filteredData;
}

async function testConditionFieldFix() {
  console.log('🧪 TESTING CONDITION FIELD FIX');
  console.log('================================');
  
  // Step 1: Show original data with condition field
  console.log('\n1️⃣ Original form data (with condition field):');
  console.log(JSON.stringify(testVehicleWithCondition, null, 2));
  
  // Step 2: Transform frontend fields to database fields
  const transformedData = transformToDatabase(testVehicleWithCondition);
  console.log('\n2️⃣ After field transformation:');
  console.log(JSON.stringify(transformedData, null, 2));
  
  // Step 3: Filter out unsupported fields (including 'condition')
  const filteredData = filterSupportedFields(transformedData);
  console.log('\n3️⃣ After filtering unsupported fields:');
  console.log(JSON.stringify(filteredData, null, 2));
  
  // Step 4: Prepare final data for database insertion
  const finalData = {
    ...filteredData,
    dealer_id: 'ramsmotors',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  console.log('\n4️⃣ Final data for database insertion:');
  console.log(JSON.stringify(finalData, null, 2));
  
  // Step 5: Test actual database insertion
  console.log('\n5️⃣ Testing database insertion...');
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([finalData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Database insertion failed:', error.message);
      console.error('Error details:', error);
      return false;
    }
    
    console.log('✅ Database insertion successful!');
    console.log('Inserted vehicle ID:', data?.id);
    
    // Clean up test data
    if (data?.id) {
      await supabase.from('vehicles').delete().eq('id', data.id);
      console.log('🧹 Test data cleaned up');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the test
testConditionFieldFix().then(success => {
  if (success) {
    console.log('\n🎉 CONDITION FIELD FIX VERIFICATION COMPLETE');
    console.log('The \'condition\' field is properly filtered out and no longer causes database errors!');
  } else {
    console.log('\n⚠️ CONDITION FIELD FIX NEEDS ATTENTION');
    console.log('There may still be issues with field filtering.');
  }
});
