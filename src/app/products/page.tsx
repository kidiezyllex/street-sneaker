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
import { Badge } from "@/components/ui/badge";
import { Icon } from "@mdi/react";
import Image from "next/image";
import Link from "next/link";
import { 
  mdiCartOutline, 
  mdiHeartOutline, 
  mdiEye, 
  mdiFilterOutline, 
  mdiStar, 
  mdiClose, 
  mdiChevronDown,
  mdiCart
} from "@mdi/js";

import { useCartStore } from "@/stores/useCartStore";
import { useFilterStore } from "@/stores/useFilterStore";
import { RatingStars } from "@/components/Common/RatingStars";

// Hàm format giá
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductsPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { products, brands, categories, colors, sizes, loading, filteredProducts } = useFilterStore((state) => state);
  const { addToCart } = useCartStore((state) => state);
  
  // Lấy dữ liệu khi component mount
  useEffect(() => {
    useFilterStore.getState().loadAllData();
  }, []);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Component sản phẩm
  const ProductCard = ({ product }: { product: any }) => {
    return (
      <Card className="group overflow-hidden border border-gray-200 hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
        <div className="relative overflow-hidden">
          <Link href={`/products/${product.slug}`}>
            <div className="aspect-square overflow-hidden relative">
              <Image 
                src={product.image || fallbackImages[product.id % fallbackImages.length]} 
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                width={300}
                height={300}
              />
            </div>
          </Link>
          
          {/* Badges */}
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-none font-medium text-xs text-white bg-gradient-to-r from-red-500 to-amber-500">
              -{product.discount}%
            </div>
          )}
          
          {product.isBestSeller && (
            <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-none font-medium text-xs text-white bg-gradient-to-r from-[#2C8B3D] to-[#88C140]">
              Best Seller
            </div>
          )}
          
          {/* Quick action buttons */}
          <div className="absolute -right-10 top-14 flex flex-col gap-2 transition-all duration-300 group-hover:right-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-8 w-8 bg-white hover:bg-primary hover:text-white"
              onClick={() => addToCart(product, 1)}
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
          <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
          <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
            <h3 className="font-medium text-lg mb-1 line-clamp-2">{product.name}</h3>
          </Link>
          
          <RatingStars rating={product.rating} />
          
          <div className="mt-2 flex items-center gap-2">
            <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          
          {/* Màu sắc */}
          <div className="flex gap-1 mt-3">
            {product.colors && product.colors.map((color: string, i: number) => (
              <div 
                key={i} 
                className="w-4 h-4 rounded-full border cursor-pointer hover:scale-110 transition-transform duration-200" 
                style={{ 
                  backgroundColor: color === 'Đen' ? 'black' : 
                              color === 'Trắng' ? 'white' : 
                              color === 'Xanh' ? '#3B82F6' : 
                              color === 'Đỏ' ? '#EF4444' :
                              color === 'Hồng' ? '#EC4899' :
                              color === 'Xám' ? '#6B7280' :
                              color === 'Cam' ? '#F97316' :
                              color === 'Xanh rêu' ? '#4D7C0F' : '#9CA3AF'
                }}
              />
            ))}
          </div>
          
          <div className="mt-auto pt-4">
            <Button 
              className="w-full font-medium" 
              onClick={() => addToCart(product, 1)}
            >
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Mini Cart UI */}
      <div className="fixed top-24 right-4 z-40">
        <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 w-64">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold flex items-center">
              <Icon path={mdiCart} size={0.8} className="mr-2 text-primary" />
              Giỏ hàng
            </h3>
            <Badge className="bg-primary">{useCartStore.getState().totalItems}</Badge>
          </div>
          
          <div className="border-t border-b py-2 my-2">
            <div className="font-medium flex justify-between">
              <span>Tổng cộng:</span>
              <span>{formatPrice(useCartStore.getState().totalPrice)}</span>
            </div>
          </div>
          
          <div className="mt-3">
            <Link href="/cart">
              <Button className="w-full" size="sm">Xem giỏ hàng</Button>
            </Link>
          </div>
          
          {useCartStore.getState().items.length > 0 && (
            <div className="mt-3 max-h-48 overflow-y-auto">
              <p className="text-xs text-gray-500 mb-2">Sản phẩm gần đây:</p>
              {useCartStore.getState().items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-2 mb-2 border-b pb-2">
                  <div className="w-10 h-10 relative flex-shrink-0">
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      width={40}
                      height={40}
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} x {formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Sản Phẩm</h1>
        <div className="text-sm breadcrumbs">
          <ul className="flex space-x-2">
            <li><Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link></li>
            <li><span className="text-primary">Sản phẩm</span></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Bộ lọc cho màn hình lớn */}
        <div className="hidden md:block md:w-1/4 lg:w-1/5">
          <div className="bg-white p-4 border border-gray-200 rounded-lg sticky top-24">
            <h2 className="font-semibold text-xl mb-4">Bộ lọc</h2>
            
            {/* Bộ lọc thương hiệu */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Thương hiệu</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center gap-2">
                    <Checkbox 
                      id={`brand-${brand.id}`} 
                      checked={useFilterStore.getState().selectedBrands.includes(brand.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          useFilterStore.getState().addBrandFilter(brand.name);
                        } else {
                          useFilterStore.getState().removeBrandFilter(brand.name);
                        }
                      }}
                    />
                    <label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                      {brand.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bộ lọc danh mục */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Danh mục</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <Checkbox 
                      id={`category-${category.id}`} 
                      checked={useFilterStore.getState().selectedCategories.includes(category.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          useFilterStore.getState().addCategoryFilter(category.name);
                        } else {
                          useFilterStore.getState().removeCategoryFilter(category.name);
                        }
                      }}
                    />
                    <label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bộ lọc giá */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Giá</h3>
              <Slider
                defaultValue={[useFilterStore.getState().priceRange[0], useFilterStore.getState().priceRange[1]]}
                max={5000000}
                step={100000}
                onValueChange={(value) => useFilterStore.getState().setPriceRange(value as [number, number])}
                className="mb-4"
              />
              <div className="flex justify-between text-sm">
                <span>{formatPrice(useFilterStore.getState().priceRange[0])}</span>
                <span>{formatPrice(useFilterStore.getState().priceRange[1])}</span>
              </div>
            </div>
            
            {/* Bộ lọc kích cỡ */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Kích cỡ</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <Badge 
                    key={size.id}
                    variant={useFilterStore.getState().selectedSizes.includes(size.name) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (useFilterStore.getState().selectedSizes.includes(size.name)) {
                        useFilterStore.getState().removeSizeFilter(size.name);
                      } else {
                        useFilterStore.getState().addSizeFilter(size.name);
                      }
                    }}
                  >
                    {size.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Bộ lọc màu sắc */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Màu sắc</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <div 
                    key={color.id}
                    className={`
                      w-6 h-6 rounded-full border cursor-pointer relative
                      ${useFilterStore.getState().selectedColors.includes(color.name) ? 'ring-2 ring-primary ring-offset-2' : ''}
                    `}
                    style={{ 
                      backgroundColor: color.name === 'Đen' ? 'black' : 
                                     color.name === 'Trắng' ? 'white' : 
                                     color.name === 'Xanh' ? '#3B82F6' : 
                                     color.name === 'Đỏ' ? '#EF4444' :
                                     color.name === 'Hồng' ? '#EC4899' :
                                     color.name === 'Xám' ? '#6B7280' :
                                     color.name === 'Cam' ? '#F97316' :
                                     color.name === 'Xanh rêu' ? '#4D7C0F' : '#9CA3AF'
                    }}
                    onClick={() => {
                      if (useFilterStore.getState().selectedColors.includes(color.name)) {
                        useFilterStore.getState().removeColorFilter(color.name);
                      } else {
                        useFilterStore.getState().addColorFilter(color.name);
                      }
                    }}
                  >
                    {useFilterStore.getState().selectedColors.includes(color.name) && (
                      <span className="absolute inset-0 flex items-center justify-center text-white">
                        <Icon path={mdiClose} size={0.5} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => useFilterStore.getState().resetFilters()}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
        
        {/* Phần chính với danh sách sản phẩm */}
        <div className="flex-1">
          <div className="bg-white p-4 border border-gray-200 rounded-lg mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Filter button trên mobile */}
              <Button 
                variant="outline" 
                className="md:hidden flex items-center gap-2"
                onClick={toggleFilter}
              >
                <Icon path={mdiFilterOutline} size={0.8} />
                Bộ lọc
              </Button>
              
              {/* Hiển thị các bộ lọc đang áp dụng */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {useFilterStore.getState().getActiveFilters().map((filter, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {filter.name}: {filter.value}
                      <button 
                        className="ml-2 hover:text-primary"
                        onClick={filter.remove}
                      >
                        <Icon path={mdiClose} size={0.6} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Sắp xếp */}
              <div className="flex items-center gap-2">
                <span className="text-sm hidden sm:inline-block">Sắp xếp:</span>
                <Select 
                  value={useFilterStore.getState().sortOption} 
                  onValueChange={(value) => useFilterStore.getState().setSortOption(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Mặc định" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Mặc định</SelectItem>
                    <SelectItem value="price_asc">Giá tăng dần</SelectItem>
                    <SelectItem value="price_desc">Giá giảm dần</SelectItem>
                    <SelectItem value="name_asc">Tên A-Z</SelectItem>
                    <SelectItem value="name_desc">Tên Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Danh sách sản phẩm */}
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 gap-4">
                  <h3 className="text-xl font-medium">Không tìm thấy sản phẩm</h3>
                  <p className="text-gray-500">Vui lòng thử các tùy chọn lọc khác</p>
                  <Button onClick={() => useFilterStore.getState().resetFilters()}>
                    Xóa bộ lọc
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Bộ lọc trên mobile */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex md:hidden" onClick={toggleFilter}>
          <div 
            className="bg-white w-4/5 h-full overflow-y-auto p-6" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Bộ lọc</h2>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-8 w-8"
                onClick={toggleFilter}
              >
                <Icon path={mdiClose} size={0.8} />
              </Button>
            </div>
            
            {/* Bộ lọc thương hiệu */}
            <div className="mb-6 border-b pb-4">
              <h3 className="font-medium mb-3">Thương hiệu</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center gap-2">
                    <Checkbox 
                      id={`mobile-brand-${brand.id}`} 
                      checked={useFilterStore.getState().selectedBrands.includes(brand.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          useFilterStore.getState().addBrandFilter(brand.name);
                        } else {
                          useFilterStore.getState().removeBrandFilter(brand.name);
                        }
                      }}
                    />
                    <label htmlFor={`mobile-brand-${brand.id}`} className="text-sm cursor-pointer">
                      {brand.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bộ lọc danh mục */}
            <div className="mb-6 border-b pb-4">
              <h3 className="font-medium mb-3">Danh mục</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <Checkbox 
                      id={`mobile-category-${category.id}`} 
                      checked={useFilterStore.getState().selectedCategories.includes(category.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          useFilterStore.getState().addCategoryFilter(category.name);
                        } else {
                          useFilterStore.getState().removeCategoryFilter(category.name);
                        }
                      }}
                    />
                    <label htmlFor={`mobile-category-${category.id}`} className="text-sm cursor-pointer">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bộ lọc giá */}
            <div className="mb-6 border-b pb-4">
              <h3 className="font-medium mb-3">Giá</h3>
              <Slider
                defaultValue={[useFilterStore.getState().priceRange[0], useFilterStore.getState().priceRange[1]]}
                max={5000000}
                step={100000}
                onValueChange={(value) => useFilterStore.getState().setPriceRange(value as [number, number])}
                className="mb-4"
              />
              <div className="flex justify-between text-sm">
                <span>{formatPrice(useFilterStore.getState().priceRange[0])}</span>
                <span>{formatPrice(useFilterStore.getState().priceRange[1])}</span>
              </div>
            </div>
            
            {/* Bộ lọc kích cỡ */}
            <div className="mb-6 border-b pb-4">
              <h3 className="font-medium mb-3">Kích cỡ</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <Badge 
                    key={size.id}
                    variant={useFilterStore.getState().selectedSizes.includes(size.name) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (useFilterStore.getState().selectedSizes.includes(size.name)) {
                        useFilterStore.getState().removeSizeFilter(size.name);
                      } else {
                        useFilterStore.getState().addSizeFilter(size.name);
                      }
                    }}
                  >
                    {size.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Bộ lọc màu sắc */}
            <div className="mb-6 border-b pb-4">
              <h3 className="font-medium mb-3">Màu sắc</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <div 
                    key={color.id}
                    className={`
                      w-6 h-6 rounded-full border cursor-pointer relative
                      ${useFilterStore.getState().selectedColors.includes(color.name) ? 'ring-2 ring-primary ring-offset-2' : ''}
                    `}
                    style={{ 
                      backgroundColor: color.name === 'Đen' ? 'black' : 
                                     color.name === 'Trắng' ? 'white' : 
                                     color.name === 'Xanh' ? '#3B82F6' : 
                                     color.name === 'Đỏ' ? '#EF4444' :
                                     color.name === 'Hồng' ? '#EC4899' :
                                     color.name === 'Xám' ? '#6B7280' :
                                     color.name === 'Cam' ? '#F97316' :
                                     color.name === 'Xanh rêu' ? '#4D7C0F' : '#9CA3AF'
                    }}
                    onClick={() => {
                      if (useFilterStore.getState().selectedColors.includes(color.name)) {
                        useFilterStore.getState().removeColorFilter(color.name);
                      } else {
                        useFilterStore.getState().addColorFilter(color.name);
                      }
                    }}
                  >
                    {useFilterStore.getState().selectedColors.includes(color.name) && (
                      <span className="absolute inset-0 flex items-center justify-center text-white">
                        <Icon path={mdiClose} size={0.5} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => useFilterStore.getState().resetFilters()}
              >
                Xóa bộ lọc
              </Button>
              
              <Button 
                className="flex-1"
                onClick={toggleFilter}
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mảng ảnh dự phòng nếu sản phẩm không có ảnh
const fallbackImages = [
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-1-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-2-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-4-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-5-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-7-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-6-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-3-300x300.jpg"
];

export default ProductsPage; 