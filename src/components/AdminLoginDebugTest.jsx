// Debug helper to check if login is working correctly
import React from 'react';

function AdminLoginDebugTest() {
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  
  // Import dynamically to avoid import issues
  const testLogin = async () => {
    try {
      setLoading(true);
      
      // Dynamically import API services
      const apiModule = await import('../services/api');
      const apiService = apiModule.default;
      
      console.log('🔍 Testing login with admin credentials');
      console.log('API Service methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(apiService)));
      
      // Test direct login
      const response = await apiService.login({ 
        username: 'admin', 
        password: 'admin123' 
      });
      
      console.log('📝 Login response:', response);
      
      setResult({
        success: response && response.success === true,
        response: response,
      });
    } catch (error) {
      console.error('❌ Test error:', error);
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ 
      padding: '15px', 
      border: '1px solid #ddd',
      borderRadius: '8px',
      margin: '20px 0' 
    }}>
      <h3>Admin Login Debug Test</h3>
      
      <button 
        onClick={testLogin} 
        disabled={loading}
        style={{
          padding: '8px 16px',
          background: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Admin Login'}
      </button>
      
      {result && (
        <div style={{ 
          marginTop: '15px',
          padding: '10px',
          background: result.success ? '#d4edda' : '#f8d7da',
          borderRadius: '4px',
          color: result.success ? '#155724' : '#721c24'
        }}>
          <p><strong>{result.success ? 'Success!' : 'Failed'}</strong></p>
          <pre style={{ 
            whiteSpace: 'pre-wrap',
            fontSize: '12px',
            background: '#f8f9fa',
            padding: '8px',
            border: '1px solid #eee',
            borderRadius: '4px'
          }}>
            {JSON.stringify(result.response || result.error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default AdminLoginDebugTest;
