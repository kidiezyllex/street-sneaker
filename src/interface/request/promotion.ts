export interface IPromotionFilter {
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface IPromotionCreate {
  name: string;
  description?: string;
  discountPercent: number;
  products?: string[];
  startDate: string | Date;
  endDate: string | Date;
}

export interface IPromotionUpdate {
  name?: string;
  description?: string;
  discountPercent?: number;
  products?: string[];
  startDate?: string | Date;
  endDate?: string | Date;
  status?: 'HOAT_DONG' | 'KHONG_HOAT_DONG';
} 