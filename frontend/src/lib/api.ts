import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5173/api/products",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = (search?: string) => {
  return api.get("/", { 
    params: search ? { search } : {} 
  });
};

export const createProduct = (data: {
  name: string;
  description: string;
  price: number;
  stock: number;
}) => {
  return api.post("/", data);
};

export const getProductById = (id: number | string) => {
  return api.get(`/${id}`);
};
export const updateProduct = (
  id: number | string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
  }
) => {
  return api.put(`/${id}`, data);
};

export const deleteProduct = (id: number | string) => {
  return api.delete(`/${id}`);
};

export default api;