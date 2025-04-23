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
  password?: string; // Password might be optional if set differently
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
  _id?: string; // ID có thể có hoặc không khi tạo
  name: string;
  phoneNumber: string;
  provinceId: string; // Assume IDs are strings, adjust if they are numbers
  districtId: string;
  wardId: string;
  specificAddress: string;
  type?: 'NhaRieng' | 'VanPhong'; // Example types
  isDefault?: boolean;
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