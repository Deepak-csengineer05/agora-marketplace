import api from './api';

export const vendorService = {
  // Update vendor profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update vendor profile' };
    }
  },

  // Get all vendors
  async getVendors(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await api.get(`/vendors?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch vendors' };
    }
  },

  // NEW: Get vendor by ID
  async getVendor(id) {
    try {
      const response = await api.get(`/vendors/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch vendor' };
    }
  }
};