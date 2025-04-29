import { IBaseResponse } from './authentication';
import { IProductVariant, IProduct } from './client';

export interface IOrderProduct {
  _id: string;
  product: string | IProduct;
  variant: string | IProductVariant;
  quantity: number;
  price: number;
}

export interface ICustomer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface IShippingInfo {
  address: string;
  city: string;
  district: string;
  ward: string;
  phone: string;
  shippingMethod?: string;
  trackingNumber?: string;
}

export interface IPayment {
  _id: string;
  amount: number;
  method: string;
  status: string;
  transactionId?: string;
  createdAt: string;
}

export interface IStatusHistory {
  _id: string;
  status: string;
  note?: string;
  updatedBy: string | {
    _id: string;
    name: string;
    email: string;
  };
  updatedAt: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: string | ICustomer;
  items: IOrderProduct[];
  shippingInfo: IShippingInfo;
  subtotal: number;
  discount?: number;
  totalAmount: number;
  status: string;
  type: string;
  statusHistory: IStatusHistory[];
  payments: IPayment[];
  createdAt: string;
  updatedAt: string;
}

export interface IOrderResponse extends IBaseResponse<IOrder> {}

export interface IOrdersResponse extends IBaseResponse<{
  orders: IOrder[];
  totalPages: number;
  currentPage: number;
}> {} 