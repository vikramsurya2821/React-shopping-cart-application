import request from "./apiClient";
import type { Product } from "../types/Product";

export async function getProducts(): Promise<Product[]> {
  const products = await request<Product[]>("/products");

  return products.map((product) => ({
    ...product,
    id: Number(product.id),
  }));
}