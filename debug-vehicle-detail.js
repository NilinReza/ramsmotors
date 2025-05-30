// Debug script to test VehicleDetail data structure issues
// Run with: node debug-vehicle-detail.js

const fs = require('fs');
const path = require('path');

function analyzeVehicleDetailIssues() {
  console.log('🔍 ANALYZING VEHICLE DETAIL DATA STRUCTURE ISSUES');
  console.log('='.repeat(60));

  // Read VehicleDetail component
  const vehicleDetailPath = path.join(__dirname, 'src', 'pages', 'VehicleDetail.jsx');
  
  if (fs.existsSync(vehicleDetailPath)) {
    const content = fs.readFileSync(vehicleDetailPath, 'utf8');
    
    console.log('\n📋 FIELD USAGE ANALYSIS');
    console.log('-'.repeat(30));
    
    // Look for field access patterns
    const fieldAccessPatterns = [
      { pattern: /vehicle\.price/g, field: 'price' },
      { pattern: /vehicle\.mileage/g, field: 'mileage' },
      { pattern: /vehicle\.transmission/g, field: 'transmission' },
      { pattern: /vehicle\.fuelType/g, field: 'fuelType' },
      { pattern: /vehicle\.bodyStyle/g, field: 'bodyStyle' },
      { pattern: /vehicle\.color/g, field: 'color' },
      { pattern: /vehicle\.status/g, field: 'status' },
      { pattern: /vehicle\.description/g, field: 'description' },
      { pattern: /vehicle\.images/g, field: 'images' },
      { pattern: /vehicle\.videos/g, field: 'videos' },
      { pattern: /vehicle\.year/g, field: 'year' },
      { pattern: /vehicle\.make/g, field: 'make' },
      { pattern: /vehicle\.model/g, field: 'model' },
      { pattern: /vehicle\.engineSize/g, field: 'engineSize' }
    ];
    
    fieldAccessPatterns.forEach(({ pattern, field }) => {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`✅ ${field}: Found ${matches.length} usage(s)`);
      }
    });
    
    console.log('\n📊 MOCK DATA FIELD MAPPING ANALYSIS');
    console.log('-'.repeat(40));
    
    // Check what fields exist in mock data vs what VehicleDetail expects
    const mockFields = [
      'id', 'vin', 'make', 'model', 'year', 'price', 'mileage', 
      'transmission', 'fuelType', 'bodyStyle', 'status', 'description', 
      'images', 'videos', 'createdAt'
    ];
    
    const expectedFields = [
      'price', 'mileage', 'transmission', 'fuelType', 'bodyStyle', 
      'color', 'status', 'description', 'images', 'videos', 
      'year', 'make', 'model', 'engineSize'
    ];
    
    console.log('\n✅ Fields available in mock data:');
    mockFields.forEach(field => console.log(`   - ${field}`));
    
    console.log('\n❓ Fields expected by VehicleDetail:');
    expectedFields.forEach(field => {
      const available = mockFields.includes(field);
      console.log(`   ${available ? '✅' : '❌'} ${field}`);
    });
    
    console.log('\n🚨 POTENTIAL ISSUES DETECTED:');
    console.log('-'.repeat(30));
    
    // Missing color field
    if (!mockFields.includes('color')) {
      console.log('❌ MISSING: color field in mock data');
    }
    
    // Missing engineSize field  
    if (!mockFields.includes('engineSize')) {
      console.log('❌ MISSING: engineSize field in mock data');
    }
    
    console.log('\n💡 RECOMMENDED FIXES:');
    console.log('-'.repeat(20));
    console.log('1. Add missing "color" field to mock data');
    console.log('2. Add missing "engineSize" field to mock data');
    console.log('3. Update VehicleDetail to handle missing fields gracefully');
    console.log('4. Check if price formatting handles null/undefined values');
    
  } else {
    console.log('❌ VehicleDetail.jsx file not found');
  }
}

// Run analysis
analyzeVehicleDetailIssues();
