import {
  ISignIn,
  IRegister,
} from "@/interface/request/authentication";
import {
  IAuthResponse,
  IProfileResponse,
} from "@/interface/response/authentication";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const register = async (payload: IRegister): Promise<IAuthResponse> => {
  const res = await sendPost("/auth/register", payload);
  const data: IAuthResponse = res;
  return data;
};

export const signIn = async (payload: ISignIn): Promise<IAuthResponse> => {
  const res = await sendPost("/auth/login", payload);
  const data: IAuthResponse = res;
  return data;
};

export const getProfile = async (): Promise<IProfileResponse> => {
  const res = await sendGet("/auth/profile");
  const data: IProfileResponse = res;
  return data;
};

export const changePassword = async (payload: any): Promise<any> => {
  const res = await sendPut("/auth/change-password", payload);
  return res;
};

export const updateProfile = async (payload: any): Promise<any> => {
  const res = await sendPut("/auth/update-profile", payload);
  return res;
};

export const addAddress = async (payload: any): Promise<any> => {
  const res = await sendPost("/auth/address", payload);
  return res;
};

export const updateAddress = async (addressId: string, payload: any): Promise<any> => {
  const res = await sendPut(`/auth/address/${addressId}`, payload);
  return res;
};

export const deleteAddress = async (addressId: string): Promise<any> => {
  const res = await sendDelete(`/auth/address/${addressId}`);
  return res;
};

export const setDefaultAddress = async (addressId: string): Promise<any> => {
  const res = await sendPut(`/auth/address/${addressId}/default`);
  return res;
};
