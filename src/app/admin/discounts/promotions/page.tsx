'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import { mdiMagnify, mdiPlus, mdiPencilCircle, mdiDeleteCircle, mdiFilterOutline, mdiLoading, mdiCalendarRange, mdiPercent } from '@mdi/js';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePromotions, useDeletePromotion } from '@/hooks/promotion';
import { IPromotionFilter } from '@/interface/request/promotion';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IPromotionFilter>({
    page: 1,
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);
  const { data, isLoading, isError } = usePromotions(filters);
  const deletePromotion = useDeletePromotion();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
      } else {
        const { search, ...rest } = filters;
        setFilters({ ...rest, page: 1 });
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleFilterChange = (key: keyof IPromotionFilter, value: string | number | undefined) => {
    if (value === '') {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters({ ...newFilters, page: 1 });
    } else {
      setFilters({ ...filters, [key]: value, page: 1 });
    }
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      await deletePromotion.mutateAsync(id, {
        onSuccess: () => {
          toast.success('Đã xóa chương trình khuyến mãi thành công');
          queryClient.invalidateQueries({ queryKey: ['promotions'] });
          setIsDeleteDialogOpen(false);
        },
      });
    } catch (error) {
      toast.error('Xóa chương trình khuyến mãi thất bại');
    }
  };

  const handleChangePage = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HOAT_DONG':
        return 'bg-green-100 text-green-800';
      case 'KHONG_HOAT_DONG':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'HOAT_DONG':
        return 'Hoạt động';
      case 'KHONG_HOAT_DONG':
        return 'Không hoạt động';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-start'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/discounts">Quản lý khuyến mãi</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Khuyến mãi theo sản phẩm</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link href="/admin/discounts/promotions/create">
          <Button className="flex items-center gap-2">
            <Icon path={mdiPlus} size={0.9} />
            Thêm chương trình khuyến mãi mới
          </Button>
        </Link>
      </div>

      <Card className="mb-4">
        <CardContent className="py-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <div className="relative flex-1 max-w-md">
              <Icon
                path={mdiMagnify}
                size={0.9}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên khuyến mãi..."
                className="pl-10 pr-4 py-2 w-full border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon path={mdiFilterOutline} size={0.9} className="mr-2" />
              {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Trạng thái
                    </label>
                    <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="HOAT_DONG">Hoạt động</SelectItem>
                        <SelectItem value="KHONG_HOAT_DONG">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Từ ngày
                    </label>
                    <Input
                      type="date"
                      value={filters.startDate || ''}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Đến ngày
                    </label>
                    <Input
                      type="date"
                      value={filters.endDate || ''}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã khuyến mãi</TableHead>
                    <TableHead>Tên chương trình</TableHead>
                    <TableHead>Phần trăm giảm</TableHead>
                    <TableHead>Thời gian áp dụng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.promotions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Không có dữ liệu khuyến mãi
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data.promotions.map((promotion) => (
                      <TableRow key={promotion._id}>
                        <TableCell className="font-medium">{promotion.code}</TableCell>
                        <TableCell>
                          <div className="truncate max-w-[250px]" title={promotion.name}>
                            {promotion.name}
                          </div>
                          {promotion.description && (
                            <div className="text-xs text-gray-500 truncate max-w-[250px]">
                              {promotion.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Icon path={mdiPercent} size={0.7} className="text-gray-600 mr-1" />
                            {promotion.discountPercent}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Icon path={mdiCalendarRange} size={0.7} className="text-gray-600 mr-1" />
                            <div className="text-sm">
                              {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(promotion.status)} variant="outline">
                            {getStatusText(promotion.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/discounts/promotions/edit/${promotion._id}`}>
                              <Button variant="ghost" size="icon" className="text-blue-600">
                                <Icon path={mdiPencilCircle} size={0.9} />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600"
                              onClick={() => {
                                setPromotionToDelete(promotion._id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Icon path={mdiDeleteCircle} size={0.9} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {data?.data.pagination && data.data.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.data.pagination.currentPage <= 1}
                  onClick={() => handleChangePage(data.data.pagination.currentPage - 1)}
                >
                  Trước
                </Button>
                {Array.from({ length: data.data.pagination.totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === data.data.pagination.currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleChangePage(page)}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    data.data.pagination.currentPage >= data.data.pagination.totalPages
                  }
                  onClick={() => handleChangePage(data.data.pagination.currentPage + 1)}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa chương trình khuyến mãi</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p>Bạn có chắc chắn muốn xóa chương trình khuyến mãi này?</p>
            <p className="text-sm text-gray-500 mt-2">
              Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan đến khuyến mãi này.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => promotionToDelete && handleDeletePromotion(promotionToDelete)}
              disabled={deletePromotion.isPending}
              className="flex items-center gap-2"
            >
              {deletePromotion.isPending && (
                <Icon path={mdiLoading} size={0.9} spin />
              )}
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 