import {
  IVoucherFilter,
  IVoucherCreate,
  IVoucherUpdate,
  IVoucherValidate
} from "@/interface/request/voucher";
import {
  IVouchersResponse,
  IVoucherResponse,
  IVoucherValidationResponse,
  INotificationResponse,
  IActionResponse
} from "@/interface/response/voucher";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// === Admin Voucher API ===
export const getAllVouchers = async (params: IVoucherFilter): Promise<IVouchersResponse> => {
  const res = await sendGet("/vouchers", { params });
  return res as IVouchersResponse;
};

export const getVoucherById = async (voucherId: string): Promise<IVoucherResponse> => {
  const res = await sendGet(`/vouchers/${voucherId}`);
  return res as IVoucherResponse;
};

export const createVoucher = async (payload: IVoucherCreate): Promise<IVoucherResponse> => {
  const res = await sendPost("/vouchers", payload);
  return res as IVoucherResponse;
};

export const updateVoucher = async (voucherId: string, payload: IVoucherUpdate): Promise<IVoucherResponse> => {
  const res = await sendPut(`/vouchers/${voucherId}`, payload);
  return res as IVoucherResponse;
};

export const deleteVoucher = async (voucherId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/vouchers/${voucherId}`);
  return res as IActionResponse;
};

export const validateVoucher = async (payload: IVoucherValidate): Promise<IVoucherValidationResponse> => {
  const res = await sendPost("/vouchers/validate", payload);
  return res as IVoucherValidationResponse;
};

export const incrementVoucherUsage = async (voucherId: string): Promise<IVoucherResponse> => {
  const res = await sendPut(`/vouchers/${voucherId}/increment-usage`, {});
  return res as IVoucherResponse;
};

export const notifyVoucher = async (voucherId: string): Promise<INotificationResponse> => {
  const res = await sendPost(`/vouchers/${voucherId}/notify`, {});
  return res as INotificationResponse;
}; 