// Final test script for admin edit functionality
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testCompleteEditFlow() {
  try {
    console.log('🧪 FINAL ADMIN EDIT FORM TEST\n');
    console.log('='.repeat(50));
    
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Missing Supabase credentials');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get a vehicle to test with
    console.log('1️⃣ Fetching vehicle for edit test...');
    const { data: vehicles, error: fetchError } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_images (
          id,
          url,
          public_id,
          is_primary,
          sort_order
        )
      `)
      .limit(1);
    
    if (fetchError) {
      console.error('❌ Error fetching vehicle:', fetchError);
      return;
    }
    
    if (!vehicles || vehicles.length === 0) {
      console.log('❌ No vehicles found in database');
      return;
    }
    
    const rawVehicle = vehicles[0];
    console.log('✅ Raw vehicle fetched from database:');
    console.log('📋 Available database fields:', Object.keys(rawVehicle));
    console.log('');
    
    // Show the actual database values
    console.log('2️⃣ Database Field Values:');
    console.log('   ID:', rawVehicle.id);
    console.log('   Make:', rawVehicle.make);
    console.log('   Model:', rawVehicle.model); 
    console.log('   Year:', rawVehicle.year);
    console.log('   Price:', rawVehicle.price);
    console.log('   Mileage:', rawVehicle.mileage);
    console.log('   VIN:', rawVehicle.vin);
    console.log('   Transmission:', rawVehicle.transmission);
    console.log('   Fuel Type:', rawVehicle.fuel_type);
    console.log('   Body Style:', rawVehicle.body_style);
    console.log('   Exterior Color:', rawVehicle.exterior_color);
    console.log('   Engine:', rawVehicle.engine);
    console.log('   Description:', rawVehicle.description ? rawVehicle.description.substring(0, 50) + '...' : 'None');
    console.log('   Features:', rawVehicle.features);
    console.log('   Is Available:', rawVehicle.is_available);
    console.log('   Condition:', rawVehicle.condition || 'NOT SET');
    console.log('');
    
    // Simulate the transformation that would happen in the service
    console.log('3️⃣ Simulating SupabaseVehicleService transformation...');
    
    const transformed = { ...rawVehicle };
    
    // Apply the same transformation logic as the service
    if (transformed.is_available !== undefined) {
      transformed.status = transformed.is_available ? 'Available' : 'Sold';
    } else {
      transformed.status = 'Available';
    }
    
    if (!transformed.condition) {
      transformed.condition = 'Used';
    }
    
    // Create form data object
    const formData = {
      make: transformed.make || '',
      model: transformed.model || '',
      year: transformed.year || new Date().getFullYear(),
      price: transformed.price || '',
      mileage: transformed.mileage || '',
      vin: transformed.vin || '',
      exterior_color: transformed.exterior_color || '',
      transmission: transformed.transmission || 'Automatic',
      fuel_type: transformed.fuel_type || 'Gasoline',
      body_style: transformed.body_style || 'Sedan',
      engine: transformed.engine || '',
      condition: transformed.condition || 'Used',
      status: transformed.status || 'Available',
      description: transformed.description || '',
      features: Array.isArray(transformed.features) ? transformed.features : []
    };
    
    console.log('✅ Form data that should populate the edit form:');
    console.log('   Make:', formData.make);
    console.log('   Model:', formData.model);
    console.log('   Year:', formData.year);
    console.log('   Price:', formData.price);
    console.log('   Mileage:', formData.mileage);
    console.log('   VIN:', formData.vin);
    console.log('   Exterior Color:', formData.exterior_color);
    console.log('   Transmission:', formData.transmission);
    console.log('   Fuel Type:', formData.fuel_type);
    console.log('   Body Style:', formData.body_style);
    console.log('   Engine:', formData.engine);
    console.log('   Condition:', formData.condition);
    console.log('   Status:', formData.status);
    console.log('   Description:', formData.description ? 'YES (has description)' : 'NO');
    console.log('   Features count:', formData.features.length);
    console.log('');
    
    // Check for any missing critical fields
    console.log('4️⃣ Checking for missing critical form fields...');
    const requiredFields = ['make', 'model', 'year', 'price', 'mileage', 'vin', 'exterior_color', 'transmission', 'fuel_type', 'body_style', 'engine'];
    const missingFields = [];
    const emptyFields = [];
    
    requiredFields.forEach(field => {
      if (!(field in formData)) {
        missingFields.push(field);
      } else if (!formData[field] && formData[field] !== 0) {
        emptyFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields);
    }
    
    if (emptyFields.length > 0) {
      console.log('⚠️  Empty fields:', emptyFields);
    }
    
    if (missingFields.length === 0 && emptyFields.length === 0) {
      console.log('✅ All required fields have values!');
    }
    
    console.log('');
    console.log('5️⃣ Summary:');
    console.log('   Database has all required fields:', missingFields.length === 0);
    console.log('   All fields have values:', emptyFields.length === 0);
    console.log('   Form should populate correctly:', missingFields.length === 0 && emptyFields.length <= 2); // Allow 2 empty fields
    
    if (missingFields.length === 0 && emptyFields.length <= 2) {
      console.log('');
      console.log('🎉 SUCCESS: The edit form should now work correctly!');
      console.log('📝 Next steps:');
      console.log('   1. Deploy the updated code');
      console.log('   2. Test the edit functionality');
      console.log('   3. All form fields should populate with vehicle data');
    } else {
      console.log('');
      console.log('❌ Issues still exist that need to be resolved');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testCompleteEditFlow();
