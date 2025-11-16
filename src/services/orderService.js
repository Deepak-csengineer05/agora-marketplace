import api from './api';

export const orderService = {
  // Create new order
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create order' };
    }
  },

  // Get user orders
  async getMyOrders() {
    try {
      const response = await api.get('/orders/my-orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Get single order
  async getOrder(id) {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch order' };
    }
  },

  // Cancel order
  async cancelOrder(id) {
    try {
      const response = await api.put(`/orders/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel order' };
    }
  },

  // Get vendor orders
  async getVendorOrders() {
    try {
      const response = await api.get('/orders/vendor/my-orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch vendor orders' };
    }
  },

  // Update order status (vendor)
  async updateOrderStatus(id, status) {
    try {
      const response = await api.put(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  }
};