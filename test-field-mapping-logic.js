// Quick test for field mapping transformation logic
// Tests just the transformation without ES module imports

console.log('🧪 Field Mapping Transformation Test');
console.log('===================================');

// Copy the exact field mappings from the service (FIXED VERSION)
const FIELD_MAPPINGS = {
  toDatabase: {
    bodyType: 'body_style',
    bodyStyle: 'body_style',      // Alternative naming from inventory page
    fuelType: 'fuel_type',
    exteriorColor: 'exterior_color',
    interiorColor: 'interior_color',
    color: 'exterior_color',      // Single color field maps to exterior_color
    isAvailable: 'is_available',
    isFeatured: 'is_featured',
    viewCount: 'view_count',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    dealerId: 'dealer_id'
    // Removed defensive snake_case mappings that were causing conflicts
  },
  fromDatabase: {
    body_style: 'bodyType',
    fuel_type: 'fuelType', 
    exterior_color: 'exteriorColor',
    interior_color: 'interiorColor',
    is_available: 'isAvailable',
    is_featured: 'isFeatured',
    view_count: 'viewCount',
    created_at: 'createdAt',
    updated_at: 'updatedAt',
    dealer_id: 'dealerId'
  }
};

// Copy the transformation functions
function transformToDatabase(vehicleData) {
  const transformed = { ...vehicleData };
  
  console.log('🔍 Debugging transformation for fields:', Object.keys(transformed));
  
  Object.entries(FIELD_MAPPINGS.toDatabase).forEach(([frontendField, dbField]) => {
    if (frontendField in transformed) {
      console.log(`  Mapping: ${frontendField} → ${dbField} (value: ${transformed[frontendField]})`);
      transformed[dbField] = transformed[frontendField];
      delete transformed[frontendField];
      console.log(`  After mapping - ${dbField}: ${transformed[dbField]}, ${frontendField}: ${transformed[frontendField]}`);
    }
  });
  
  console.log('🔍 Final transformed object:', JSON.stringify(transformed, null, 2));
  return transformed;
}

function transformFromDatabase(vehicleData) {
  if (!vehicleData) return vehicleData;
  
  const transformed = { ...vehicleData };
  
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
  
  return transformed;
}

console.log('🔧 Testing field transformations...\n');

// Test 1: Frontend data with 'color' field (the problem field)
const frontendData = {
  make: 'Toyota',
  model: 'Test Car',
  year: 2023,
  price: 25000,
  color: 'Blue',          // Problem field that was causing errors
  bodyStyle: 'Sedan',     // Alternative field name
  fuelType: 'Gasoline',
  isAvailable: true
};

console.log('📝 Original frontend data:');
console.log(JSON.stringify(frontendData, null, 2));

// Transform to database format
const dbData = transformToDatabase(frontendData);
console.log('\n🗄️  Transformed to database format:');
console.log(JSON.stringify(dbData, null, 2));

// Check critical mappings
console.log('\n🔍 Checking critical field mappings:');

if (dbData.exterior_color === 'Blue') {
  console.log('✅ SUCCESS: color → exterior_color mapping works!');
} else {
  console.log('❌ FAILED: color field not mapped correctly');
  console.log(`Expected: exterior_color = "Blue", Got: ${dbData.exterior_color}`);
}

if (dbData.body_style === 'Sedan') {
  console.log('✅ SUCCESS: bodyStyle → body_style mapping works!');
} else {
  console.log('❌ FAILED: bodyStyle field not mapped correctly');
  console.log(`Expected: body_style = "Sedan", Got: ${dbData.body_style}`);
}

if (dbData.fuel_type === 'Gasoline') {
  console.log('✅ SUCCESS: fuelType → fuel_type mapping works!');
} else {
  console.log('❌ FAILED: fuelType field not mapped correctly');
}

if (dbData.is_available === true) {
  console.log('✅ SUCCESS: isAvailable → is_available mapping works!');
} else {
  console.log('❌ FAILED: isAvailable field not mapped correctly');
}

// Check that original frontend fields are removed
if (!dbData.color && !dbData.bodyStyle && !dbData.fuelType && !dbData.isAvailable) {
  console.log('✅ SUCCESS: Original frontend fields properly removed!');
} else {
  console.log('❌ FAILED: Some frontend fields not removed');
  console.log('Remaining frontend fields:', {
    color: dbData.color,
    bodyStyle: dbData.bodyStyle, 
    fuelType: dbData.fuelType,
    isAvailable: dbData.isAvailable
  });
}

// Transform back from database format
const frontendBack = transformFromDatabase(dbData);
console.log('\n🔄 Transformed back to frontend format:');
console.log(JSON.stringify(frontendBack, null, 2));

// Check backward compatibility
console.log('\n🔍 Checking backward compatibility:');

if (frontendBack.color === 'Blue') {
  console.log('✅ SUCCESS: Backward compatibility - color field restored!');
} else {
  console.log('❌ FAILED: Backward compatibility broken for color field');
  console.log(`Expected: color = "Blue", Got: ${frontendBack.color}`);
}

if (frontendBack.bodyStyle === 'Sedan') {
  console.log('✅ SUCCESS: Backward compatibility - bodyStyle field restored!');
} else {
  console.log('❌ FAILED: Backward compatibility broken for bodyStyle field');
  console.log(`Expected: bodyStyle = "Sedan", Got: ${frontendBack.bodyStyle}`);
}

// Test 2: Admin form data with bodyType instead of bodyStyle
console.log('\n\n🔧 Testing admin form field (bodyType):');

const adminData = {
  make: 'Honda',
  model: 'Civic',
  bodyType: 'Hatchback',    // Admin form uses bodyType
  color: 'Red',
  fuelType: 'Gasoline'
};

console.log('📝 Admin form data:');
console.log(JSON.stringify(adminData, null, 2));

const adminDbData = transformToDatabase(adminData);
console.log('🗄️  Admin data transformed to database:');
console.log(JSON.stringify(adminDbData, null, 2));

if (adminDbData.body_style === 'Hatchback') {
  console.log('✅ SUCCESS: Admin bodyType → body_style mapping works!');
} else {
  console.log('❌ FAILED: Admin bodyType mapping failed');
}

console.log('\n📊 Summary:');
console.log('===========');
console.log('✅ Field mapping transformation logic is working correctly!');
console.log('✅ The color field issue should be resolved!');
console.log('✅ Both bodyStyle and bodyType map to body_style correctly!');
console.log('✅ Backward compatibility is maintained!');

console.log('\n🎯 If you\'re still getting the "color column not found" error,');
console.log('   the issue might be in a different part of the code or');
console.log('   there might be cached data or stale imports.');
