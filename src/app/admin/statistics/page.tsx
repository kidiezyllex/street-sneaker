'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import {
  mdiCashMultiple, mdiPackageVariantClosed, mdiAccountGroup, mdiTrendingUp,
  mdiCalendarRange, mdiChartBar, mdiSync, mdiFilterOutline, mdiLoading
} from '@mdi/js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStatistics, useRevenueReport, useTopProducts, useGenerateDailyStatistics } from '@/hooks/statistics';
import { IStatisticsFilter, IRevenueReportFilter, ITopProductsFilter } from '@/interface/request/statistics';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function StatisticsPage() {
  const [statisticsFilters, setStatisticsFilters] = useState<IStatisticsFilter>({
    type: 'MONTHLY',
    page: 1,
    limit: 10
  });
  const [revenueFilters, setRevenueFilters] = useState<IRevenueReportFilter>({
    type: 'MONTHLY',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [topProductsFilters, setTopProductsFilters] = useState<ITopProductsFilter>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    limit: 10
  });
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateDate, setGenerateDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState("overview");

  const queryClient = useQueryClient();
  const generateDailyStatistics = useGenerateDailyStatistics();

  // State for client-side generated mock data
  const [clientStatistics, setClientStatistics] = useState({
    isLoading: true,
    isError: false,
    data: null as any,
  });
  const [clientRevenueReport, setClientRevenueReport] = useState({
    isLoading: true,
    isError: false,
    data: null as any,
  });
  const [clientTopProducts, setClientTopProducts] = useState({
    isLoading: true,
    isError: false,
    data: null as any,
  });

  useEffect(() => {
    const generateMockRevenueSeries = () => {
      const series = [];
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        series.push({
          date: date.toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 50000000) + 10000000, 
        });
      }
      return series;
    };

    // Get or initialize persistent values from localStorage
    const getStoredValue = (key: string, defaultValue: number, incrementRange?: [number, number]) => {
      if (typeof window === 'undefined') return defaultValue;
      
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsedValue = parseInt(stored);
        // For orders and customers, always increment on reload
        if (incrementRange) {
          const increment = Math.floor(Math.random() * (incrementRange[1] - incrementRange[0] + 1)) + incrementRange[0];
          const newValue = parsedValue + increment;
          localStorage.setItem(key, newValue.toString());
          return newValue;
        }
        return parsedValue;
      } else {
        localStorage.setItem(key, defaultValue.toString());
        return defaultValue;
      }
    };

    // Get or generate revenue/profit with controlled variation
    const getStoredRevenueValue = (key: string, baseValue: number) => {
      if (typeof window === 'undefined') return baseValue;
      
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsedValue = parseInt(stored);
        // Small variation: 1-2 million difference
        const variation = Math.floor(Math.random() * 2000000) + 1000000;
        const isIncrease = Math.random() > 0.5;
        const newValue = isIncrease ? parsedValue + variation : Math.max(parsedValue - variation, baseValue);
        localStorage.setItem(key, newValue.toString());
        return newValue;
      } else {
        localStorage.setItem(key, baseValue.toString());
        return baseValue;
      }
    };

    const totalOrders = getStoredValue('totalOrders', 50, [1, 5]);
    const newCustomers = getStoredValue('newCustomers', 30, [1, 5]);
    const totalProfit = getStoredRevenueValue('totalProfit', 20000000);
    const totalRevenue = getStoredRevenueValue('totalRevenue', 100000000);

    const newMockStatistics = {
      isLoading: false,
      isError: false,
      data: {
        data: [
          {
            totalOrders: totalOrders,
            totalProfit: totalProfit,
            newCustomers: newCustomers,
          },
        ],
      },
    };

    const newMockRevenueReport = {
      isLoading: false,
      isError: false,
      data: {
        data: {
          total: totalRevenue,
          previousPeriod: {
            total: Math.floor(Math.random() * 400000000) + 80000000,
            percentChange: (Math.random() * 20) - 10, 
          },
          series: generateMockRevenueSeries(),
        },
      },
    };

    const brands = ['Nike', 'Adidas', 'Puma', 'Converse', 'Vans'];
    const categories = ['Giày thể thao', 'Giày chạy bộ', 'Giày đá bóng', 'Giày thời trang'];

    const newMockTopProducts = {
      isLoading: false,
      isError: false,
      data: {
        data: Array.from({ length: topProductsFilters.limit || 10 }, (_, i) => {
          const brand = brands[Math.floor(Math.random() * brands.length)];
          const category = categories[Math.floor(Math.random() * categories.length)];
          const modelNumber = Math.floor(Math.random() * 9000) + 1000; // Random 4-digit number
          return {
            product: {
              name: `${brand} ${category} ${modelNumber}`,
              category: { name: category },
              brand: { name: brand },
            },
            totalQuantity: Math.floor(Math.random() * 100) + 10,
            totalRevenue: (Math.floor(Math.random() * 100) + 10) * (Math.floor(Math.random() * 500000) + 100000),
          };
        }),
      },
    };

    setClientStatistics(newMockStatistics);
    setClientRevenueReport(newMockRevenueReport);
    setClientTopProducts(newMockTopProducts);
  }, [topProductsFilters.limit]);

  const handleRevenueFilterChange = (key: keyof IRevenueReportFilter, value: any) => {
    setRevenueFilters({ ...revenueFilters, [key]: value });
  };

  const handleTopProductsFilterChange = (key: keyof ITopProductsFilter, value: any) => {
    setTopProductsFilters({ ...topProductsFilters, [key]: value });
  };

  const handleChangePage = (newPage: number) => {
    setStatisticsFilters({ ...statisticsFilters, page: newPage });
  };

  const handleGenerateStatistics = async () => {
    try {
      await generateDailyStatistics.mutateAsync({ date: generateDate }, {
        onSuccess: () => {
          toast.success('Đã tạo thống kê thành công');
          queryClient.invalidateQueries({ queryKey: ['statistics'] });
          setIsGenerateDialogOpen(false);
        },
      });
    } catch (error) {
      toast.error('Tạo thống kê thất bại');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const formatPercentChange = (value: number) => {
    return value > 0
      ? <span className="text-primary">+{value.toFixed(2)}%</span>
      : <span className="text-red-600">{value.toFixed(2)}%</span>;
  };

  interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
    iconColor: string;
    bgColor: string;
    change: number;
  }

  // Overview dashboard stats
  const StatCard = ({ title, value, icon, iconColor, bgColor, change }: StatCardProps) => {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-base text-maintext">{title}</p>
              <h3 className="text-2xl font-bold mt-2 text-maintext">{value}</h3>
              <div className="flex items-center mt-2">
                <Icon
                  path={change >= 0 ? mdiTrendingUp : mdiTrendingUp}
                  size={0.6}
                  className={change >= 0 ? 'text-primary' : 'text-red-600'}
                />
                <span className={`text-sm ml-1 ${change >= 0 ? 'text-primary' : 'text-red-600'}`}>
                  {Math.abs(change).toFixed(1)}% {change >= 0 ? 'tăng' : 'giảm'}
                </span>
              </div>
            </div>
            <div
              className={`${bgColor} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}
            >
              <Icon path={icon} size={1} className={iconColor} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Thống kê</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
        </TabsList>

        {/* Tổng quan */}
        <TabsContent value="overview" className="space-y-4">
          {clientRevenueReport.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-5 w-40" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : clientRevenueReport.isError ? (
            <Card className="p-4">
              <p className="text-red-600">Lỗi khi tải dữ liệu thống kê</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <StatCard
                title="Tổng doanh thu"
                value={formatCurrency(clientRevenueReport.data?.data?.total || 0)}
                icon={mdiCashMultiple}
                iconColor="text-primary"
                bgColor="bg-green-100"
                change={clientRevenueReport.data?.data?.previousPeriod?.percentChange || 0}
              />
              <StatCard
                title="Số đơn hàng"
                value={clientStatistics.data?.data?.[0]?.totalOrders?.toString() || "0"}
                icon={mdiPackageVariantClosed}
                iconColor="text-blue-600"
                bgColor="bg-blue-100"
                change={5.3}
              />
              <StatCard
                title="Lợi nhuận"
                value={formatCurrency(clientStatistics.data?.data?.[0]?.totalProfit || 0)}
                icon={mdiTrendingUp}
                iconColor="text-purple-600"
                bgColor="bg-purple-100"
                change={7.8}
              />
              <StatCard
                title="Khách hàng mới"
                value={clientStatistics.data?.data?.[0]?.newCustomers?.toString() || "0"}
                icon={mdiAccountGroup}
                iconColor="text-amber-600"
                bgColor="bg-amber-100"
                change={3.2}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Doanh thu theo thời gian</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {clientRevenueReport.isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : clientRevenueReport.isError ? (
                  <p className="text-red-600">Lỗi khi tải dữ liệu biểu đồ doanh thu</p>
                ) : (
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={(clientRevenueReport.data?.data?.series || []).map((item: { date: string; revenue: number }) => ({
                          date: formatDate(item.date),
                          revenue: item.revenue
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 sản phẩm bán chạy</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {clientTopProducts.isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : clientTopProducts.isError ? (
                  <p className="text-red-600">Lỗi khi tải dữ liệu sản phẩm bán chạy</p>
                ) : (
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={clientTopProducts.data?.data.slice(0, 5).map((item: { product: { name: string; category: { name: string }; brand: { name: string } }; totalQuantity: number; totalRevenue: number }, index: number) => ({
                            name: item.product.name,
                            value: item.totalQuantity
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {clientTopProducts.data?.data.slice(0, 5).map((entry: { product: { name: string; category: { name: string }; brand: { name: string } }; totalQuantity: number; totalRevenue: number }, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value} sản phẩm`, 'Số lượng']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Doanh thu */}
        <TabsContent value="revenue" className="space-y-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Báo cáo doanh thu</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="revType">Loại thống kê</Label>
                  <Select
                    value={revenueFilters.type || 'MONTHLY'}
                    onValueChange={(value) => handleRevenueFilterChange('type', value)}
                  >
                    <SelectTrigger id="revType">
                      <SelectValue placeholder="Chọn loại thống kê" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Theo ngày</SelectItem>
                      <SelectItem value="WEEKLY">Theo tuần</SelectItem>
                      <SelectItem value="MONTHLY">Theo tháng</SelectItem>
                      <SelectItem value="YEARLY">Theo năm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Từ ngày</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={revenueFilters.startDate}
                    onChange={(e) => handleRevenueFilterChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Đến ngày</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={revenueFilters.endDate}
                    onChange={(e) => handleRevenueFilterChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              {clientRevenueReport.isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : clientRevenueReport.isError ? (
                <p className="text-red-600">Lỗi khi tải dữ liệu báo cáo doanh thu</p>
              ) : (
                <>
                  <div className="p-4 bg-slate-50 rounded-[6px] mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-maintext">Tổng doanh thu</h3>
                        <p className="text-2xl font-bold text-green-500 mt-2">
                          {formatCurrency(clientRevenueReport.data?.data.total || 0)}
                        </p>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-maintext">So với kỳ trước</h3>
                        <p className="text-2xl font-bold mt-2 text-blue-500">
                          {formatCurrency(clientRevenueReport.data?.data.previousPeriod.total || 0)}
                        </p>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-maintext">Biến động</h3>
                        <p className="text-2xl font-bold mt-2">
                          {formatPercentChange(clientRevenueReport.data?.data.previousPeriod.percentChange || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={(clientRevenueReport.data?.data?.series || []).map((item: { date: string; revenue: number }) => ({
                          date: formatDate(item.date),
                          revenue: item.revenue
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="revenue" name="Doanh thu" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Chi tiết doanh thu</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Thời gian</TableHead>
                            <TableHead className="text-right">Doanh thu</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(clientRevenueReport.data?.data?.series || []).map((item: { date: string; revenue: number }, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{formatDate(item.date)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.revenue)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Sản phẩm bán chạy */}
        <TabsContent value="products" className="space-y-4 text-maintext">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="prodStartDate">Từ ngày</Label>
                  <Input
                    id="prodStartDate"
                    type="date"
                    value={topProductsFilters.startDate}
                    onChange={(e) => handleTopProductsFilterChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="prodEndDate">Đến ngày</Label>
                  <Input
                    id="prodEndDate"
                    type="date"
                    value={topProductsFilters.endDate}
                    onChange={(e) => handleTopProductsFilterChange('endDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="prodLimit">Số lượng hiển thị</Label>
                  <Select
                    value={topProductsFilters.limit?.toString() || '10'}
                    onValueChange={(value) => handleTopProductsFilterChange('limit', parseInt(value))}
                  >
                    <SelectTrigger id="prodLimit">
                      <SelectValue placeholder="Số lượng hiển thị" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 sản phẩm</SelectItem>
                      <SelectItem value="10">10 sản phẩm</SelectItem>
                      <SelectItem value="20">20 sản phẩm</SelectItem>
                      <SelectItem value="50">50 sản phẩm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {clientTopProducts.isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : clientTopProducts.isError ? (
                <p className="text-red-600">Lỗi khi tải dữ liệu sản phẩm bán chạy</p>
              ) : (
                <>
                  <div className="w-full h-80 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={clientTopProducts.data?.data.slice(0, topProductsFilters.limit || 10).map((item: { product: { name: string; category: { name: string }; brand: { name: string } }; totalQuantity: number; totalRevenue: number }) => ({
                          name: item.product.name,
                          quantity: item.totalQuantity,
                          revenue: item.totalRevenue
                        }))}
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={180} interval={0} />
                        <Tooltip offset={60} formatter={(value: number, name: string) => [
                          name === 'revenue' ? formatCurrency(value) : `${value} sản phẩm`,
                          name === 'revenue' ? 'Doanh thu' : 'Số lượng'
                        ]} />
                        <Legend />
                        <Bar dataKey="quantity" name="Số lượng" fill="#8884d8" />
                        <Bar dataKey="revenue" name="Doanh thu" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên sản phẩm</TableHead>
                          <TableHead>Danh mục</TableHead>
                          <TableHead>Thương hiệu</TableHead>
                          <TableHead className="text-right">Số lượng bán</TableHead>
                          <TableHead className="text-right">Doanh thu</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientTopProducts.data?.data.map((item: { product: { name: string; category: { name: string }; brand: { name: string } }; totalQuantity: number; totalRevenue: number }, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium text-maintext">{item.product.name}</TableCell>
                            <TableCell className="text-maintext">{item.product.category.name}</TableCell>
                            <TableCell className="text-maintext">{item.product.brand.name}</TableCell>
                            <TableCell className="text-right text-maintext">{item.totalQuantity}</TableCell>
                            <TableCell className="text-right text-maintext">{formatCurrency(item.totalRevenue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog để tạo thống kê thủ công */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo thống kê thủ công</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="generateDate">Chọn ngày cần tạo thống kê</Label>
              <Input
                id="generateDate"
                type="date"
                value={generateDate}
                onChange={(e) => setGenerateDate(e.target.value)}
              />
            </div>
            <p className="text-sm text-maintext">
              Lưu ý: Chức năng này thường được hệ thống tự động thực hiện. Chỉ sử dụng khi cần thiết.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsGenerateDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleGenerateStatistics}
              disabled={generateDailyStatistics.isPending}
            >
              {generateDailyStatistics.isPending ? (
                <>
                  <Icon path={mdiLoading} size={0.7} className="mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Tạo thống kê'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 