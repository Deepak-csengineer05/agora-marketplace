import axios from "axios";
const API_URL = "http://localhost:5000/api/products";

export const productService = {
  getAll: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },
  create: async (product) => {
    const res = await axios.post(API_URL, product);
    return res.data;
  },
};
