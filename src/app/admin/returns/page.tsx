'use client';

import { useState } from 'react';
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
  mdiImageOutline,
  mdiCheck,
  mdiCancel,
} from '@mdi/js';
import { mockReturns } from '@/components/ReturnsPage/mockData';
import { ReturnStatusBadge, RefundStatusBadge, ReturnReasonBadge } from '@/components/ReturnsPage/ReturnStatusBadge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

export default function ReturnsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedReason, setSelectedReason] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [imageViewUrl, setImageViewUrl] = useState<string | null>(null);
  
  // Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Định dạng ngày giờ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  // Lọc đơn hàng trả lại theo tất cả các điều kiện
  const filteredReturns = mockReturns.filter((returnItem) => {
    // Lọc theo tab
    if (selectedTab === 'pending' && returnItem.status !== 'pending') {
      return false;
    } else if (selectedTab === 'approved' && returnItem.status !== 'approved') {
      return false;
    } else if (selectedTab === 'rejected' && returnItem.status !== 'rejected') {
      return false;
    } else if (selectedTab === 'completed' && returnItem.status !== 'completed') {
      return false;
    }

    // Lọc theo trạng thái
    if (selectedStatus !== 'all' && returnItem.status !== selectedStatus) {
      return false;
    }

    // Lọc theo lý do
    if (selectedReason !== 'all' && returnItem.reason !== selectedReason) {
      return false;
    }

    // Tìm kiếm theo từ khóa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        returnItem.code.toLowerCase().includes(query) ||
        returnItem.orderCode.toLowerCase().includes(query) ||
        returnItem.customerName.toLowerCase().includes(query) ||
        returnItem.customerPhone.includes(query) ||
        (returnItem.customerEmail && returnItem.customerEmail.toLowerCase().includes(query)) ||
        returnItem.items.some(item => 
          item.productName.toLowerCase().includes(query) || 
          item.sku.toLowerCase().includes(query)
        )
      );
    }

    return true;
  });

  // Lấy tên phương thức thanh toán/hoàn tiền
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

  // Component cho Dialog xem hình ảnh
  const ImageViewer = ({ imageUrl }: { imageUrl: string }) => {
    return (
      <div className="relative h-[80vh] w-full">
        <Image 
          src={imageUrl} 
          alt="Chi tiết sản phẩm" 
          fill 
          className="object-contain" 
        />
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">Quản lý trả hàng</h1>
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
          <Button>Tạo yêu cầu trả hàng</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="px-4">
                  Tất cả
                </TabsTrigger>
                <TabsTrigger value="pending" className="px-4">
                  Chờ xử lý
                </TabsTrigger>
                <TabsTrigger value="approved" className="px-4">
                  Đã chấp nhận
                </TabsTrigger>
                <TabsTrigger value="completed" className="px-4">
                  Đã hoàn thành
                </TabsTrigger>
                <TabsTrigger value="rejected" className="px-4">
                  Đã từ chối
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                <div className="relative w-full sm:w-80">
                  <Input
                    placeholder="Tìm theo mã, tên KH, SĐT..."
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
                  {(selectedStatus !== 'all' || selectedReason !== 'all') && (
                    <Badge className="ml-2 bg-primary h-5 w-5 p-0 flex items-center justify-center">
                      {(selectedStatus !== 'all' ? 1 : 0) + (selectedReason !== 'all' ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="bg-slate-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Trạng thái đơn trả</label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="approved">Đã chấp nhận</SelectItem>
                      <SelectItem value="rejected">Từ chối</SelectItem>
                      <SelectItem value="completed">Đã hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Lý do trả hàng</label>
                  <Select
                    value={selectedReason}
                    onValueChange={setSelectedReason}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tất cả lý do" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả lý do</SelectItem>
                      <SelectItem value="wrong_size">Sai kích cỡ</SelectItem>
                      <SelectItem value="wrong_item">Sản phẩm không đúng</SelectItem>
                      <SelectItem value="damaged">Sản phẩm bị hỏng</SelectItem>
                      <SelectItem value="defective">Sản phẩm bị lỗi</SelectItem>
                      <SelectItem value="changed_mind">Đổi ý</SelectItem>
                      <SelectItem value="other">Lý do khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStatus('all');
                      setSelectedReason('all');
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
              <ReturnsTable 
                returns={filteredReturns} 
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getPaymentMethodName={getPaymentMethodName}
                onViewImage={setImageViewUrl}
              />
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              <ReturnsTable 
                returns={filteredReturns} 
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getPaymentMethodName={getPaymentMethodName}
                onViewImage={setImageViewUrl}
              />
            </TabsContent>
            <TabsContent value="approved" className="mt-0">
              <ReturnsTable 
                returns={filteredReturns} 
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getPaymentMethodName={getPaymentMethodName}
                onViewImage={setImageViewUrl}
              />
            </TabsContent>
            <TabsContent value="completed" className="mt-0">
              <ReturnsTable 
                returns={filteredReturns} 
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getPaymentMethodName={getPaymentMethodName}
                onViewImage={setImageViewUrl}
              />
            </TabsContent>
            <TabsContent value="rejected" className="mt-0">
              <ReturnsTable 
                returns={filteredReturns} 
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getPaymentMethodName={getPaymentMethodName}
                onViewImage={setImageViewUrl}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog hiển thị hình ảnh */}
      <Dialog open={!!imageViewUrl} onOpenChange={(open) => !open && setImageViewUrl(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Hình ảnh chi tiết</DialogTitle>
          </DialogHeader>
          {imageViewUrl && <ImageViewer imageUrl={imageViewUrl} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ReturnsTableProps {
  returns: typeof mockReturns;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getPaymentMethodName: (method: string) => string;
  onViewImage: (url: string) => void;
}

const ReturnsTable: React.FC<ReturnsTableProps> = ({
  returns,
  formatCurrency,
  formatDate,
  getPaymentMethodName,
  onViewImage,
}) => {
  if (returns.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">Không tìm thấy đơn trả hàng nào phù hợp.</p>
      </div>
    );
  }

  // Component Drawer xem chi tiết
  const ReturnDetail = ({ returnItem }: { returnItem: typeof mockReturns[0] }) => {
    return (
      <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Thông tin đơn trả</h3>
            <div className="bg-white rounded-md shadow p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Mã đơn trả:</span>
                <span className="font-medium">{returnItem.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mã đơn hàng:</span>
                <span className="font-medium">{returnItem.orderCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trạng thái:</span>
                <ReturnStatusBadge status={returnItem.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lý do:</span>
                <ReturnReasonBadge reason={returnItem.reason} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ngày tạo:</span>
                <span>{formatDate(returnItem.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cập nhật lần cuối:</span>
                <span>{formatDate(returnItem.updatedAt)}</span>
              </div>
              {returnItem.staffName && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Nhân viên xử lý:</span>
                  <span>{returnItem.staffName}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Thông tin khách hàng</h3>
            <div className="bg-white rounded-md shadow p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Khách hàng:</span>
                <span className="font-medium">{returnItem.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Số điện thoại:</span>
                <span>{returnItem.customerPhone}</span>
              </div>
              {returnItem.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span>{returnItem.customerEmail}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Sản phẩm trả lại</h3>
          <div className="bg-white rounded-md shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left font-medium text-gray-400">Sản phẩm</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-400">Size</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-400">Màu</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-400">SL</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-400">Đơn giá</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-400">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {returnItem.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="relative h-12 w-12 rounded overflow-hidden mr-3 flex-shrink-0">
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-gray-400 text-xs">SKU: {item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">{item.size}</td>
                    <td className="px-4 py-4 text-center">{item.color}</td>
                    <td className="px-4 py-4 text-center">{item.returnedQuantity}</td>
                    <td className="px-4 py-4 text-right">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-4 text-right font-medium">
                      {formatCurrency(item.price * item.returnedQuantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={5} className="px-4 py-3 text-right font-medium">
                    Tổng tiền hoàn:
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-primary">
                    {formatCurrency(returnItem.refundAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {returnItem.reasonDetail && (
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Chi tiết lý do</h3>
            <div className="bg-white rounded-md shadow p-4">
              <p className="text-gray-700">{returnItem.reasonDetail}</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Thông tin hoàn tiền</h3>
          <div className="bg-white rounded-md shadow p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Trạng thái:</span>
              <RefundStatusBadge status={returnItem.refundStatus} />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Phương thức:</span>
              <span>{getPaymentMethodName(returnItem.refundMethod)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Số tiền:</span>
              <span className="font-medium text-primary">{formatCurrency(returnItem.refundAmount)}</span>
            </div>
          </div>
        </div>

        {returnItem.images && returnItem.images.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Hình ảnh đính kèm</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {returnItem.images.map((image, index) => (
                <div 
                  key={index} 
                  className="relative h-28 rounded overflow-hidden cursor-pointer"
                  onClick={() => onViewImage(image)}
                >
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {returnItem.status === 'pending' && (
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" className="flex items-center text-red-500">
              <Icon path={mdiCancel} size={0.8} className="mr-2" />
              Từ chối
            </Button>
            <Button className="flex items-center">
              <Icon path={mdiCheck} size={0.8} className="mr-2" />
              Chấp nhận
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium text-gray-400">Mã đơn trả</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Mã đơn hàng</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Khách hàng</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Ngày tạo</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Trạng thái</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Lý do</th>
            <th className="px-4 py-3 text-right font-medium text-gray-400">Tiền hoàn</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {returns.map((returnItem) => (
            <tr key={returnItem.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 font-medium">{returnItem.code}</td>
              <td className="px-4 py-4">{returnItem.orderCode}</td>
              <td className="px-4 py-4">
                <div>
                  <div className="font-medium">{returnItem.customerName}</div>
                  <div className="text-gray-400 text-xs">{returnItem.customerPhone}</div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div>{formatDate(returnItem.createdAt)}</div>
              </td>
              <td className="px-4 py-4">
                <ReturnStatusBadge status={returnItem.status} />
              </td>
              <td className="px-4 py-4">
                <ReturnReasonBadge reason={returnItem.reason} />
              </td>
              <td className="px-4 py-4 text-right font-medium">
                {formatCurrency(returnItem.refundAmount)}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-center space-x-2">
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title="Xem chi tiết"
                      >
                        <Icon path={mdiEye} size={0.8} />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="p-0">
                      <DrawerHeader className="border-b px-6 py-4">
                        <DrawerTitle>Chi tiết trả hàng #{returnItem.code}</DrawerTitle>
                      </DrawerHeader>
                      <ReturnDetail returnItem={returnItem} />
                    </DrawerContent>
                  </Drawer>

                  {returnItem.images && returnItem.images.length > 0 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-blue-500"
                      title="Xem ảnh"
                      onClick={() => onViewImage(returnItem.images![0])}
                    >
                      <Icon path={mdiImageOutline} size={0.8} />
                    </Button>
                  )}

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    title="In phiếu"
                  >
                    <Icon path={mdiPrinter} size={0.8} />
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