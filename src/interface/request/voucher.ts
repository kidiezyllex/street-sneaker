export interface IVoucherFilter {
  page?: number;
  limit?: number;
  sort?: string;
  name?: string;
  code?: string;
  type?: string;
  typeValue?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface IVoucherCreate {
  name: string;
  value: number;
  maximumValue?: number;
  type: string;
  typeValue: string;
  minimumAmount?: number;
  quantity: number;
  startDate: Date | string;
  endDate: Date | string;
}

export interface IVoucherUpdate {
  name?: string;
  value?: number;
  maximumValue?: number;
  type?: string;
  typeValue?: string;
  minimumAmount?: number;
  quantity?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  status?: string;
}

export interface IAddCustomerToVoucher {
  accountId: string;
}

export interface ICheckVoucher {
  code: string;
  totalAmount: number;
} 