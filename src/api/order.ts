import { 
  IOrderFilter, 
  IOrderStatusUpdate, 
  IShippingInfoUpdate,
  IOrderItemsUpdate
} from "@/interface/request/order";

import { 
  IOrderResponse, 
  IOrdersResponse 
} from "@/interface/response/order";

import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// Lấy danh sách đơn hàng
export const getOrders = async (params: IOrderFilter = {}): Promise<IOrdersResponse> => {
  const res = await sendGet("/orders", { params });
  const data: IOrdersResponse = res;
  return data;
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (orderId: string): Promise<IOrderResponse> => {
  const res = await sendGet(`/orders/${orderId}`);
  const data: IOrderResponse = res;
  return data;
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId: string, payload: IOrderStatusUpdate): Promise<IOrderResponse> => {
  const res = await sendPut(`/orders/${orderId}/status`, payload);
  const data: IOrderResponse = res;
  return data;
};

// Cập nhật thông tin vận chuyển
export const updateShippingInfo = async (orderId: string, payload: IShippingInfoUpdate): Promise<IOrderResponse> => {
  const res = await sendPut(`/orders/${orderId}/shipping`, payload);
  const data: IOrderResponse = res;
  return data;
};

// Cập nhật sản phẩm trong đơn hàng
export const updateOrderItems = async (orderId: string, payload: IOrderItemsUpdate): Promise<IOrderResponse> => {
  const res = await sendPut(`/orders/${orderId}/items`, payload);
  const data: IOrderResponse = res;
  return data;
}; 