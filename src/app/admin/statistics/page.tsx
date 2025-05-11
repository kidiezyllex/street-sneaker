'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import { mdiCashMultiple, mdiPackageVariantClosed, mdiAccountGroup, mdiTrendingUp, 
         mdiCalendarRange, mdiChartBar, mdiSync, mdiFilterOutline, mdiLoading } from '@mdi/js';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showStatisticsFilters, setShowStatisticsFilters] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateDate, setGenerateDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState("overview");
  
  const queryClient = useQueryClient();
  const statistics = useStatistics(statisticsFilters);
  const revenueReport = useRevenueReport(revenueFilters);
  const topProducts = useTopProducts(topProductsFilters);
  const generateDailyStatistics = useGenerateDailyStatistics();

  const handleStatisticsFilterChange = (key: keyof IStatisticsFilter, value: any) => {
    if (value === '') {
      const newFilters = { ...statisticsFilters };
      delete newFilters[key];
      setStatisticsFilters({ ...newFilters, page: 1 });
    } else {
      setStatisticsFilters({ ...statisticsFilters, [key]: value, page: 1 });
    }
  };

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
      ? <span className="text-green-600">+{value.toFixed(2)}%</span>
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
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-base text-gray-500">{title}</p>
              <h3 className="text-2xl font-bold mt-2">{value}</h3>
              <div className="flex items-center mt-2">
                <Icon
                  path={change >= 0 ? mdiTrendingUp : mdiTrendingUp}
                  size={0.6}
                  className={change >= 0 ? 'text-green-600' : 'text-red-600'}
                />
                <span className={`text-sm ml-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Thống kê</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          onClick={() => setIsGenerateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Icon path={mdiSync} size={0.9} />
          Tạo thống kê thủ công
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
        </TabsList>

        {/* Tổng quan */}
        <TabsContent value="overview" className="space-y-6">
          {revenueReport.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="p-6">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-5 w-40" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : revenueReport.isError ? (
            <Card className="p-6">
              <p className="text-red-600">Lỗi khi tải dữ liệu thống kê</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Tổng doanh thu"
                value={formatCurrency(revenueReport.data?.data.total || 0)}
                icon={mdiCashMultiple}
                iconColor="text-green-600"
                bgColor="bg-green-100"
                change={revenueReport.data?.data.previousPeriod.percentChange || 0}
              />
              <StatCard
                title="Số đơn hàng"
                value={statistics.data?.data[0]?.totalOrders.toString() || "0"}
                icon={mdiPackageVariantClosed}
                iconColor="text-blue-600"
                bgColor="bg-blue-100"
                change={5.3}
              />
              <StatCard
                title="Lợi nhuận"
                value={formatCurrency(statistics.data?.data[0]?.totalProfit || 0)}
                icon={mdiTrendingUp}
                iconColor="text-purple-600"
                bgColor="bg-purple-100"
                change={7.8}
              />
              <StatCard
                title="Khách hàng mới"
                value="56"
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
              <CardContent className="p-6">
                {revenueReport.isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : revenueReport.isError ? (
                  <p className="text-red-600">Lỗi khi tải dữ liệu biểu đồ doanh thu</p>
                ) : (
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={revenueReport.data?.data.series.map(item => ({
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
              <CardContent className="p-6">
                {topProducts.isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : topProducts.isError ? (
                  <p className="text-red-600">Lỗi khi tải dữ liệu sản phẩm bán chạy</p>
                ) : (
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topProducts.data?.data.slice(0, 5).map((item, index) => ({
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
                          {topProducts.data?.data.slice(0, 5).map((entry, index) => (
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
        <TabsContent value="revenue" className="space-y-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Báo cáo doanh thu</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

              {revenueReport.isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : revenueReport.isError ? (
                <p className="text-red-600">Lỗi khi tải dữ liệu báo cáo doanh thu</p>
              ) : (
                <>
                  <div className="p-4 bg-slate-50 rounded-lg mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-500">Tổng doanh thu</h3>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                          {formatCurrency(revenueReport.data?.data.total || 0)}
                        </p>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-500">So với kỳ trước</h3>
                        <p className="text-2xl font-bold mt-2">
                          {formatCurrency(revenueReport.data?.data.previousPeriod.total || 0)}
                        </p>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-500">Biến động</h3>
                        <p className="text-2xl font-bold mt-2">
                          {formatPercentChange(revenueReport.data?.data.previousPeriod.percentChange || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={revenueReport.data?.data.series.map(item => ({
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
                          {revenueReport.data?.data.series.map((item, index) => (
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
        <TabsContent value="products" className="space-y-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

              {topProducts.isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : topProducts.isError ? (
                <p className="text-red-600">Lỗi khi tải dữ liệu sản phẩm bán chạy</p>
              ) : (
                <>
                  <div className="w-full h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={topProducts.data?.data.slice(0, 10).map(item => ({
                          name: item.product.name,
                          quantity: item.totalQuantity,
                          revenue: item.totalRevenue
                        }))}
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip formatter={(value: number, name: string) => [
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
                        {topProducts.data?.data.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.product.name}</TableCell>
                            <TableCell>{item.product.category.name}</TableCell>
                            <TableCell>{item.product.brand.name}</TableCell>
                            <TableCell className="text-right">{item.totalQuantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.totalRevenue)}</TableCell>
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
            <p className="text-sm text-gray-500">
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
                  <Icon path={mdiLoading} size={0.9} className="mr-2 animate-spin" />
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