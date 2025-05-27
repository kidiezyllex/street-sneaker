import {
  IReturnFilter,
  IReturnCreate,
  IReturnUpdate,
  IReturnStatusUpdate,
  IReturnSearchParams,
  IReturnStatsParams,
  IReturnableOrdersParams,
  ICustomerReturnRequest,
  IMyReturnsParams
} from "@/interface/request/return";
import {
  IReturnsResponse,
  IReturnResponse,
  IReturnSearchResponse,
  IReturnStatsResponse,
  IActionResponse,
  IReturnableOrdersResponse
} from "@/interface/response/return";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// === Admin Return API ===
export const getAllReturns = async (params: IReturnFilter): Promise<IReturnsResponse> => {
  const res = await sendGet("/returns", params);
  return res as IReturnsResponse;
};

export const getReturnById = async (returnId: string): Promise<IReturnResponse> => {
  const res = await sendGet(`/returns/${returnId}`);
  return res as IReturnResponse;
};

export const createReturn = async (payload: IReturnCreate): Promise<IReturnResponse> => {
  const res = await sendPost("/returns", payload);
  return res as IReturnResponse;
};

export const updateReturn = async (returnId: string, payload: IReturnUpdate): Promise<IReturnResponse> => {
  const res = await sendPut(`/returns/${returnId}`, payload);
  return res as IReturnResponse;
};

export const updateReturnStatus = async (returnId: string, payload: IReturnStatusUpdate): Promise<IReturnResponse> => {
  const res = await sendPut(`/returns/${returnId}/status`, payload);
  return res as IReturnResponse;
};

export const deleteReturn = async (returnId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/returns/${returnId}`);
  return res as IActionResponse;
};

export const searchReturn = async (params: IReturnSearchParams): Promise<IReturnSearchResponse> => {
  const res = await sendGet("/returns/search", params);
  return res as IReturnSearchResponse;
};

export const getReturnStats = async (params: IReturnStatsParams): Promise<IReturnStatsResponse> => {
  const res = await sendGet("/returns/stats", params);
  return res as IReturnStatsResponse;
};

// === Customer Return API ===

export const getReturnableOrders = async (params: IReturnableOrdersParams = {}): Promise<IReturnableOrdersResponse> => {
  const res = await sendGet("/returns/returnable-orders", params);
  return res as IReturnableOrdersResponse;
};

export const createReturnRequest = async (payload: ICustomerReturnRequest): Promise<IReturnResponse> => {
  const res = await sendPost("/returns/request", payload);
  return res as IReturnResponse;
};

export const getMyReturns = async (params: IMyReturnsParams = {}): Promise<IReturnsResponse> => {
  const res = await sendGet("/returns/my", params);
  return res as IReturnsResponse;
};

export const getMyReturnDetail = async (returnId: string): Promise<IReturnResponse> => {
  const res = await sendGet(`/returns/my/${returnId}`);
  return res as IReturnResponse;
};

export const cancelMyReturn = async (returnId: string): Promise<IActionResponse> => {
  const res = await sendPut(`/returns/my/${returnId}/cancel`);
  return res as IActionResponse;
}; 