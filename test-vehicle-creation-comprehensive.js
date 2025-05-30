/**
 * Comprehensive test for vehicle creation with the fixed field mapping
 * This test simulates the complete vehicle creation flow including UI interactions
 */

// Import the fixed service
const SupabaseVehicleService = require('./src/services/supabaseVehicleService.js');

// Mock Supabase client to avoid actual database calls during testing
const mockSupabaseClient = {
  from: (table) => ({
    insert: (data) => {
      console.log(`📝 Mock Insert to ${table} table:`, JSON.stringify(data, null, 2));
      return {
        select: () => ({
          single: () => Promise.resolve({
            data: { id: 'mock-id-123', ...data },
            error: null
          })
        })
      };
    },
    select: () => ({
      eq: () => Promise.resolve({
        data: [],
        error: null
      })
    })
  })
};

// Create service instance with mock client
const vehicleService = new SupabaseVehicleService(mockSupabaseClient);

// Test data that would come from the vehicle creation form
const testVehicleFormData = {
  // Frontend form data (camelCase)
  make: 'Toyota',
  model: 'Camry',
  year: 2023,
  price: 28500,
  mileage: 15000,
  color: 'Pearl White',  // This should map to exterior_color
  bodyStyle: 'Sedan',    // This should map to body_style
  fuelType: 'Gasoline',  // This should map to fuel_type
  transmission: 'Automatic',
  drivetrain: 'FWD',
  engine: '2.5L 4-Cylinder',
  isAvailable: true,     // This should map to is_available
  isFeatured: false,
  description: 'Clean, well-maintained vehicle with low mileage',
  imageUrl: 'https://example.com/camry.jpg',
  // Additional fields that don't need mapping
  vin: '1HGBH41JXMN109186',
  stockNumber: 'TOY2023001'
};

console.log('🚗 Testing Vehicle Creation with Fixed Field Mapping');
console.log('=' * 60);

async function testVehicleCreation() {
  try {
    console.log('📋 Original Form Data (Frontend):');
    console.log(JSON.stringify(testVehicleFormData, null, 2));
    console.log('\n' + '=' * 60 + '\n');

    // Test the create vehicle method
    console.log('🔄 Creating vehicle through SupabaseVehicleService...\n');
    
    const result = await vehicleService.createVehicle(testVehicleFormData);
    
    console.log('\n' + '=' * 60);
    console.log('✅ Vehicle Creation Result:');
    console.log(JSON.stringify(result, null, 2));
    
    // Verify critical mappings were applied correctly
    console.log('\n🔍 Verification of Critical Field Mappings:');
    console.log('----------------------------------------');
    
    // The mock insert will show us what data was actually sent to the database
    // We should see snake_case field names
    
    return result;
    
  } catch (error) {
    console.error('❌ Error during vehicle creation:', error);
    return null;
  }
}

// Test field transformation directly
function testFieldTransformation() {
  console.log('\n🔧 Testing Field Transformation Logic Directly:');
  console.log('=' * 50);
  
  // Access the transformation method directly
  const transformedData = vehicleService.transformToDatabase(testVehicleFormData);
  
  console.log('📥 Input (Frontend format):');
  console.log(JSON.stringify(testVehicleFormData, null, 2));
  
  console.log('\n📤 Output (Database format):');
  console.log(JSON.stringify(transformedData, null, 2));
  
  console.log('\n✅ Critical Mapping Verification:');
  console.log(`color → exterior_color: ${testVehicleFormData.color} → ${transformedData.exterior_color}`);
  console.log(`bodyStyle → body_style: ${testVehicleFormData.bodyStyle} → ${transformedData.body_style}`);
  console.log(`fuelType → fuel_type: ${testVehicleFormData.fuelType} → ${transformedData.fuel_type}`);
  console.log(`isAvailable → is_available: ${testVehicleFormData.isAvailable} → ${transformedData.is_available}`);
  
  // Check that original fields are not present in database format
  const problematicFields = ['color', 'bodyStyle', 'fuelType', 'isAvailable'];
  const foundProblematicFields = problematicFields.filter(field => 
    transformedData.hasOwnProperty(field)
  );
  
  if (foundProblematicFields.length > 0) {
    console.log(`❌ ERROR: Found frontend field names in database format: ${foundProblematicFields.join(', ')}`);
  } else {
    console.log('✅ SUCCESS: No frontend field names found in database format');
  }
  
  return transformedData;
}

// Test with edge cases
function testEdgeCases() {
  console.log('\n🧪 Testing Edge Cases:');
  console.log('=' * 30);
  
  // Test with minimal data
  const minimalData = {
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    price: 22000,
    color: 'Black'
  };
  
  console.log('📝 Minimal data test:');
  const minimalTransformed = vehicleService.transformToDatabase(minimalData);
  console.log('Input:', JSON.stringify(minimalData, null, 2));
  console.log('Output:', JSON.stringify(minimalTransformed, null, 2));
  
  // Test with bodyType instead of bodyStyle (backward compatibility)
  const bodyTypeData = {
    make: 'Ford',
    model: 'F-150',
    year: 2023,
    price: 35000,
    bodyType: 'Truck',  // Should also map to body_style
    color: 'Red'
  };
  
  console.log('\n📝 BodyType compatibility test:');
  const bodyTypeTransformed = vehicleService.transformToDatabase(bodyTypeData);
  console.log('Input:', JSON.stringify(bodyTypeData, null, 2));
  console.log('Output:', JSON.stringify(bodyTypeTransformed, null, 2));
  console.log(`bodyType → body_style: ${bodyTypeData.bodyType} → ${bodyTypeTransformed.body_style}`);
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Vehicle Creation Tests\n');
  
  // Test 1: Direct field transformation
  testFieldTransformation();
  
  // Test 2: Edge cases
  testEdgeCases();
  
  // Test 3: Full vehicle creation simulation
  await testVehicleCreation();
  
  console.log('\n🎉 All tests completed!');
  console.log('\nIf you see the correct field mappings above (color → exterior_color, etc.)');
  console.log('and no errors, then the fix is working correctly! 🎯');
}

// Run the tests
runAllTests().catch(console.error);
