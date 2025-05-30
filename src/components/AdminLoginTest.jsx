import React from 'react';

// Simple test component to isolate the admin login issue
const AdminLoginTest = () => {
  const [credentials, setCredentials] = React.useState({ username: '', password: '' });
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🔍 Testing login with:', credentials);
      
      // Import the API service
      const apiService = (await import('../services/api')).default;
      
      console.log('📡 API Service imported successfully');
      console.log('🔧 API Service methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(apiService)));
      
      // Test the login call
      const response = await apiService.login(credentials);
      
      console.log('📬 Login response:', response);
      
      setResult({
        success: response.success,
        message: response.success ? 'Login successful!' : (response.error || 'Login failed'),
        token: response.token,
        user: response.user
      });
      
    } catch (error) {
      console.error('❌ Login test error:', error);
      setResult({
        success: false,
        message: 'Error: ' + error.message,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>🔐 Admin Login Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Username:</label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            placeholder="admin"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            placeholder="admin123"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <button
          onClick={testLogin}
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>
        
        <button
          onClick={() => setCredentials({ username: 'admin', password: 'admin123' })}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '10px'
          }}
        >
          Fill Correct Credentials
        </button>
      </div>
      
      {result && (
        <div style={{
          padding: '15px',
          borderRadius: '5px',
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          color: result.success ? '#155724' : '#721c24'
        }}>
          <h3>{result.success ? '✅ Success' : '❌ Failed'}</h3>
          <p><strong>Message:</strong> {result.message}</p>
          {result.token && <p><strong>Token:</strong> {result.token.substring(0, 30)}...</p>}
          {result.user && <p><strong>User:</strong> {JSON.stringify(result.user)}</p>}
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Expected credentials:</strong></p>
        <p>Username: admin</p>
        <p>Password: admin123</p>
      </div>
    </div>
  );
};

export default AdminLoginTest;
