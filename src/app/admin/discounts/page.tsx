'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icon } from '@mdi/react';
import {
  mdiMagnify,
  mdiPlus,
  mdiPencil,
  mdiDelete,
  mdiCalendarClock,
} from '@mdi/js';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

//                                                                                                                     Types
type DiscountType = 'percentage' | 'fixed';
type DiscountStatus = 'active' | 'scheduled' | 'expired' | 'draft';

interface Discount {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  applyToProducts: 'all' | 'specific';
  productIds?: string[];
  status: DiscountStatus;
  createdAt: string;
  updatedAt: string;
}

//                                                                                                                     Mock data
const mockDiscounts: Discount[] = [
  {
    id: '1',
    code: 'SUMMER2023',
    name: 'Khuyến mãi hè 2023',
    description: 'Giảm giá cho tất cả sản phẩm mùa hè',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 1000000,
    maxDiscountAmount: 500000,
    startDate: '2023-06-01T00:00:00Z',
    endDate: '2023-08-31T23:59:59Z',
    usageLimit: 100,
    usageCount: 45,
    applyToProducts: 'all',
    status: 'expired',
    createdAt: '2023-05-15T10:00:00Z',
    updatedAt: '2023-05-15T10:00:00Z'
  },
  {
    id: '2',
    code: 'NEWCUSTOMER',
    name: 'Khách hàng mới',
    description: 'Giảm giá cho khách hàng lần đầu mua hàng',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 500000,
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z',
    usageLimit: 1000,
    usageCount: 358,
    applyToProducts: 'all',
    status: 'active',
    createdAt: '2023-01-01T08:00:00Z',
    updatedAt: '2023-01-01T08:00:00Z'
  },
  {
    id: '3',
    code: 'NIKE10',
    name: 'Giảm giá Nike',
    description: 'Giảm giá cho tất cả sản phẩm Nike',
    discountType: 'percentage',
    discountValue: 10,
    startDate: '2023-10-01T00:00:00Z',
    endDate: '2023-10-31T23:59:59Z',
    usageCount: 125,
    applyToProducts: 'specific',
    productIds: ['1', '2', '3', '4'],
    status: 'active',
    createdAt: '2023-09-25T14:30:00Z',
    updatedAt: '2023-09-25T14:30:00Z'
  },
  {
    id: '4',
    code: 'BLACKFRIDAY',
    name: 'Black Friday',
    description: 'Giảm giá Black Friday cho tất cả sản phẩm',
    discountType: 'percentage',
    discountValue: 30,
    minOrderValue: 1500000,
    maxDiscountAmount: 1000000,
    startDate: '2023-11-24T00:00:00Z',
    endDate: '2023-11-26T23:59:59Z',
    usageCount: 0,
    applyToProducts: 'all',
    status: 'scheduled',
    createdAt: '2023-10-30T11:00:00Z',
    updatedAt: '2023-10-30T11:00:00Z'
  },
  {
    id: '5',
    code: 'WELCOME500K',
    name: 'Chào mừng - Giảm 500K',
    description: 'Giảm 500.000đ cho đơn hàng từ 3.000.000đ',
    discountType: 'fixed',
    discountValue: 500000,
    minOrderValue: 3000000,
    startDate: '2023-09-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z',
    usageLimit: 50,
    usageCount: 12,
    applyToProducts: 'all',
    status: 'active',
    createdAt: '2023-08-28T09:15:00Z',
    updatedAt: '2023-08-28T09:15:00Z'
  },
  {
    id: '6',
    code: 'ADIDAS15',
    name: 'Adidas Sale 15%',
    description: 'Giảm giá 15% cho sản phẩm Adidas',
    discountType: 'percentage',
    discountValue: 15,
    startDate: '2023-11-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
    usageCount: 27,
    applyToProducts: 'specific',
    productIds: ['5', '6', '7', '8'],
    status: 'active',
    createdAt: '2023-10-20T15:00:00Z',
    updatedAt: '2023-10-20T15:00:00Z'
  },
  {
    id: '7',
    code: 'NEWYEAR2024',
    name: 'Năm mới 2024',
    description: 'Khuyến mại đầu năm 2024',
    discountType: 'percentage',
    discountValue: 24,
    minOrderValue: 1000000,
    maxDiscountAmount: 500000,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
    usageCount: 0,
    applyToProducts: 'all',
    status: 'scheduled',
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2023-12-01T10:00:00Z'
  },
];

export default function DiscountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(null);

  //                                                                                                                     Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  //                                                                                                                     Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: vi });
  };

  //                                                                                                                     Filter discounts based on search query and selected tab
  const filteredDiscounts = mockDiscounts.filter((discount) => {
    //                                                                                                                     Filter by tab
    if (selectedTab !== 'all' && discount.status !== selectedTab) {
      return false;
    }

    //                                                                                                                     Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        discount.code.toLowerCase().includes(query) ||
        discount.name.toLowerCase().includes(query) ||
        (discount.description && discount.description.toLowerCase().includes(query))
      );
    }

    return true;
  });

  //                                                                                                                     Get status badge
  const getStatusBadge = (status: DiscountStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đang hoạt động</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Lên lịch</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Đã hết hạn</Badge>;
      case 'draft':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Bản nháp</Badge>;
    }
  };

  //                                                                                                                     Handle delete discount
  const handleDeleteDiscount = (discount: Discount) => {
    setDiscountToDelete(discount);
    setIsDeleteDialogOpen(true);
  };

  //                                                                                                                     Confirm delete discount
  const confirmDeleteDiscount = () => {
    setIsDeleteDialogOpen(false);
    setDiscountToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <Button className="flex items-center">
          <Icon path={mdiPlus} size={0.8} className="mr-2" />
          Tạo mã giảm giá
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="px-4">
                  Tất cả
                </TabsTrigger>
                <TabsTrigger value="active" className="px-4">
                  Đang hoạt động
                </TabsTrigger>
                <TabsTrigger value="scheduled" className="px-4">
                  Lên lịch
                </TabsTrigger>
                <TabsTrigger value="expired" className="px-4">
                  Đã hết hạn
                </TabsTrigger>
              </TabsList>

              <div className="relative w-full sm:w-80">
                <Input
                  placeholder="Tìm theo mã, tên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Icon path={mdiMagnify} size={0.9} />
                </div>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <DiscountTable 
                discounts={filteredDiscounts}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                onDelete={handleDeleteDiscount}
              />
            </TabsContent>
            <TabsContent value="active" className="mt-0">
              <DiscountTable 
                discounts={filteredDiscounts}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                onDelete={handleDeleteDiscount}
              />
            </TabsContent>
            <TabsContent value="scheduled" className="mt-0">
              <DiscountTable 
                discounts={filteredDiscounts}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                onDelete={handleDeleteDiscount}
              />
            </TabsContent>
            <TabsContent value="expired" className="mt-0">
              <DiscountTable 
                discounts={filteredDiscounts}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                onDelete={handleDeleteDiscount}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa mã giảm giá</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa mã giảm giá <span className="font-medium">{discountToDelete?.code}</span>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDeleteDiscount}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface DiscountTableProps {
  discounts: Discount[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getStatusBadge: (status: DiscountStatus) => React.ReactNode;
  onDelete: (discount: Discount) => void;
}

const DiscountTable: React.FC<DiscountTableProps> = ({
  discounts,
  formatCurrency,
  formatDate,
  getStatusBadge,
  onDelete,
}) => {
  if (discounts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">Không tìm thấy mã giảm giá nào phù hợp.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium text-gray-400">Mã giảm giá</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Tên</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Giá trị</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Áp dụng</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Thời gian</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Sử dụng</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Trạng thái</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {discounts.map((discount) => (
            <tr key={discount.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 font-medium">{discount.code}</td>
              <td className="px-4 py-4">
                <div>
                  <div className="font-medium">{discount.name}</div>
                  {discount.description && (
                    <div className="text-gray-400 text-xs truncate max-w-[200px]">{discount.description}</div>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-center">
                {discount.discountType === 'percentage' ? (
                  <span>{discount.discountValue}%</span>
                ) : (
                  <span>{formatCurrency(discount.discountValue)}</span>
                )}
                {discount.minOrderValue && (
                  <div className="text-xs text-gray-400">
                    Đơn tối thiểu: {formatCurrency(discount.minOrderValue)}
                  </div>
                )}
              </td>
              <td className="px-4 py-4 text-center">
                {discount.applyToProducts === 'all' ? (
                  <span>Tất cả</span>
                ) : (
                  <span>Sản phẩm cụ thể</span>
                )}
              </td>
              <td className="px-4 py-4 text-center">
                <div className="flex items-center justify-center">
                  <Icon path={mdiCalendarClock} size={0.7} className="mr-1 text-gray-400" />
                  <div>
                    <div>{formatDate(discount.startDate)}</div>
                    <div className="text-xs text-gray-400">{formatDate(discount.endDate)}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-center">
                <div>
                  <span>{discount.usageCount}</span>
                  {discount.usageLimit && (
                    <span className="text-gray-400">/{discount.usageLimit}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-center">
                {getStatusBadge(discount.status)}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <span className="sr-only">Mở menu</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                          <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center cursor-pointer">
                        <Icon path={mdiPencil} size={0.7} className="mr-2" />
                        <span>Chỉnh sửa</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="flex items-center text-red-600 cursor-pointer"
                        onClick={() => onDelete(discount)}
                      >
                        <Icon path={mdiDelete} size={0.7} className="mr-2" />
                        <span>Xóa</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 