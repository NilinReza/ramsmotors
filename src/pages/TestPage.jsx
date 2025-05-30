import React from 'react';
import AdminLoginTest from '../components/AdminLoginTest';
import InventoryTest from '../components/InventoryTest';

const TestPage = () => {
  const [activeTest, setActiveTest] = React.useState('login');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>🔧 Component Testing Page</h1>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={() => setActiveTest('login')}
            style={{
              backgroundColor: activeTest === 'login' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            🔐 Admin Login Test
          </button>
          
          <button
            onClick={() => setActiveTest('inventory')}
            style={{
              backgroundColor: activeTest === 'inventory' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            📦 Inventory Test
          </button>
          
          <button
            onClick={() => setActiveTest('maps')}
            style={{
              backgroundColor: activeTest === 'maps' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🗺️ Maps Test
          </button>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {activeTest === 'login' && <AdminLoginTest />}
          {activeTest === 'inventory' && <InventoryTest />}
          {activeTest === 'maps' && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h2>🗺️ Google Maps Test</h2>
              <p>Testing Google Maps integration...</p>
              <iframe
                src="/google-maps-test.html"
                style={{
                  width: '100%',
                  height: '500px',
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
                title="Google Maps Test"
              />
            </div>
          )}
        </div>
        
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e9ecef',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <h3>📋 Testing Instructions</h3>
          <ul>
            <li><strong>Admin Login:</strong> Test with username "admin" and password "admin123"</li>
            <li><strong>Inventory:</strong> Should load mock vehicle data from the API</li>
            <li><strong>Maps:</strong> Should display Google Maps with Rams Motors location</li>
          </ul>
          <p><strong>Note:</strong> Check the browser console for detailed error messages and debugging information.</p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
