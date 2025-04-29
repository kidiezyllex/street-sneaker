import { 
  IBillFilter, 
  IBillCreate, 
  IBillUpdate, 
  IBillStatusUpdate, 
  IBillItemCreate, 
  IBillItemUpdate, 
  IBillTransaction, 
  IBillReturn 
} from "@/interface/request/bill";

import { 
  IBillResponse, 
  IBillsResponse 
} from "@/interface/response/bill";

import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const getAllBills = async (params: IBillFilter): Promise<IBillsResponse> => {
  const res = await sendGet("/bills", { params });
  const data: IBillsResponse = res;
  return data;
};

export const searchBill = async (params: IBillFilter): Promise<IBillsResponse> => {
  const res = await sendGet("/bills/search", { params });
  const data: IBillsResponse = res;
  return data;
};

export const getBillById = async (billId: string): Promise<IBillResponse> => {
  const res = await sendGet(`/bills/${billId}`);
  const data: IBillResponse = res;
  return data;
};

export const createBill = async (payload: IBillCreate): Promise<IBillResponse> => {
  const res = await sendPost("/bills", payload);
  const data: IBillResponse = res;
  return data;
};

export const updateBill = async (billId: string, payload: IBillUpdate): Promise<IBillResponse> => {
  const res = await sendPut(`/bills/${billId}`, payload);
  const data: IBillResponse = res;
  return data;
};

export const updateBillStatus = async (billId: string, payload: IBillStatusUpdate): Promise<IBillResponse> => {
  const res = await sendPut(`/bills/${billId}/status`, payload);
  const data: IBillResponse = res;
  return data;
};

export const addBillDetail = async (billId: string, payload: IBillItemCreate): Promise<IBillResponse> => {
  const res = await sendPost(`/bills/${billId}/details`, payload);
  const data: IBillResponse = res;
  return data;
};

export const updateBillDetail = async (billId: string, detailId: string, payload: IBillItemUpdate): Promise<IBillResponse> => {
  const res = await sendPut(`/bills/${billId}/details/${detailId}`, payload);
  const data: IBillResponse = res;
  return data;
};

export const deleteBillDetail = async (billId: string, detailId: string): Promise<IBillResponse> => {
  const res = await sendDelete(`/bills/${billId}/details/${detailId}`);
  const data: IBillResponse = res;
  return data;
};

export const addTransaction = async (billId: string, payload: IBillTransaction): Promise<IBillResponse> => {
  const res = await sendPost(`/bills/${billId}/transactions`, payload);
  const data: IBillResponse = res;
  return data;
};

export const processBillReturn = async (billId: string, payload: IBillReturn): Promise<IBillResponse> => {
  const res = await sendPost(`/bills/${billId}/return`, payload);
  const data: IBillResponse = res;
  return data;
};

export const deleteBill = async (billId: string): Promise<any> => {
  const res = await sendDelete(`/bills/${billId}`);
  return res;
};

export const getCustomerBills = async (params: IBillFilter): Promise<IBillsResponse> => {
  const res = await sendGet("/bills/customer", { params });
  const data: IBillsResponse = res;
  return data;
};