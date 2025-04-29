import { IBaseResponse } from './authentication';

export interface IPromotion {
  _id: string;
  name: string;
  type: 'PHAN_TRAM' | 'TIEN_MAT';
  value: number;
  startDate: string;
  endDate: string;
  status: 'DANG_HOAT_DONG' | 'NGUNG_HOAT_DONG';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPromotionResponse extends IBaseResponse<IPromotion> {}

export interface IPromotionsResponse extends IBaseResponse<IPromotion[]> {}

export interface IActivePromotionsResponse extends IBaseResponse<IPromotion[]> {}

export interface IVoucherCustomer {
  _id: string;
  account: string;
  usedCount: number;
  createdAt: string;
}

export interface IVoucher {
  _id: string;
  code: string;
  name: string;
  description?: string;
  discountType: 'PHAN_TRAM' | 'TIEN_MAT';
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue?: number;
  quantity: number;
  usedCount: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
  status: string;
  customers: IVoucherCustomer[];
  createdAt: string;
  updatedAt: string;
}

export interface IVoucherResponse extends IBaseResponse<IVoucher> {}

export interface IVouchersResponse extends IBaseResponse<IVoucher[]> {}

export interface IProductPromotion {
  _id: string;
  productId: string;
  name: string;
  description?: string;
  discountType: 'PHAN_TRAM' | 'TIEN_MAT';
  discountValue: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProductPromotionResponse extends IBaseResponse<IProductPromotion> {}

export interface IProductPromotionsResponse extends IBaseResponse<IProductPromotion[]> {} 