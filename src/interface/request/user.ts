export interface IUserRequest {
    username?: string
    password?: string
    rank?: string
    position?: string
    gender?: boolean
    dob?: string
    department?: string
    division?: string
    is_active?: boolean
    fullname?: string
    role?: string
  }
  export interface IPasswordRequest {
    old_password?: string
    new_password?: string
   
  }
