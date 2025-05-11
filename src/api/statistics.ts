import {
  IStatisticsFilter,
  IRevenueReportFilter,
  ITopProductsFilter,
  IGenerateDailyStatistics
} from "@/interface/request/statistics";
import {
  IStatisticsResponse,
  IStatisticsDetailResponse,
  IRevenueReportResponse,
  ITopProductsResponse,
  IGenerateDailyResponse
} from "@/interface/response/statistics";
import { sendGet, sendPost } from "./axios";

export const getStatistics = async (params: IStatisticsFilter = {}): Promise<IStatisticsResponse> => {
  const res = await sendGet("/statistics", params);
  return res as IStatisticsResponse;
};

export const getStatisticsById = async (statisticsId: string): Promise<IStatisticsDetailResponse> => {
  const res = await sendGet(`/statistics/${statisticsId}`);
  return res as IStatisticsDetailResponse;
};

export const getRevenueReport = async (params: IRevenueReportFilter): Promise<IRevenueReportResponse> => {
  const res = await sendGet("/statistics/revenue", params);
  return res as IRevenueReportResponse;
};

export const getTopProducts = async (params: ITopProductsFilter): Promise<ITopProductsResponse> => {
  const res = await sendGet("/statistics/top-products", params);
  return res as ITopProductsResponse;
};

export const generateDailyStatistics = async (payload: IGenerateDailyStatistics): Promise<IGenerateDailyResponse> => {
  const res = await sendPost("/statistics/generate-daily", payload);
  return res as IGenerateDailyResponse;
}; 