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

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [productId, setProductId] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Chuyển đổi slug thành productId
  useEffect(() => {
    if (typeof slug === 'string') {
      // Giả định: slug có định dạng name-productId
      const id = slug.split('-').pop();
      if (id) {
        setProductId(id);
      }
    }
  }, [slug]);

  const { data: productData, isLoading, isError } = useProductDetail(productId);

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

  // Xử lý khi chọn màu
  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
    
    // Tìm variant phù hợp với color và size đã chọn
    const matchingVariant = productData?.data?.variants.find(
      (v: any) => v.colorId._id === colorId && v.sizeId._id === selectedSize
    );
    
    // Nếu tìm thấy variant phù hợp, cập nhật selectedVariant
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      setCurrentImageIndex(0);
    } else {
      // Nếu không có variant phù hợp với size hiện tại, chọn variant đầu tiên có màu này
      const firstVariantWithColor = productData?.data?.variants.find(
        (v: any) => v.colorId._id === colorId
      );
      
      if (firstVariantWithColor) {
        setSelectedVariant(firstVariantWithColor);
        setSelectedSize(firstVariantWithColor.sizeId._id);
        setCurrentImageIndex(0);
      }
    }
  };

  // Xử lý khi chọn kích cỡ
  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId);
    
    // Tìm variant phù hợp với color và size đã chọn
    const matchingVariant = productData?.data?.variants.find(
      (v: any) => v.colorId._id === selectedColor && v.sizeId._id === sizeId
    );
    
    // Cập nhật selectedVariant nếu tìm thấy
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, selectedVariant?.stock || 10));
    setQuantity(newQuantity);
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    // Thực hiện thêm vào giỏ hàng...
    toast.success('Đã thêm sản phẩm vào giỏ hàng');
  };

  // Xử lý chuyển ảnh
  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    if (!selectedVariant?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedVariant.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!selectedVariant?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === selectedVariant.images.length - 1 ? 0 : prev + 1
    );
  };

  // Format giá tiền
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
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
            <Skeleton className="h-8 w-1/4" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
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

  if (isError || !productData?.data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
        <p className="mb-6">Sản phẩm này không tồn tại hoặc đã bị xóa.</p>
        <Button asChild>
          <Link href="/products">Quay lại trang sản phẩm</Link>
        </Button>
      </div>
    );
  }

  const product = productData.data;
  
  // Lấy danh sách các color và size duy nhất
  const uniqueColors = Array.from(
    new Set(product.variants.map((v: any) => v.colorId._id))
  ).map((colorId) => {
    return product.variants.find((v: any) => v.colorId._id === colorId)?.colorId;
  });
  
  const availableSizes = product.variants
    .filter((v: any) => v.colorId._id === selectedColor)
    .map((v: any) => v.sizeId);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
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
        {/* Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {selectedVariant?.images && selectedVariant.images.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={checkImageUrl(selectedVariant.images[currentImageIndex])}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Không có hình ảnh</p>
              </div>
            )}

            {selectedVariant?.images && selectedVariant.images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                  onClick={handlePrevImage}
                >
                  <Icon path={mdiChevronLeft} size={1} />
                </Button>
                <Button
                  variant="secondary" 
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                  onClick={handleNextImage}
                >
                  <Icon path={mdiChevronRight} size={1} />
                </Button>
              </>
            )}
          </div>

          {selectedVariant?.images && selectedVariant.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {selectedVariant.images.map((image: string, index: number) => (
                <div
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                    currentImageIndex === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={checkImageUrl(image)}
                    alt={`${product.name} - Hình ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">
              {typeof product.brand === 'string' ? product.brand : product.brand.name}
            </Badge>
            <Badge variant="outline">
              {typeof product.category === 'string' ? product.category : product.category.name}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {typeof product.material === 'string' ? product.material : product.material.name}
            </Badge>
          </div>
          
          <div className="text-2xl font-bold text-primary mb-6">
            {selectedVariant ? formatCurrency(selectedVariant.price) : ''}
          </div>

          <div className="space-y-6">
            {/* Mô tả ngắn */}
            <div className="prose prose-sm max-w-none">
              <p>{product.description}</p>
            </div>

            {/* Color Selector */}
            {uniqueColors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">Màu sắc:</h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueColors.map((color: any) => (
                    <button
                      key={color._id}
                      onClick={() => handleColorSelect(color._id)}
                      className={`
                        relative group flex items-center justify-center w-10 h-10 rounded-full
                        ${selectedColor === color._id ? 'ring-2 ring-primary ring-offset-2' : 'ring-1 ring-gray-200'}
                      `}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    >
                      {selectedColor === color._id && (
                        <Icon 
                          path={mdiCheck} 
                          size={0.8} 
                          className={`text-${color.code === '#ffffff' ? 'black' : 'white'}`} 
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">Kích cỡ:</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size: any) => (
                    <button
                      key={size._id}
                      onClick={() => handleSizeSelect(size._id)}
                      className={`
                        px-3 py-2 border font-medium text-sm rounded
                        ${selectedSize === size._id 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }
                      `}
                    >
                      {size.code}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-sm font-medium mb-3">Số lượng:</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  min="1"
                  max={selectedVariant?.stock || 10}
                  className="w-16 px-2 py-1 text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (selectedVariant?.stock || 10)}
                >
                  +
                </Button>
                <span className="text-sm text-gray-500 ml-2">
                  {selectedVariant ? `${selectedVariant.stock} sản phẩm có sẵn` : ''}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => toast.success('Đã thêm vào danh sách yêu thích')}
              >
                <Icon path={mdiHeartOutline} size={1} className="mr-2" />
                Yêu thích
              </Button>
              <Button 
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock < 1}
              >
                <Icon path={mdiCartOutline} size={1} className="mr-2" />
                Thêm vào giỏ
              </Button>
            </div>

            {/* Chia sẻ */}
            <div className="pt-4 flex items-center gap-2 text-sm text-gray-500">
              <span>Chia sẻ:</span>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Icon path={mdiShareVariant} size={0.9} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="specs">Thông số kỹ thuật</TabsTrigger>
            <TabsTrigger value="delivery">Vận chuyển & Đổi trả</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose prose-sm max-w-none">
              <p>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
            </div>
          </TabsContent>
          <TabsContent value="specs" className="mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <table className="min-w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2 pr-4 font-medium text-gray-700 w-1/3">Thương hiệu</td>
                    <td className="py-2">{typeof product.brand === 'string' ? product.brand : product.brand.name}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-gray-700">Danh mục</td>
                    <td className="py-2">{typeof product.category === 'string' ? product.category : product.category.name}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-gray-700">Chất liệu</td>
                    <td className="py-2">{typeof product.material === 'string' ? product.material : product.material.name}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-gray-700">Trọng lượng</td>
                    <td className="py-2">{product.weight} gram</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-gray-700">Mã sản phẩm</td>
                    <td className="py-2">{product.code}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="delivery" className="mt-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Chính sách vận chuyển</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Giao hàng toàn quốc</li>
                  <li>Thời gian giao hàng: 2-5 ngày làm việc</li>
                  <li>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Chính sách đổi trả</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Đổi trả miễn phí trong vòng 7 ngày</li>
                  <li>Sản phẩm phải còn nguyên tag và chưa qua sử dụng</li>
                  <li>Không áp dụng đổi trả với sản phẩm giảm giá</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products Placeholder */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="aspect-square bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
} 