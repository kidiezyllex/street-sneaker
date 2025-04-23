export interface ISignIn {
  email: string
  password: string
}

export interface IRegister {
  fullName: string
  email: string
  password: string
  phoneNumber: string
  role?: string
}
