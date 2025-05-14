// import { IShippingAddress, IOrderItem } from "../request/order"; // Remove this line
import { IVoucher } from "./voucher";

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

// Define IOrderItem locally for IPopulatedOrderItem
export interface IOrderItem {
  _id: string;
  product: string; // This will be replaced by IOrderProduct in IPopulatedOrderItem
  variant?: { // Assuming variant is optional here and might have colorId/sizeId
    colorId?: string;
    sizeId?: string;
  };
  quantity: number;
  price: number;
  // Add other necessary fields if IOrderItem is used elsewhere or has more props
}

export interface IPopulatedOrderItem extends Omit<IOrderItem, 'product'> {
  product: IOrderProduct;
}

// Define IShippingAddress locally for IOrder
export interface IShippingAddress {
  name: string;
  phoneNumber: string;
  provinceId: string; // Or full Province object if populated
  districtId: string; // Or full District object
  wardId: string;     // Or full Ward object
  specificAddress: string;
  // country?: string;
  // zipCode?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
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
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderResponse {
  success: boolean;
  data: {
    _id: string;
    orderNumber: string;
    customer: any;
    items: any[];
    voucher: any;
    subTotal: number;
    discount: number;
    total: number;
    shippingAddress: any;
    paymentMethod: string;
    orderStatus: 'CHO_XAC_NHAN' | 'CHO_GIAO_HANG' | 'DANG_VAN_CHUYEN' | 'DA_GIAO_HANG' | 'HOAN_THANH' | 'DA_HUY';
    paymentStatus: 'PENDING' | 'PARTIAL_PAID' | 'PAID';
    createdAt: string;
    updatedAt: string;
  };
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

export interface IPOSOrderCreateResponse {
  success: boolean;
  message: string;
  data: IOrder;
} 