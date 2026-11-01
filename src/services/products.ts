
import api from "./api";

export type Product = {
  _id?: string;
  id?: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  stock?: number;
};


export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products");
  return res.data;
};


export const getProductById = async (
  id: string | number
): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};


export const searchProducts = async (
  searchTerm: string
): Promise<Product[]> => {
  const res = await api.get("/products", {
    params: { search: searchTerm },
  });

  return res.data;
};


export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const res = await api.get("/products", {
    params: { category },
  });

  return res.data;
};


export const createProduct = async (
  product: Omit<Product, "_id" | "id">
): Promise<Product> => {
  const res = await api.post("/products", product);
  return res.data;
};


export const updateProduct = async (
  id: string | number,
  product: Partial<Product>
): Promise<Product> => {
  const res = await api.put(`/products/${id}`, product);
  return res.data;
};


export const deleteProduct = async (
  id: string | number
): Promise<void> => {
  await api.delete(`/products/${id}`);
};
