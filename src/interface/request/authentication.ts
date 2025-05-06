export interface ISignIn {
  email: string
  password: string
}

export interface IRegister {
  fullName: string
  email: string
  password: string
  phoneNumber: string
  role?: 'CUSTOMER' | 'STAFF' | 'ADMIN'
  gender?: 'Nam' | 'Nữ' | 'Khác'
  birthday?: Date
  citizenId?: string
}
