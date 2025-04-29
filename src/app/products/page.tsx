"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Icon } from "@mdi/react";
import Image from "next/image";
import Link from "next/link";
import { 
  mdiCartOutline, 
  mdiHeartOutline, 
  mdiEye, 
  mdiFilterOutline, 
  mdiClose, 
  mdiMagnify
} from "@mdi/js";

import { useSearchProducts } from '@/hooks/product';
import { IProductSearchParams } from '@/interface/request/product';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { checkImageUrl } from '@/lib/utils';

// Hàm format giá
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<IProductSearchParams>({
    keyword: '',
    page: 1,
    limit: 12
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useSearchProducts({
    ...searchParams,
    keyword: searchQuery
  });

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handlePageChange = (page: number) => {
    setSearchParams({
      ...searchParams,
      page
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Sản phẩm</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tất cả sản phẩm</h1>
        <Button 
          variant="outline" 
          className="lg:hidden flex items-center gap-2"
          onClick={toggleFilter}
        >
          <Icon path={mdiFilterOutline} size={0.9} />
          {isFilterOpen ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters - Mobile */}
        {isFilterOpen && (
          <div className="lg:hidden w-full">
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium">Bộ lọc sản phẩm</h2>
                <Button variant="ghost" size="sm" onClick={toggleFilter}>
                  <Icon path={mdiClose} size={0.9} />
                </Button>
              </div>
              <ProductFilters />
            </div>
          </div>
        )}

        {/* Filters - Desktop */}
        <div className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
          <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-20">
            <h2 className="font-medium mb-4">Bộ lọc sản phẩm</h2>
            <ProductFilters />
          </div>
        </div>

        {/* Products */}
        <div className="w-full lg:w-3/4 xl:w-4/5">
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1">
                <Icon 
                  path={mdiMagnify} 
                  size={0.9} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <Input 
                  placeholder="Tìm kiếm sản phẩm..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="default">
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Mặc định</SelectItem>
                  <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                  <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="popularity">Phổ biến nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="overflow-hidden h-full">
                  <div className="aspect-square w-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Đã xảy ra lỗi khi tải dữ liệu</p>
              <Button onClick={() => setSearchParams({ ...searchParams })}>
                Thử lại
              </Button>
            </div>
          ) : data?.data.products && data.data.products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {data.data.pagination && data.data.pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(data.data.pagination.currentPage - 1)}
                      disabled={data.data.pagination.currentPage === 1}
                    >
                      Trước
                    </Button>
                    {[...Array(data.data.pagination.totalPages)].map((_, i) => (
                      <Button
                        key={i}
                        variant={data.data.pagination.currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(i + 1)}
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
                      onClick={() => handlePageChange(data.data.pagination.currentPage + 1)}
                      disabled={data.data.pagination.currentPage === data.data.pagination.totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Không tìm thấy sản phẩm nào</p>
              {searchQuery && (
                <Button onClick={() => setSearchQuery('')}>
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ProductFilters = () => {
  const brandOptions = [
    { id: 'nike', name: 'Nike' },
    { id: 'adidas', name: 'Adidas' },
    { id: 'puma', name: 'Puma' },
    { id: 'vans', name: 'Vans' },
    { id: 'converse', name: 'Converse' }
  ];
  
  const categoryOptions = [
    { id: 'running', name: 'Giày chạy bộ' },
    { id: 'basketball', name: 'Giày bóng rổ' },
    { id: 'sneakers', name: 'Giày thể thao' },
    { id: 'casual', name: 'Giày thời trang' }
  ];
  
  const colorOptions = [
    { id: 'black', name: 'Đen', code: '#000000' },
    { id: 'white', name: 'Trắng', code: '#ffffff' },
    { id: 'red', name: 'Đỏ', code: '#ff0000' },
    { id: 'blue', name: 'Xanh dương', code: '#0000ff' },
    { id: 'green', name: 'Xanh lá', code: '#00ff00' }
  ];
  
  const sizeOptions = [
    { id: 'eu35', name: 'EU 35' },
    { id: 'eu36', name: 'EU 36' },
    { id: 'eu37', name: 'EU 37' },
    { id: 'eu38', name: 'EU 38' },
    { id: 'eu39', name: 'EU 39' },
    { id: 'eu40', name: 'EU 40' },
    { id: 'eu41', name: 'EU 41' },
    { id: 'eu42', name: 'EU 42' },
    { id: 'eu43', name: 'EU 43' }
  ];
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  
  const formatPriceLabel = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Giá</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 5000000]}
            max={5000000}
            step={100000}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{formatPriceLabel(priceRange[0])}</span>
            <span>{formatPriceLabel(priceRange[1])}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3">Thương hiệu</h3>
        <div className="space-y-2">
          {brandOptions.map((brand) => (
            <div key={brand.id} className="flex items-center gap-2">
              <Checkbox id={`brand-${brand.id}`} />
              <label htmlFor={`brand-${brand.id}`} className="text-sm">
                {brand.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3">Danh mục</h3>
        <div className="space-y-2">
          {categoryOptions.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox id={`category-${category.id}`} />
              <label htmlFor={`category-${category.id}`} className="text-sm">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3">Màu sắc</h3>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.id}
              className="w-8 h-8 rounded-full border border-gray-300 overflow-hidden relative"
              style={{ backgroundColor: color.code }}
              title={color.name}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3">Kích cỡ</h3>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size.id}
              className="px-2 py-1 border border-gray-300 rounded text-sm hover:border-primary"
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>
      
      <Button className="w-full">Áp dụng</Button>
      <Button variant="outline" className="w-full">Đặt lại</Button>
    </div>
  );
};

const ProductCard = ({ product }: { product: any }) => {
  return (
    <Card className="group overflow-hidden border border-gray-200 hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product._id}`}>
          <div className="aspect-square overflow-hidden relative">
            <Image 
              src={checkImageUrl(product.variants[0]?.images?.[0])}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              fill
            />
          </div>
        </Link>
        
        {/* Quick action buttons */}
        <div className="absolute -right-10 top-14 flex flex-col gap-2 transition-all duration-300 group-hover:right-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8 bg-white hover:bg-primary hover:text-white"
          >
            <Icon path={mdiCartOutline} size={0.8} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8 bg-white hover:bg-primary hover:text-white"
          >
            <Icon path={mdiHeartOutline} size={0.8} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8 bg-white hover:bg-primary hover:text-white"
          >
            <Icon path={mdiEye} size={0.8} />
          </Button>
        </div>
      </div>
      
      {/* Thông tin sản phẩm */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-sm text-gray-500 mb-1">
          {typeof product.brand === 'string' ? product.brand : product.brand.name}
        </div>
        <Link 
          href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product._id}`} 
          className="hover:text-primary transition-colors"
        >
          <h3 className="font-medium text-lg mb-1 line-clamp-2">{product.name}</h3>
        </Link>
        
        <div className="mt-auto pt-2">
          <div className="font-bold text-primary">
            {formatPrice(product.variants[0]?.price || 0)}
          </div>
          
          {/* Color dots to show available colors */}
          {product.variants.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {Array.from<string>(
                new Set(product.variants.map((v: any) => 
                  typeof v.colorId === 'object' ? v.colorId._id : v.colorId
                ))
              ).slice(0, 4).map((colorId, index: number) => {
                const variant = product.variants.find((v: any) => 
                  (typeof v.colorId === 'object' ? v.colorId._id : v.colorId) === colorId
                );
                const color = typeof variant.colorId === 'object' ? variant.colorId : { code: '#000000' };
                
                return (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.code }}
                  />
                );
              })}
              
              {Array.from<string>(
                new Set(product.variants.map((v: any) => 
                  typeof v.colorId === 'object' ? v.colorId._id : v.colorId
                ))
              ).length > 4 && (
                <span className="text-xs text-gray-500">
                  +{Array.from<string>(
                    new Set(product.variants.map((v: any) => 
                      typeof v.colorId === 'object' ? v.colorId._id : v.colorId
                    ))
                  ).length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}; 