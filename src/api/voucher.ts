import {
  IVoucherFilter,
  IVoucherCreate,
  IVoucherUpdate,
  IVoucherValidate,
  IUserVoucherParams
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
/**
 * Get all vouchers with optional filtering
 * Endpoint: GET /api/vouchers
 */
export const getAllVouchers = async (params: IVoucherFilter): Promise<IVouchersResponse> => {
  const res = await sendGet("/vouchers", params);
  return res as IVouchersResponse;
};

/**
 * Get voucher details by ID
 * Endpoint: GET /api/vouchers/{id}
 */
export const getVoucherById = async (voucherId: string): Promise<IVoucherResponse> => {
  const res = await sendGet(`/vouchers/${voucherId}`);
  return res as IVoucherResponse;
};

/**
 * Create a new voucher
 * Endpoint: POST /api/vouchers
 */
export const createVoucher = async (payload: IVoucherCreate): Promise<IVoucherResponse> => {
  const res = await sendPost("/vouchers", payload);
  return res as IVoucherResponse;
};

/**
 * Update an existing voucher
 * Endpoint: PUT /api/vouchers/{id}
 */
export const updateVoucher = async (voucherId: string, payload: IVoucherUpdate): Promise<IVoucherResponse> => {
  const res = await sendPut(`/vouchers/${voucherId}`, payload);
  return res as IVoucherResponse;
};

/**
 * Delete a voucher
 * Endpoint: DELETE /api/vouchers/{id}
 */
export const deleteVoucher = async (voucherId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/vouchers/${voucherId}`);
  return res as IActionResponse;
};

/**
 * Validate a voucher code for a given order value
 * Endpoint: POST /api/vouchers/validate
 */
export const validateVoucher = async (payload: IVoucherValidate): Promise<IVoucherValidationResponse> => {
  const res = await sendPost("/vouchers/validate", payload);
  return res as IVoucherValidationResponse;
};

/**
 * Increment the usage count of a voucher
 * Endpoint: PUT /api/vouchers/{id}/increment-usage
 */
export const incrementVoucherUsage = async (voucherId: string): Promise<IVoucherResponse> => {
  const res = await sendPut(`/vouchers/${voucherId}/increment-usage`, {});
  return res as IVoucherResponse;
};

/**
 * Send notification about a voucher to users
 * Endpoint: POST /api/vouchers/{id}/notify
 */
export const notifyVoucher = async (voucherId: string): Promise<INotificationResponse> => {
  const res = await sendPost(`/vouchers/${voucherId}/notify`, {});
  return res as INotificationResponse;
};

// === User Voucher API ===
/**
 * Get available vouchers for a specific user
 * Endpoint: GET /api/vouchers/user/{userId}
 */
export const getAvailableVouchersForUser = async (userId: string, params?: IUserVoucherParams): Promise<IVouchersResponse> => {
  const res = await sendGet(`/vouchers/user/${userId}`, params);
  return res as IVouchersResponse;
}; 