export interface IPromotionProduct {
  _id: string;
  name: string;
  code: string;
  price: number;
  images?: string[];
}

export interface IPromotion {
  _id: string;
  code: string;
  name: string;
  description?: string;
  discountPercent: number;
  products: IPromotionProduct[] | string[];
  startDate: string;
  endDate: string;
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
  createdAt: string;
  updatedAt: string;
}

export interface IPromotionResponse {
  success: boolean;
  message: string;
  data: IPromotion;
}

export interface IPromotionsResponse {
  success: boolean;
  message: string;
  data: {
    promotions: IPromotion[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface IProductPromotionsResponse {
  success: boolean;
  message: string;
  data: Pick<IPromotion, '_id' | 'name' | 'discountPercent' | 'startDate' | 'endDate'>[];
}

export interface IActionResponse {
  success: boolean;
  message: string;
  data?: any;
} 