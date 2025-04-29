import {
  IClientFilter,
  ICheckoutPayload,
  ICartItemPayload,
  IAddressCreate,
  IAddressUpdate,
  IProfileUpdate
} from "@/interface/request/client";

import {
  IHomeResponse,
  IProductsResponse,
  IProductDetailResponse,
  IPaymentMethodsResponse,
  IOrdersResponse,
  IOrderDetailResponse,
  IProfileResponse,
  IAddressesResponse
} from "@/interface/response/client";

import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// Trang chủ
export const getHomeData = async (): Promise<IHomeResponse> => {
  const res = await sendGet("/client/home");
  const data: IHomeResponse = res;
  return data;
};

// Sản phẩm
export const getNewProducts = async (page: number = 1, limit: number = 12): Promise<IProductsResponse> => {
  const res = await sendGet("/client/products/new", { params: { page, limit } });
  const data: IProductsResponse = res;
  return data;
};

export const getPopularProducts = async (page: number = 1, limit: number = 12): Promise<IProductsResponse> => {
  const res = await sendGet("/client/products/popular", { params: { page, limit } });
  const data: IProductsResponse = res;
  return data;
};

export const getProducts = async (params: IClientFilter = {}): Promise<IProductsResponse> => {
  const res = await sendGet("/client/products", { params });
  const data: IProductsResponse = res;
  return data;
};

export const getProductDetails = async (productId: string): Promise<IProductDetailResponse> => {
  const res = await sendGet(`/client/products/${productId}`);
  const data: IProductDetailResponse = res;
  return data;
};

export const searchProducts = async (query: string, page: number = 1, limit: number = 12): Promise<IProductsResponse> => {
  const res = await sendGet("/client/products/search", { params: { q: query, page, limit } });
  const data: IProductsResponse = res;
  return data;
};

export const filterProducts = async (params: IClientFilter = {}): Promise<IProductsResponse> => {
  const res = await sendGet("/client/products/filter", { params });
  const data: IProductsResponse = res;
  return data;
};

// Thanh toán
export const checkout = async (payload: ICheckoutPayload): Promise<IOrderDetailResponse> => {
  const res = await sendPost("/client/checkout", payload);
  const data: IOrderDetailResponse = res;
  return data;
};

export const getPaymentMethods = async (): Promise<IPaymentMethodsResponse> => {
  const res = await sendGet("/client/payment-methods");
  const data: IPaymentMethodsResponse = res;
  return data;
};

// Đơn hàng
export const getOrders = async (page: number = 1, limit: number = 10, status?: string): Promise<IOrdersResponse> => {
  const res = await sendGet("/client/orders", { params: { page, limit, status } });
  const data: IOrdersResponse = res;
  return data;
};

export const getOrderDetails = async (orderId: string): Promise<IOrderDetailResponse> => {
  const res = await sendGet(`/client/orders/${orderId}`);
  const data: IOrderDetailResponse = res;
  return data;
};

// Hồ sơ khách hàng
export const getProfile = async (): Promise<IProfileResponse> => {
  const res = await sendGet("/client/profile");
  const data: IProfileResponse = res;
  return data;
};

export const updateProfile = async (payload: IProfileUpdate): Promise<IProfileResponse> => {
  const res = await sendPut("/client/profile", payload);
  const data: IProfileResponse = res;
  return data;
};

// Địa chỉ giao hàng
export const getAddresses = async (): Promise<IAddressesResponse> => {
  const res = await sendGet("/client/addresses");
  const data: IAddressesResponse = res;
  return data;
};

export const addAddress = async (payload: IAddressCreate): Promise<IAddressesResponse> => {
  const res = await sendPost("/client/addresses", payload);
  const data: IAddressesResponse = res;
  return data;
};

export const updateAddress = async (addressId: string, payload: IAddressUpdate): Promise<IAddressesResponse> => {
  const res = await sendPut(`/client/addresses/${addressId}`, payload);
  const data: IAddressesResponse = res;
  return data;
};

export const deleteAddress = async (addressId: string): Promise<IAddressesResponse> => {
  const res = await sendDelete(`/client/addresses/${addressId}`);
  const data: IAddressesResponse = res;
  return data;
}; 