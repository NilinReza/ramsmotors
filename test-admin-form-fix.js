// Test Vehicle Creation Fix - Admin Form Simulation
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Simulate the vehicle service class
class TestVehicleService {
  constructor() {
    this.currentDealerId = 'ramsmotors';
  }

  static FIELD_MAPPINGS = {
    toDatabase: {
      bodyType: 'body_style',
      bodyStyle: 'body_style',      // Alternative naming from inventory page
      fuelType: 'fuel_type',
      exteriorColor: 'exterior_color',
      interiorColor: 'interior_color',
      color: 'exterior_color',      // Single color field maps to exterior_color
      isAvailable: 'is_available',
      isFeatured: 'is_featured',
      viewCount: 'view_count',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      dealerId: 'dealer_id'
    },
    fromDatabase: {
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
    }
  };

  transformToDatabase(vehicleData) {
    const transformed = { ...vehicleData };
    
    Object.entries(TestVehicleService.FIELD_MAPPINGS.toDatabase).forEach(([frontendField, dbField]) => {
      if (frontendField in transformed) {
        transformed[dbField] = transformed[frontendField];
        delete transformed[frontendField];
      }
    });
    
    return transformed;
  }

  async createVehicle(vehicleData, images = [], videos = []) {
    try {
      console.log('🚗 Test Service: Creating vehicle:', vehicleData);
      console.log('📸 Images received:', images.length);
      console.log('🎥 Videos received:', videos.length);
      
      // Transform frontend field names to database field names
      const transformedData = this.transformToDatabase(vehicleData);
      console.log('🔄 Transformed data:', transformedData);
      
      // Prepare vehicle data for insertion
      const vehicleToInsert = {
        ...transformedData,
        dealer_id: this.currentDealerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Clean up undefined/null values that might cause database issues
      Object.keys(vehicleToInsert).forEach(key => {
        if (vehicleToInsert[key] === undefined || vehicleToInsert[key] === null || vehicleToInsert[key] === '') {
          delete vehicleToInsert[key];
        }
      });
      
      // Ensure required fields have default values
      if (vehicleToInsert.is_available === undefined) {
        vehicleToInsert.is_available = true;
      }
      if (vehicleToInsert.is_featured === undefined) {
        vehicleToInsert.is_featured = false;
      }
      
      console.log('📋 Final vehicle data for insert:', vehicleToInsert);

      // Insert vehicle first
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert([vehicleToInsert])
        .select()
        .single();

      if (vehicleError) {
        console.error('❌ Supabase vehicle insert error:', vehicleError);
        console.error('❌ Error details:', JSON.stringify(vehicleError, null, 2));
        console.error('❌ Data that caused error:', JSON.stringify(vehicleToInsert, null, 2));
        throw vehicleError;
      }

      console.log('✅ Vehicle created:', vehicle.id);
      return {
        success: true,
        data: vehicle
      };
    } catch (error) {
      console.error('❌ Test createVehicle error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

async function testAdminFormSubmission() {
  console.log('🧪 TESTING ADMIN FORM SUBMISSION FIX');
  console.log('====================================\n');
  
  const vehicleService = new TestVehicleService();
  
  // 1. Test with typical admin form data (including imageFiles/videoFiles)
  console.log('1️⃣ Testing with typical admin form data...');
  
  const adminFormData = {
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    price: 32000,
    mileage: 1500,
    transmission: 'Automatic',
    bodyType: 'Sedan',
    fuelType: 'Hybrid',
    exteriorColor: 'Silver',
    interiorColor: 'Black',
    engine: '2.5L Hybrid',
    drivetrain: 'FWD',
    description: 'Clean vehicle with low mileage',
    features: ['Navigation', 'Backup Camera', 'Bluetooth'],
    isAvailable: true,
    isFeatured: false,
    // These would be in the form data but should be extracted
    imageFiles: [], // Mock file objects
    videoFiles: [], // Mock file objects
    images: [] // Base64 preview strings
  };
  
  console.log('📋 Raw admin form data:', adminFormData);
  
  // 2. Simulate the handleFormSubmit fix
  console.log('\n2️⃣ Simulating handleFormSubmit extraction...');
  const { imageFiles = [], videoFiles = [], images, ...cleanVehicleData } = adminFormData;
  
  console.log('📸 Extracted imageFiles:', imageFiles.length);
  console.log('🎥 Extracted videoFiles:', videoFiles.length);
  console.log('📋 Clean vehicle data:', cleanVehicleData);
  
  // 3. Test vehicle creation
  console.log('\n3️⃣ Testing vehicle creation...');
  const result = await vehicleService.createVehicle(cleanVehicleData, imageFiles, videoFiles);
  
  if (result.success) {
    console.log('✅ Vehicle creation successful!');
    
    // Clean up
    console.log('\n🧹 Cleaning up test vehicle...');
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', result.data.id);
    
    if (deleteError) {
      console.log('⚠️ Failed to delete test vehicle:', deleteError.message);
    } else {
      console.log('✅ Test vehicle cleaned up successfully');
    }
  } else {
    console.log('❌ Vehicle creation failed:', result.error);
  }
  
  // 4. Test with problematic data
  console.log('\n4️⃣ Testing with problematic data (nulls/undefined)...');
  
  const problematicData = {
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 28000,
    mileage: null, // This might cause issues
    transmission: '',
    bodyType: undefined,
    fuelType: 'Gasoline',
    exteriorColor: null,
    interiorColor: '',
    description: undefined
  };
  
  console.log('📋 Problematic data:', problematicData);
  
  const problematicResult = await vehicleService.createVehicle(problematicData);
  
  if (problematicResult.success) {
    console.log('✅ Problematic data handled successfully!');
    
    // Clean up
    await supabase.from('vehicles').delete().eq('id', problematicResult.data.id);
    console.log('🧹 Cleaned up problematic test vehicle');
  } else {
    console.log('❌ Problematic data failed (expected):', problematicResult.error);
  }
  
  console.log('\n🎯 TEST SUMMARY');
  console.log('===============');
  console.log(`Form Data Extraction: ${result.success ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`Data Cleaning: ${problematicResult.success ? '✅ WORKING' : '⚠️ NEEDS REVIEW'}`);
  console.log(`Vehicle Creation: ${result.success ? '✅ WORKING' : '❌ FAILED'}`);
  
  if (result.success) {
    console.log('\n🎉 ADMIN FORM SUBMISSION FIX IS WORKING!');
  } else {
    console.log('\n⚠️ ADMIN FORM SUBMISSION STILL HAS ISSUES');
  }
}

testAdminFormSubmission().catch(console.error);
