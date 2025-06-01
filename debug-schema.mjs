// Simple test to check database schema columns
import { supabase } from './src/config/supabase.js';

async function checkSchema() {
  console.log('🔍 Checking database columns...');
  
  // First, let's see if there are any existing vehicles
  const { data: existingVehicles, error: fetchError } = await supabase
    .from('vehicles')
    .select('*')
    .limit(1);
    
  if (fetchError) {
    console.error('❌ Error fetching vehicles:', fetchError);
  } else if (existingVehicles && existingVehicles.length > 0) {
    console.log('✅ Found existing vehicle. Columns are:');
    console.log(Object.keys(existingVehicles[0]).sort());
    return;
  }
  
  // Test specific columns
  const columnsToTest = [
    'status', 'condition', 'availability', 'state', 
    'is_available', 'is_sold', 'vehicle_status'
  ];
  
  for (const col of columnsToTest) {
    try {
      const { error } = await supabase
        .from('vehicles')
        .select(col)
        .limit(1);
        
      if (error) {
        console.log(`❌ Column '${col}' - Error: ${error.message}`);
      } else {
        console.log(`✅ Column '${col}' exists`);
      }
    } catch (e) {
      console.log(`❌ Column '${col}' - Exception: ${e.message}`);
    }
  }
}

checkSchema().catch(console.error);
