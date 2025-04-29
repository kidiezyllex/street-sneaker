import { 
  IPromotionFilter,
  IPromotionCreate,
  IPromotionUpdate,
  IVoucherFilter,
  IVoucherCreate,
  IVoucherUpdate,
  ICustomerVoucher,
  IProductPromotionFilter,
  IProductPromotionCreate,
  IProductPromotionUpdate
} from "@/interface/request/promotion";

import { 
  IPromotionResponse,
  IPromotionsResponse,
  IVoucherResponse,
  IVouchersResponse,
  IProductPromotionResponse,
  IProductPromotionsResponse,
  IActivePromotionsResponse
} from "@/interface/response/promotion";

import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const getPromotions = async (params: IPromotionFilter = {}): Promise<IPromotionsResponse> => {
  const res = await sendGet("/promotions", { params });
  const data: IPromotionsResponse = res;
  return data;
};

export const getPromotionById = async (promotionId: string): Promise<IPromotionResponse> => {
  const res = await sendGet(`/promotions/${promotionId}`);
  const data: IPromotionResponse = res;
  return data;
};

export const createPromotion = async (payload: IPromotionCreate): Promise<IPromotionResponse> => {
  const res = await sendPost("/promotions", payload);
  const data: IPromotionResponse = res;
  return data;
};

export const updatePromotion = async (promotionId: string, payload: IPromotionUpdate): Promise<IPromotionResponse> => {
  const res = await sendPut(`/promotions/${promotionId}`, payload);
  const data: IPromotionResponse = res;
  return data;
};

export const deletePromotion = async (promotionId: string): Promise<any> => {
  const res = await sendDelete(`/promotions/${promotionId}`);
  return res;
};

export const getActivePromotions = async (): Promise<IActivePromotionsResponse> => {
  const res = await sendGet("/promotions/active");
  const data: IActivePromotionsResponse = res;
  return data;
};

export const getVouchers = async (params: IVoucherFilter = {}): Promise<IVouchersResponse> => {
  const res = await sendGet("/promotions/vouchers", { params });
  const data: IVouchersResponse = res;
  return data;
};

export const getVoucherById = async (voucherId: string): Promise<IVoucherResponse> => {
  const res = await sendGet(`/promotions/vouchers/${voucherId}`);
  const data: IVoucherResponse = res;
  return data;
};

export const createVoucher = async (payload: IVoucherCreate): Promise<IVoucherResponse> => {
  const res = await sendPost("/promotions/vouchers", payload);
  const data: IVoucherResponse = res;
  return data;
};

export const updateVoucher = async (voucherId: string, payload: IVoucherUpdate): Promise<IVoucherResponse> => {
  const res = await sendPut(`/promotions/vouchers/${voucherId}`, payload);
  const data: IVoucherResponse = res;
  return data;
};

export const addCustomerToVoucher = async (voucherId: string, payload: ICustomerVoucher): Promise<IVoucherResponse> => {
  const res = await sendPost(`/promotions/vouchers/${voucherId}/customers`, payload);
  const data: IVoucherResponse = res;
  return data;
};

export const removeCustomerFromVoucher = async (voucherId: string, customerId: string): Promise<IVoucherResponse> => {
  const res = await sendDelete(`/promotions/vouchers/${voucherId}/customers/${customerId}`);
  const data: IVoucherResponse = res;
  return data;
};

export const searchVouchers = async (params: IVoucherFilter = {}): Promise<IVouchersResponse> => {
  const res = await sendGet("/promotions/vouchers/search", { params });
  const data: IVouchersResponse = res;
  return data;
};

export const createProductPromotion = async (payload: IProductPromotionCreate): Promise<IProductPromotionResponse> => {
  const res = await sendPost("/promotions/products", payload);
  const data: IProductPromotionResponse = res;
  return data;
};

export const getProductPromotions = async (params: IProductPromotionFilter = {}): Promise<IProductPromotionsResponse> => {
  const res = await sendGet("/promotions/products", { params });
  const data: IProductPromotionsResponse = res;
  return data;
};

export const searchProductPromotions = async (params: IProductPromotionFilter = {}): Promise<IProductPromotionsResponse> => {
  const res = await sendGet("/promotions/products/search", { params });
  const data: IProductPromotionsResponse = res;
  return data;
};

export const updateProductPromotion = async (promotionId: string, payload: IProductPromotionUpdate): Promise<IProductPromotionResponse> => {
  const res = await sendPut(`/promotions/products/${promotionId}`, payload);
  const data: IProductPromotionResponse = res;
  return data;
};

export const deleteProductPromotion = async (promotionId: string): Promise<any> => {
  const res = await sendDelete(`/promotions/products/${promotionId}`);
  return res;
};