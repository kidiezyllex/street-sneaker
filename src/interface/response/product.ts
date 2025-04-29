import { IBaseResponse } from './authentication';

export interface IProductImage {
  _id: string;
  url: string;
  defaultImage: boolean;
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IProductPromotion {
  _id: string;
  promotionId: string;
  pricePromotion: number;
}

export interface IProductVariant {
  _id: string;
  code: string;
  price: number;
  weight: number;
  amount: number;
  quantityReturn: number;
  description: string;
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
  brand: IBrand;
  sole: ISole;
  material: IMaterial;
  category: ICategory;
  size: ISize;
  color: IColor;
  images: IProductImage[];
  promotions: IProductPromotion[];
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
  createdAt: string;
  updatedAt: string;
  variants: IProductVariant[];
}

export interface IAttribute {
  _id: string;
  name: string;
  description?: string;
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
  createdAt: string;
  updatedAt: string;
}

export interface IBrand extends IAttribute {}
export interface ICategory extends IAttribute {}
export interface IMaterial extends IAttribute {}
export interface ISole extends IAttribute {}

export interface ISize extends IAttribute {
  size: number;
}

export interface IColor extends IAttribute {
  code: string;
}

export interface IProductResponse extends IBaseResponse<IProduct> {}
export interface IProductsResponse extends IBaseResponse<{
  products: IProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {}

export interface IBrandsResponse extends IBaseResponse<IBrand[]> {}
export interface ICategoriesResponse extends IBaseResponse<ICategory[]> {}
export interface IColorsResponse extends IBaseResponse<IColor[]> {}
export interface IMaterialsResponse extends IBaseResponse<IMaterial[]> {}
export interface ISizesResponse extends IBaseResponse<ISize[]> {}
export interface ISolesResponse extends IBaseResponse<ISole[]> {} 