import { IBaseResponse } from './authentication';

// Sản phẩm
export interface IProductVariant {
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
  status: string;
  images: {
    _id: string;
    url: string;
    publicId: string;
  }[];
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  status: string;
  variants: IProductVariant[];
  createdAt: string;
  updatedAt: string;
}

// Trang chủ
export interface IHomeResponse extends IBaseResponse<{
  newProducts: IProduct[];
  popularProducts: IProduct[];
}> {}

// Danh sách sản phẩm
export interface IProductsResponse extends IBaseResponse<{
  products: IProduct[];
  totalPages: number;
  currentPage: number;
}> {}

// Chi tiết sản phẩm
export interface IProductDetailResponse extends IBaseResponse<IProduct> {}

// Phương thức thanh toán
export interface IPaymentMethod {
  id: string;
  name: string;
}

export interface IPaymentMethodsResponse extends IBaseResponse<IPaymentMethod[]> {}

// Đơn hàng
export interface IOrderItem {
  _id: string;
  product: string | IProduct;
  variant: string | IProductVariant;
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  _id: string;
  fullName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault: boolean;
}

export interface IOrder {
  _id: string;
  account: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrdersResponse extends IBaseResponse<{
  orders: IOrder[];
  totalPages: number;
  currentPage: number;
}> {}

export interface IOrderDetailResponse extends IBaseResponse<IOrder> {}

// Hồ sơ khách hàng
export interface IAddress {
  _id: string;
  fullName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault: boolean;
}

export interface IProfile {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  gender?: string;
  dateOfBirth?: string;
  addresses: IAddress[];
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProfileResponse extends IBaseResponse<IProfile> {}

export interface IAddressesResponse extends IBaseResponse<IAddress[]> {} 