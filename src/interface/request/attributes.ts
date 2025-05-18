// Brand interfaces
export interface IBrandFilter {
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IBrandCreate {
  name: string;
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IBrandUpdate {
  name?: string;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

// Category interfaces
export interface ICategoryFilter {
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface ICategoryCreate {
  name: string;
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface ICategoryUpdate {
  name?: string;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

// Material interfaces
export interface IMaterialFilter {
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IMaterialCreate {
  name: string;
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IMaterialUpdate {
  name?: string;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

// Color interfaces
export interface IColorFilter {
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IColorCreate {
  name: string;
  code: string;
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface IColorUpdate {
  name?: string;
  code?: string;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

// Size interfaces
export interface ISizeFilter {
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface ISizeCreate {
  value: number;
  status: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
}

export interface ISizeUpdate {
  value?: number;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
} 