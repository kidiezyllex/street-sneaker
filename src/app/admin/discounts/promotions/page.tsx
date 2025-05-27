'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import { mdiMagnify, mdiPlus, mdiPencilCircle, mdiDeleteCircle, mdiFilterOutline, mdiLoading, mdiEmailFast, mdiTagCheckOutline, mdiFilterRemoveOutline, mdiPercent } from '@mdi/js';
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

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({ page: 1, limit: 10 });
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      await deletePromotion.mutateAsync(id, {
        onSuccess: () => {
          toast.success('Đã xóa chiến dịch khuyến mãi thành công');
          queryClient.invalidateQueries({ queryKey: ['promotions'] });
          setIsDeleteDialogOpen(false);
        },
      });
    } catch (error) {
      toast.error('Xóa chiến dịch khuyến mãi thất bại');
    }
  };

  const handleChangePage = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Hiển thị theo UTC để khớp với dữ liệu từ API
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const getPromotionStatusBadge = (promotion: any) => {
    // Lấy thời gian hiện tại và convert tất cả về timestamp UTC để so sánh
    const now = new Date();
    const nowUTC = Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );
    
    // Parse thời gian từ API và lấy timestamp UTC
    const startUTC = new Date(promotion.startDate).getTime();
    const endUTC = new Date(promotion.endDate).getTime();
    
    if (promotion.status === 'KHONG_HOAT_DONG') {
      return <Badge variant="destructive">Không hoạt động</Badge>;
    }

    if (promotion.status === 'HOAT_DONG') {
      if (nowUTC < startUTC) {
        return <Badge variant="secondary">Chưa bắt đầu</Badge>;
      }
      
      if (nowUTC > endUTC) {
        return <Badge variant="outline">Đã kết thúc</Badge>;
      }
      
      return <Badge variant="default">Đang hoạt động</Badge>;
    }

    return <Badge variant="secondary">Không xác định</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className='flex justify-between items-start'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/discounts">Quản lý Đợt khuyến mãii</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chiến dịch khuyến mãi</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex space-x-2">
          <Link href="/admin/discounts/promotions/create">
            <Button className="flex items-center gap-2">
              <Icon path={mdiPlus} size={0.7} />
              Thêm chiến dịch khuyến mãi
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="py-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <div className="relative flex-1 max-w-md">
              <Icon
                path={mdiMagnify}
                size={0.7}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maintext"
              />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên chiến dịch..."
                className="pl-10 pr-4 py-2 w-full border rounded-[6px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              {(showFilters || searchQuery || Object.keys(filters).filter(k => k !== 'page' && k !== 'limit').length > 0) && (
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={handleClearFilters}
                >
                  <Icon path={mdiFilterRemoveOutline} size={0.7} className="mr-2" />
                  Clear bộ lọc
                </Button>
              )}
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Icon path={mdiFilterOutline} size={0.7} className="mr-2" />
                {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
              </Button>
            </div>
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
                    <label className="block text-sm text-maintext mb-2 font-semibold">
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
                    <label className="block text-sm text-maintext mb-2 font-semibold">
                      Thời gian bắt đầu
                    </label>
                    <Input
                      type="date"
                      value={filters.startDate || ''}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      className="w-full"
                      placeholder="Từ ngày"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-maintext mb-2 font-semibold">
                      Thời gian kết thúc
                    </label>
                    <Input
                      type="date"
                      value={filters.endDate || ''}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      className="w-full"
                      placeholder="Đến ngày"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="bg-white rounded-[6px] shadow-sm p-4 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-[6px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white rounded-[6px] shadow-sm p-4 text-center">
          <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['promotions'] })}
          >
            Thử lại
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-[6px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Mã</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Tên chiến dịch</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Giảm giá</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Sản phẩm</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Thời gian</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Trạng thái</TableHead>
                  <TableHead className="px-4 py-4 text-center text-sm font-medium text-maintext">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.promotions?.length ? (
                  data.data.promotions.map((promotion) => (
                    <TableRow key={promotion._id}>
                      <TableCell className="px-4 py-4 text-sm">
                        <span className="font-mono font-medium">{promotion.code}</span>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm">
                        <div>
                          <div className="font-medium">{promotion.name}</div>
                          {promotion.description && (
                            <div className="text-xs text-maintext mt-1 line-clamp-2">
                              {promotion.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Icon path={mdiPercent} size={0.7} className="text-primary" />
                          <span className="font-medium text-primary">{promotion.discountPercent}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm">
                        {Array.isArray(promotion.products) ? (
                          <span className="text-maintext">
                            {promotion.products.length === 0 ? 'Tất cả sản phẩm' : `${promotion.products.length} sản phẩm`}
                          </span>
                        ) : (
                          <span className="text-maintext">Tất cả sản phẩm</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm">
                        <div className="text-xs">
                          <div>{formatDate(promotion.startDate)}</div>
                          <div className="text-maintext">đến {formatDate(promotion.endDate)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm">
                        {getPromotionStatusBadge(promotion)}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/admin/discounts/promotions/edit/${promotion._id}`}>
                            <Button
                              variant="outline"
                              size="icon"
                              title="Sửa"
                            >
                              <Icon path={mdiPencilCircle} size={0.7} />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setPromotionToDelete(promotion._id);
                              setIsDeleteDialogOpen(true);
                            }}
                            title="Xóa"
                          >
                            <Icon path={mdiDeleteCircle} size={0.7} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="px-4 py-8 text-center text-maintext">
                      Không tìm thấy chiến dịch khuyến mãi nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {data && data.data && data.data.pagination && (
            <div className="flex justify-center items-center space-x-2 p-4 border-t">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChangePage(1)}
                disabled={data.data.pagination.currentPage === 1}
              >
                <span className="sr-only">Trang đầu</span>
                <span>«</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChangePage(data.data.pagination.currentPage - 1)}
                disabled={data.data.pagination.currentPage === 1}
              >
                <span className="sr-only">Trang trước</span>
                <span>‹</span>
              </Button>
              {[...Array(data.data.pagination.totalPages)].map((_, index) => {
                const page = index + 1;
                // Hiển thị trang hiện tại, 2 trang trước và 2 trang sau
                if (
                  page === 1 ||
                  page === data.data.pagination.totalPages ||
                  (page >= data.data.pagination.currentPage - 2 &&
                    page <= data.data.pagination.currentPage + 2)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={page === data.data.pagination.currentPage ? "default" : "outline"}
                      size="icon"
                      onClick={() => handleChangePage(page)}
                    >
                      {page}
                    </Button>
                  );
                } else if (
                  page === data.data.pagination.currentPage - 3 ||
                  page === data.data.pagination.currentPage + 3
                ) {
                  return <span key={page}>...</span>;
                }
                return null;
              })}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChangePage(data.data.pagination.currentPage + 1)}
                disabled={data.data.pagination.currentPage === data.data.pagination.totalPages}
              >
                <span className="sr-only">Trang sau</span>
                <span>›</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChangePage(data.data.pagination.totalPages)}
                disabled={data.data.pagination.currentPage === data.data.pagination.totalPages}
              >
                <span className="sr-only">Trang cuối</span>
                <span>»</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Xác nhận xóa dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa chiến dịch khuyến mãi</DialogTitle>
          </DialogHeader>
          <p className="py-4">Bạn có chắc chắn muốn xóa chiến dịch khuyến mãi này không? Hành động này không thể hoàn tác.</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => promotionToDelete && handleDeletePromotion(promotionToDelete)}
              disabled={deletePromotion.isPending}
            >
              {deletePromotion.isPending ? (
                <>
                  <Icon path={mdiLoading} size={0.7} className="mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 