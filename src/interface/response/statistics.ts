export interface IStatisticsItem {
  _id: string;
  date: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  totalOrders: number;
  totalRevenue: number;
  totalProfit: number;
}

export interface IProductSold {
  product: {
    _id: string;
    name: string;
    code?: string;
    imageUrl?: string;
  };
  quantity: number;
  revenue: number;
}

export interface IVoucherUsed {
  voucher: {
    _id: string;
    code: string;
    discount: number;
  };
  usageCount: number;
  totalDiscount: number;
}

export interface ICustomerCount {
  new: number;
  total: number;
}

export interface IStatisticsDetail extends IStatisticsItem {
  productsSold: IProductSold[];
  vouchersUsed: IVoucherUsed[];
  customerCount: ICustomerCount;
  createdAt: string;
  updatedAt: string;
}

export interface IRevenueSeries {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface IPreviousPeriod {
  total: number;
  change: number;
  percentChange: number;
}

export interface IRevenueReport {
  total: number;
  series: IRevenueSeries[];
  previousPeriod: IPreviousPeriod;
}

export interface ITopProduct {
  product: {
    _id: string;
    name: string;
    brand: {
      _id: string;
      name: string;
    };
    category: {
      _id: string;
      name: string;
    };
  };
  totalQuantity: number;
  totalRevenue: number;
}

export interface IStatisticsResponse {
  success: boolean;
  message: string;
  data: {
    statistics: IStatisticsItem[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface IStatisticsDetailResponse {
  success: boolean;
  data: IStatisticsDetail;
}

export interface IRevenueReportResponse {
  success: boolean;
  message: string;
  data: IRevenueSeries[];
}

export interface ITopProductsResponse {
  success: boolean;
  message: string;
  data: ITopProduct[];
}

export interface IGenerateDailyResponse {
  success: boolean;
  data: IStatisticsDetail;
} 