import { IBaseResponse } from './authentication';
import { IAddress } from '../request/account'; //                                                                                                                     Reuse IAddress from request if appropriate

export interface IAccount {
  _id: string;
  code: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'ADMIN' | 'CUSTOMER';
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
  gender?: 'Nam' | 'Nữ' | 'Khác';
  birthday?: string | Date;
  citizenId?: string;
  avatar?: string;
  addresses: IAddress[];
  isMainAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAccountResponse extends IBaseResponse<IAccount> {}

export interface IPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IAccountsResponse extends IBaseResponse<IAccount[]> {}

export interface IProfileResponse extends IBaseResponse<Omit<IAccount, 'password' | 'addresses' | 'isMainAdmin'>> {}

export interface IAddressListResponse extends IBaseResponse<IAddress[]> {}

export interface IActionResponse extends IBaseResponse<null> {}

export interface IMessageResponse extends IBaseResponse<string> {} 