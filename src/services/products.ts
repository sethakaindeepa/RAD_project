
import api from "./api";

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


function extractData<T>(response: any): T {
  const data = response.data?.data ?? response.data;
  return data;
}


export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products");
  const data = extractData<any>(res);

  return Array.isArray(data)
    ? data
    : Array.isArray(data?.products)
    ? data.products
    : [];
};



export const getProductById = async (
  id: string
): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  return extractData<Product>(res);
};


export const searchProducts = async (
  searchTerm: string
): Promise<Product[]> => {
  const res = await api.get("/products", {
    params: { search: searchTerm },
  });

  return extractData<Product[]>(res);
};


export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const res = await api.get("/products", {
    params: { category },
  });

  return extractData<Product[]>(res);
};


export const createProduct = async (
  product: CreateProductData
): Promise<Product> => {
  const res = await api.post("/products", product);
  return extractData<Product>(res);
};


export const updateProduct = async (
  id: string,
  product: Partial<CreateProductData>
): Promise<Product> => {
  const res = await api.put(`/products/${id}`, product);
  return extractData<Product>(res);
};


export const deleteProduct = async (
  id: string
): Promise<void> => {
  await api.delete(`/products/${id}`);
};
