import api from "@/lib/api";
import type { Product, ProductFormData } from "@/types";

export const productService = {
  async getProducts(search?: string): Promise<Product[]> {
    const params = search ? { search } : {};
    const response = await api.get<Product[]>("/products", { params });
    return response.data;
  },

  async getProductById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    const response = await api.post<Product>("/products", data);
    return response.data;
  },

  async updateProduct(id: number, data: ProductFormData): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },
};
