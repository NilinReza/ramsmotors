import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../../services/api'; // Use our API service instead of direct Supabase

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Check if user has a valid token using our API service
        const token = apiService.getToken();
        if (token) {
          // Validate the token with our API service
          const response = await apiService.validateToken();
          if (response && response.success && response.user) {
            setUser(response.user);
          } else {
            // Invalid token, clear it
            apiService.setToken(null);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('Auth initialization error:', error.message);
        setUser(null);
        apiService.setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔐 AdminAuthContext login called with:', credentials);
      
      // Call our API service login method
      const response = await apiService.login(credentials);

      if (response && response.success) {
        setUser(response.user);
        return { success: true, user: response.user };
      } else {
        throw new Error(response?.error || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};