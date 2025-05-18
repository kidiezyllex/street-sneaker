import {
  IBrandFilter, IBrandCreate, IBrandUpdate,
  ICategoryFilter, ICategoryCreate, ICategoryUpdate,
  IMaterialFilter, IMaterialCreate, IMaterialUpdate,
  IColorFilter, IColorCreate, IColorUpdate,
  ISizeFilter, ISizeCreate, ISizeUpdate
} from "@/interface/request/attributes";

import {
  IBrandResponse, IBrandsResponse,
  ICategoryResponse, ICategoriesResponse,
  IMaterialResponse, IMaterialsResponse,
  IColorResponse, IColorsResponse,
  ISizeResponse, ISizesResponse,
  IActionResponse
} from "@/interface/response/attributes";

import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// ======= Brand API ======= //
export const getAllBrands = async (params: IBrandFilter = {}): Promise<IBrandsResponse> => {
  const res = await sendGet("/attributes/brands", params);
  return res as IBrandsResponse;
};

export const getBrandById = async (brandId: string): Promise<IBrandResponse> => {
  const res = await sendGet(`/attributes/brands/${brandId}`);
  return res as IBrandResponse;
};

export const createBrand = async (payload: IBrandCreate): Promise<IBrandResponse> => {
  const res = await sendPost("/attributes/brands", payload);
  return res as IBrandResponse;
};

export const updateBrand = async (brandId: string, payload: IBrandUpdate): Promise<IBrandResponse> => {
  const res = await sendPut(`/attributes/brands/${brandId}`, payload);
  return res as IBrandResponse;
};

export const deleteBrand = async (brandId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/attributes/brands/${brandId}`);
  return res as IActionResponse;
};

// ======= Category API ======= //
export const getAllCategories = async (params: ICategoryFilter = {}): Promise<ICategoriesResponse> => {
  const res = await sendGet("/attributes/categories", params);
  return res as ICategoriesResponse;
};

export const getCategoryById = async (categoryId: string): Promise<ICategoryResponse> => {
  const res = await sendGet(`/attributes/categories/${categoryId}`);
  return res as ICategoryResponse;
};

export const createCategory = async (payload: ICategoryCreate): Promise<ICategoryResponse> => {
  const res = await sendPost("/attributes/categories", payload);
  return res as ICategoryResponse;
};

export const updateCategory = async (categoryId: string, payload: ICategoryUpdate): Promise<ICategoryResponse> => {
  const res = await sendPut(`/attributes/categories/${categoryId}`, payload);
  return res as ICategoryResponse;
};

export const deleteCategory = async (categoryId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/attributes/categories/${categoryId}`);
  return res as IActionResponse;
};

// ======= Material API ======= //
export const getAllMaterials = async (params: IMaterialFilter = {}): Promise<IMaterialsResponse> => {
  const res = await sendGet("/attributes/materials", params);
  return res as IMaterialsResponse;
};

export const getMaterialById = async (materialId: string): Promise<IMaterialResponse> => {
  const res = await sendGet(`/attributes/materials/${materialId}`);
  return res as IMaterialResponse;
};

export const createMaterial = async (payload: IMaterialCreate): Promise<IMaterialResponse> => {
  const res = await sendPost("/attributes/materials", payload);
  return res as IMaterialResponse;
};

export const updateMaterial = async (materialId: string, payload: IMaterialUpdate): Promise<IMaterialResponse> => {
  const res = await sendPut(`/attributes/materials/${materialId}`, payload);
  return res as IMaterialResponse;
};

export const deleteMaterial = async (materialId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/attributes/materials/${materialId}`);
  return res as IActionResponse;
};

// ======= Color API ======= //
export const getAllColors = async (params: IColorFilter = {}): Promise<IColorsResponse> => {
  const res = await sendGet("/attributes/colors", params);
  return res as IColorsResponse;
};

export const getColorById = async (colorId: string): Promise<IColorResponse> => {
  const res = await sendGet(`/attributes/colors/${colorId}`);
  return res as IColorResponse;
};

export const createColor = async (payload: IColorCreate): Promise<IColorResponse> => {
  const res = await sendPost("/attributes/colors", payload);
  return res as IColorResponse;
};

export const updateColor = async (colorId: string, payload: IColorUpdate): Promise<IColorResponse> => {
  const res = await sendPut(`/attributes/colors/${colorId}`, payload);
  return res as IColorResponse;
};

export const deleteColor = async (colorId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/attributes/colors/${colorId}`);
  return res as IActionResponse;
};

// ======= Size API ======= //
export const getAllSizes = async (params: ISizeFilter = {}): Promise<ISizesResponse> => {
  const res = await sendGet("/attributes/sizes", params);
  return res as ISizesResponse;
};

export const getSizeById = async (sizeId: string): Promise<ISizeResponse> => {
  const res = await sendGet(`/attributes/sizes/${sizeId}`);
  return res as ISizeResponse;
};

export const createSize = async (payload: ISizeCreate): Promise<ISizeResponse> => {
  const res = await sendPost("/attributes/sizes", payload);
  return res as ISizeResponse;
};

export const updateSize = async (sizeId: string, payload: ISizeUpdate): Promise<ISizeResponse> => {
  const res = await sendPut(`/attributes/sizes/${sizeId}`, payload);
  return res as ISizeResponse;
};

export const deleteSize = async (sizeId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/attributes/sizes/${sizeId}`);
  return res as IActionResponse;
}; 