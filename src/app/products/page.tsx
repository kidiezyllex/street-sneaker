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
  mdiMagnify,
} from "@mdi/js";

import { useProducts, useSearchProducts } from '@/hooks/product';
import { useCreateOrder } from '@/hooks/order';
import { IProductFilter, IProductSearchParams } from '@/interface/request/product';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { checkImageUrl } from '@/lib/utils';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import QrCodeScanner from '@/components/ProductPage/QrCodeScanner';
import VoucherForm from '@/components/ProductPage/VoucherForm';
import CartIcon from '@/components/ui/CartIcon';

// Hàm format giá
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<IProductFilter>({
    page: 1,
    limit: 12,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number; voucherId: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { addToCart } = useCartStore();
  const createOrder = useCreateOrder();

  const searchParams: IProductSearchParams = {
    keyword: searchQuery,
  };

  if (filters.brands) searchParams.brands = filters.brands;
  if (filters.categories) searchParams.categories = filters.categories;
  if (filters.color) searchParams.color = filters.color;
  if (filters.size) searchParams.size = filters.size;
  if (filters.minPrice) searchParams.minPrice = filters.minPrice;
  if (filters.maxPrice) searchParams.maxPrice = filters.maxPrice;
  if (filters.sortBy) searchParams.sortBy = filters.sortBy;
  if (filters.sortOrder) searchParams.sortOrder = filters.sortOrder;
  
  searchParams.page = filters.page;
  searchParams.limit = filters.limit;
  searchParams.status = 'HOAT_DONG';

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchQuery) {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  useEffect(() => {
    const updateSortParams = () => {
      const updatedParams = { ...filters };
      const { sortBy, sortOrder, ...restParams } = updatedParams as any;

      let newParams: IProductFilter = { ...restParams };
      let sortParams: any = {};

      switch (sortOption) {
        case 'price-asc':
          sortParams = { sortBy: 'price', sortOrder: 'asc' };
          break;
        case 'price-desc':
          sortParams = { sortBy: 'price', sortOrder: 'desc' };
          break;
        case 'newest':
          sortParams = { sortBy: 'createdAt', sortOrder: 'desc' };
          break;
        case 'popularity':
          sortParams = { sortBy: 'popularity', sortOrder: 'desc' };
          break;
        default:
          break;
      }

      if (JSON.stringify(sortParams) !== JSON.stringify({ sortBy: filters.sortBy, sortOrder: filters.sortOrder })) {
        setFilters({ ...newParams, ...(sortParams as any) });
      }
    };

    updateSortParams();
  }, [sortOption]);

  // Sử dụng useProducts hoặc useSearchProducts tùy thuộc vào trạng thái tìm kiếm
  const productsQuery = useProducts(filters);
  const searchQuery2 = useSearchProducts(isSearching ? searchParams : { keyword: '' });
  
  // Chọn dữ liệu từ query phù hợp
  const { data, isLoading, isError } = isSearching ? searchQuery2 : productsQuery;

  // Xử lý khi thay đổi bộ lọc
  const handleFilterChange = (updatedFilters: Partial<IProductFilter>) => {
    // Cập nhật bộ lọc và đặt lại trang về 1
    setFilters(prev => ({
      ...prev,
      ...updatedFilters,
      page: 1
    }));
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleAddToCart = (product: any) => {
    if (!product || !product.variants || product.variants.length === 0) {
      toast.error('Không thể thêm sản phẩm này vào giỏ hàng');
      return;
    }

    const variant = product.variants[0];
    const productToAdd = {
      id: product._id,
      name: product.name,
      price: variant.price,
      image: variant.images?.[0] || '',
      quantity: 1,
      slug: product.name.toLowerCase().replace(/\s+/g, '-') + '-' + product._id,
      brand: typeof product.brand === 'string' ? product.brand : product.brand.name,
      colors: [typeof variant.colorId === 'object' ? variant.colorId.name : variant.colorId],
      size: typeof variant.sizeId === 'object' ? variant.sizeId.name : variant.sizeId
    };

    addToCart(productToAdd, 1);
    toast.success('Đã thêm sản phẩm vào giỏ hàng');
  };

  const handleQuickView = (product: any) => {
    // Điều hướng đến trang chi tiết sản phẩm
    window.location.href = `/products/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product._id}`;
  };

  const handleAddToWishlist = (product: any) => {
    toast.success('Đã thêm sản phẩm vào danh sách yêu thích');
  };

  const handleApplyVoucher = (voucherData: { code: string; discount: number; voucherId: string }) => {
    setAppliedVoucher(voucherData);
    toast.success(`Đã áp dụng mã giảm giá: ${voucherData.code}`);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    toast.info('Đã xóa mã giảm giá');
  };

  const handleQrCodeDetected = (qrData: string) => {
    try {
      // Thử phân tích dữ liệu QR
      const productData = JSON.parse(qrData);

      if (productData && productData.productId) {
        // Tìm sản phẩm trong danh sách hiện tại
        const product = data?.data.products.find(p => p._id === productData.productId);

        if (product) {
          handleAddToCart(product);
          toast.success(`Đã quét mã QR và thêm ${product.name} vào giỏ hàng`);
        } else {
          // Sản phẩm không có trong danh sách hiện tại, điều hướng đến trang chi tiết
          window.location.href = `/products/${productData.productId}`;
        }
      } else {
        toast.error('Mã QR không chứa thông tin sản phẩm hợp lệ');
      }
    } catch (error) {
      toast.error('Không thể đọc mã QR. Vui lòng thử lại.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
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
        <div className="flex gap-2">
          <QrCodeScanner onQrCodeDetected={handleQrCodeDetected} />
          <Button
            variant="outline"
            className="lg:hidden flex items-center gap-2"
            onClick={toggleFilter}
          >
            <Icon path={mdiFilterOutline} size={0.9} />
            {isFilterOpen ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters - Mobile */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden w-full"
            >
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-medium">Bộ lọc sản phẩm</h2>
                  <Button variant="ghost" size="sm" onClick={toggleFilter}>
                    <Icon path={mdiClose} size={0.9} />
                  </Button>
                </div>
                <ProductFilters
                  filters={filters}
                  onChange={handleFilterChange}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
          <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-20">
            <h2 className="font-medium mb-4">Bộ lọc sản phẩm</h2>
            <ProductFilters
              filters={filters}
              onChange={handleFilterChange}
            />

            {data && data.data.products && data.data.products.length > 0 && (
              <VoucherForm
                orderValue={data.data.products.reduce((sum, product) => sum + (product.variants[0]?.price || 0), 0)}
                onApplyVoucher={handleApplyVoucher}
                onRemoveVoucher={handleRemoveVoucher}
                appliedVoucher={appliedVoucher}
              />
            )}
          </div>
        </div>

        {/* Products */}
        <div className="w-full lg:w-3/4 xl:w-4/5">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
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
            <Select
              defaultValue="default"
              value={sortOption}
              onValueChange={setSortOption}
            >
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
              <Button onClick={() => setFilters({ ...filters })}>
                Thử lại
              </Button>
            </div>
          ) : data?.data.products && data.data.products.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">
                  Tìm thấy {data.data.pagination?.totalItems || data.data.products.length} sản phẩm
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.data.products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onQuickView={() => handleQuickView(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                  />
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

              <div className="lg:hidden mt-8 bg-white rounded-lg shadow-sm border p-4">
                <VoucherForm
                  orderValue={data.data.products.reduce((sum, product) => sum + (product.variants[0]?.price || 0), 0)}
                  onApplyVoucher={handleApplyVoucher}
                  onRemoveVoucher={handleRemoveVoucher}
                  appliedVoucher={appliedVoucher}
                />
              </div>
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

      <div className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full bg-primary p-2 hover:bg-primary/90 transition-all duration-300">
        <CartIcon className="text-white" />
      </div>
    </div>
  );
}

interface ProductFiltersProps {
  filters: IProductFilter;
  onChange: (filters: Partial<IProductFilter>) => void;
}

const ProductFilters = ({ filters, onChange }: ProductFiltersProps) => {
  // Dữ liệu cố định
  const brands = [
    { _id: 'nike', name: 'Nike' },
    { _id: 'adidas', name: 'Adidas' },
    { _id: 'puma', name: 'Puma' },
    { _id: 'converse', name: 'Converse' },
    { _id: 'vans', name: 'Vans' }
  ];
  
  const categories = [
    { _id: 'giay-the-thao', name: 'Giày thể thao' },
    { _id: 'giay-chay-bo', name: 'Giày chạy bộ' },
    { _id: 'giay-da-bong', name: 'Giày đá bóng' },
    { _id: 'giay-thoi-trang', name: 'Giày thời trang' }
  ];
  
  const colors = [
    { _id: 'black', name: 'Đen', code: '#000' },
    { _id: 'white', name: 'Trắng', code: '#FFF' },
    { _id: 'red', name: 'Đỏ', code: '#FF0000' },
    { _id: 'blue', name: 'Xanh dương', code: '#0000FF' },
    { _id: 'green', name: 'Xanh lá', code: '#00FF00' },
    { _id: 'yellow', name: 'Vàng', code: '#FFFF00' },
    { _id: 'gray', name: 'Xám', code: '#808080' }
  ];
  
  const sizes = [
    { _id: 'eu35', name: 'EU 35' },
    { _id: 'eu36', name: 'EU 36' },
    { _id: 'eu37', name: 'EU 37' },
    { _id: 'eu38', name: 'EU 38' },
    { _id: 'eu39', name: 'EU 39' },
    { _id: 'eu40', name: 'EU 40' },
    { _id: 'eu41', name: 'EU 41' },
    { _id: 'eu42', name: 'EU 42' },
    { _id: 'eu43', name: 'EU 43' },
    { _id: 'eu44', name: 'EU 44' },
    { _id: 'eu45', name: 'EU 45' }
  ];
  
  // Khoảng giá mặc định
  const priceRange = {
    min: 0,
    max: 5000000
  };
  
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([
    filters.minPrice || priceRange.min, 
    filters.maxPrice || priceRange.max
  ]);
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    filters.brands ? (Array.isArray(filters.brands) ? filters.brands : [filters.brands]) : []
  );
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    filters.categories ? (Array.isArray(filters.categories) ? filters.categories : [filters.categories]) : []
  );
  
  useEffect(() => {
    setSelectedPriceRange([
      filters.minPrice || priceRange.min,
      filters.maxPrice || priceRange.max
    ]);
  }, [filters.minPrice, filters.maxPrice]);
  
  useEffect(() => {
    if (filters.brands) {
      setSelectedBrands(Array.isArray(filters.brands) ? filters.brands : [filters.brands]);
    } else {
      setSelectedBrands([]);
    }
  }, [filters.brands]);
  
  useEffect(() => {
    if (filters.categories) {
      setSelectedCategories(Array.isArray(filters.categories) ? filters.categories : [filters.categories]);
    } else {
      setSelectedCategories([]);
    }
  }, [filters.categories]);
  
  const formatPriceLabel = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const handleBrandChange = (brandId: string, checked: boolean) => {
    let newSelectedBrands: string[];
    
    if (checked) {
      newSelectedBrands = [...selectedBrands, brandId];
    } else {
      newSelectedBrands = selectedBrands.filter(id => id !== brandId);
    }
    
    setSelectedBrands(newSelectedBrands);
    onChange({ 
      brands: newSelectedBrands.length > 0 ? newSelectedBrands : undefined 
    });
  };
  
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    let newSelectedCategories: string[];
    
    if (checked) {
      newSelectedCategories = [...selectedCategories, categoryId];
    } else {
      newSelectedCategories = selectedCategories.filter(id => id !== categoryId);
    }
    
    setSelectedCategories(newSelectedCategories);
    onChange({ 
      categories: newSelectedCategories.length > 0 ? newSelectedCategories : undefined 
    });
  };
  
  const handleColorChange = (colorId: string) => {
    onChange({ 
      color: filters.color === colorId ? undefined : colorId 
    });
  };
  
  const handleSizeChange = (sizeId: string) => {
    onChange({ 
      size: filters.size === sizeId ? undefined : sizeId 
    });
  };
  
  const handlePriceChange = (values: number[]) => {
    setSelectedPriceRange(values as [number, number]);
  };
  
  const handleApplyFilters = () => {
    onChange({
      minPrice: selectedPriceRange[0],
      maxPrice: selectedPriceRange[1]
    });
    toast.success('Đã áp dụng bộ lọc');
  };
  
  const handleResetFilters = () => {
    setSelectedPriceRange([priceRange.min, priceRange.max]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    onChange({
      brands: undefined,
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      color: undefined,
      size: undefined
    });
    toast.info('Đã đặt lại bộ lọc');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Giá</h3>
        <div className="px-2">
          <Slider
            defaultValue={[priceRange.min, priceRange.max]}
            min={priceRange.min}
            max={priceRange.max}
            step={100000}
            value={selectedPriceRange}
            onValueChange={(value) => handlePriceChange(value as [number, number])}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{formatPriceLabel(selectedPriceRange[0])}</span>
            <span>{formatPriceLabel(selectedPriceRange[1])}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3">Thương hiệu</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {brands.map((brand) => (
            <div key={brand._id} className="flex items-center gap-2">
              <Checkbox 
                id={`brand-${brand._id}`} 
                checked={selectedBrands.includes(brand._id)}
                onCheckedChange={(checked) => handleBrandChange(brand._id, checked as boolean)}
              />
              <label htmlFor={`brand-${brand._id}`} className="text-sm">
                {brand.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3">Danh mục</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {categories.map((category) => (
            <div key={category._id} className="flex items-center gap-2">
              <Checkbox 
                id={`category-${category._id}`} 
                checked={selectedCategories.includes(category._id)}
                onCheckedChange={(checked) => handleCategoryChange(category._id, checked as boolean)}
              />
              <label htmlFor={`category-${category._id}`} className="text-sm">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3">Màu sắc</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color._id}
              className={`w-8 h-8 rounded-full border overflow-hidden relative transition-all duration-300 ${filters.color === color._id ? 'ring-2 ring-primary ring-offset-2' : 'border-gray-300'}`}
              style={{ backgroundColor: color.code }}
              title={color.name}
              onClick={() => handleColorChange(color._id)}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3">Kích cỡ</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size._id}
              className={`px-2 py-1 border rounded text-sm transition-all duration-300 ${filters.size === size._id ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary'}`}
              onClick={() => handleSizeChange(size._id)}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>
      
      <Button className="w-full" onClick={handleApplyFilters}>Áp dụng</Button>
      <Button variant="outline" className="w-full" onClick={handleResetFilters}>Đặt lại</Button>
    </div>
  );
};

interface ProductCardProps {
  product: any;
  onAddToCart: () => void;
  onQuickView: () => void;
  onAddToWishlist: () => void;
}

const ProductCard = ({ product, onAddToCart, onQuickView, onAddToWishlist }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
      <div className="relative overflow-hidden bg-gray-50">
        <Link href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product._id}`}>
          <div className="aspect-square overflow-hidden relative">
            <Image
              src={checkImageUrl(product.variants[0]?.images?.[0])}
              alt={product.name}
              className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
              fill
            />
          </div>
        </Link>

        {/* Badge cho sản phẩm mới hoặc giảm giá */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
            Mới
          </div>
        )}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            -{product.discount}%
          </div>
        )}

        {/* Quick action buttons */}
        <div className="absolute -right-10 top-14 flex flex-col gap-2 transition-all duration-300 group-hover:right-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-9 w-9 bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-white shadow-md"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
          >
            <Icon path={mdiCartOutline} size={0.8} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-9 w-9 bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-white shadow-md"
            onClick={(e) => {
              e.preventDefault();
              onAddToWishlist();
            }}
          >
            <Icon path={mdiHeartOutline} size={0.8} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-9 w-9 bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-white shadow-md"
            onClick={(e) => {
              e.preventDefault();
              onQuickView();
            }}
          >
            <Icon path={mdiEye} size={0.8} />
          </Button>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-4 flex flex-col flex-grow  bg-muted border-t">
        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">
          {typeof product.brand === 'string' ? product.brand : product.brand.name}
        </div>
        <Link
          href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product._id}`}
          className="hover:text-primary transition-colors"
        >
          <h3 className="font-semibold text-base mb-1 line-clamp-2 leading-tight">{product.name}</h3>
        </Link>

        <div className="mt-auto pt-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="font-bold text-lg text-primary">
              {formatPrice(product.variants[0]?.price || 0)}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          {/* Color dots to show available colors */}
          {product.variants.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {Array.from(new Set(product.variants.map((v: any) =>
                typeof v.colorId === 'object' ? v.colorId._id : v.colorId
              ))).slice(0, 4).map((colorId, index: number) => {
                const variant = product.variants.find((v: any) =>
                  (typeof v.colorId === 'object' ? v.colorId._id : v.colorId) === colorId
                );
                const color = typeof variant.colorId === 'object' ? variant.colorId : { code: '#000000' };

                return (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-gray-300 transform hover:scale-125 transition-transform"
                    style={{ backgroundColor: color.code }}
                  />
                );
              })}

              {Array.from(new Set(product.variants.map((v: any) =>
                typeof v.colorId === 'object' ? v.colorId._id : v.colorId
              ))).length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{Array.from(new Set(product.variants.map((v: any) =>
                      typeof v.colorId === 'object' ? v.colorId._id : v.colorId
                    ))).length - 4}
                  </span>
                )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}; 