import {
  IOrderFilter,
  IOrderCreate,
  IOrderUpdate,
  IOrderStatusUpdate
} from "@/interface/request/order";
import {
  IOrdersResponse,
  IOrderResponse,
  IActionResponse
} from "@/interface/response/order";
import { sendGet, sendPost, sendPut, sendPatch, sendDelete } from "./axios";

// === Admin Order API ===
export const getAllOrders = async (params: IOrderFilter): Promise<IOrdersResponse> => {
  const res = await sendGet("/orders", { params });
  return res as IOrdersResponse;
};

export const getOrderById = async (orderId: string): Promise<IOrderResponse> => {
  const res = await sendGet(`/orders/${orderId}`);
  return res as IOrderResponse;
};

export const createOrder = async (payload: IOrderCreate): Promise<IOrderResponse> => {
  const res = await sendPost("/orders", payload);
  return res as IOrderResponse;
};

export const updateOrder = async (orderId: string, payload: IOrderUpdate): Promise<IOrderResponse> => {
  const res = await sendPut(`/orders/${orderId}`, payload);
  return res as IOrderResponse;
};

export const updateOrderStatus = async (orderId: string, payload: IOrderStatusUpdate): Promise<IOrderResponse> => {
  const res = await sendPatch(`/orders/${orderId}/status`, payload);
  return res as IOrderResponse;
};

export const cancelOrder = async (orderId: string): Promise<IOrderResponse> => {
  const res = await sendPatch(`/orders/${orderId}/cancel`);
  return res as IOrderResponse;
};

// === User Order API ===
export const getMyOrders = async (params: IOrderFilter = {}): Promise<IOrdersResponse> => {
  const res = await sendGet("/orders/my-orders", { params });
  return res as IOrdersResponse;
}; 