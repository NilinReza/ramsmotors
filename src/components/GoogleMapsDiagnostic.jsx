import React, { useState, useEffect } from 'react';
import googleMapsService from '../services/googleMapsService';

const GoogleMapsDiagnostic = () => {  const [diagnostics, setDiagnostics] = useState({
    apiKey: null,
    environment: null,
    serviceStatus: null,
    mapInstance: null,
    errors: []
  });

  useEffect(() => {
    // Check environment variables
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    setDiagnostics(prev => ({
      ...prev,
      apiKey: apiKey ? {
        present: true,
        length: apiKey.length,
        prefix: apiKey.substring(0, 10),
        valid: apiKey.startsWith('AIza') && apiKey.length === 39
      } : { present: false },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        allReactEnvVars: Object.keys(process.env).filter(key => key.startsWith('REACT_APP'))
      }
    }));
  }, []);
  const TestMapComponent = ({ center, zoom }) => {
    const ref = React.useRef(null);
    const [map, setMap] = React.useState();

    React.useEffect(() => {
      const loadMap = async () => {
        if (ref.current && !map) {
          try {
            console.log('🗺️ Creating Google Maps instance for diagnostic using centralized service...');
            
            // Use the centralized Google Maps service
            const google = await googleMapsService.load();
            
            if (google.maps) {
              const newMap = new google.maps.Map(ref.current, {
                center,
                zoom,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true,
              });

              // Use AdvancedMarkerElement if available, else fallback to Marker
              const AdvancedMarker = google.maps.marker && google.maps.marker.AdvancedMarkerElement;
              if (AdvancedMarker) {
                new AdvancedMarker({
                  position: center,
                  map: newMap,
                  title: "Diagnostic Test Location"
                });
              } else {
                // Fallback for environments where AdvancedMarkerElement is not available
                new google.maps.Marker({
                  position: center,
                  map: newMap,
                  title: "Diagnostic Test Location",
                  animation: google.maps.Animation.DROP
                });
              }

              setMap(newMap);
              setDiagnostics(prev => ({
                ...prev,
                mapInstance: { 
                  created: true, 
                  timestamp: new Date().toISOString(),
                  mapType: newMap.getMapTypeId(),
                  service: 'centralized'
                },
                serviceStatus: 'SUCCESS'
              }));
              console.log('✅ Diagnostic Google Maps instance created successfully with centralized service');
            }
          } catch (error) {
            console.error('❌ Error creating diagnostic Google Maps instance:', error);
            setDiagnostics(prev => ({
              ...prev,
              errors: [...prev.errors, `Map creation error: ${error.message}`],
              serviceStatus: 'FAILURE'
            }));
          }
        }
      };

      loadMap();
    }, [ref, map, center, zoom]);

    return <div ref={ref} className="w-full h-full" />;
  };

  const center = { lat: 43.751454684487484, lng: -79.26328702204334 };
  const zoom = 15;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Google Maps Diagnostic</h2>
      
      {/* API Key Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">API Key Status</h3>
        {diagnostics.apiKey?.present ? (
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>API Key Found</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>Length: {diagnostics.apiKey.length} characters</p>
              <p>Prefix: {diagnostics.apiKey.prefix}...</p>
              <p>Format Valid: {diagnostics.apiKey.valid ? '✅' : '❌'}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center text-red-600">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            <span>API Key Missing</span>
          </div>
        )}
      </div>

      {/* Environment */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Environment</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>NODE_ENV: {diagnostics.environment?.nodeEnv}</p>
          <p>React Environment Variables: {diagnostics.environment?.allReactEnvVars?.length || 0}</p>
        </div>
      </div>      {/* Service Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Centralized Service Status</h3>
        {diagnostics.serviceStatus === 'SUCCESS' ? (
          <div className="flex items-center text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span>Google Maps loaded successfully via centralized service</span>
          </div>
        ) : diagnostics.serviceStatus === 'FAILURE' ? (
          <div className="flex items-center text-red-600">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            <span>Failed to load Google Maps via centralized service</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-600">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            <span>Pending...</span>
          </div>
        )}
      </div>

      {/* Map Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Map Loading Test</h3>
        <div className="h-64 border rounded-lg overflow-hidden">
          {diagnostics.apiKey?.present ? (
            <TestMapComponent center={center} zoom={zoom} />
          ) : (
            <div className="w-full h-full bg-yellow-50 flex items-center justify-center">
              <div className="text-center text-yellow-600">
                <p className="font-semibold">No API Key Available</p>
                <p className="text-sm">Add REACT_APP_GOOGLE_MAPS_API_KEY to .env.local</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Status Summary</h3>
        <div className="space-y-2 text-sm">          <div className="flex justify-between">
            <span>Service Status:</span>
            <span className={`font-semibold ${
              diagnostics.serviceStatus === 'SUCCESS' ? 'text-green-600' : 
              diagnostics.serviceStatus === 'FAILURE' ? 'text-red-600' : 
              'text-yellow-600'
            }`}>
              {diagnostics.serviceStatus || 'Not tested'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Map Instance:</span>
            <span className={`font-semibold ${diagnostics.mapInstance ? 'text-green-600' : 'text-gray-400'}`}>
              {diagnostics.mapInstance ? `Created (${diagnostics.mapInstance.service})` : 'Not created'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Errors:</span>
            <span className={`font-semibold ${diagnostics.errors.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {diagnostics.errors.length}
            </span>
          </div>
        </div>
      </div>

      {/* Errors */}
      {diagnostics.errors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-3">Errors</h3>
          <ul className="space-y-1 text-sm text-red-700">
            {diagnostics.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Debug Data */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
          Show Full Diagnostic Data
        </summary>
        <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
          {JSON.stringify(diagnostics, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default GoogleMapsDiagnostic;
