export interface IOrderFilter {
  customer?: string;
  orderStatus?: 'CHO_XAC_NHAN' | 'CHO_GIAO_HANG' | 'DANG_VAN_CHUYEN' | 'DA_GIAO_HANG' | 'HOAN_THANH' | 'DA_HUY';
  paymentStatus?: 'PENDING' | 'PARTIAL_PAID' | 'PAID';
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IOrderItem {
  product: string;
  variant?: {
    colorId?: string;
    sizeId?: string;
  };
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  name?: string;
  phoneNumber?: string;
  provinceId?: string;
  districtId?: string;
  wardId?: string;
  specificAddress?: string;
}

export interface IOrderCreate {
  customer: string;
  items: IOrderItem[];
  voucher?: string;
  subTotal: number;
  discount?: number;
  total: number;
  shippingAddress?: IShippingAddress;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'COD' | 'MIXED';
}

export interface IOrderUpdate {
  shippingAddress?: IShippingAddress;
  orderStatus?: 'CHO_XAC_NHAN' | 'CHO_GIAO_HANG' | 'DANG_VAN_CHUYEN' | 'DA_GIAO_HANG' | 'HOAN_THANH' | 'DA_HUY';
  paymentStatus?: 'PENDING' | 'PARTIAL_PAID' | 'PAID';
}

export interface IOrderStatusUpdate {
  status: 'CHO_XAC_NHAN' | 'CHO_GIAO_HANG' | 'DANG_VAN_CHUYEN' | 'DA_GIAO_HANG' | 'HOAN_THANH' | 'DA_HUY';
} 