import {
  IPromotionFilter,
  IPromotionCreate,
  IPromotionUpdate
} from "@/interface/request/promotion";
import {
  IPromotionsResponse,
  IPromotionResponse,
  IProductPromotionsResponse,
  IActionResponse
} from "@/interface/response/promotion";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// === Admin Promotion API ===
export const getAllPromotions = async (params: IPromotionFilter): Promise<IPromotionsResponse> => {
  const res = await sendGet("/promotions", { params });
  return res as IPromotionsResponse;
};

export const getPromotionById = async (promotionId: string): Promise<IPromotionResponse> => {
  const res = await sendGet(`/promotions/${promotionId}`);
  return res as IPromotionResponse;
};

export const createPromotion = async (payload: IPromotionCreate): Promise<IPromotionResponse> => {
  const res = await sendPost("/promotions", payload);
  return res as IPromotionResponse;
};

export const updatePromotion = async (promotionId: string, payload: IPromotionUpdate): Promise<IPromotionResponse> => {
  const res = await sendPut(`/promotions/${promotionId}`, payload);
  return res as IPromotionResponse;
};

export const deletePromotion = async (promotionId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/promotions/${promotionId}`);
  return res as IActionResponse;
};

// === Product Promotion API ===
export const getProductPromotions = async (productId: string): Promise<IProductPromotionsResponse> => {
  const res = await sendGet(`/promotions/product/${productId}`);
  return res as IProductPromotionsResponse;
}; 