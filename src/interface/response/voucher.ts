import { IBaseResponse } from './authentication';

export interface IVoucherCustomer {
  _id: string;
  account: string;
  used?: boolean;
  usedAt?: Date;
}

export interface IVoucher {
  _id: string;
  name: string;
  value: number;
  maximumValue: number | null;
  type: string;
  typeValue: string;
  minimumAmount: number;
  quantity: number;
  startDate: Date | string;
  endDate: Date | string;
  status: string;
  customers: IVoucherCustomer[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IVoucherResponse extends IBaseResponse<IVoucher> {}

export interface IVouchersResponse extends IBaseResponse<{
  vouchers: IVoucher[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {}

export interface ICheckVoucherResponse extends IBaseResponse<{
  voucher: IVoucher;
  discountAmount: number;
}> {} 