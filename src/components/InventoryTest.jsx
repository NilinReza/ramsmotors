import React from 'react';

// Simple test component to isolate inventory loading issues
const InventoryTest = () => {
  const [vehicles, setVehicles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [testStage, setTestStage] = React.useState('');

  const testInventory = async () => {
    setLoading(true);
    setError(null);
    setVehicles([]);
    setTestStage('Starting...');
    
    try {
      setTestStage('Importing API service...');
      const apiService = (await import('../services/api')).default;
      console.log('📡 API Service imported for inventory test');
      
      setTestStage('Calling getVehicles...');
      const response = await apiService.getVehicles();
      console.log('📦 Vehicles response:', response);
      
      setTestStage('Processing response...');
      
      // Handle different response formats
      let vehiclesData;
      if (response.data) {
        vehiclesData = response.data;
      } else if (Array.isArray(response)) {
        vehiclesData = response;
      } else {
        throw new Error('Unexpected response format: ' + JSON.stringify(response));
      }
      
      setTestStage('Setting vehicles...');
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      setTestStage(`Completed! Loaded ${vehiclesData.length} vehicles`);
      
    } catch (error) {
      console.error('❌ Inventory test error:', error);
      setError(error.message);
      setTestStage('Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>📦 Inventory Test</h2>
      
      <button
        onClick={testInventory}
        disabled={loading}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          marginBottom: '20px'
        }}
      >
        {loading ? 'Testing...' : 'Test Inventory Loading'}
      </button>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Test Stage:</strong> {testStage}
      </div>
      
      {error && (
        <div style={{
          padding: '15px',
          borderRadius: '5px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          marginBottom: '20px'
        }}>
          <h3>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {vehicles.length > 0 && (
        <div style={{
          padding: '15px',
          borderRadius: '5px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          color: '#155724',
          marginBottom: '20px'
        }}>
          <h3>✅ Success</h3>
          <p>Loaded {vehicles.length} vehicles</p>
        </div>
      )}
      
      {vehicles.length > 0 && (
        <div>
          <h3>🚗 Vehicles ({vehicles.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {vehicles.map((vehicle, index) => (
              <div key={vehicle.id || index} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: 'white'
              }}>
                <h4>{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                <p><strong>Price:</strong> ${vehicle.price?.toLocaleString()}</p>
                <p><strong>Mileage:</strong> {vehicle.mileage?.toLocaleString()} miles</p>
                <p><strong>Status:</strong> {vehicle.status}</p>
                {vehicle.images && vehicle.images.length > 0 && (
                  <img 
                    src={vehicle.images[0].url} 
                    alt={`${vehicle.make} ${vehicle.model}`}
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTest;
