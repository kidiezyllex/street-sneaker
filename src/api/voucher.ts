import { IVoucherFilter, IVoucherCreate, IVoucherUpdate, IAddCustomerToVoucher, ICheckVoucher } from "@/interface/request/voucher";
import { IVoucherResponse, IVouchersResponse, ICheckVoucherResponse } from "@/interface/response/voucher";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

//                                                                                                                     Danh sách voucher
export const getAllVouchers = async (params: IVoucherFilter): Promise<IVouchersResponse> => {
  const res = await sendGet("/vouchers", { params });
  const data: IVouchersResponse = res;
  return data;
};

//                                                                                                                     Chi tiết voucher
export const getVoucherById = async (voucherId: string): Promise<IVoucherResponse> => {
  const res = await sendGet(`/vouchers/${voucherId}`);
  const data: IVoucherResponse = res;
  return data;
};

//                                                                                                                     Tạo voucher mới
export const createVoucher = async (payload: IVoucherCreate): Promise<IVoucherResponse> => {
  const res = await sendPost("/vouchers", payload);
  const data: IVoucherResponse = res;
  return data;
};

//                                                                                                                     Cập nhật voucher
export const updateVoucher = async (voucherId: string, payload: IVoucherUpdate): Promise<IVoucherResponse> => {
  const res = await sendPut(`/vouchers/${voucherId}`, payload);
  const data: IVoucherResponse = res;
  return data;
};

//                                                                                                                     Xóa voucher
export const deleteVoucher = async (voucherId: string): Promise<any> => {
  const res = await sendDelete(`/vouchers/${voucherId}`);
  return res;
};

//                                                                                                                     Thêm khách hàng vào voucher
export const addCustomerToVoucher = async (voucherId: string, payload: IAddCustomerToVoucher): Promise<IVoucherResponse> => {
  const res = await sendPost(`/vouchers/${voucherId}/customers`, payload);
  const data: IVoucherResponse = res;
  return data;
};

//                                                                                                                     Xóa khách hàng khỏi voucher
export const removeCustomerFromVoucher = async (voucherId: string, customerId: string): Promise<IVoucherResponse> => {
  const res = await sendDelete(`/vouchers/${voucherId}/customers/${customerId}`);
  const data: IVoucherResponse = res;
  return data;
};

//                                                                                                                     Kiểm tra voucher
export const checkVoucher = async (payload: ICheckVoucher): Promise<ICheckVoucherResponse> => {
  const res = await sendPost("/vouchers/check", payload);
  const data: ICheckVoucherResponse = res;
  return data;
};

//                                                                                                                     Lấy danh sách voucher của khách hàng
export const getCustomerVouchers = async (): Promise<IVouchersResponse> => {
  const res = await sendGet("/vouchers/customer");
  const data: IVouchersResponse = res;
  return data;
}; 