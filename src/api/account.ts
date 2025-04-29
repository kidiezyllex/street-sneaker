import {
  IAccountFilter,
  IAccountCreate,
  IAccountUpdate,
  IAccountStatusUpdate,
  IAddressCreate,
  IAddressUpdate,
  IProfileUpdate,
  IChangePassword,
} from "@/interface/request/account";
import {
  IAccountsResponse,
  IAccountResponse,
  IAddressListResponse,
  IProfileResponse,
  IActionResponse
} from "@/interface/response/account";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// Lấy danh sách tất cả tài khoản (Admin)
export const getAllAccounts = async (params: IAccountFilter): Promise<IAccountsResponse> => {
  const res = await sendGet("/accounts", { params }); // Endpoint dựa trên controller
  return res as IAccountsResponse;
};

// Lấy thông tin chi tiết một tài khoản (Admin)
export const getAccountById = async (accountId: string): Promise<IAccountResponse> => {
  const res = await sendGet(`/accounts/${accountId}`); // Endpoint dựa trên controller
  return res as IAccountResponse;
};

// Tạo tài khoản mới (Admin)
export const createAccount = async (payload: IAccountCreate): Promise<IAccountResponse> => {
  const res = await sendPost("/accounts", payload); // Endpoint dựa trên controller
  return res as IAccountResponse;
};

// Cập nhật thông tin tài khoản (Admin)
export const updateAccount = async (accountId: string, payload: IAccountUpdate): Promise<IAccountResponse> => {
  const res = await sendPut(`/accounts/${accountId}`, payload); // Endpoint dựa trên controller
  return res as IAccountResponse;
};

// Cập nhật trạng thái tài khoản (Admin)
export const updateAccountStatus = async (accountId: string, payload: IAccountStatusUpdate): Promise<IAccountResponse> => {
  const res = await sendPut(`/accounts/${accountId}/status`, payload); // Endpoint dựa trên controller
  return res as IAccountResponse;
};

// Xóa tài khoản (Admin)
export const deleteAccount = async (accountId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/accounts/${accountId}`); // Endpoint dựa trên controller
  return res as IActionResponse;
};

// Thêm địa chỉ mới cho tài khoản (User/Admin)
export const addAddress = async (accountId: string, payload: IAddressCreate): Promise<IAddressListResponse> => {
  const res = await sendPost(`/accounts/${accountId}/addresses`, payload); // Endpoint dựa trên controller
  return res as IAddressListResponse;
};

// Cập nhật địa chỉ (User/Admin)
export const updateAddress = async (accountId: string, addressId: string, payload: IAddressUpdate): Promise<IAddressListResponse> => {
  const res = await sendPut(`/accounts/${accountId}/addresses/${addressId}`, payload); // Endpoint dựa trên controller
  return res as IAddressListResponse;
};

// Xóa địa chỉ (User/Admin)
export const deleteAddress = async (accountId: string, addressId: string): Promise<IAddressListResponse> => {
  const res = await sendDelete(`/accounts/${accountId}/addresses/${addressId}`); // Endpoint dựa trên controller
  return res as IAddressListResponse;
};

// Cập nhật thông tin cá nhân người dùng đang đăng nhập
export const updateProfile = async (payload: IProfileUpdate): Promise<IProfileResponse> => {
  const res = await sendPut("/account/profile", payload); // Endpoint từ router
  return res as IProfileResponse;
};

// Đổi mật khẩu người dùng đang đăng nhập
export const changePassword = async (payload: IChangePassword): Promise<IActionResponse> => {
  const res = await sendPut("/account/profile/password", payload); // Endpoint từ router
  return res as IActionResponse;
};

// --- Customer Account Endpoints (dựa trên router) ---
// Lưu ý: Các hàm này có thể trùng lặp logic với các hàm /accounts ở trên
// Cân nhắc gộp hoặc làm rõ sự khác biệt nếu cần

// Lấy danh sách tài khoản khách hàng
export const getCustomerAccounts = async (params: IAccountFilter): Promise<IAccountsResponse> => {
  const res = await sendGet("/account/customers", { params }); // Endpoint từ router
  return res as IAccountsResponse;
};

// Lấy thông tin tài khoản khách hàng theo ID
export const getCustomerAccountById = async (customerId: string): Promise<IAccountResponse> => {
  const res = await sendGet(`/account/customers/${customerId}`); // Endpoint từ router
  return res as IAccountResponse;
};

// Cập nhật tài khoản khách hàng
export const updateCustomerAccount = async (customerId: string, payload: IAccountUpdate): Promise<IAccountResponse> => {
  const res = await sendPut(`/account/customers/${customerId}`, payload); // Endpoint từ router
  return res as IAccountResponse;
};

// Thêm địa chỉ cho khách hàng (Dùng lại hàm addAddress với ID khách hàng?)
// export const addCustomerAddress = ...

// Cập nhật địa chỉ khách hàng (Dùng lại hàm updateAddress với ID khách hàng?)
// export const updateCustomerAddress = ...

// Xóa địa chỉ khách hàng (Dùng lại hàm deleteAddress với ID khách hàng?)
// export const deleteCustomerAddress = ... 