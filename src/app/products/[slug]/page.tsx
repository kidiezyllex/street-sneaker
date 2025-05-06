'use client';

import React, { useState, useEffect } from 'react';
import { useProductDetail } from '@/hooks/product';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Icon } from '@mdi/react';
import { mdiCartOutline, mdiHeartOutline, mdiShareVariant, mdiCheck, mdiLoading, mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { checkImageUrl } from '@/lib/utils';
import { useCartStore } from '@/stores/useCartStore';
import { IProduct, IBrand, ICategory, IPopulatedProductVariant } from '@/interface/response/product';

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug;
  const [productId, setProductId] = useState<string>('');
  const { data: productData, isLoading } = useProductDetail(productId);
  const { addToCart } = useCartStore();

  const [selectedVariant, setSelectedVariant] = useState<IPopulatedProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Extract product ID from slug
  useEffect(() => {
    if (typeof slug === 'string') {
      const id = slug.split('-').pop();
      if (id) {
        setProductId(id);
      }
    }
  }, [slug]);

  // Cập nhật variant được chọn khi có dữ liệu sản phẩm
  useEffect(() => {
    if (productData?.data?.variants?.length && productData.data.variants.length > 0) {
      // Mặc định chọn variant đầu tiên
      const firstVariant = productData.data.variants[0];
      setSelectedVariant(firstVariant);
      setSelectedColor(firstVariant.colorId._id);
      setSelectedSize(firstVariant.sizeId._id);
    }
  }, [productData]);

  // Xử lý chọn màu sắc
  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
    
    // Tìm variant phù hợp với color và size đã chọn
    const matchingVariant = productData?.data?.variants.find(
      (v) => v.colorId._id === colorId && v.sizeId._id === selectedSize
    );
    
    // Nếu tìm thấy variant phù hợp, cập nhật selectedVariant
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      setCurrentImageIndex(0);
    } else {
      // Nếu không có variant phù hợp với size hiện tại, chọn variant đầu tiên có màu này
      const firstVariantWithColor = productData?.data?.variants.find(
        (v) => v.colorId._id === colorId
      );
      if (firstVariantWithColor) {
        setSelectedVariant(firstVariantWithColor);
        setSelectedSize(firstVariantWithColor.sizeId._id);
        setCurrentImageIndex(0);
      }
    }
  };

  // Xử lý chọn kích thước
  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId);
    
    // Tìm variant phù hợp với color và size đã chọn
    const matchingVariant = productData?.data?.variants.find(
      (v) => v.colorId._id === selectedColor && v.sizeId._id === sizeId
    );
    
    // Cập nhật selectedVariant nếu tìm thấy
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedVariant || !productData?.data) return;
    
    const cartItem = {
      id: selectedVariant._id,
      name: productData.data.name,
      price: selectedVariant.price,
      image: selectedVariant.images?.[0] || '',
      quantity: quantity,
      slug: productData.data.code, // Use code instead of slug
      brand: typeof productData.data.brand === 'string' ? productData.data.brand : productData.data.brand.name,
      size: selectedVariant.sizeId.code,
      colors: [selectedVariant.colorId.name]
    };

    addToCart(cartItem, quantity);
    toast.success('Đã thêm sản phẩm vào giỏ hàng');
  };

  // Xử lý chuyển ảnh
  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    if (!selectedVariant || !selectedVariant.images || selectedVariant.images.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedVariant.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!selectedVariant || !selectedVariant.images || selectedVariant.images.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev === selectedVariant.images.length - 1 ? 0 : prev + 1
    );
  };

  // Fix the disabled prop type error
  const handleQuantityChange = (newQuantity: number) => {
    if (!selectedVariant) return;
    const maxQuantity = selectedVariant.stock || 0;
    setQuantity(Math.max(1, Math.min(newQuantity, maxQuantity)));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="w-full sm:w-1/2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="aspect-square w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="w-full sm:w-1/2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex gap-2 pt-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-10 w-10 rounded-full" />
              ))}
            </div>
            <div className="flex gap-2">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-10 w-16" />
              ))}
            </div>
            <div className="pt-4 flex gap-2">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const product = productData?.data;
  if (!product) return null;

  const brandName = typeof product.brand === 'string' ? product.brand : product.brand.name;
  const brandSlug = typeof product.brand === 'string' ? product.brand : product.brand.name.toLowerCase().replace(/\s+/g, '-');
  const categoryName = typeof product.category === 'string' ? product.category : product.category.name;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Sản phẩm</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Phần hình ảnh sản phẩm */}
        <div className="w-full lg:w-3/5">
          {/* Ảnh chính */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border">
            {selectedVariant && selectedVariant.images && selectedVariant.images.length > 0 ? (
              <>
                <Image
                  src={checkImageUrl(selectedVariant.images[currentImageIndex])}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={100}
                />
                {selectedVariant.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 bg-white shadow-lg"
                      onClick={handlePrevImage}
                    >
                      <Icon path={mdiChevronLeft} size={1} />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 bg-white shadow-lg"
                      onClick={handleNextImage}
                    >
                      <Icon path={mdiChevronRight} size={1} />
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Không có hình ảnh</p>
              </div>
            )}
          </div>

          {/* Ảnh thumbnail */}
          {selectedVariant && selectedVariant.images && selectedVariant.images.length > 1 && (
            <div className="grid grid-cols-5 gap-3 mt-4">
              {selectedVariant.images.map((image: string, index: number) => (
                <div
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`
                    relative aspect-square rounded-lg overflow-hidden cursor-pointer
                    border-2 transition-all duration-200 hover:opacity-80
                    ${currentImageIndex === index 
                      ? 'border-primary ring-2 ring-primary/20 shadow-md' 
                      : 'border-gray-100 hover:border-gray-200'
                    }
                  `}
                >
                  <Image
                    src={checkImageUrl(image)}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 20vw, 10vw"
                    quality={80}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="w-full lg:w-2/5 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              <Link 
                href={`/brand/${brandSlug}`} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {brandName}
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{categoryName}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-3xl font-bold text-primary">
              {selectedVariant && formatPrice(selectedVariant.price)}
            </div>
            {selectedVariant?.price && selectedVariant.price > selectedVariant.price && (
              <div className="flex items-center gap-2">
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(selectedVariant.price)}
                </span>
                <Badge variant="secondary" className="font-medium">
                  -{Math.round(((selectedVariant.price - selectedVariant.price) / selectedVariant.price) * 100)}%
                </Badge>
              </div>
            )}
          </div>

          {/* Chọn màu sắc */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Màu sắc</span>
              {selectedVariant?.colorId && (
                <span className="text-sm text-muted-foreground">
                  {selectedVariant.colorId.name}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {product.variants
                .filter((variant, index, self) => 
                  index === self.findIndex((v) => v.colorId._id === variant.colorId._id)
                )
                .map((variant) => (
                  <button
                    key={variant.colorId._id}
                    onClick={() => handleColorSelect(variant.colorId._id)}
                    className={`
                      relative group flex items-center justify-center w-12 h-12 rounded-full
                      transition-all duration-200
                      ${selectedColor === variant.colorId._id 
                        ? 'ring-2 ring-primary ring-offset-2 scale-110' 
                        : 'ring-1 ring-gray-200 hover:ring-gray-300'
                      }
                    `}
                    style={{ backgroundColor: variant.colorId.code }}
                    title={variant.colorId.name}
                  >
                    {selectedColor === variant.colorId._id && (
                      <Icon 
                        path={mdiCheck} 
                        size={1} 
                        className="text-white drop-shadow-md" 
                      />
                    )}
                  </button>
                ))}
            </div>
          </div>

          {/* Chọn kích thước */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Kích thước</span>
              {selectedVariant?.sizeId && (
                <span className="text-sm text-muted-foreground">
                  {selectedVariant.sizeId.code}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants
                .filter((variant) => variant.colorId._id === selectedColor)
                .map((variant) => (
                  <button
                    key={variant.sizeId._id}
                    onClick={() => handleSizeSelect(variant.sizeId._id)}
                    disabled={variant.stock === 0}
                    className={`
                      min-w-[3.5rem] h-11 px-3 rounded-lg border-2 font-medium
                      transition-all duration-200
                      ${
                        selectedSize === variant.sizeId._id
                          ? 'border-primary bg-primary/5 text-primary'
                          : variant.stock === 0
                          ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    {variant.sizeId.code}
                  </button>
                ))}
            </div>
          </div>

          {/* Chọn số lượng */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Số lượng</span>
              {selectedVariant && (
                <span className="text-sm text-muted-foreground">
                  Còn {selectedVariant.stock} sản phẩm
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-11 w-11"
              >
                -
              </Button>
              <span className="w-12 text-center text-lg font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={!selectedVariant || quantity >= (selectedVariant.stock || 0)}
                className="h-11 w-11"
              >
                +
              </Button>
            </div>
          </div>

          {/* Nút thao tác */}
          <div className="flex gap-4 pt-2">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => toast.success('Đã thêm vào danh sách yêu thích')}
            >
              <Icon path={mdiHeartOutline} size={1.2} className="mr-2" />
              Yêu thích
            </Button>
            <Button
              size="lg"
              className="flex-[2]"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              <Icon path={mdiCartOutline} size={1.2} className="mr-2" />
              Thêm vào giỏ
            </Button>
          </div>

          {/* Chia sẻ */}
          <div className="pt-4 flex items-center gap-2 text-sm text-gray-500">
            <span>Chia sẻ:</span>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Icon path={mdiShareVariant} size={0.9} />
            </button>
          </div>

          {/* Thông tin chi tiết */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-3">
            <h3 className="font-medium">Thông tin sản phẩm</h3>
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 pr-4 text-gray-600 w-1/3">Thương hiệu</td>
                  <td className="py-2 font-medium">{brandName}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-gray-600">Danh mục</td>
                  <td className="py-2 font-medium">{categoryName}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-gray-600">Mã sản phẩm</td>
                  <td className="py-2 font-medium">{product.code}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mô tả và chi tiết sản phẩm */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full sm:w-auto border-b">
            <TabsTrigger value="description" className="flex-1 sm:flex-none">Mô tả</TabsTrigger>
            <TabsTrigger value="details" className="flex-1 sm:flex-none">Chi tiết sản phẩm</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="prose max-w-none mt-6">
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </TabsContent>
          <TabsContent value="details" className="mt-6">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sản phẩm liên quan */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
        {/* Thêm component sản phẩm liên quan ở đây */}
      </div>
    </div>
  );
} 