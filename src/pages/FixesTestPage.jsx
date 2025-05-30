import React from 'react';
import AdminLoginDebugTest from '../components/AdminLoginDebugTest';

const FixesTestPage = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Critical Issues Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>1. Admin Login Test</h2>
        <p>Testing login with admin/admin123 credentials</p>
        <AdminLoginDebugTest />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>2. Inventory Page Test</h2>
        <p>View the inventory page to see if it's working:</p>
        <a 
          href="/inventory" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            background: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          Open Inventory
        </a>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>3. Google Maps Test</h2>
        <p>View the contact page to see if Google Maps is working:</p>
        <a 
          href="/contact" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            background: '#17a2b8',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          Open Contact Page
        </a>
        <a 
          href="/google-maps-test.html" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            background: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Direct Maps Test
        </a>
      </div>
      
      <div style={{
        marginTop: '40px',
        padding: '15px',
        background: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <h3>Console Output</h3>
        <p>Check your browser console (F12) for detailed debugging information.</p>
      </div>
    </div>
  );
};

export default FixesTestPage;
