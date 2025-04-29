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

export const getAllAccounts = async (params: IAccountFilter): Promise<IAccountsResponse> => {
  const res = await sendGet("/accounts", { params });
  return res as IAccountsResponse;
};

export const getAccountById = async (accountId: string): Promise<IAccountResponse> => {
  const res = await sendGet(`/accounts/${accountId}`);
  return res as IAccountResponse;
};

export const createAccount = async (payload: IAccountCreate): Promise<IAccountResponse> => {
  const res = await sendPost("/accounts", payload);
  return res as IAccountResponse;
};

export const updateAccount = async (accountId: string, payload: IAccountUpdate): Promise<IAccountResponse> => {
  const res = await sendPut(`/accounts/${accountId}`, payload);
  return res as IAccountResponse;
};

export const updateAccountStatus = async (accountId: string, payload: IAccountStatusUpdate): Promise<IAccountResponse> => {
  const res = await sendPut(`/accounts/${accountId}/status`, payload);
  return res as IAccountResponse;
};
export const deleteAccount = async (accountId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/accounts/${accountId}`);
  return res as IActionResponse;
};

export const addAddress = async (accountId: string, payload: IAddressCreate): Promise<IAddressListResponse> => {
  const res = await sendPost(`/accounts/${accountId}/addresses`, payload);
  return res as IAddressListResponse;
};

export const updateAddress = async (accountId: string, addressId: string, payload: IAddressUpdate): Promise<IAddressListResponse> => {
  const res = await sendPut(`/accounts/${accountId}/addresses/${addressId}`, payload);
  return res as IAddressListResponse;
};

export const deleteAddress = async (accountId: string, addressId: string): Promise<IAddressListResponse> => {
  const res = await sendDelete(`/accounts/${accountId}/addresses/${addressId}`);
  return res as IAddressListResponse;
};

export const updateProfile = async (payload: IProfileUpdate): Promise<IProfileResponse> => {
  const res = await sendPut("/account/profile", payload);
  return res as IProfileResponse;
};

export const changePassword = async (payload: IChangePassword): Promise<IActionResponse> => {
  const res = await sendPut("/account/profile/password", payload);
  return res as IActionResponse;
};


export const getCustomerAccounts = async (params: IAccountFilter): Promise<IAccountsResponse> => {
  const res = await sendGet("/account/customers", { params });
  return res as IAccountsResponse;
};

export const getCustomerAccountById = async (customerId: string): Promise<IAccountResponse> => {
  const res = await sendGet(`/account/customers/${customerId}`);
  return res as IAccountResponse;
};

export const updateCustomerAccount = async (customerId: string, payload: IAccountUpdate): Promise<IAccountResponse> => {
  const res = await sendPut(`/account/customers/${customerId}`, payload);
  return res as IAccountResponse;
};

