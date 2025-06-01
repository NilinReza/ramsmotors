// Simple test to debug
console.log('Starting debug...');

require('dotenv').config();
console.log('dotenv loaded');

const { createClient } = require('@supabase/supabase-js');
console.log('supabase imported');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('URL exists:', !!supabaseUrl);
console.log('Key exists:', !!supabaseKey);

if (supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client created');
  
  // Test a simple query
  supabase
    .from('vehicle_images')
    .select('vehicle_id')
    .limit(5)
    .then(({ data, error }) => {
      if (error) {
        console.error('Query error:', error);
      } else {
        console.log('Query success, found', data?.length, 'images');
        
        // Count images per vehicle
        const counts = {};
        if (data) {
          data.forEach(img => {
            counts[img.vehicle_id] = (counts[img.vehicle_id] || 0) + 1;
          });
          console.log('Image counts per vehicle:', counts);
        }
      }
    })
    .catch(err => console.error('Promise error:', err));
} else {
  console.log('Missing credentials');
}
