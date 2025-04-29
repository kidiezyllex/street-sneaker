import { IShippingAddress, IOrderItem } from "../request/order";

export interface IOrderProduct {
  _id: string;
  name: string;
  code: string;
  imageUrl: string;
  price?: number;
}

export interface IOrderCustomer {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  addresses?: any[];
}

export interface IOrderStaff {
  _id: string;
  fullName: string;
}

export interface IPopulatedOrderItem extends Omit<IOrderItem, 'product'> {
  product: IOrderProduct;
}

export interface IOrder {
  _id: string;
  code: string;
  customer: IOrderCustomer;
  staff?: IOrderStaff;
  items: IPopulatedOrderItem[];
  voucher?: any;
  subTotal: number;
  discount: number;
  total: number;
  shippingAddress?: IShippingAddress;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'COD' | 'MIXED';
  paymentStatus: 'PENDING' | 'PARTIAL_PAID' | 'PAID';
  orderStatus: 'CHO_XAC_NHAN' | 'CHO_GIAO_HANG' | 'DANG_VAN_CHUYEN' | 'DA_GIAO_HANG' | 'HOAN_THANH' | 'DA_HUY';
  createdAt: string;
  updatedAt: string;
}

export interface IOrderResponse {
  success: boolean;
  message: string;
  data: IOrder;
}

export interface IOrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: IOrder[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface IActionResponse {
  success: boolean;
  message: string;
  data?: any;
} 