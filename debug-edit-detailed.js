// Debug script to test admin edit vehicle functionality
// This will help us understand the data flow and identify issues

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://wouvnoexhcfhpevrxfuy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdXZub2V4aGNmaHBldnJ4ZnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjY1OTIsImV4cCI6MjA2NDA0MjU5Mn0.fT5japUFLZgVNqruJPAz4hRJYx7kp9a90xDDTNpYwFk';

const supabase = createClient(supabaseUrl, supabaseKey);

// We'll test the transformation directly
async function testEditFlow() {
  console.log('🔍 Testing Admin Edit Vehicle Flow');
  console.log('=====================================');
  
  try {
    // Step 1: Get all vehicles to see what's available
    console.log('\n📋 Step 1: Fetching all vehicles...');
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (vehiclesError) {
      console.error('❌ Error fetching vehicles:', vehiclesError);
      return;
    }
    
    console.log(`✅ Found ${vehicles.length} vehicles`);
    vehicles.forEach((v, i) => {
      console.log(`  ${i + 1}. ${v.make} ${v.model} (ID: ${v.id})`);
    });
    
    if (vehicles.length === 0) {
      console.log('⚠️ No vehicles found in database');
      return;
    }
    
    // Step 2: Test getting a specific vehicle (first one)
    const testVehicleId = vehicles[0].id;
    console.log(`\n🎯 Step 2: Getting vehicle with ID: ${testVehicleId}`);
    
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', testVehicleId)
      .single();
    
    if (vehicleError) {
      console.error('❌ Error fetching single vehicle:', vehicleError);
      return;
    }
    
    console.log('✅ Raw vehicle data from database:');
    console.log(JSON.stringify(vehicle, null, 2));
    
    // Step 3: Test form field mapping as VehicleForm would receive it
    console.log('\n🔄 Step 3: Testing VehicleForm field mapping...');
    
    const mappedVehicle = {
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year || new Date().getFullYear(),
      price: vehicle.price || '',
      mileage: vehicle.mileage || '',
      exterior_color: vehicle.exterior_color || '',
      transmission: vehicle.transmission || 'Automatic',
      fuel_type: vehicle.fuel_type || 'Gasoline',
      body_style: vehicle.body_style || 'Sedan',
      engine: vehicle.engine || '',
      vin: vehicle.vin || '',
      description: vehicle.description || '',
      features: Array.isArray(vehicle.features) ? vehicle.features : [],
      condition: vehicle.condition || 'Used',
      status: vehicle.is_available ? 'Available' : 'Sold',
      id: vehicle.id,
      images: vehicle.images || [],
      videos: vehicle.videos || []
    };
    
    console.log('✅ Mapped vehicle data for form:');
    console.log(JSON.stringify(mappedVehicle, null, 2));
    
    // Step 4: Check for missing or problematic fields
    console.log('\n⚠️ Step 4: Checking for potential issues...');
    const issues = [];
    
    if (!mappedVehicle.make) issues.push('Missing make');
    if (!mappedVehicle.model) issues.push('Missing model');
    if (!mappedVehicle.year) issues.push('Missing year');
    if (!mappedVehicle.price) issues.push('Missing price');
    if (!mappedVehicle.exterior_color) issues.push('Missing exterior_color');
    if (!mappedVehicle.fuel_type) issues.push('Missing fuel_type');
    if (!mappedVehicle.body_style) issues.push('Missing body_style');
    if (!mappedVehicle.engine) issues.push('Missing engine');
    if (mappedVehicle.features && !Array.isArray(mappedVehicle.features)) {
      issues.push('Features is not an array');
    }
    
    if (issues.length > 0) {
      console.log('❌ Found issues:');
      issues.forEach(issue => console.log(`  - ${issue}`));
    } else {
      console.log('✅ No obvious issues found');
    }
    
    // Step 5: Check if form would show data
    console.log('\n📝 Step 5: Form field check...');
    console.log(`Make: "${mappedVehicle.make}" (${mappedVehicle.make ? '✅' : '❌'})`);
    console.log(`Model: "${mappedVehicle.model}" (${mappedVehicle.model ? '✅' : '❌'})`);
    console.log(`Year: "${mappedVehicle.year}" (${mappedVehicle.year ? '✅' : '❌'})`);
    console.log(`Price: "${mappedVehicle.price}" (${mappedVehicle.price ? '✅' : '❌'})`);
    console.log(`Color: "${mappedVehicle.exterior_color}" (${mappedVehicle.exterior_color ? '✅' : '❌'})`);
    console.log(`Fuel Type: "${mappedVehicle.fuel_type}" (${mappedVehicle.fuel_type ? '✅' : '❌'})`);
    console.log(`Body Style: "${mappedVehicle.body_style}" (${mappedVehicle.body_style ? '✅' : '❌'})`);
    console.log(`Engine: "${mappedVehicle.engine}" (${mappedVehicle.engine ? '✅' : '❌'})`);
    
  } catch (error) {
    console.error('💥 Critical error in test:', error);
  }
}

// Run the test
testEditFlow().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
