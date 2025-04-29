export interface IClientFilter {
  page?: number;
  limit?: number;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string;
  sizes?: string;
}

export interface ICartItemPayload {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface ICheckoutPayload {
  addressId: string;
  paymentMethod: string;
}

export interface IAddressCreate {
  fullName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault?: boolean;
}

export interface IAddressUpdate extends Partial<IAddressCreate> {}

export interface IProfileUpdate {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  avatar?: string;
  gender?: string;
  dateOfBirth?: string;
} 