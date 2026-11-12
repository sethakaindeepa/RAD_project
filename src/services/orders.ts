
import { apiFetch } from "./api";

export interface CreateOrderData {
  items: {
    productId: string;
    quantity: number;
  }[];
  paymentMethod: "CASH_ON_DELIVERY" | "CARD";
  shippingAddress: string;
}

export interface OrderResponse {
  message: string;
  order: {
    _id: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
  };
}


export const createOrder = async (
  orderData: CreateOrderData
): Promise<OrderResponse> => {
  return await apiFetch<OrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};


export const getMyOrders = async () => {
  return await apiFetch("/orders/my-orders", {
    method: "GET",
  });
};


export const getOrderById = async (id: string) => {
  return await apiFetch(`/orders/${id}`, {
    method: "GET",
  });
};
