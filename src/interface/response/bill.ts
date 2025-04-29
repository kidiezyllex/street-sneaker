import { IBaseResponse } from './authentication';

export interface IBillProductDetail {
  _id: string;
  brand: {
    _id: string;
    name: string;
  };
  sole: {
    _id: string;
    name: string;
  };
  material: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
  };
  size: {
    _id: string;
    size: string;
  };
  color: {
    _id: string;
    name: string;
    code: string;
  };
  price: number;
  amount: number;
}

export interface IBillProduct {
  _id: string;
  name: string;
  description: string;
  status: string;
  variants: IBillProductDetail[];
}

export interface IBillItem {
  _id: string;
  productDetail: string | IBillProductDetail;
  quantity: number;
  price: number;
  status: string;
  note?: string;
}

export interface IBillCustomer {
  _id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
}

export interface IBillVoucher {
  _id: string;
  code: string;
  name: string;
  value: number;
  typeValue: string;
}

export interface IBillHistoryItem {
  _id: string;
  statusBill: string;
  note?: string;
  account: string | {
    _id: string;
    fullName: string;
    email: string;
  };
  recepti?: string | {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
}

export interface IBillTransaction {
  _id: string;
  type: string;
  totalMoney: number;
  paymentMethod: string;
  note?: string;
  transactionCode?: string;
  status: string;
  account: string | {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IBill {
  _id: string;
  orderNumber: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  totalMoney: number;
  moneyReduced: number;
  moneyAfter: number;
  type: string;
  note?: string;
  status: string;
  desiredReceiptDate?: string;
  receivingMethod: number;
  confirmationDate?: string;
  shipDate?: string;
  receiveDate?: string;
  completeDate?: string;
  customer?: string | IBillCustomer;
  voucher?: string | IBillVoucher;
  billDetails: IBillItem[];
  billHistory: IBillHistoryItem[];
  transactions: IBillTransaction[];
  createdAt: string;
  updatedAt: string;
}

export interface IBillResponse extends IBaseResponse<IBill> {}

export interface IBillsResponse extends IBaseResponse<{
  bills: IBill[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {} 