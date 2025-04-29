'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Icon } from '@mdi/react';
import { mdiMagnify, mdiPlus, mdiPencilOutline, mdiTrashCanOutline, mdiFilterOutline, mdiLoading } from '@mdi/js';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useProducts, useDeleteProduct } from '@/hooks/product';
import { IProductFilter } from '@/interface/request/product';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { checkImageUrl } from '@/lib/utils';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IProductFilter>({
    page: 1,
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);
  const { data, isLoading, isError } = useProducts(filters);
  const deleteProduct = useDeleteProduct();
  const queryClient = useQueryClient();

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        setFilters((prev) => ({ ...prev, name: searchQuery, page: 1 }));
      } else {
        const { name, ...rest } = filters;
        setFilters({ ...rest, page: 1 });
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleFilterChange = (key: keyof IProductFilter, value: string | number | undefined) => {
    if (value === '') {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters({ ...newFilters, page: 1 });
    } else {
      setFilters({ ...filters, [key]: value, page: 1 });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id, {
        onSuccess: () => {
          toast.success('Đã xóa sản phẩm thành công');
          queryClient.invalidateQueries({ queryKey: ['products'] });
        },
      });
    } catch (error) {
      toast.error('Xóa sản phẩm thất bại');
    }
  };

  const handleChangePage = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
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

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Quản lý sản phẩm</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Sản phẩm</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Quản lý sản phẩm</h1>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Icon path={mdiPlus} size={0.9} className="mr-2" />
          Thêm sản phẩm mới
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <div className="relative flex-1 max-w-md">
              <Icon
                path={mdiMagnify}
                size={0.9}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm..."
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thương hiệu
                    </label>
                    <select
                      className="w-full border rounded-md p-2"
                      value={filters.brand || ''}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                    >
                      <option value="">Tất cả thương hiệu</option>
                      {['Nike', 'Adidas', 'Puma', 'Converse', 'Vans'].map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục
                    </label>
                    <select
                      className="w-full border rounded-md p-2"
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">Tất cả danh mục</option>
                      {['Giày thể thao', 'Giày chạy bộ', 'Giày đá bóng', 'Giày thời trang'].map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      className="w-full border rounded-md p-2"
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange('status', e.target.value as 'HOAT_DONG' | 'KHONG_HOAT_DONG' | undefined)}
                    >
                      <option value="">Tất cả trạng thái</option>
                      <option value="HOAT_DONG">Hoạt động</option>
                      <option value="KHONG_HOAT_DONG">Không hoạt động</option>
                    </select>
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
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
          >
            Thử lại
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">Hình ảnh</th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">Sản phẩm</th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">Mã</th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">Thương hiệu</th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">Danh mục</th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">Trạng thái</th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">Ngày cập nhật</th>
                  <th className="px-4 py-4 text-right text-sm font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.data.products.length ? (
                  data.data.products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={checkImageUrl(product.variants[0]?.images?.[0])}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">
                          {product.variants.length} biến thể
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.code}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof product.brand === 'string' ? product.brand : product.brand.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof product.category === 'string' ? product.category : product.category.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.status === 'HOAT_DONG' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status === 'HOAT_DONG' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(product.updatedAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/products/edit/${product._id}`}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Icon path={mdiPencilOutline} size={0.9} />
                          </Link>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteProduct(product._id)}
                            disabled={deleteProduct.isPending}
                          >
                            {deleteProduct.isPending && deleteProduct.variables === product._id ? (
                              <Icon path={mdiLoading} size={0.9} className="animate-spin" />
                            ) : (
                              <Icon path={mdiTrashCanOutline} size={0.9} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {data?.data.pagination && data.data.pagination.totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{(data.data.pagination.currentPage - 1) * data.data.pagination.limit + 1}</span> đến <span className="font-medium">
                    {Math.min(data.data.pagination.currentPage * data.data.pagination.limit, data.data.pagination.totalItems)}
                  </span> của <span className="font-medium">{data.data.pagination.totalItems}</span> sản phẩm
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChangePage(data.data.pagination.currentPage - 1)}
                  disabled={data.data.pagination.currentPage === 1}
                >
                  Trước
                </Button>
                {[...Array(data.data.pagination.totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={data.data.pagination.currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleChangePage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                )).slice(
                  Math.max(0, data.data.pagination.currentPage - 3),
                  Math.min(data.data.pagination.totalPages, data.data.pagination.currentPage + 2)
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChangePage(data.data.pagination.currentPage + 1)}
                  disabled={data.data.pagination.currentPage === data.data.pagination.totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 