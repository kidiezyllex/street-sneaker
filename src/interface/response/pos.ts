import { IBaseResponse } from './authentication';

export interface IPOSOrderProduct {
  _id: string;
  name: string;
  description?: string;
  status: string;
}

export interface IPOSOrderVariant {
  _id: string;
  price: number;
  stock: number;
  brand: string;
  color: string;
  size: string;
  material: string;
}

export interface IPOSOrderItem {
  _id: string;
  product: IPOSOrderProduct;
  variant: IPOSOrderVariant;
  quantity: number;
  price: number;
}

export interface IPOSPayment {
  _id: string;
  orderId: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPOSCustomer {
  _id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
}

export interface IPOSOrder {
  _id: string;
  orderNumber: string;
  customer?: IPOSCustomer;
  items: IPOSOrderItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  status: string;
  note?: string;
  payments: IPOSPayment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface IPOSReceipt {
  orderId: string;
  orderNumber: string;
  date: string;
  customer?: {
    name: string;
    phone?: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  payment: {
    method: string;
    amount: number;
  }[];
  staff: string;
}

export interface IPOSQRProduct {
  _id: string;
  name: string;
  variantId: string;
  price: number;
  stock: number;
  brand: string;
  color: string;
  size: string;
}

export interface IPOSOrderResponse extends IBaseResponse<IPOSOrder> {}

export interface IPOSOrdersResponse extends IBaseResponse<{
  orders: IPOSOrder[];
  totalPages: number;
  currentPage: number;
}> {}

export interface IPOSReceiptResponse extends IBaseResponse<IPOSReceipt> {}

export interface IPOSQRProductResponse extends IBaseResponse<IPOSQRProduct> {} 