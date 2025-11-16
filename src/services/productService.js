import api from './api';

export const productService = {
  // Get all products
  async getProducts(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await api.get(`/products?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get single product
  async getProduct(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product' };
    }
  },

  // Create product (vendor only)
  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create product' };
    }
  },

  // Update product (vendor only)
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product' };
    }
  },

  // Delete product (vendor only)
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete product' };
    }
  },

  // Get vendor's products
  async getVendorProducts() {
    try {
      const response = await api.get('/products/vendor/my-products');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch vendor products' };
    }
  },

  // Update product availability
  async updateProductAvailability(id, available) {
    try {
      const response = await api.patch(`/products/${id}/availability`, { available });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product availability' };
    }
  }
};