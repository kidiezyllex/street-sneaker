import { 
  ICartItemAdd,
  ICartItemUpdate
} from "@/interface/request/cart";

import { 
  ICartResponse
} from "@/interface/response/cart";

import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const getCart = async (): Promise<ICartResponse> => {
  const res = await sendGet("/cart");
  const data: ICartResponse = res;
  return data;
};

export const addToCart = async (payload: ICartItemAdd): Promise<ICartResponse> => {
  const res = await sendPost("/cart", payload);
  const data: ICartResponse = res;
  return data;
};

export const updateCartItem = async (itemId: string, payload: ICartItemUpdate): Promise<ICartResponse> => {
  const res = await sendPut(`/cart/${itemId}`, payload);
  const data: ICartResponse = res;
  return data;
};

export const removeFromCart = async (itemId: string): Promise<ICartResponse> => {
  const res = await sendDelete(`/cart/${itemId}`);
  const data: ICartResponse = res;
  return data;
};

export const clearCart = async (): Promise<ICartResponse> => {
  const res = await sendDelete("/cart");
  const data: ICartResponse = res;
  return data;
};