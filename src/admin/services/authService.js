// Modern Authentication Service - Supabase Ready
import mockApiService from '../../services/mockApi';
import { supabase } from '../../config/supabase';

const USE_MOCK_DATA = false; // Toggle for Supabase migration

class AuthService {
  constructor() {
    this.isInitialized = false;
    this.supabase = supabase;
  }

  // Initialize Supabase client (when ready)
  async initialize() {
    if (this.isInitialized) return;
    
    if (!USE_MOCK_DATA) {
      // Supabase client is already initialized in constructor
      console.log('🔧 Supabase auth service initialized');
    }
    
    this.isInitialized = true;
  }
  async login(credentials) {
    await this.initialize();
    
    if (USE_MOCK_DATA) {
      return await mockApiService.login(credentials);
    }
    
    try {
      console.log('🔐 Attempting Supabase login for:', credentials.email || credentials.username);
      
      // Supabase auth implementation
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email || credentials.username,
        password: credentials.password
      });
      
      if (error) {
        console.error('❌ Supabase auth error:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Supabase login successful');
      
      return {
        success: true,
        token: data.session.access_token,
        user: data.user,
        refreshToken: data.session.refresh_token
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message };
    }
  }
  async logout() {
    await this.initialize();
    
    if (USE_MOCK_DATA) {
      return await mockApiService.logout();
    }
    
    try {
      // Supabase auth implementation
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Logout error:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Logout successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      return { success: false, error: error.message };
    }
  }
  async validateToken(token) {
    await this.initialize();
    
    if (USE_MOCK_DATA) {
      // Mock validation - check if token exists and is valid format
      return token && token.startsWith('mock-token-');
    }
    
    try {
      // Supabase token validation
      const { data: { user }, error } = await this.supabase.auth.getUser(token);
      return !error && user;
    } catch (error) {
      console.error('❌ Token validation error:', error);
      return false;
    }
  }
  async getCurrentUser() {
    await this.initialize();
    
    if (USE_MOCK_DATA) {
      const token = localStorage.getItem('authToken');
      if (token) {
        return {
          id: 'admin-001',
          username: 'admin',
          email: 'admin@ramsmotors.ca',
          role: 'admin',
          permissions: ['vehicle:read', 'vehicle:write', 'vehicle:delete', 'analytics:read']
        };
      }
      return null;
    }
    
    try {
      // Supabase user retrieval
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error || !user) {
        console.log('❌ No current user or error:', error?.message);
        return null;
      }
      
      console.log('✅ Current user retrieved:', user.email);
      
      return {
        id: user.id,
        email: user.email,
        ...user.user_metadata
      };
    } catch (error) {
      console.error('❌ Get current user error:', error);
      return null;
    }
  }

  async refreshToken() {
    await this.initialize();
    
    if (USE_MOCK_DATA) {
      // Mock refresh - generate new token
      const newToken = `mock-token-${Date.now()}`;
      localStorage.setItem('authToken', newToken);
      return { success: true, token: newToken };
    }
    
    // Supabase token refresh
    /*
    const { data, error } = await this.supabase.auth.refreshSession();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return {
      success: true,
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    };
    */
    
    return { success: false, error: 'Not implemented' };
  }

  async resetPassword(email) {
    await this.initialize();
    
    if (USE_MOCK_DATA) {
      // Mock password reset
      console.log('Mock password reset for:', email);
      return { success: true, message: 'Password reset email sent' };
    }
    
    // Supabase password reset
    /*
    const { error } = await this.supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, message: 'Password reset email sent' };
    */
    
    return { success: false, error: 'Not implemented' };
  }

  // Check if user has specific permission
  hasPermission(user, permission) {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }

  // Get user role
  getUserRole(user) {
    return user?.role || 'guest';
  }
}

// Export singleton instance
export const authService = new AuthService();
