import { IAddress } from "../request/account"

export interface IBaseResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface IAccountData {
  _id: string
  code: string
  fullName: string
  email: string
  role: string
}

export interface IAuthData {
  _id: string
  fullName: string
  email: string
  role: string
  token: string
}

export interface IAuthResponse extends IBaseResponse<IAuthData> {}

export interface IProfileData {
  _id: string
  fullName: string
  email: string
  phoneNumber: string
  role: string
  avatar: string
}

export interface IProfileResponse extends IBaseResponse<IProfileData> {}

