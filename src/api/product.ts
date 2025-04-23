import { IProductFilter, IProductVariant, IProductImage, IProductPromotion, IAttributeCreate, IColorCreate } from "@/interface/request/product";
import {
  IProductResponse,
  IProductsResponse,
  IBrandsResponse,
  ICategoriesResponse,
  IColorsResponse,
  IMaterialsResponse,
  ISizesResponse,
  ISolesResponse,
} from "@/interface/response/product";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// Sản phẩm
export const getAllProducts = async (params: IProductFilter): Promise<IProductsResponse> => {
  const res = await sendGet("/products", { params });
  const data: IProductsResponse = res;
  return data;
};

export const getProductById = async (productId: string): Promise<IProductResponse> => {
  const res = await sendGet(`/products/${productId}`);
  const data: IProductResponse = res;
  return data;
};

export const createProduct = async (payload: any): Promise<IProductResponse> => {
  const res = await sendPost("/products", payload);
  const data: IProductResponse = res;
  return data;
};

export const updateProduct = async (productId: string, payload: any): Promise<IProductResponse> => {
  const res = await sendPut(`/products/${productId}`, payload);
  const data: IProductResponse = res;
  return data;
};

export const deleteProduct = async (productId: string): Promise<any> => {
  const res = await sendDelete(`/products/${productId}`);
  return res;
};

// Biến thể sản phẩm
export const addProductVariant = async (productId: string, payload: IProductVariant): Promise<any> => {
  const res = await sendPost(`/products/${productId}/variants`, payload);
  return res;
};

export const updateProductVariant = async (productId: string, variantId: string, payload: Partial<IProductVariant>): Promise<any> => {
  const res = await sendPut(`/products/${productId}/variants/${variantId}`, payload);
  return res;
};

export const deleteProductVariant = async (productId: string, variantId: string): Promise<any> => {
  const res = await sendDelete(`/products/${productId}/variants/${variantId}`);
  return res;
};

// Hình ảnh sản phẩm
export const addProductImage = async (productId: string, variantId: string, payload: IProductImage): Promise<any> => {
  const res = await sendPost(`/products/${productId}/variants/${variantId}/images`, payload);
  return res;
};

export const updateProductImage = async (productId: string, variantId: string, imageId: string, payload: Partial<IProductImage>): Promise<any> => {
  const res = await sendPut(`/products/${productId}/variants/${variantId}/images/${imageId}`, payload);
  return res;
};

export const deleteProductImage = async (productId: string, variantId: string, imageId: string): Promise<any> => {
  const res = await sendDelete(`/products/${productId}/variants/${variantId}/images/${imageId}`);
  return res;
};

// Khuyến mãi
export const addProductPromotion = async (productId: string, variantId: string, payload: IProductPromotion): Promise<any> => {
  const res = await sendPost(`/products/${productId}/variants/${variantId}/promotions`, payload);
  return res;
};

export const deleteProductPromotion = async (productId: string, variantId: string, promotionId: string): Promise<any> => {
  const res = await sendDelete(`/products/${productId}/variants/${variantId}/promotions/${promotionId}`);
  return res;
};

// Thương hiệu
export const getAllBrands = async (): Promise<IBrandsResponse> => {
  const res = await sendGet("/products/brands");
  const data: IBrandsResponse = res;
  return data;
};

export const createBrand = async (payload: IAttributeCreate): Promise<any> => {
  const res = await sendPost("/products/brands", payload);
  return res;
};

export const updateBrand = async (brandId: string, payload: Partial<IAttributeCreate>): Promise<any> => {
  const res = await sendPut(`/products/brands/${brandId}`, payload);
  return res;
};

// Danh mục
export const getAllCategories = async (): Promise<ICategoriesResponse> => {
  const res = await sendGet("/products/categories");
  const data: ICategoriesResponse = res;
  return data;
};

export const createCategory = async (payload: IAttributeCreate): Promise<any> => {
  const res = await sendPost("/products/categories", payload);
  return res;
};

export const updateCategory = async (categoryId: string, payload: Partial<IAttributeCreate>): Promise<any> => {
  const res = await sendPut(`/products/categories/${categoryId}`, payload);
  return res;
};

// Màu sắc
export const getAllColors = async (): Promise<IColorsResponse> => {
  const res = await sendGet("/products/colors");
  const data: IColorsResponse = res;
  return data;
};

export const createColor = async (payload: IColorCreate): Promise<any> => {
  const res = await sendPost("/products/colors", payload);
  return res;
};

export const updateColor = async (colorId: string, payload: Partial<IColorCreate>): Promise<any> => {
  const res = await sendPut(`/products/colors/${colorId}`, payload);
  return res;
};

// Vật liệu
export const getAllMaterials = async (): Promise<IMaterialsResponse> => {
  const res = await sendGet("/products/materials");
  const data: IMaterialsResponse = res;
  return data;
};

export const createMaterial = async (payload: IAttributeCreate): Promise<any> => {
  const res = await sendPost("/products/materials", payload);
  return res;
};

export const updateMaterial = async (materialId: string, payload: Partial<IAttributeCreate>): Promise<any> => {
  const res = await sendPut(`/products/materials/${materialId}`, payload);
  return res;
};

// Kích thước
export const getAllSizes = async (): Promise<ISizesResponse> => {
  const res = await sendGet("/products/sizes");
  const data: ISizesResponse = res;
  return data;
};

export const createSize = async (payload: IAttributeCreate): Promise<any> => {
  const res = await sendPost("/products/sizes", payload);
  return res;
};

export const updateSize = async (sizeId: string, payload: Partial<IAttributeCreate>): Promise<any> => {
  const res = await sendPut(`/products/sizes/${sizeId}`, payload);
  return res;
};

// Đế giày
export const getAllSoles = async (): Promise<ISolesResponse> => {
  const res = await sendGet("/products/soles");
  const data: ISolesResponse = res;
  return data;
};

export const createSole = async (payload: IAttributeCreate): Promise<any> => {
  const res = await sendPost("/products/soles", payload);
  return res;
};

export const updateSole = async (soleId: string, payload: Partial<IAttributeCreate>): Promise<any> => {
  const res = await sendPut(`/products/soles/${soleId}`, payload);
  return res;
};

// Tìm kiếm và lọc sản phẩm
export const searchProducts = async (query: string, page: number = 1, limit: number = 10): Promise<IProductsResponse> => {
  const res = await sendGet("/products/search", { params: { query, page, limit } });
  const data: IProductsResponse = res;
  return data;
};

export const getNewestProducts = async (limit: number = 8): Promise<IProductsResponse> => {
  const res = await sendGet("/products/newest", { params: { limit } });
  const data: IProductsResponse = res;
  return data;
};

export const getBestSellingProducts = async (limit: number = 8): Promise<IProductsResponse> => {
  const res = await sendGet("/products/best-selling", { params: { limit } });
  const data: IProductsResponse = res;
  return data;
};

export const getLowStockProducts = async (threshold: number = 10, limit: number = 20): Promise<IProductsResponse> => {
  const res = await sendGet("/products/low-stock", { params: { threshold, limit } });
  const data: IProductsResponse = res;
  return data;
}; 