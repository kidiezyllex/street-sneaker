export interface IBaseResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: null | any
  timestamp?: string
}

export interface IAccountData {
  _id: string
  code: string
  fullName: string
  email: string
  role: string
}

export interface IAuthData {
  token: string
  account: IAccountData
}

export interface IAuthResponse extends IBaseResponse<IAuthData> {}

export interface IProfileData {
  _id: string
  fullName: string
  email: string
  role: string
  avatar: string
}

export interface IProfileResponse extends IBaseResponse<IProfileData> {}

