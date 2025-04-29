//                                                                                                                     =================== Khuyến mãi chung ===================
export interface IPromotionFilter {
  page?: number;
  limit?: number;
  sort?: string;
  name?: string;
  code?: string;
  type?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface IPromotionCreate {
  name: string;
  type: 'PHAN_TRAM' | 'TIEN_MAT';
  value: number;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface IPromotionUpdate {
  name?: string;
  type?: 'PHAN_TRAM' | 'TIEN_MAT';
  value?: number;
  startDate?: string;
  endDate?: string;
  status?: 'DANG_HOAT_DONG' | 'NGUNG_HOAT_DONG';
  description?: string;
}

export interface IVoucherFilter {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  query?: string;
  type?: string;
  minDiscount?: number;
  maxDiscount?: number;
}

export interface IVoucherCreate {
  code: string;
  name?: string;
  description?: string;
  discountType: 'PHAN_TRAM' | 'TIEN_MAT';
  discountValue: number;
  minOrderValue?: number;
  maxDiscountValue?: number;
  quantity?: number;
  usageLimit?: number;
  startDate: string;
  endDate: string;
}

export interface IVoucherUpdate {
  code?: string;
  name?: string;
  description?: string;
  discountType?: 'PHAN_TRAM' | 'TIEN_MAT';
  discountValue?: number;
  minOrderValue?: number;
  maxDiscountValue?: number;
  quantity?: number;
  usageLimit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface ICustomerVoucher {
  accountId: string;
}

export interface IProductPromotionFilter {
  page?: number;
  limit?: number;
  status?: string;
  query?: string;
  minDiscount?: number;
  maxDiscount?: number;
}

export interface IProductPromotionCreate {
  productId: string;
  name?: string;
  description?: string;
  discountType: 'PHAN_TRAM' | 'TIEN_MAT';
  discountValue: number;
  startDate: string;
  endDate: string;
}

export interface IProductPromotionUpdate {
  name?: string;
  description?: string;
  discountType?: 'PHAN_TRAM' | 'TIEN_MAT';
  discountValue?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface IPromotionRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  maxDiscountValue?: number;
  maxUsage?: number;
  isActive: boolean;
}

export interface IPromotionsRequest {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
}

export interface IVoucherRequest {
  code: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  maxDiscountValue?: number;
  maxUsage?: number;
  isActive: boolean;
}

export interface IVouchersRequest {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
}

export interface IProductPromotionRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  productIds: string[];
  isActive: boolean;
}

export interface IProductPromotionsRequest {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
} 