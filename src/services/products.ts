
import { apiFetch } from "./api";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isActive: boolean;
  rating?: number;
  reviews?: number;
  oldPrice?: number;
  badge?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export const getProducts = async (): Promise<Product[]> => {
  const data = await apiFetch<{ products: Product[] }>("/products");
  return data.products ?? [];
};

export const getProductById = async (id: string): Promise<Product> => {
  const data = await apiFetch<{ product: Product }>(`/products/${id}`);
  return data.product;
};

export const createProduct = async (
  product: CreateProductData
): Promise<Product> => {
  const data = await apiFetch<{ product: Product }>("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });

  return data.product;
};

export const updateProduct = async (
  id: string,
  product: Partial<CreateProductData>
): Promise<Product> => {
  const data = await apiFetch<{ product: Product }>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });

  return data.product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiFetch<{ message: string }>(`/products/${id}`, {
    method: "DELETE",
  });
};
