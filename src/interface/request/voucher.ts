export interface IVoucherFilter {
  code?: string;
  name?: string;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface IVoucherCreate {
  code: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  quantity: number;
  startDate: string | Date;
  endDate: string | Date;
  minOrderValue?: number;
  maxDiscount?: number;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IVoucherUpdate {
  name?: string;
  quantity?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  minOrderValue?: number;
  maxDiscount?: number;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IVoucherValidate {
  code: string;
  orderValue?: number;
} 