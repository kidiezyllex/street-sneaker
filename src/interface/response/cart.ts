import { IBaseResponse } from './authentication';

export interface ICartProductDetail {
  _id: string;
  price: number;
  code: string;
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
  images: {
    _id: string;
    url: string;
    publicId: string;
  }[];
}

export interface ICartItem {
  _id: string;
  productDetail: ICartProductDetail;
  quantity: number;
}

export interface ICart {
  _id: string;
  account: string;
  items: ICartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ICartResponse extends IBaseResponse<ICart> {} 