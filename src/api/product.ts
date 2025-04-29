import {
  IProductFilter,
  IProductCreate,
  IProductUpdate,
  IProductStatusUpdate,
  IProductStockUpdate,
  IProductImageUpdate,
  IProductSearchParams
} from "@/interface/request/product";
import {
  IProductsResponse,
  IProductResponse,
  IActionResponse
} from "@/interface/response/product";
import { sendGet, sendPost, sendPut, sendPatch, sendDelete } from "./axios";

// === Admin/Staff Product API ===
export const getAllProducts = async (params: IProductFilter): Promise<IProductsResponse> => {
  const res = await sendGet("/products", { params });
  return res as IProductsResponse;
};

export const getProductById = async (productId: string): Promise<IProductResponse> => {
  const res = await sendGet(`/products/${productId}`);
  return res as IProductResponse;
};

export const createProduct = async (payload: IProductCreate): Promise<IProductResponse> => {
  const res = await sendPost("/products", payload);
  return res as IProductResponse;
};

export const updateProduct = async (productId: string, payload: IProductUpdate): Promise<IProductResponse> => {
  const res = await sendPut(`/products/${productId}`, payload);
  return res as IProductResponse;
};

export const updateProductStatus = async (productId: string, payload: IProductStatusUpdate): Promise<IProductResponse> => {
  const res = await sendPatch(`/products/${productId}/status`, payload);
  return res as IProductResponse;
};

export const updateProductStock = async (productId: string, payload: IProductStockUpdate): Promise<IProductResponse> => {
  const res = await sendPatch(`/products/${productId}/stock`, payload);
  return res as IProductResponse;
};

export const updateProductImages = async (productId: string, payload: IProductImageUpdate): Promise<IProductResponse> => {
  const res = await sendPatch(`/products/${productId}/images`, payload);
  return res as IProductResponse;
};

export const deleteProduct = async (productId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/products/${productId}`);
  return res as IActionResponse;
};

// === Public Product API ===
export const searchProducts = async (params: IProductSearchParams): Promise<IProductsResponse> => {
  const res = await sendGet("/products/search", { params });
  return res as IProductsResponse;
}; 