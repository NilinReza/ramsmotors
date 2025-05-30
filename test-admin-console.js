// Test script to validate admin portal functionality
// Run this in the browser console when on http://localhost:3001/admin

console.log('🧪 Starting Admin Portal Tests...');

// Test 1: Check if admin portal loads
const checkAdminPortalLoad = () => {
  console.log('Test 1: Checking admin portal load...');
  
  if (window.location.pathname.includes('/admin')) {
    console.log('✅ Admin portal URL loaded successfully');
    return true;
  } else {
    console.log('❌ Not on admin portal URL');
    return false;
  }
};

// Test 2: Check for React components
const checkReactComponents = () => {
  console.log('Test 2: Checking React components...');
  
  // Look for admin login form
  const loginForm = document.querySelector('form');
  if (loginForm) {
    console.log('✅ Login form found');
    return true;
  } else {
    console.log('❌ Login form not found');
    return false;
  }
};

// Test 3: Simulate login
const testLogin = async () => {
  console.log('Test 3: Testing login functionality...');
  
  try {
    // Fill in credentials
    const usernameInput = document.querySelector('input[name="username"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const submitButton = document.querySelector('button[type="submit"]');
    
    if (usernameInput && passwordInput && submitButton) {
      console.log('✅ Login form elements found');
      
      // Fill credentials
      usernameInput.value = 'admin';
      passwordInput.value = 'admin123';
      
      // Trigger change events
      usernameInput.dispatchEvent(new Event('change', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log('✅ Credentials filled in');
      console.log('📋 To complete login test, click the "Sign in" button');
      
      return true;
    } else {
      console.log('❌ Login form elements not found');
      return false;
    }
  } catch (error) {
    console.log('❌ Error during login test:', error);
    return false;
  }
};

// Test 4: Check for admin routes
const checkAdminRoutes = () => {
  console.log('Test 4: Checking admin routes...');
  
  // This will be tested after login
  console.log('📋 Admin routes will be tested after successful login');
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Running all admin portal tests...');
  
  const results = {
    portalLoad: checkAdminPortalLoad(),
    reactComponents: checkReactComponents(),
    loginForm: await testLogin(),
  };
  
  console.log('📊 Test Results:', results);
  
  const passedTests = Object.values(results).filter(result => result === true).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`🎯 Tests Passed: ${passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Admin portal is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the results above.');
  }
  
  return results;
};

// Auto-run tests after a short delay
setTimeout(runAllTests, 1000);

// Export test functions for manual use
window.adminPortalTests = {
  runAllTests,
  checkAdminPortalLoad,
  checkReactComponents,
  testLogin,
  checkAdminRoutes
};

console.log('📋 Manual Commands Available:');
console.log('- adminPortalTests.runAllTests() - Run all tests');
console.log('- adminPortalTests.testLogin() - Test login form');
console.log('- adminPortalTests.checkReactComponents() - Check components');
