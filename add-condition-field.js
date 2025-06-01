// Script to add the missing condition field to the database
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function addConditionField() {
  try {
    console.log('🔧 Adding condition field to vehicles table...\n');
    
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Missing Supabase credentials');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Execute the SQL to add the condition field
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Add missing condition field to vehicles table
        ALTER TABLE vehicles 
        ADD COLUMN IF NOT EXISTS condition VARCHAR(50) DEFAULT 'Used';
        
        -- Update existing records to have a default condition
        UPDATE vehicles 
        SET condition = 'Used' 
        WHERE condition IS NULL;
      `
    });
    
    if (error) {
      console.error('❌ Error adding condition field:', error);
      
      // Try a simpler approach - just query and update manually
      console.log('🔄 Trying manual update approach...');
      
      // First check if condition field exists
      const { data: vehicles, error: queryError } = await supabase
        .from('vehicles')
        .select('id, condition')
        .limit(1);
        
      if (queryError) {
        console.log('🆕 Condition field does not exist, will need to be added via dashboard');
        console.log('📋 Fields that need to be added to database:');
        console.log('   - condition (VARCHAR, default "Used")');
      } else {
        console.log('✅ Condition field already exists');
      }
      
      return;
    }
    
    console.log('✅ Successfully added condition field');
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

addConditionField();
