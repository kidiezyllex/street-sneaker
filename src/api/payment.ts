import {
  IPaymentFilter,
  IPaymentCreate,
  IPaymentStatusUpdate
} from "@/interface/request/payment";
import {
  IPaymentsResponse,
  IPaymentResponse,
  IActionResponse
} from "@/interface/response/payment";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// === Admin/Staff Payment API ===
export const getAllPayments = async (params: IPaymentFilter): Promise<IPaymentsResponse> => {
  const res = await sendGet("/payments", params);
  return res as IPaymentsResponse;
};

export const getPaymentById = async (paymentId: string): Promise<IPaymentResponse> => {
  const res = await sendGet(`/payments/${paymentId}`);
  return res as IPaymentResponse;
};

export const createPayment = async (payload: IPaymentCreate): Promise<IPaymentResponse> => {
  const res = await sendPost("/payments", payload);
  return res as IPaymentResponse;
};

export const updatePaymentStatus = async (paymentId: string, payload: IPaymentStatusUpdate): Promise<IPaymentResponse> => {
  const res = await sendPut(`/payments/${paymentId}`, payload);
  return res as IPaymentResponse;
};

export const deletePayment = async (paymentId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/payments/${paymentId}`);
  return res as IActionResponse;
};

// === Order Payments API ===
export const getPaymentsByOrderId = async (orderId: string): Promise<IPaymentsResponse> => {
  const res = await sendGet(`/orders/${orderId}/payments`);
  return res as IPaymentsResponse;
}; 