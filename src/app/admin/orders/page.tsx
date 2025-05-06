'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icon } from '@mdi/react';
import {
  mdiMagnify,
  mdiFilterOutline,
  mdiEye,
  mdiPrinter,
  mdiDelete,
  mdiClose,
  mdiFileExport,
} from '@mdi/js';
import { mockOrders } from '@/components/OrdersPage/mockData';
import { OrderStatusBadge, OrderPaymentStatusBadge } from '@/components/OrdersPage/OrderStatusBadge';
import { OrderDetail } from '@/components/OrdersPage/OrderDetail';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from '@radix-ui/react-icons';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrderType, setSelectedOrderType] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filteredOrders, setFilteredOrders] = useState<typeof mockOrders>([]);
  const [nowDate, setNowDate] = useState<Date | null>(null);

  //                                                                                                                     Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  //                                                                                                                     Định dạng ngày giờ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  useEffect(() => {
    setNowDate(new Date());
  }, []);

  useEffect(() => {
    if (!nowDate) return;
    const filtered = mockOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      if (selectedTab === 'today' && !isToday(orderDate)) {
        return false;
      } else if (selectedTab === 'week' && !isThisWeek(orderDate)) {
        return false;
      } else if (selectedTab === 'month' && !isThisMonth(orderDate)) {
        return false;
      }

      if (dateRange?.from && dateRange?.to) {
        const startOfDay = new Date(dateRange.from);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(dateRange.to);
        endOfDay.setHours(23, 59, 59, 999);
        
        if (orderDate < startOfDay || orderDate > endOfDay) {
          return false;
        }
      }

      if (selectedStatus !== 'all' && order.status !== selectedStatus) {
        return false;
      }

      if (selectedOrderType !== 'all' && order.type !== selectedOrderType) {
        return false;
      }

      //                                                                                                                     Lọc theo trạng thái thanh toán
      if (selectedPaymentStatus !== 'all' && order.paymentStatus !== selectedPaymentStatus) {
        return false;
      }

      //                                                                                                                     Tìm kiếm theo từ khóa
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.code.toLowerCase().includes(query) ||
          order.customer.fullName.toLowerCase().includes(query) ||
          order.customer.phone.includes(query) ||
          (order.customer.email && order.customer.email.toLowerCase().includes(query))
        );
      }

      return true;
    });

    setFilteredOrders(filtered);
  }, [nowDate, selectedTab, dateRange, selectedStatus, selectedOrderType, selectedPaymentStatus, searchQuery]);

  //                                                                                                                     Kiểm tra ngày hiện tại
  function isToday(date: Date): boolean {
    if (!nowDate) return false;
    
    return (
      date.getDate() === nowDate.getDate() &&
      date.getMonth() === nowDate.getMonth() &&
      date.getFullYear() === nowDate.getFullYear()
    );
  }

  //                                                                                                                     Kiểm tra tuần hiện tại
  function isThisWeek(date: Date): boolean {
    if (!nowDate) return false;
    
    const weekStart = new Date(nowDate);
    weekStart.setDate(nowDate.getDate() - nowDate.getDay()); // Đầu tuần (Chủ nhật)
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Cuối tuần (Thứ 7)
    weekEnd.setHours(23, 59, 59, 999);
    
    return date >= weekStart && date <= weekEnd;
  }

  //                                                                                                                     Kiểm tra tháng hiện tại
  function isThisMonth(date: Date): boolean {
    if (!nowDate) return false;
    
    return (
      date.getMonth() === nowDate.getMonth() &&
      date.getFullYear() === nowDate.getFullYear()
    );
  }

  //                                                                                                                     Lấy tên loại đơn hàng
  const getOrderTypeName = (type: string) => {
    switch (type) {
      case 'store':
        return 'Mua tại cửa hàng';
      case 'online':
        return 'Đặt hàng online';
      default:
        return 'Không xác định';
    }
  };

  //                                                                                                                     Lấy tên phương thức thanh toán
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Tiền mặt';
      case 'banking':
        return 'Chuyển khoản ngân hàng';
      case 'card':
        return 'Thẻ tín dụng/ghi nợ';
      case 'momo':
        return 'Ví MoMo';
      case 'zalopay':
        return 'ZaloPay';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="mb-0 md:mb-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">Quản lý đơn hàng</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Icon path={mdiFileExport} size={0.8} className="mr-2" />
                Xuất dữ liệu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Xuất Excel</DropdownMenuItem>
              <DropdownMenuItem>Xuất PDF</DropdownMenuItem>
              <DropdownMenuItem>In danh sách</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>Tạo đơn hàng mới</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="px-4">
                  Tất cả
                </TabsTrigger>
                <TabsTrigger value="today" className="px-4">
                  Hôm nay
                </TabsTrigger>
                <TabsTrigger value="week" className="px-4">
                  Tuần này
                </TabsTrigger>
                <TabsTrigger value="month" className="px-4">
                  Tháng này
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                <div className="relative w-full sm:w-80">
                  <Input
                    placeholder="Tìm theo mã đơn, tên KH, SĐT..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Icon path={mdiMagnify} size={0.9} />
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center"
                >
                  <Icon path={mdiFilterOutline} size={0.8} className="mr-2" />
                  Bộ lọc
                  {(selectedStatus !== 'all' || selectedOrderType !== 'all' || selectedPaymentStatus !== 'all' || dateRange?.from) && (
                    <Badge className="ml-2 bg-primary h-5 w-5 p-0 flex items-center justify-center">
                      {[
                        selectedStatus !== 'all' ? 1 : 0,
                        selectedOrderType !== 'all' ? 1 : 0,
                        selectedPaymentStatus !== 'all' ? 1 : 0,
                        dateRange?.from ? 1 : 0,
                      ].reduce((a, b) => a + b, 0)}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="bg-slate-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Trạng thái đơn hàng</label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="pending">Chờ xác nhận</SelectItem>
                      <SelectItem value="processing">Đang xử lý</SelectItem>
                      <SelectItem value="shipping">Đang giao hàng</SelectItem>
                      <SelectItem value="delivered">Đã giao hàng</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                      <SelectItem value="returned">Đã trả hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Loại đơn hàng</label>
                  <Select
                    value={selectedOrderType}
                    onValueChange={setSelectedOrderType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tất cả loại đơn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại đơn</SelectItem>
                      <SelectItem value="store">Mua tại cửa hàng</SelectItem>
                      <SelectItem value="online">Đặt hàng online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Trạng thái thanh toán</label>
                  <Select
                    value={selectedPaymentStatus}
                    onValueChange={setSelectedPaymentStatus}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="pending">Chờ thanh toán</SelectItem>
                      <SelectItem value="paid">Đã thanh toán</SelectItem>
                      <SelectItem value="failed">Thanh toán thất bại</SelectItem>
                      <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Khoảng thời gian</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                              {format(dateRange.to, "dd/MM/yyyy")}
                            </>
                          ) : (
                            format(dateRange.from, "dd/MM/yyyy")
                          )
                        ) : (
                          <span>Chọn khoảng thời gian</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                      <div className="flex items-center justify-between p-3 border-t">
                        <Button
                          variant="ghost"
                          onClick={() => setDateRange(undefined)}
                          size="sm"
                        >
                          Đặt lại
                        </Button>
                        <Button size="sm" onClick={() => {}}>
                          Áp dụng
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="md:col-span-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStatus('all');
                      setSelectedOrderType('all');
                      setSelectedPaymentStatus('all');
                      setDateRange(undefined);
                    }}
                    className="flex items-center text-gray-400"
                  >
                    <Icon path={mdiClose} size={0.7} className="mr-1" />
                    Đặt lại bộ lọc
                  </Button>
                </div>
              </div>
            )}

            <TabsContent value="all" className="mt-0">
              <OrdersTable 
                orders={filteredOrders} 
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getOrderTypeName={getOrderTypeName}
                getPaymentMethodName={getPaymentMethodName}
                onViewDetail={setSelectedOrder}
              />
            </TabsContent>
            <TabsContent value="today" className="mt-0">
              <OrdersTable 
                orders={filteredOrders}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getOrderTypeName={getOrderTypeName}
                getPaymentMethodName={getPaymentMethodName}
                onViewDetail={setSelectedOrder}
              />
            </TabsContent>
            <TabsContent value="week" className="mt-0">
              <OrdersTable 
                orders={filteredOrders}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getOrderTypeName={getOrderTypeName}
                getPaymentMethodName={getPaymentMethodName}
                onViewDetail={setSelectedOrder}
              />
            </TabsContent>
            <TabsContent value="month" className="mt-0">
              <OrdersTable 
                orders={filteredOrders}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getOrderTypeName={getOrderTypeName}
                getPaymentMethodName={getPaymentMethodName}
                onViewDetail={setSelectedOrder}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

interface OrdersTableProps {
  orders: typeof mockOrders;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getOrderTypeName: (type: string) => string;
  getPaymentMethodName: (method: string) => string;
  onViewDetail: (order: typeof mockOrders[0]) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  formatCurrency,
  formatDate,
  getOrderTypeName,
  getPaymentMethodName,
  onViewDetail,
}) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">Không tìm thấy đơn hàng nào phù hợp.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium text-gray-400">Mã đơn</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Khách hàng</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Ngày tạo</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Loại đơn</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Trạng thái</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Thanh toán</th>
            <th className="px-4 py-3 text-right font-medium text-gray-400">Tổng tiền</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 font-medium">{order.code}</td>
              <td className="px-4 py-4">
                <div>
                  <div className="font-medium">{order.customer.fullName}</div>
                  <div className="text-gray-400 text-xs">{order.customer.phone}</div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div>{formatDate(order.createdAt)}</div>
              </td>
              <td className="px-4 py-4">{getOrderTypeName(order.type)}</td>
              <td className="px-4 py-4">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-4">
                <div className="mb-1">
                  <OrderPaymentStatusBadge status={order.paymentStatus} />
                </div>
                <div className="text-xs text-gray-400">{getPaymentMethodName(order.paymentMethod)}</div>
              </td>
              <td className="px-4 py-4 text-right font-medium">
                {formatCurrency(order.finalAmount)}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onViewDetail(order)}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 bg-gray-100"
                    title="Xem chi tiết"
                  >
                    <Icon path={mdiEye} size={0.8} className='text-gray-400' />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 bg-gray-100"
                    title="In hóa đơn"
                  >
                    <Icon path={mdiPrinter} size={0.8} className='text-gray-400' />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 bg-gray-100 text-red-500"
                    title="Xóa đơn hàng"
                  >
                    <Icon path={mdiDelete} size={0.8} className='text-gray-400' />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 