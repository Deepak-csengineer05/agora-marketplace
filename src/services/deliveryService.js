import api from './api';

export const deliveryService = {
  // Get delivery dashboard
  async getDashboard() {
    try {
      const response = await api.get('/delivery/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard' };
    }
  },

  // Get available tasks
  async getAvailableTasks() {
    try {
      const response = await api.get('/delivery/tasks/available');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch available tasks' };
    }
  },

  // Accept a task
  async acceptTask(taskId) {
    try {
      const response = await api.put(`/delivery/tasks/${taskId}/accept`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to accept task' };
    }
  },

  // Update task status
  async updateTaskStatus(taskId, status) {
    try {
      const response = await api.put(`/delivery/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update task status' };
    }
  },

  // Get completed deliveries
  async getCompletedDeliveries() {
    try {
      const response = await api.get('/delivery/tasks/completed');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch completed deliveries' };
    }
  },

  // Get earnings
  async getEarnings(period = 'month') {
    try {
      const response = await api.get(`/delivery/earnings?period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch earnings' };
    }
  },

  // Update delivery partner status (online/offline)
  async updateStatus(online) {
    try {
      const response = await api.put('/delivery/status', { online });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update status' };
    }
  }
};