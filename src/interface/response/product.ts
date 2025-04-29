import { IProductVariant } from "../request/product";

export interface IBrand {
  _id: string;
  name: string;
}

export interface ICategory {
  _id: string;
  name: string;
}

export interface IMaterial {
  _id: string;
  name: string;
}

export interface IColor {
  _id: string;
  name: string;
  code: string;
}

export interface ISize {
  _id: string;
  name: string;
  code: string;
}

export interface IPopulatedProductVariant {
  _id: string;
  colorId: IColor;
  sizeId: ISize;
  price: number;
  stock: number;
  images: string[];
}

export interface IProduct {
  _id: string;
  code: string;
  name: string;
  brand: string | IBrand;
  category: string | ICategory;
  material: string | IMaterial;
  description: string;
  weight: number;
  variants: IPopulatedProductVariant[];
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
  createdAt: string;
  updatedAt: string;
}

export interface IProductResponse {
  success: boolean;
  message: string;
  data: IProduct;
}

export interface IProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: IProduct[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface IActionResponse {
  success: boolean;
  message: string;
  data?: any;
} 