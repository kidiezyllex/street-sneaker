import { 
  IPOSOrderFilter, 
  IPOSOrderCreate, 
  IPOSOrderUpdate, 
  IPOSOrderItemCreate, 
  IPOSOrderItemUpdate, 
  IPOSPayment, 
  IPOSScanQR 
} from "@/interface/request/pos";

import { 
  IPOSOrderResponse, 
  IPOSOrdersResponse, 
  IPOSReceiptResponse, 
  IPOSQRProductResponse 
} from "@/interface/response/pos";

import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// Order management
export const createOrder = async (payload: IPOSOrderCreate): Promise<IPOSOrderResponse> => {
  const res = await sendPost("/pos/orders", payload);
  const data: IPOSOrderResponse = res;
  return data;
};

export const getOrders = async (params: IPOSOrderFilter): Promise<IPOSOrdersResponse> => {
  const res = await sendGet("/pos/orders", { params });
  const data: IPOSOrdersResponse = res;
  return data;
};

export const getOrderById = async (orderId: string): Promise<IPOSOrderResponse> => {
  const res = await sendGet(`/pos/orders/${orderId}`);
  const data: IPOSOrderResponse = res;
  return data;
};

export const updateOrder = async (orderId: string, payload: IPOSOrderUpdate): Promise<IPOSOrderResponse> => {
  const res = await sendPut(`/pos/orders/${orderId}`, payload);
  const data: IPOSOrderResponse = res;
  return data;
};

export const deleteOrder = async (orderId: string): Promise<any> => {
  const res = await sendDelete(`/pos/orders/${orderId}`);
  return res;
};

// Order items management
export const addOrderItem = async (orderId: string, payload: IPOSOrderItemCreate): Promise<IPOSOrderResponse> => {
  const res = await sendPost(`/pos/orders/${orderId}/items`, payload);
  const data: IPOSOrderResponse = res;
  return data;
};

export const updateOrderItem = async (orderId: string, itemId: string, payload: IPOSOrderItemUpdate): Promise<IPOSOrderResponse> => {
  const res = await sendPut(`/pos/orders/${orderId}/items/${itemId}`, payload);
  const data: IPOSOrderResponse = res;
  return data;
};

export const removeOrderItem = async (orderId: string, itemId: string): Promise<IPOSOrderResponse> => {
  const res = await sendDelete(`/pos/orders/${orderId}/items/${itemId}`);
  const data: IPOSOrderResponse = res;
  return data;
};

// Payment processing
export const processPayment = async (orderId: string, payload: IPOSPayment): Promise<IPOSOrderResponse> => {
  const res = await sendPost(`/pos/orders/${orderId}/payment`, payload);
  const data: IPOSOrderResponse = res;
  return data;
};

export const completeOrder = async (orderId: string): Promise<IPOSOrderResponse> => {
  const res = await sendPost(`/pos/orders/${orderId}/complete`);
  const data: IPOSOrderResponse = res;
  return data;
};

// Utility functions
export const scanProductQRCode = async (payload: IPOSScanQR): Promise<IPOSQRProductResponse> => {
  const res = await sendPost('/pos/scan', payload);
  const data: IPOSQRProductResponse = res;
  return data;
};

export const printReceipt = async (orderId: string): Promise<IPOSReceiptResponse> => {
  const res = await sendPost(`/pos/orders/${orderId}/print`);
  const data: IPOSReceiptResponse = res;
  return data;
}; 