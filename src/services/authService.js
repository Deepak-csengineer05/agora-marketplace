import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const authService = {
  login: async (credentials) => {
    const res = await axios.post(`${API_URL}/login`, credentials, {
      withCredentials: true,
    });
    return res.data;
  },
  register: async (data) => {
    const res = await axios.post(`${API_URL}/register`, data);
    return res.data;
  },
  logout: async () => {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  },
};
