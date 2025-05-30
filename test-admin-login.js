// Quick test for admin login functionality
// Test credentials: admin / admin123

const testAdminLogin = async () => {
  try {
    console.log('🧪 Testing Admin Login...');
    
    // Test with correct credentials
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    const result = await response.json();
    console.log('Login result:', result);
    
    if (result.success) {
      console.log('✅ Admin login successful!');
      localStorage.setItem('authToken', result.token);
      return true;
    } else {
      console.log('❌ Admin login failed:', result.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Login test error:', error);
    return false;
  }
};

// Run the test
testAdminLogin();
