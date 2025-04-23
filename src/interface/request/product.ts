export interface IProductFilter {
  page?: number;
  limit?: number;
  sort?: string;
  name?: string;
  brand?: string;
  category?: string;
  color?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}

export interface IProductVariant {
  price: number;
  weight: number;
  amount: number;
  description: string;
  brand: string;
  sole: string;
  material: string;
  category: string;
  size: string;
  color: string;
  images?: string[];
}

export interface IProductImage {
  url: string;
  defaultImage?: boolean;
}

export interface IProductPromotion {
  promotionId: string;
  pricePromotion: number;
}

export interface IAttributeCreate {
  name: string;
}

export interface IColorCreate extends IAttributeCreate {
  code: string;
} 