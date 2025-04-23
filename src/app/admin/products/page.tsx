'use client';

import { useState } from 'react';
import { products, brands, shoeTypes, soleTypes, materials, Product } from '@/components/ProductsPage/mockData';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Icon } from '@mdi/react';
import { mdiMagnify, mdiPlus, mdiPencilOutline, mdiTrashCanOutline, mdiFilterOutline } from '@mdi/js';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Lọc sản phẩm theo tìm kiếm và bộ lọc
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesBrand = selectedBrand ? product.brandId === selectedBrand : true;
    const matchesType = selectedType ? product.shoeTypeId === selectedType : true;

    return matchesSearch && matchesBrand && matchesType;
  });

  // Định dạng ngày
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Lấy tên thương hiệu từ ID
  const getBrandName = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : '';
  };

  // Lấy tên loại giày từ ID
  const getShoeTypeName = (typeId: string) => {
    const type = shoeTypes.find((t) => t.id === typeId);
    return type ? type.name : '';
  };

  // Xóa sản phẩm (mô phỏng)
  const handleDeleteProduct = (id: string) => {
    toast.success(`Đã xóa sản phẩm ${id}`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Quản lý sản phẩm</h1>
        <Link
          href="/admin/products/add"
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
                placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
                className="pl-10 pr-4 py-2 w-full border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="flex items-center text-gray-600 hover:text-primary transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon path={mdiFilterOutline} size={0.9} className="mr-2" />
              {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thương hiệu
                  </label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={selectedBrand || ''}
                    onChange={(e) => setSelectedBrand(e.target.value || null)}
                  >
                    <option value="">Tất cả thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại giày
                  </label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={selectedType || ''}
                    onChange={(e) => setSelectedType(e.target.value || null)}
                  >
                    <option value="">Tất cả loại giày</option>
                    {shoeTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Hình ảnh</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Sản phẩm</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">SKU</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Thương hiệu</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Loại</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Giá</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Ngày cập nhật</th>
                <th className="px-4 py-4 text-right text-sm font-medium text-gray-400">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={product.colors[0].images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-400">
                        {product.colors.length} màu, {product.colors.reduce(
                          (sum, color) => sum + color.sizes.length,
                          0
                        )} kích thước
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                      {product.sku}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                      {getBrandName(product.brandId)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                      {getShoeTypeName(product.shoeTypeId)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatCurrency(product.colors[0].sizes[0].price)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatDate(product.updatedAt)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right space-x-2">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Icon path={mdiPencilOutline} size={0.9} />
                      </Link>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Icon path={mdiTrashCanOutline} size={0.9} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 