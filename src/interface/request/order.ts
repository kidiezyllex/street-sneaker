export interface IOrderFilter {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
}

export interface IOrderStatusUpdate {
  status: string;
  note?: string;
}

export interface IShippingInfoUpdate {
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  phone?: string;
  shippingMethod?: string;
  trackingNumber?: string;
}

export interface IOrderItem {
  product: string;
  variant: string;
  quantity: number;
}

export interface IOrderItemsUpdate {
  items: IOrderItem[];
} 