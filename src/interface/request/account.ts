export interface IAccountFilter {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IAccountCreate {
  fullName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  role?: 'ADMIN' | 'CUSTOMER';
  gender?: 'Nam' | 'Nữ' | 'Khác';
  birthday?: string | Date;
  citizenId?: string;
}

export interface IAccountUpdate {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: 'Nam' | 'Nữ' | 'Khác';
  birthday?: string | Date;
  citizenId?: string;
  avatar?: string;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IAccountStatusUpdate {
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IAddress {
  _id?: string;
  fullName: string;
  phone: string;
  address: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  type: "NhaRieng" | "VanPhong";
  isDefault: boolean;
}

export interface IAddressCreate extends Omit<IAddress, '_id'> {}

export interface IAddressUpdate extends Partial<Omit<IAddress, '_id'>> {}

export interface IProfileUpdate {
  fullName?: string;
  phoneNumber?: string;
  gender?: 'Nam' | 'Nữ' | 'Khác';
  birthday?: string | Date;
  avatar?: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}

export interface IAccountRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  avatar?: string;
  isMainAdmin?: boolean;
}

export interface IAccountsRequest {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
} 