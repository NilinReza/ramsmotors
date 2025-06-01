// Debug script to check actual database schema
const { supabase } = require('./src/config/supabase.js');

async function checkDatabaseSchema() {
  try {
    console.log('🔍 Checking actual database schema...');
    
    // Try to get one record to see the actual columns
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching data:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Available columns in database:');
      console.log(Object.keys(data[0]).sort());
    } else {
      console.log('📝 No data in table, trying schema introspection...');
      
      // Try a different approach - attempt to insert an empty record and see what fails
      const { error: schemaError } = await supabase
        .from('vehicles')
        .insert({})
        .select();
        
      if (schemaError) {
        console.log('📋 Schema error details:', schemaError);
      }
    }
    
    // Also try to check what columns are actually required
    console.log('\n🔍 Testing individual column existence...');
    const testColumns = [
      'make', 'model', 'year', 'price', 'mileage', 'transmission', 'engine', 
      'vin', 'description', 'features', 'status', 'condition', 'body_style', 'fuel_type', 
      'exterior_color', 'interior_color', 'dealer_id', 'created_at', 'updated_at', 
      'is_available', 'is_featured'
    ];
    
    for (const column of testColumns) {
      try {
        const { error } = await supabase
          .from('vehicles')
          .select(column)
          .limit(1);
          
        if (error) {
          console.log(`❌ Column '${column}' does not exist`);
        } else {
          console.log(`✅ Column '${column}' exists`);
        }
      } catch (e) {
        console.log(`❌ Column '${column}' failed: ${e.message}`);
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkDatabaseSchema();
