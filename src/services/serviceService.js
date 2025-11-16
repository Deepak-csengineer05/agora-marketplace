import api from './api';

export const serviceService = {
  // Get all services - WORKS (matches your backend)
  async getServices(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await api.get(`/services?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch services' };
    }
  },

  // Get single service - WORKS
  async getService(id) {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch service' };
    }
  },

  // Create service (vendor only) - WORKS
  async createService(serviceData) {
    try {
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create service' };
    }
  },

  // Update service (vendor only) - WORKS
  async updateService(id, serviceData) {
    try {
      const response = await api.put(`/services/${id}`, serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update service' };
    }
  },

  // Delete service (vendor only) - WORKS
  async deleteService(id) {
    try {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete service' };
    }
  },

  // Get vendor's services - CHECK if this endpoint exists
  async getVendorServices() {
    try {
      const response = await api.get("/services/vendor/my-services");
      return response.data;
    } catch (error) {
      // Check if it's a 404 → fallback
      if (error.response?.status === 404) {
        console.warn(
          "Vendor services endpoint not available (404), using fallback instead"
        );
        try {
          const allServices = await this.getServices();
          return allServices;
        } catch (fallbackError) {
          throw fallbackError.response?.data || { message: "Fallback failed" };
        }
      }

      // For other errors, rethrow so you don’t hide real issues
      throw error.response?.data || { message: "Failed to fetch vendor services" };
    }
  }

};