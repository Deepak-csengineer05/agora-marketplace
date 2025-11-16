import api from './api';

export const authService = {
  // Register user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('agora_user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('agora_user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // OTP Login
  async otpLogin(phone) {
    try {
      const response = await api.post('/auth/otp/login', { phone });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP login failed' };
    }
  },

  // Verify OTP
  async verifyOTP(otpData) {
    try {
      const response = await api.post('/auth/otp/verify', otpData);
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('agora_user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user data' };
    }
  },

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profile update failed' };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('agora_user');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  // Get stored user data
  getStoredUser() {
    const user = localStorage.getItem('agora_user');
    return user ? JSON.parse(user) : null;
  },

  // Request password reset (backend not implemented yet, optional stub)
  async resetPassword(emailData) {
    try {
      const response = await api.post('/auth/reset-password', emailData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset request failed' };
    }
  },

  // Reset password with token
  async resetPasswordWithToken(token, newPasswordData) {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, newPasswordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  }
};