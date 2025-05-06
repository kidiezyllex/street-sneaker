import {
  ISignIn,
  IRegister
} from "@/interface/request/authentication";
import {
  IAuthResponse,
  IProfileResponse
} from "@/interface/response/authentication";
import { sendGet, sendPost } from "./axios";

/**
 * Đăng ký tài khoản mới
 */
export const register = async (payload: IRegister): Promise<IAuthResponse> => {
  const res = await sendPost("/accounts/register", payload);
  return res as IAuthResponse;
};

/**
 * Đăng nhập
 */
export const login = async (payload: ISignIn): Promise<IAuthResponse> => {
  const res = await sendPost("/auth/login", payload);
  return res as IAuthResponse;
};

/**
 * Đăng xuất
 */
export const logout = async (): Promise<{success: boolean; message: string}> => {
  const res = await sendPost("/auth/logout", {});
  return res;
};

/**
 * Lấy thông tin người dùng hiện tại từ token
 */
export const getCurrentUser = async (): Promise<IProfileResponse> => {
  const res = await sendGet("/auth/me");
  return res as IProfileResponse;
};

/**
 * Làm mới token
 */
export const refreshToken = async (payload: {refreshToken: string}): Promise<{success: boolean; data: {token: string; refreshToken: string}}> => {
  const res = await sendPost("/auth/refresh-token", payload);
  return res;
}; 