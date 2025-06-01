// Debug Supabase Vehicle Insert Error
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Field mapping for vehicle creation
const FIELD_MAPPINGS = {
  bodyType: 'body_style',
  bodyStyle: 'body_style',
  fuelType: 'fuel_type',
  exteriorColor: 'exterior_color',
  interiorColor: 'interior_color',
  color: 'exterior_color',
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

async function debugVehicleInsert() {
  console.log('🔍 DEBUGGING SUPABASE VEHICLE INSERT ERROR');
  console.log('==========================================\n');
  
  try {
    // 1. Check database connection
    console.log('1️⃣ Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('vehicles')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError);
      return;
    }
    console.log('✅ Database connection successful\n');
      // 2. Skip schema check for now
    console.log('2️⃣ Skipping schema check, proceeding to insert test...');
    
    // 3. Test minimal vehicle insert
    console.log('\n3️⃣ Testing minimal vehicle insert...');
    const minimalVehicle = {
      make: 'Test',
      model: 'Debug',
      year: 2024,
      price: 1000,
      mileage: 0,
      dealer_id: 'ramsmotors',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📋 Minimal vehicle data:', minimalVehicle);
    
    const { data: minimalResult, error: minimalError } = await supabase
      .from('vehicles')
      .insert([minimalVehicle])
      .select()
      .single();
    
    if (minimalError) {
      console.error('❌ MINIMAL INSERT ERROR:', minimalError);
      console.error('Error details:', JSON.stringify(minimalError, null, 2));
    } else {
      console.log('✅ Minimal insert successful:', minimalResult.id);
      
      // Clean up
      await supabase.from('vehicles').delete().eq('id', minimalResult.id);
      console.log('🧹 Cleaned up test vehicle\n');
    }
    
    // 4. Test full vehicle with field mapping
    console.log('4️⃣ Testing full vehicle with field mapping...');
    const fullVehicleData = {
      make: 'Test',
      model: 'FullDebug',
      year: 2024,
      price: 25000,
      mileage: 1000,
      transmission: 'Automatic',
      bodyType: 'Sedan',
      fuelType: 'Gasoline',
      exteriorColor: 'Blue',
      interiorColor: 'Black',
      engine: '2.0L',
      drivetrain: 'FWD',
      description: 'Test vehicle for debugging',
      features: ['Test Feature'],
      isAvailable: true,
      isFeatured: false
    };
    
    console.log('📋 Original vehicle data:', fullVehicleData);
    
    const transformedData = transformToDatabase(fullVehicleData);
    console.log('📋 Transformed data:', transformedData);
    
    const vehicleToInsert = {
      ...transformedData,
      dealer_id: 'ramsmotors',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📋 Final insert data:', vehicleToInsert);
    
    const { data: fullResult, error: fullError } = await supabase
      .from('vehicles')
      .insert([vehicleToInsert])
      .select()
      .single();
    
    if (fullError) {
      console.error('❌ FULL INSERT ERROR:', fullError);
      console.error('Error details:', JSON.stringify(fullError, null, 2));
      console.error('Error code:', fullError.code);
      console.error('Error message:', fullError.message);
      
      // Check for specific field issues
      if (fullError.message && fullError.message.includes('violates')) {
        console.error('🔍 Constraint violation detected - checking fields...');
        
        // Try without optional fields
        const essentialFields = {
          make: vehicleToInsert.make,
          model: vehicleToInsert.model,
          year: vehicleToInsert.year,
          price: vehicleToInsert.price,
          mileage: vehicleToInsert.mileage,
          dealer_id: vehicleToInsert.dealer_id,
          created_at: vehicleToInsert.created_at,
          updated_at: vehicleToInsert.updated_at
        };
        
        console.log('🔍 Trying with essential fields only:', essentialFields);
        
        const { data: essentialResult, error: essentialError } = await supabase
          .from('vehicles')
          .insert([essentialFields])
          .select()
          .single();
        
        if (essentialError) {
          console.error('❌ ESSENTIAL FIELDS ERROR:', essentialError);
        } else {
          console.log('✅ Essential fields insert successful:', essentialResult.id);
          await supabase.from('vehicles').delete().eq('id', essentialResult.id);
          console.log('🧹 Cleaned up essential test vehicle');
        }
      }
    } else {
      console.log('✅ Full insert successful:', fullResult.id);
      
      // Clean up
      await supabase.from('vehicles').delete().eq('id', fullResult.id);
      console.log('🧹 Cleaned up full test vehicle');
    }
    
  } catch (error) {
    console.error('💥 Debug script error:', error);
  }
}

debugVehicleInsert().catch(console.error);
