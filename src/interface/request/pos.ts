export interface IPOSOrderFilter {
  page?: number;
  limit?: number;
  status?: string;
}

export interface IPOSOrderItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface IPOSOrderCreate {
  customer?: string;
  items?: IPOSOrderItem[];
  note?: string;
}

export interface IPOSOrderUpdate {
  customer?: string;
  status?: string;
  note?: string;
}

export interface IPOSOrderItemCreate {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface IPOSOrderItemUpdate {
  variantId?: string;
  quantity?: number;
}

export interface IPOSPayment {
  amount: number;
  method: string;
}

export interface IPOSScanQR {
  qrCode: string;
} 