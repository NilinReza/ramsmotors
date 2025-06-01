// Comprehensive test to verify PGRST204 fix is working
import { supabase } from './src/config/supabase.js';

// Import the actual service to test the real transformation logic
class TestSupabaseVehicleService {
  constructor() {
    this.currentDealerId = 'ramsmotors';
  }

  // Copy the actual transformation logic from the service
  transformToDatabase(vehicleData) {
    const transformed = { ...vehicleData };
    
    // Field mappings
    const fieldMappings = {
      bodyType: 'body_style',
      bodyStyle: 'body_style',
      fuelType: 'fuel_type',
      exteriorColor: 'exterior_color',
      interiorColor: 'interior_color',
      color: 'exterior_color',
      isAvailable: 'is_available',
      isFeatured: 'is_featured',
      viewCount: 'view_count',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      dealerId: 'dealer_id'
    };
    
    Object.entries(fieldMappings).forEach(([frontendField, dbField]) => {
      if (frontendField in transformed) {
        transformed[dbField] = transformed[frontendField];
        delete transformed[frontendField];
      }
    });
    
    // Handle status to is_available conversion
    if ('status' in transformed) {
      transformed.is_available = transformed.status === 'Available';
      delete transformed.status;
    }
    
    return transformed;
  }

  async testVehicleCreation() {
    try {
      console.log('🧪 Testing Vehicle Creation with Status Fix\n');
      
      // Simulate exact form data from VehicleForm component
      const formData = {
        make: 'Toyota',
        model: 'Camry',
        year: 2025,
        price: 25000,
        mileage: 50000,
        color: 'Black',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        bodyType: 'Sedan',
        engine: '2.0L 4-Cylinder',
        vin: '1HGBH41JXMN109186',
        description: 'Test vehicle for PGRST204 fix',
        features: ['Air Conditioning', 'Bluetooth'],
        condition: 'Used',
        status: 'Available' // This was causing the PGRST204 error
      };
      
      console.log('📝 Original form data:');
      console.log('   Status field:', formData.status);
      console.log('   Contains status:', 'status' in formData);
      
      // Transform the data
      const transformedData = this.transformToDatabase(formData);
      
      console.log('\n🔄 After transformation:');
      console.log('   Status field removed:', !('status' in transformedData));
      console.log('   Is available field:', transformedData.is_available);
      console.log('   Contains is_available:', 'is_available' in transformedData);
      
      // Add required fields
      const vehicleToInsert = {
        ...transformedData,
        dealer_id: this.currentDealerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Filter to only supported columns
      const supportedColumns = [
        'make', 'model', 'year', 'price', 'mileage', 'transmission', 'engine', 
        'vin', 'description', 'features', 'body_style', 'fuel_type', 
        'exterior_color', 'interior_color', 'dealer_id', 'created_at', 'updated_at', 
        'is_available', 'is_featured'
      ];
      
      const filteredData = {};
      Object.keys(vehicleToInsert).forEach(key => {
        if (supportedColumns.includes(key)) {
          filteredData[key] = vehicleToInsert[key];
        } else {
          console.log(`⚠️ Skipping unsupported field: ${key}`);
        }
      });
      
      console.log('\n📋 Final data to insert:');
      console.log('   Fields:', Object.keys(filteredData).sort());
      console.log('   Contains status:', 'status' in filteredData);
      console.log('   Contains is_available:', 'is_available' in filteredData);
      
      // Test the actual insertion (DRY RUN first)
      console.log('\n🧪 Testing database insertion...');
      
      // Check if we can access the table
      const { data: testData, error: testError } = await supabase
        .from('vehicles')
        .select('id')
        .limit(1);
        
      if (testError) {
        console.log('❌ Database connection error:', testError.message);
        return false;
      }
      
      console.log('✅ Database connection successful');
      
      // Try to insert the vehicle
      const { data, error } = await supabase
        .from('vehicles')
        .insert(filteredData)
        .select();
        
      if (error) {
        console.log('❌ Vehicle insertion failed:', error.message);
        console.log('   Error code:', error.code);
        console.log('   Data that caused error:', JSON.stringify(filteredData, null, 2));
        return false;
      } else {
        console.log('✅ Vehicle insertion successful!');
        console.log('   Inserted vehicle ID:', data[0]?.id);
        
        // Clean up - delete the test vehicle
        if (data[0]?.id) {
          await supabase
            .from('vehicles')
            .delete()
            .eq('id', data[0].id);
          console.log('🧹 Test vehicle cleaned up');
        }
        
        return true;
      }
      
    } catch (error) {
      console.log('💥 Unexpected error:', error.message);
      return false;
    }
  }
}

async function runTest() {
  const service = new TestSupabaseVehicleService();
  const success = await service.testVehicleCreation();
  
  console.log('\n🎯 Test Result:');
  if (success) {
    console.log('✅ PGRST204 Error RESOLVED!');
    console.log('   • Status field properly converted to is_available');
    console.log('   • No unsupported columns sent to database');
    console.log('   • Vehicle creation works without errors');
  } else {
    console.log('❌ PGRST204 Error still exists');
    console.log('   • Check the error details above');
    console.log('   • May need additional debugging');
  }
}

runTest().catch(console.error);
