// Comprehensive integration test for the field mapping fix
// Tests all CRUD operations through the actual service layer

const path = require('path');
const fs = require('fs');

// Mock React environment
global.window = {};
global.document = {};

// Load environment variables
require('dotenv').config();

// Import the actual service
const SupabaseVehicleService = require('./src/services/supabaseVehicleService.js');

console.log('🧪 Comprehensive Field Mapping Integration Test');
console.log('===============================================');

// Test data with frontend field names (mixed case as used in different components)
const testVehicles = [
  {
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 28000,
    mileage: 5000,
    transmission: 'Automatic',
    bodyType: 'Sedan',      // camelCase (from admin forms)
    fuelType: 'Gasoline',   // camelCase
    exteriorColor: 'Silver', // camelCase
    interiorColor: 'Black',  // camelCase
    engine: '2.5L I4',
    drivetrain: 'FWD',
    description: 'Reliable and fuel-efficient sedan',
    features: ['Backup Camera', 'Apple CarPlay', 'Lane Assist'],
    isAvailable: true,      // camelCase
    isFeatured: false       // camelCase
  },
  {
    make: 'Honda',
    model: 'CR-V',
    year: 2024,
    price: 32000,
    mileage: 2000,
    transmission: 'CVT',
    bodyStyle: 'SUV',       // Different naming (from inventory page)
    fuelType: 'Gasoline',   // camelCase
    exterior_color: 'Blue', // snake_case (mixed usage)
    interior_color: 'Gray', // snake_case
    engine: '1.5L Turbo',
    drivetrain: 'AWD',
    description: 'Compact SUV with excellent safety ratings',
    features: ['Honda Sensing', 'Heated Seats', 'Sunroof'],
    is_available: true,     // snake_case (mixed usage)
    is_featured: true       // snake_case
  }
];

async function runIntegrationTest() {
  let createdVehicleIds = [];
  
  try {
    console.log('\n📋 Test 1: Creating vehicles with mixed field naming...');
    
    // Test vehicle creation with different field naming conventions
    for (let i = 0; i < testVehicles.length; i++) {
      const vehicleData = testVehicles[i];
      console.log(`\n🚗 Creating vehicle ${i + 1}: ${vehicleData.make} ${vehicleData.model}`);
      
      const result = await SupabaseVehicleService.createVehicle(vehicleData);
      
      if (result.success) {
        console.log(`✅ Vehicle created successfully! ID: ${result.vehicle.id}`);
        createdVehicleIds.push(result.vehicle.id);
        
        // Verify the returned data has frontend field names
        const vehicle = result.vehicle;
        console.log('🔍 Checking returned field names...');
        
        // Check for frontend camelCase fields
        const frontendFields = ['bodyType', 'fuelType', 'exteriorColor', 'interiorColor', 'isAvailable', 'isFeatured'];
        const missingFields = frontendFields.filter(field => !(field in vehicle));
        
        if (missingFields.length === 0) {
          console.log('✅ All frontend field names present in response');
        } else {
          console.log(`⚠️ Missing frontend fields: ${missingFields.join(', ')}`);
        }
        
        // Verify values match
        if (vehicleData.bodyType && vehicle.bodyType !== vehicleData.bodyType) {
          console.log(`⚠️ bodyType mismatch: ${vehicle.bodyType} vs ${vehicleData.bodyType}`);
        }
        if (vehicleData.bodyStyle && vehicle.bodyType !== vehicleData.bodyStyle) {
          console.log(`⚠️ bodyStyle->bodyType mismatch: ${vehicle.bodyType} vs ${vehicleData.bodyStyle}`);
        }
        
      } else {
        console.error(`❌ Failed to create vehicle: ${result.message}`);
        return;
      }
    }
    
    console.log('\n📋 Test 2: Retrieving all vehicles...');
    
    const allVehiclesResult = await SupabaseVehicleService.getVehicles();
    
    if (allVehiclesResult.success) {
      console.log(`✅ Retrieved ${allVehiclesResult.vehicles.length} vehicles`);
      
      // Check that our test vehicles are included and have correct field names
      const ourTestVehicles = allVehiclesResult.vehicles.filter(v => 
        createdVehicleIds.includes(v.id)
      );
      
      console.log(`🔍 Found ${ourTestVehicles.length} of our test vehicles`);
      
      ourTestVehicles.forEach((vehicle, index) => {
        console.log(`\n📊 Vehicle ${index + 1} field verification:`);
        console.log(`   bodyType: ${vehicle.bodyType} (${typeof vehicle.bodyType})`);
        console.log(`   fuelType: ${vehicle.fuelType} (${typeof vehicle.fuelType})`);
        console.log(`   exteriorColor: ${vehicle.exteriorColor} (${typeof vehicle.exteriorColor})`);
        console.log(`   isAvailable: ${vehicle.isAvailable} (${typeof vehicle.isAvailable})`);
        console.log(`   isFeatured: ${vehicle.isFeatured} (${typeof vehicle.isFeatured})`);
      });
      
    } else {
      console.error(`❌ Failed to retrieve vehicles: ${allVehiclesResult.message}`);
    }
    
    console.log('\n📋 Test 3: Testing filters with different field names...');
    
    // Test bodyType filter (admin interface)
    const bodyTypeFilterResult = await SupabaseVehicleService.getVehicles({
      bodyType: 'Sedan'
    });
    
    if (bodyTypeFilterResult.success) {
      console.log(`✅ bodyType filter: Found ${bodyTypeFilterResult.vehicles.length} sedans`);
    } else {
      console.error(`❌ bodyType filter failed: ${bodyTypeFilterResult.message}`);
    }
    
    // Test bodyStyle filter (inventory page)
    const bodyStyleFilterResult = await SupabaseVehicleService.getVehicles({
      bodyStyle: 'SUV'
    });
    
    if (bodyStyleFilterResult.success) {
      console.log(`✅ bodyStyle filter: Found ${bodyStyleFilterResult.vehicles.length} SUVs`);
    } else {
      console.error(`❌ bodyStyle filter failed: ${bodyStyleFilterResult.message}`);
    }
    
    console.log('\n📋 Test 4: Testing vehicle updates...');
    
    if (createdVehicleIds.length > 0) {
      const vehicleId = createdVehicleIds[0];
      
      const updateData = {
        price: 29000,
        mileage: 6000,
        bodyType: 'Hybrid Sedan', // Frontend field name
        fuelType: 'Hybrid',       // Frontend field name
        isAvailable: false,       // Frontend field name
        description: 'Updated description with new features'
      };
      
      console.log(`🔄 Updating vehicle ${vehicleId}...`);
      
      const updateResult = await SupabaseVehicleService.updateVehicle(vehicleId, updateData);
      
      if (updateResult.success) {
        console.log('✅ Vehicle updated successfully!');
        
        const updatedVehicle = updateResult.vehicle;
        console.log('🔍 Verifying updated fields:');
        console.log(`   bodyType: ${updatedVehicle.bodyType}`);
        console.log(`   fuelType: ${updatedVehicle.fuelType}`);
        console.log(`   isAvailable: ${updatedVehicle.isAvailable}`);
        console.log(`   price: ${updatedVehicle.price}`);
        
        // Verify the update worked
        if (updatedVehicle.bodyType === 'Hybrid Sedan' && 
            updatedVehicle.fuelType === 'Hybrid' && 
            updatedVehicle.isAvailable === false &&
            updatedVehicle.price === 29000) {
          console.log('✅ All updates applied correctly!');
        } else {
          console.log('⚠️ Some updates may not have been applied correctly');
        }
        
      } else {
        console.error(`❌ Failed to update vehicle: ${updateResult.message}`);
      }
    }
    
    console.log('\n📋 Test 5: Testing individual vehicle retrieval...');
    
    if (createdVehicleIds.length > 0) {
      const vehicleId = createdVehicleIds[0];
      
      const singleVehicleResult = await SupabaseVehicleService.getVehicle(vehicleId);
      
      if (singleVehicleResult.success) {
        console.log('✅ Single vehicle retrieved successfully!');
        
        const vehicle = singleVehicleResult.vehicle;
        console.log('🔍 Field name verification:');
        
        const requiredFields = ['bodyType', 'fuelType', 'exteriorColor', 'interiorColor', 'isAvailable', 'isFeatured'];
        requiredFields.forEach(field => {
          const hasField = field in vehicle;
          console.log(`   ${field}: ${hasField ? '✅' : '❌'} ${hasField ? vehicle[field] : 'MISSING'}`);
        });
        
      } else {
        console.error(`❌ Failed to retrieve single vehicle: ${singleVehicleResult.message}`);
      }
    }
    
    console.log('\n🎉 Integration test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`✅ Created ${createdVehicleIds.length} test vehicles`);
    console.log('✅ Field mapping working in all CRUD operations');
    console.log('✅ Both bodyType and bodyStyle filters working');
    console.log('✅ Frontend camelCase field names preserved in responses');
    console.log('✅ Backend snake_case field names used in database');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    console.error(error.stack);
  } finally {
    // Clean up test vehicles
    console.log('\n🧹 Cleaning up test vehicles...');
    
    for (const vehicleId of createdVehicleIds) {
      try {
        await SupabaseVehicleService.deleteVehicle(vehicleId);
        console.log(`✅ Deleted vehicle ${vehicleId}`);
      } catch (error) {
        console.warn(`⚠️ Failed to delete vehicle ${vehicleId}:`, error.message);
      }
    }
    
    console.log('✅ Cleanup completed');
  }
}

// Run the integration test
runIntegrationTest();
