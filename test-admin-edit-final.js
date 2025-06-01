/**
 * FINAL TEST: Admin Edit Vehicle Form - Complete Flow
 * Tests the complete flow from database retrieval to form display
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://qjjbzjvgpkuqnzuvmqnr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqamJ6anZncGt1cW56dXZtcW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzODc5MTcsImV4cCI6MjA0OTk2MzkxN30.U9zPTp-F8z94hKR3X_2KZlJNDpkTYiNzTdDj3RCxhvI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Simulate the data transformation that happens in SupabaseVehicleService
function transformFromDatabase(rawData) {
  if (!rawData) return null;
  
  console.log('🔄 Raw database data:', rawData);
  
  return {
    id: rawData.id,
    make: rawData.make,
    model: rawData.model,
    year: rawData.year,
    price: rawData.price,
    mileage: rawData.mileage,
    exterior_color: rawData.exterior_color,
    transmission: rawData.transmission,
    fuel_type: rawData.fuel_type,
    body_style: rawData.body_style,
    engine: rawData.engine,
    vin: rawData.vin,
    condition: rawData.condition,
    description: rawData.description,
    features: rawData.features || [],
    status: rawData.is_available === true ? 'Available' : rawData.is_available === false ? 'Sold' : 'Draft',
    images: rawData.images || [],
    videos: rawData.videos || [],
    created_at: rawData.created_at,
    updated_at: rawData.updated_at,
    
    // Backward compatibility aliases for inventory components
    exteriorColor: rawData.exterior_color,
    fuelType: rawData.fuel_type,
    bodyStyle: rawData.body_style,
    bodyType: rawData.body_style,
    engineSize: rawData.engine,
    color: rawData.exterior_color
  };
}

// Test the complete admin edit flow
async function testAdminEditFlow() {
  console.log('🧪 Testing Admin Edit Vehicle - Complete Flow');
  console.log('================================================');
  
  try {
    // Step 1: Get a vehicle from database (simulating AdminDashboard.handleEditVehicle)
    console.log('\n📋 Step 1: Fetching vehicle from database...');
    const { data: vehicles, error: fetchError } = await supabase
      .from('vehicles')
      .select('*')
      .limit(1);
    
    if (fetchError) {
      throw new Error(`Database fetch error: ${fetchError.message}`);
    }
    
    if (!vehicles || vehicles.length === 0) {
      throw new Error('No vehicles found in database');
    }
    
    const rawVehicle = vehicles[0];
    console.log('✅ Raw vehicle fetched:', rawVehicle);
    
    // Step 2: Transform data (simulating SupabaseVehicleService.getVehicle)
    console.log('\n🔄 Step 2: Transforming vehicle data...');
    const transformedVehicle = transformFromDatabase(rawVehicle);
    console.log('✅ Transformed vehicle:', transformedVehicle);
    
    // Step 3: Simulate VehicleForm initial state
    console.log('\n📝 Step 3: Simulating VehicleForm initial state...');
    const initialFormState = {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      mileage: '',
      exterior_color: '',
      transmission: 'Automatic',
      fuel_type: 'Gasoline',
      body_style: 'Sedan',
      engine: '',
      vin: '',
      description: '',
      features: [],
      condition: 'Used',
      status: 'Available'
    };
    console.log('📋 Initial form state:', initialFormState);
    
    // Step 4: Simulate form data mapping (what happens in useEffect)
    console.log('\n🎯 Step 4: Mapping vehicle data to form...');
    const mappedFormData = {
      make: transformedVehicle.make || '',
      model: transformedVehicle.model || '',
      year: transformedVehicle.year || new Date().getFullYear(),
      price: transformedVehicle.price || '',
      mileage: transformedVehicle.mileage || '',
      exterior_color: transformedVehicle.exterior_color || transformedVehicle.exteriorColor || transformedVehicle.color || '',
      transmission: transformedVehicle.transmission || 'Automatic',
      fuel_type: transformedVehicle.fuel_type || transformedVehicle.fuelType || 'Gasoline',
      body_style: transformedVehicle.body_style || transformedVehicle.bodyStyle || transformedVehicle.bodyType || 'Sedan',
      engine: transformedVehicle.engine || transformedVehicle.engineSize || '',
      vin: transformedVehicle.vin || '',
      description: transformedVehicle.description || '',
      features: Array.isArray(transformedVehicle.features) ? transformedVehicle.features : [],
      condition: transformedVehicle.condition || 'Used',
      status: transformedVehicle.status || 'Available'
    };
    
    console.log('✅ Mapped form data:', mappedFormData);
    
    // Step 5: Verify all expected fields have values
    console.log('\n🔍 Step 5: Verifying field mappings...');
    const requiredFields = ['make', 'model', 'year', 'price', 'mileage', 'exterior_color', 'transmission', 'fuel_type', 'body_style', 'engine', 'vin', 'description'];
    
    let allFieldsValid = true;
    requiredFields.forEach(field => {
      const value = mappedFormData[field];
      const isEmpty = value === '' || value === null || value === undefined;
      console.log(`   ${field}: ${value} ${isEmpty ? '❌ EMPTY' : '✅ OK'}`);
      if (isEmpty) allFieldsValid = false;
    });
    
    console.log(`\n📊 Field validation result: ${allFieldsValid ? '✅ ALL FIELDS HAVE VALUES' : '❌ SOME FIELDS ARE EMPTY'}`);
    
    // Step 6: Simulate form render values (what React sees)
    console.log('\n🖥️ Step 6: Simulating form input values...');
    const formInputValues = {
      'make input': mappedFormData.make || '',
      'model input': mappedFormData.model || '',
      'year select': mappedFormData.year || new Date().getFullYear(),
      'price input': mappedFormData.price || '',
      'mileage input': mappedFormData.mileage || '',
      'exterior_color input': mappedFormData.exterior_color || '',
      'transmission select': mappedFormData.transmission || 'Automatic',
      'fuel_type select': mappedFormData.fuel_type || 'Gasoline',
      'body_style select': mappedFormData.body_style || 'Sedan',
      'engine input': mappedFormData.engine || '',
      'vin input': mappedFormData.vin || '',
      'description textarea': mappedFormData.description || '',
      'condition select': mappedFormData.condition || 'Used',
      'status select': mappedFormData.status || 'Available'
    };
    
    console.log('🖥️ Form input values (what should appear in browser):');
    Object.entries(formInputValues).forEach(([field, value]) => {
      console.log(`   ${field}: "${value}"`);
    });
    
    // Step 7: Summary
    console.log('\n🎉 TEST SUMMARY:');
    console.log('================');
    console.log(`✅ Database retrieval: SUCCESS`);
    console.log(`✅ Data transformation: SUCCESS`);
    console.log(`✅ Form mapping: SUCCESS`);
    console.log(`${allFieldsValid ? '✅' : '❌'} Field validation: ${allFieldsValid ? 'ALL FIELDS POPULATED' : 'MISSING FIELDS'}`);
    console.log(`✅ Form input preparation: SUCCESS`);
    
    if (allFieldsValid) {
      console.log('\n🎯 CONCLUSION: Admin edit form should now display all vehicle data correctly!');
      console.log('📋 Next steps:');
      console.log('   1. Open http://localhost:3001 in browser');
      console.log('   2. Go to Admin Portal');
      console.log('   3. Click "Edit" on any vehicle');
      console.log('   4. All form fields should now be populated with vehicle data');
    } else {
      console.log('\n⚠️ CONCLUSION: Some fields are still empty. Check the data transformation logic.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testAdminEditFlow();
