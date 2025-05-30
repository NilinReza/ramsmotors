// Test Supabase Integration
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🧪 Testing Supabase Integration...');
console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Supabase Key:', supabaseKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔄 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('vehicles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    console.log(`📊 Current vehicle count: ${data || 0}`);
    
    // Test reading vehicles
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id, make, model, year, price')
      .limit(5);
    
    if (vehiclesError) {
      console.error('❌ Error reading vehicles:', vehiclesError.message);
      return false;
    }
    
    console.log('✅ Vehicle data read successful');
    console.log(`📋 Sample vehicles:`, vehicles.map(v => `${v.year} ${v.make} ${v.model} - $${v.price}`));
    
    return true;
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Supabase integration test completed successfully!');
  } else {
    console.log('\n💥 Supabase integration test failed!');
  }
});
