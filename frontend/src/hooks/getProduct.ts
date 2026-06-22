import api from "@/lib/api";
import type { Product } from "@/types";

/**
 * @deprecated Use productService instead
 */
export const testData = async () => {
  try {
    const res = await api.get<Product[]>("/products");
    console.log(res.data);
  } catch (err) {
    console.log("Gagal", err);
  }
};