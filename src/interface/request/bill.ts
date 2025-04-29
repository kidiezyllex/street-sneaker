export interface IBillFilter {
  page?: number;
  limit?: number;
  sort?: string;
  code?: string;
  fullName?: string;
  phoneNumber?: string;
  status?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
}

export interface IBillItemCreate {
  productDetailId: string;
  quantity: number;
  price: number;
}

export interface IBillCreate {
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  totalMoney: number;
  moneyReduced?: number;
  moneyAfter: number;
  type: string;
  note?: string;
  desiredReceiptDate?: Date | string;
  receivingMethod?: number;
  customerId?: string;
  voucherId?: string;
  billDetails: IBillItemCreate[];
  transactions?: IBillTransaction[];
}

export interface IBillUpdate {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  note?: string;
  desiredReceiptDate?: Date | string;
  receivingMethod?: number;
}

export interface IBillStatusUpdate {
  status: string;
  note?: string;
}

export interface IBillItemUpdate {
  quantity?: number;
  price?: number;
  note?: string;
}

export interface IBillTransaction {
  type: string;
  totalMoney: number;
  paymentMethod: string;
  note?: string;
  transactionCode?: string;
}

export interface IBillReturnItem {
  detailId: string;
  quantity: number;
  reason: string;
}

export interface IBillReturn {
  items: IBillReturnItem[];
  note?: string;
} 