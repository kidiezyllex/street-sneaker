export interface IProductFilter {
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
  name?: string;
  brand?: string;
  category?: string;
  color?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IProductVariant {
  code?: string;
  price: number;
  weight?: number;
  amount: number;
  quantityReturn?: number;
  description?: string;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
  brand: {
    _id?: string;
    name: string;
  };
  sole: {
    _id?: string;
    name: string;
  };
  material: {
    _id?: string;
    name: string;
  };
  category: {
    _id?: string;
    name: string;
  };
  size: {
    _id?: string;
    size: number;
  };
  color: {
    _id?: string;
    code: string;
    name: string;
  };
  images?: IProductImage[];
  promotions?: IProductPromotion[];
}

export interface IProductImage {
  url: string;
  defaultImage?: boolean;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IProductPromotion {
  promotionId: string;
  pricePromotion: number;
}

export interface IAttributeCreate {
  name: string;
  description?: string;
}

export interface IColorCreate extends IAttributeCreate {
  code: string;
}

export interface ISizeCreate extends IAttributeCreate {
  size: number;
} 