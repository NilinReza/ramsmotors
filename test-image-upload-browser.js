const puppeteer = require('puppeteer');
const path = require('path');

async function testImageUpload() {
  console.log('🧪 BROWSER IMAGE UPLOAD TEST');
  console.log('=============================');
  
  let browser;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({ 
      headless: false, // Show browser for debugging
      devtools: true   // Open dev tools
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      console.log(`🖥️  CONSOLE ${msg.type().toUpperCase()}: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      console.log(`❌ PAGE ERROR: ${error.message}`);
    });
    
    // Navigate to the vehicle form
    console.log('📍 Navigating to vehicle form...');
    await page.goto('http://localhost:3001/admin/vehicles/add', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for the form to load
    await page.waitForSelector('input[type="file"]', { timeout: 10000 });
    console.log('✅ File input found');
    
    // Create a test image file
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    
    // Check if form elements are present
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      console.log('✅ File input element found');
      
      // Try to upload a file (simulate file selection)
      try {
        // This won't work without an actual file, but let's see what happens
        await page.evaluate(() => {
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) {
            console.log('Found file input:', fileInput);
            
            // Create a fake file event to test the handler
            const fakeEvent = {
              target: {
                files: []
              }
            };
            
            // Check if the onChange handler exists
            const handler = fileInput.onchange;
            console.log('File input has onChange handler:', !!handler);
            
            return true;
          }
          return false;
        });
        
        console.log('✅ File input interaction test completed');
      } catch (error) {
        console.log(`❌ File upload error: ${error.message}`);
      }
    }
    
    // Check for React errors
    const reactErrors = await page.evaluate(() => {
      return window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ? 'React DevTools available' : 'No React DevTools';
    });
    console.log(`🔧 React status: ${reactErrors}`);
    
    // Wait a bit to see the page
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Check if puppeteer is available
try {
  testImageUpload();
} catch (error) {
  console.log('⚠️  Puppeteer not available, using alternative test approach');
  console.log('Please manually test by:');
  console.log('1. Opening http://localhost:3001/admin/vehicles/add');
  console.log('2. Opening browser dev tools (F12)');
  console.log('3. Trying to upload an image');
  console.log('4. Checking for console errors');
}
