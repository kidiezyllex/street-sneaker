export interface IProductFilter {
  name?: string;
  brand?: string;
  category?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
  page?: number;
  limit?: number;
}

export interface IProductVariant {
  colorId: string;
  sizeId: string;
  price: number;
  stock?: number;
  images?: string[];
}

export interface IProductCreate {
  name: string;
  brand: string;
  category: string;
  material: string;
  description: string;
  weight: number;
  variants: IProductVariant[];
}

export interface IProductUpdate {
  name?: string;
  brand?: string;
  category?: string;
  material?: string;
  description?: string;
  weight?: number;
  variants?: IProductVariant[];
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IProductStatusUpdate {
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IVariantStockUpdate {
  variantId: string;
  stock: number;
}

export interface IProductStockUpdate {
  variantUpdates: IVariantStockUpdate[];
}

export interface IProductImageUpdate {
  variantId: string;
  images: string[];
}

export interface IProductSearchParams {
  keyword: string;
  page?: number;
  limit?: number;
} 