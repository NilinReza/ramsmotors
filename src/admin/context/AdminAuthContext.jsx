// Admin Authentication Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (token) {
        const isValid = await authService.validateToken(token);
        if (isValid) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.token) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user || { username: credentials.username, role: 'admin' });
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, error: response.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };
  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/'); // Redirect to homepage instead of login page
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/'); // Redirect to homepage instead of login page
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshAuth: initializeAuth
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
