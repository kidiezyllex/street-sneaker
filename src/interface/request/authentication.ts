export interface ISignIn {
  username: string
  password: string
}

export interface IRegister {
  username: string
  password: string
  email: string
  phone: string
  fullName: string
  invitationCode: string
  shopName: string
  shopAddress: string
}

export interface IUpdateBank {
  bankName: string
  accountNumber: string
  accountHolder: string
  branch?: string
}

export interface IUpdateUser {
  fullName?: string
  email?: string
  phone?: string
  address?: string
  avatar?: string
  shopName?: string
  shopAddress?: string
  city?: string
  district?: string
  ward?: string
  logoUrl?: string
  countryId?: string
  stateId?: string
  cityId?: string
  districtId?: string
  postalCodeId?: string
  metaTitle?: string
  metaDescription?: string
  bannerImage?: string
  mobileBannerImage?: string
  fullBannerImage?: string
  halfBannerImage?: string
  bannerImage2?: string
  bankName?: string
  bankAccountNumber?: string
  bankAccountName?: string
  bankBranch?: string
  bankCode?: string
  bankNumber?: string
}

export interface IChangePassword {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ISpreadPackageHistoryParams {
  order?: 'ASC' | 'DESC'
  page?: number
  take?: number
  search?: string
}

export interface IPackageHistoryParams {
  order?: 'ASC' | 'DESC'
  page?: number
  take?: number
  search?: string
}

