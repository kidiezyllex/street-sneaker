export interface IVoucher {
  _id: string;
  code: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  quantity: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  minOrderValue: number;
  maxDiscount?: number;
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
  createdAt: string;
  updatedAt: string;
}

export interface IVoucherResponse {
  success: boolean;
  message: string;
  data: IVoucher;
}

export interface IVouchersResponse {
  success: boolean;
  message: string;
  data: {
    vouchers: IVoucher[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface IVoucherValidationResponse {
  success: boolean;
  message: string;
  data: {
    voucher: IVoucher;
    discountValue: number;
  };
}

export interface INotificationResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface IActionResponse {
  success: boolean;
  message: string;
  data?: any;
} 