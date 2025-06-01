// Clean up duplicate images and test the current system
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function cleanupAndTestImages() {
  console.log('🧹 Cleaning up duplicate images and testing system');
  
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Get all images grouped by vehicle and URL
    console.log('1️⃣ Analyzing current image situation...');
    const { data: allImages } = await supabase
      .from('vehicle_images')
      .select('*')
      .order('vehicle_id, created_at');
    
    console.log(`📊 Total images in database: ${allImages?.length || 0}`);
    
    if (allImages && allImages.length > 0) {
      // Group by vehicle_id and URL to find duplicates
      const imageGroups = {};
      
      allImages.forEach(img => {
        const key = `${img.vehicle_id}:${img.url}`;
        if (!imageGroups[key]) {
          imageGroups[key] = [];
        }
        imageGroups[key].push(img);
      });
      
      // Find duplicates
      const duplicateGroups = Object.entries(imageGroups).filter(([key, images]) => images.length > 1);
      
      console.log(`🔍 Found ${duplicateGroups.length} groups of duplicate images`);
      
      if (duplicateGroups.length > 0) {
        console.log('\n🚨 Duplicate image groups:');
        
        for (const [key, images] of duplicateGroups) {
          console.log(`\n  ${key}:`);
          images.forEach((img, idx) => {
            console.log(`    ${idx + 1}. ID: ${img.id.substring(0, 8)}..., Created: ${img.created_at}`);
          });
          
          // Keep the first image (oldest) and mark others for deletion
          const imagesToDelete = images.slice(1);
          console.log(`  📝 Will delete ${imagesToDelete.length} duplicate(s)`);
          
          // Delete duplicates
          for (const img of imagesToDelete) {
            const { error } = await supabase
              .from('vehicle_images')
              .delete()
              .eq('id', img.id);
            
            if (error) {
              console.log(`    ❌ Failed to delete ${img.id}: ${error.message}`);
            } else {
              console.log(`    ✅ Deleted duplicate image ${img.id.substring(0, 8)}...`);
            }
          }
        }
      } else {
        console.log('✅ No duplicate images found');
      }
      
      // Show final count
      const { data: finalImages } = await supabase
        .from('vehicle_images')
        .select('vehicle_id')
        .order('vehicle_id');
      
      const finalCounts = {};
      if (finalImages) {
        finalImages.forEach(img => {
          finalCounts[img.vehicle_id] = (finalCounts[img.vehicle_id] || 0) + 1;
        });
      }
      
      console.log('\n📈 Final image counts per vehicle:');
      Object.entries(finalCounts).forEach(([vehicleId, count]) => {
        console.log(`  Vehicle ${vehicleId.substring(0, 8)}...: ${count} image(s)`);
      });
    }
    
    console.log('\n✅ Cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupAndTestImages();
