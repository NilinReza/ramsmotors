// Admin Login Test Script
// This script tests the admin login functionality

import apiService from '../services/api.js';

export const testAdminLogin = async () => {
  console.log('🧪 TESTING ADMIN LOGIN');
  console.log('=======================');
  
  const username = 'admin';
  const password = 'admin123';
  
  console.log('Testing credentials:', { username, passwordLength: password.length });
  
  try {
    console.log('🔍 API Service available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(apiService)));
    console.log('🔍 Calling apiService.login...');
    
    const result = await apiService.login(username, password);
    
    console.log('🔍 Login result:', result);
    
    if (result && result.success) {
      console.log('✅ Admin login test PASSED');
      console.log('Token received:', result.token?.substring(0, 20) + '...');
      return { success: true, token: result.token };
    } else {
      console.error('❌ Admin login test FAILED');
      console.error('Error:', result?.error || 'Unknown error');
      return { success: false, error: result?.error || 'Unknown error' };
    }
  } catch (error) {
    console.error('💥 Admin login test ERROR:', error);
    return { success: false, error: error.message };
  }
};

// Test function to be called from browser console
window.testAdminLogin = testAdminLogin;

console.log('🧪 Admin login test function available as window.testAdminLogin()');
