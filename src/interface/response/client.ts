import { IBaseResponse } from './authentication';

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

//                                                                                                                     Trang chủ
export interface IHomeResponse {
  newProducts: IProductResponse[];
  popularProducts: IProductResponse[];
  featuredProducts: IProductResponse[];
}

//                                                                                                                     Danh sách sản phẩm
export interface IProductsResponse {
  products: IProductResponse[];
  totalPages: number;
  currentPage: number;
}

//                                                                                                                     Chi tiết sản phẩm
export interface IProductDetailResponse extends IProductResponse {}

//                                                                                                                     Phương thức thanh toán
export interface IPaymentMethod {
  id: string;
  name: string;
}

export interface IPaymentMethodsResponse extends IBaseResponse<IPaymentMethod[]> {}

//                                                                                                                     Đơn hàng
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

export interface IOrdersResponse {
  orders: IOrderResponse[];
  totalPages: number;
  currentPage: number;
}

export interface IOrderDetailResponse extends IOrderResponse {
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    ward: string;
  };
  paymentMethod: {
    id: string;
    name: string;
  };
}

//                                                                                                                     Hồ sơ khách hàng
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

export interface IProfileResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatar: string;
}

export interface IAddressesResponse extends IBaseResponse<IAddress[]> {}

export interface IProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  brand: string;
  category: string;
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
}

export interface IOrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

export interface IPaymentMethodResponse {
  id: string;
  name: string;
  description: string;
  icon: string;
} 