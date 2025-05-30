import {
  IOrderFilter,
  IOrderCreate,
  IOrderUpdate,
  IOrderStatusUpdate,
  IPOSOrderCreateRequest
} from "@/interface/request/order";
import {
  IOrdersResponse,
  IOrderResponse,
  IActionResponse,
  IPOSOrderCreateResponse
} from "@/interface/response/order";
import { sendGet, sendPost, sendPut, sendPatch, sendDelete } from "./axios";

// === Admin Order API ===
export const getAllOrders = async (params: IOrderFilter): Promise<IOrdersResponse> => {
  const res = await sendGet("/orders", params);
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

export const getOrdersByUser = async (
  userId: string,
  params: { orderStatus?: string; page?: number; limit?: number } = {}
): Promise<IOrdersResponse> => {
  const res = await sendGet(`/orders/user/${userId}`, params);
  return res as IOrdersResponse;
};

export const createPOSOrder = async (
  payload: IPOSOrderCreateRequest
): Promise<IPOSOrderCreateResponse> => {
  const res = await sendPost("/orders/pos", payload);
  return res as IPOSOrderCreateResponse;
}; 