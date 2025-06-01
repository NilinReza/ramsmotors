// Authentication Debug Utility
// Use this to debug authentication issues in production

console.log('🔍 Authentication Debug Information');
console.log('==================================');

// Environment information
console.log('📦 Environment Variables:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  REACT_APP_USE_MOCK_DATA:', process.env.REACT_APP_USE_MOCK_DATA);
console.log('  REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('  REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

// Test authentication with different credential formats
const testCredentials = [
  { username: 'admin', password: 'admin123', description: 'Development format' },
  { username: 'admin@ramsmotors.com', password: 'password123', description: 'Production format' }
];

// Function to test authentication
async function testAuthentication() {
  const { default: apiService } = await import('./src/services/api.js');
  
  console.log('\n🧪 Testing Authentication:');
  console.log('=========================');
  
  for (const creds of testCredentials) {
    console.log(`\n🔐 Testing ${creds.description}:`);
    console.log(`   Username: ${creds.username}`);
    console.log(`   Password: ${'*'.repeat(creds.password.length)}`);
    
    try {
      const result = await apiService.login(creds);
      console.log(`   Result: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
      if (!result.success) {
        console.log(`   Error: ${result.error}`);
      }
    } catch (error) {
      console.log(`   Exception: ❌ ${error.message}`);
    }
  }
}

// Run the test if this script is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  testAuthentication().catch(console.error);
} else {
  console.log('\n💡 To test authentication, run this in the browser console');
  console.log('   or import and call testAuthentication() function');
}

export { testAuthentication };
