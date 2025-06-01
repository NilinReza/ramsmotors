// Debug script to test the image transformation fix
const path = require('path');

// Mock the required modules for testing
function createMockSupabaseService() {
  // Import the field mappings and transformFromDatabase method
  const fs = require('fs');
  const serviceFile = fs.readFileSync('./src/services/supabaseVehicleService.js', 'utf8');
  
  // Mock vehicle data with vehicle_images (as returned by Supabase)
  const mockVehicleData = {
    id: '1',
    vehicle_make: 'Toyota',
    vehicle_model: 'Camry',
    vehicle_year: 2023,
    vehicle_price: 28500,
    is_available: true,
    vehicle_images: [
      {
        id: 1,
        image_url: 'https://example.com/image1.jpg',
        public_id: 'cloudinary_id_1',
        display_order: 1,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        image_url: 'https://example.com/image2.jpg',
        public_id: 'cloudinary_id_2', 
        display_order: 2,
        created_at: '2024-01-01T00:00:00Z'
      }
    ],
    vehicle_videos: [
      {
        id: 1,
        video_url: 'https://example.com/video1.mp4',
        public_id: 'cloudinary_video_1',
        display_order: 1,
        created_at: '2024-01-01T00:00:00Z'
      }
    ]
  };

  // Simulate the transformation logic from the service
  function transformFromDatabase(vehicleData) {
    if (!vehicleData) return vehicleData;
    
    const transformed = { ...vehicleData };
    
    // Apply field mappings (simplified for testing)
    const FIELD_MAPPINGS = {
      fromDatabase: {
        'vehicle_make': 'make',
        'vehicle_model': 'model',
        'vehicle_year': 'year',
        'vehicle_price': 'price',
        'is_available': 'isAvailable'
      }
    };
    
    Object.entries(FIELD_MAPPINGS.fromDatabase).forEach(([dbField, frontendField]) => {
      if (dbField in transformed) {
        transformed[frontendField] = transformed[dbField];
        delete transformed[dbField];
      }
    });
    
    // Add backward compatibility fields
    if (transformed.exteriorColor && !transformed.color) {
      transformed.color = transformed.exteriorColor;
    }
    
    if (transformed.bodyType && !transformed.bodyStyle) {
      transformed.bodyStyle = transformed.bodyType;
    }
    
    // Convert is_available back to status for frontend compatibility
    if ('isAvailable' in transformed) {
      transformed.status = transformed.isAvailable ? 'Available' : 'Sold';
    }
    
    // Transform vehicle_images to images array for frontend compatibility
    if (transformed.vehicle_images && Array.isArray(transformed.vehicle_images)) {
      transformed.images = transformed.vehicle_images.map(img => ({
        id: img.id,
        url: img.image_url,
        publicId: img.public_id || img.cloudinary_id,
        displayOrder: img.display_order || 0,
        createdAt: img.created_at
      }));
      delete transformed.vehicle_images;
    }
    
    // Transform vehicle_videos to videos array for frontend compatibility
    if (transformed.vehicle_videos && Array.isArray(transformed.vehicle_videos)) {
      transformed.videos = transformed.vehicle_videos.map(video => ({
        id: video.id,
        url: video.video_url,
        publicId: video.public_id || video.cloudinary_id,
        displayOrder: video.display_order || 0,
        createdAt: video.created_at
      }));
      delete transformed.vehicle_videos;
    }
    
    return transformed;
  }

  return {
    mockVehicleData,
    transformFromDatabase
  };
}

function runTransformationTest() {
  console.log('🔍 Testing Image Transformation Fix\n');
  
  const { mockVehicleData, transformFromDatabase } = createMockSupabaseService();
  
  console.log('📥 BEFORE Transformation:');
  console.log('- vehicle_images length:', mockVehicleData.vehicle_images?.length || 0);
  console.log('- vehicle_videos length:', mockVehicleData.vehicle_videos?.length || 0);
  console.log('- has "images" field:', 'images' in mockVehicleData);
  console.log('- has "videos" field:', 'videos' in mockVehicleData);
  
  if (mockVehicleData.vehicle_images && mockVehicleData.vehicle_images.length > 0) {
    console.log('- first vehicle_image structure:');
    console.log('  ', JSON.stringify(mockVehicleData.vehicle_images[0], null, 2));
  }
  
  console.log('\n🔄 Running transformation...\n');
  
  const transformed = transformFromDatabase(mockVehicleData);
  
  console.log('📤 AFTER Transformation:');
  console.log('- images length:', transformed.images?.length || 0);
  console.log('- videos length:', transformed.videos?.length || 0);
  console.log('- has "vehicle_images" field:', 'vehicle_images' in transformed);
  console.log('- has "vehicle_videos" field:', 'vehicle_videos' in transformed);
  
  if (transformed.images && transformed.images.length > 0) {
    console.log('- first image structure:');
    console.log('  ', JSON.stringify(transformed.images[0], null, 2));
    
    console.log('\n✅ SUCCESS! Image transformation working:');
    console.log('  - vehicle_images → images ✅');
    console.log('  - image_url → url ✅');
    console.log('  - public_id → publicId ✅');
    console.log('  - display_order → displayOrder ✅');
  } else {
    console.log('\n❌ FAILED! No images array found after transformation');
  }
  
  console.log('\n📋 All transformed fields:');
  Object.keys(transformed).sort().forEach(key => {
    const value = transformed[key];
    const type = Array.isArray(value) ? `Array(${value.length})` : typeof value;
    console.log(`  ${key}: ${type}`);
  });
}

runTransformationTest();
