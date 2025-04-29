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

// Lấy danh sách đơn hàng
export const getAllBills = async (params: IBillFilter): Promise<IBillsResponse> => {
  const res = await sendGet("/bills", { params });
  const data: IBillsResponse = res;
  return data;
};

// Tìm kiếm đơn hàng
export const searchBill = async (params: IBillFilter): Promise<IBillsResponse> => {
  const res = await sendGet("/bills/search", { params });
  const data: IBillsResponse = res;
  return data;
};

// Lấy chi tiết đơn hàng
export const getBillById = async (billId: string): Promise<IBillResponse> => {
  const res = await sendGet(`/bills/${billId}`);
  const data: IBillResponse = res;
  return data;
};

// Tạo đơn hàng mới
export const createBill = async (payload: IBillCreate): Promise<IBillResponse> => {
  const res = await sendPost("/bills", payload);
  const data: IBillResponse = res;
  return data;
};

// Cập nhật thông tin đơn hàng
export const updateBill = async (billId: string, payload: IBillUpdate): Promise<IBillResponse> => {
  const res = await sendPut(`/bills/${billId}`, payload);
  const data: IBillResponse = res;
  return data;
};

// Cập nhật trạng thái đơn hàng
export const updateBillStatus = async (billId: string, payload: IBillStatusUpdate): Promise<IBillResponse> => {
  const res = await sendPut(`/bills/${billId}/status`, payload);
  const data: IBillResponse = res;
  return data;
};

// Thêm sản phẩm vào đơn hàng
export const addBillDetail = async (billId: string, payload: IBillItemCreate): Promise<IBillResponse> => {
  const res = await sendPost(`/bills/${billId}/details`, payload);
  const data: IBillResponse = res;
  return data;
};

// Cập nhật sản phẩm trong đơn hàng
export const updateBillDetail = async (billId: string, detailId: string, payload: IBillItemUpdate): Promise<IBillResponse> => {
  const res = await sendPut(`/bills/${billId}/details/${detailId}`, payload);
  const data: IBillResponse = res;
  return data;
};

// Xóa sản phẩm khỏi đơn hàng
export const deleteBillDetail = async (billId: string, detailId: string): Promise<IBillResponse> => {
  const res = await sendDelete(`/bills/${billId}/details/${detailId}`);
  const data: IBillResponse = res;
  return data;
};

// Thêm giao dịch thanh toán
export const addTransaction = async (billId: string, payload: IBillTransaction): Promise<IBillResponse> => {
  const res = await sendPost(`/bills/${billId}/transactions`, payload);
  const data: IBillResponse = res;
  return data;
};

// Xử lý trả hàng
export const processBillReturn = async (billId: string, payload: IBillReturn): Promise<IBillResponse> => {
  const res = await sendPost(`/bills/${billId}/return`, payload);
  const data: IBillResponse = res;
  return data;
};

// Xóa đơn hàng
export const deleteBill = async (billId: string): Promise<any> => {
  const res = await sendDelete(`/bills/${billId}`);
  return res;
};

// Lấy đơn hàng của khách hàng
export const getCustomerBills = async (params: IBillFilter): Promise<IBillsResponse> => {
  const res = await sendGet("/bills/customer", { params });
  const data: IBillsResponse = res;
  return data;
}; 