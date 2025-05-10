'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreatePromotion } from '@/hooks/promotion';
import { useProducts } from '@/hooks/product';
import { IPromotionCreate } from '@/interface/request/promotion';
import { IProductFilter } from '@/interface/request/product';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@mdi/react';
import { mdiArrowLeft, mdiLoading, mdiMagnify, mdiPlus, mdiTrashCanOutline } from '@mdi/js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { checkImageUrl } from '@/lib/utils';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { IProduct } from '@/interface/response/product';

const initialPromotion: IPromotionCreate = {
  name: '',
  description: '',
  discountPercent: 0,
  products: [],
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
};

// Add a proper type check for date values
const isDateObject = (value: any): value is Date => {
  return value instanceof Date;
}

export default function CreatePromotionPage() {
  const router = useRouter();
  const [promotion, setPromotion] = useState<IPromotionCreate>(initialPromotion);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createPromotion = useCreatePromotion();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productFilters, setProductFilters] = useState<IProductFilter>({
    page: 1,
    limit: 10,
    status: 'HOAT_DONG',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const { data: productsData, isLoading: isLoadingProducts } = useProducts(productFilters);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        setProductFilters((prev) => ({ ...prev, name: searchQuery, page: 1 }));
      } else {
        const { name, ...rest } = productFilters;
        setProductFilters({ ...rest, page: 1 });
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    setPromotion(prev => ({
      ...prev,
      products: selectedProductIds
    }));
  }, [selectedProductIds]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    let parsedValue: string | number = value;
    
    // Handle numeric fields
    if (type === 'number') {
      parsedValue = value === '' ? 0 : parseFloat(value);
    }
    
    setPromotion({ ...promotion, [name]: parsedValue });
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setPromotion({ ...promotion, [name]: value });
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleDateChange = (name: string, value: string) => {
    setPromotion({ ...promotion, [name]: value });
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleProductPageChange = (page: number) => {
    setProductFilters(prev => ({ ...prev, page }));
  };

  const handleProductSelection = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const handleRemoveSelectedProduct = (productId: string) => {
    setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!promotion.name.trim()) {
      newErrors.name = 'Tên chương trình khuyến mãi không được để trống';
    }
    
    if (promotion.discountPercent <= 0) {
      newErrors.discountPercent = 'Phần trăm giảm giá phải lớn hơn 0';
    }
    
    if (promotion.discountPercent > 100) {
      newErrors.discountPercent = 'Phần trăm giảm giá không được vượt quá 100%';
    }
    
    if (!promotion.startDate) {
      newErrors.startDate = 'Ngày bắt đầu không được để trống';
    }
    
    if (!promotion.endDate) {
      newErrors.endDate = 'Ngày kết thúc không được để trống';
    }
    
    if (promotion.startDate && promotion.endDate && new Date(promotion.startDate) > new Date(promotion.endDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }
    
    if (promotion.products && promotion.products.length === 0) {
      newErrors.products = 'Phải có ít nhất một sản phẩm được áp dụng';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    try {
      await createPromotion.mutateAsync(promotion, {
        onSuccess: () => {
          toast.success('Tạo chương trình khuyến mãi thành công');
          router.push('/admin/discounts/promotions');
        },
        onError: (error) => {
          console.error('Chi tiết lỗi:', error);
          toast.error('Tạo chương trình khuyến mãi thất bại: ' + (error.message || 'Không xác định'));
        }
      });
    } catch (error) {
      console.error('Lỗi khi tạo chương trình khuyến mãi:', error);
      toast.error('Tạo chương trình khuyến mãi thất bại');
    }
  };

  const getSelectedProductDetails = (productId: string): IProduct | null => {
    if (!productsData) return null;
    const allProducts = productsData.data.products;
    return allProducts.find(product => product._id === productId) || null;
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
              <BreadcrumbLink href="/admin/discounts/promotions">Khuyến mãi theo sản phẩm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Thêm chương trình khuyến mãi mới</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <Icon path={mdiArrowLeft} size={0.9} />
          Quay lại
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chương trình khuyến mãi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-maintext">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên chương trình <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    value={promotion.name}
                    onChange={handleInputChange}
                    placeholder="VD: Khuyến mãi mùa hè 2024"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả chương trình</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={promotion.description || ''}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả chi tiết về chương trình khuyến mãi"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountPercent">Phần trăm giảm giá (%) <span className="text-red-500">*</span></Label>
                    <Input
                      id="discountPercent"
                      name="discountPercent"
                      type="number"
                      min="0"
                      max="100"
                      value={promotion.discountPercent}
                      onChange={handleInputChange}
                      placeholder="VD: 10%"
                      className={errors.discountPercent ? 'border-red-500' : ''}
                    />
                    {errors.discountPercent && <p className="text-red-500 text-sm">{errors.discountPercent}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Ngày bắt đầu <span className="text-red-500">*</span></Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={typeof promotion.startDate === 'string' 
                          ? promotion.startDate 
                          : (isDateObject(promotion.startDate) 
                              ? promotion.startDate.toISOString().split('T')[0] 
                              : '')}
                        onChange={(e) => handleDateChange('startDate', e.target.value)}
                        className={errors.startDate ? 'border-red-500' : ''}
                      />
                      {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">Ngày kết thúc <span className="text-red-500">*</span></Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={typeof promotion.endDate === 'string' 
                          ? promotion.endDate 
                          : (isDateObject(promotion.endDate) 
                              ? promotion.endDate.toISOString().split('T')[0] 
                              : '')}
                        onChange={(e) => handleDateChange('endDate', e.target.value)}
                        className={errors.endDate ? 'border-red-500' : ''}
                      />
                      {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sản phẩm áp dụng</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setIsProductDialogOpen(true)}
                >
                  <Icon path={mdiPlus} size={0.9} />
                  Thêm sản phẩm
                </Button>
              </CardHeader>
              <CardContent>
                {errors.products && <p className="text-red-500 text-sm mb-4">{errors.products}</p>}
                
                {selectedProductIds.length === 0 ? (
                  <div className="text-center py-6 border border-dashed rounded-md">
                    <p className="text-gray-500">Chưa có sản phẩm nào được áp dụng</p>
                    <Button 
                      variant="link" 
                      type="button" 
                      onClick={() => setIsProductDialogOpen(true)}
                      className="mt-2"
                    >
                      Thêm sản phẩm ngay
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedProductIds.map(productId => {
                      const product = getSelectedProductDetails(productId);
                      if (!product) return null;
                      
                      // Safely get product image
                      let productImage: string | null = null;
                      
                      if (product.variants?.[0]?.images?.length) {
                        productImage = product.variants[0].images[0];
                      }
                      
                      return (
                        <div key={productId} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            {productImage ? (
                              <div className="h-12 w-12 relative">
                                <Image 
                                  src={checkImageUrl(productImage)} 
                                  alt={product.name}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded-md">
                                <span className="text-xs text-gray-500">No IMG</span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">Mã: {product.code}</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => handleRemoveSelectedProduct(productId)}
                            type="button"
                          >
                            <Icon path={mdiTrashCanOutline} size={0.9} />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tạo chương trình khuyến mãi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-6">
                  Vui lòng kiểm tra kỹ thông tin trước khi tạo chương trình khuyến mãi.
                </p>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createPromotion.isPending}
                >
                  {createPromotion.isPending ? (
                    <>
                      <Icon path={mdiLoading} size={0.9} className="mr-2" spin={true} />
                      Đang xử lý...
                    </>
                  ) : (
                    'Tạo chương trình khuyến mãi'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chọn sản phẩm áp dụng khuyến mãi</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="relative mb-4">
              <Icon
                path={mdiMagnify}
                size={0.9}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isLoadingProducts ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-5" />
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : productsData?.data.products.length === 0 ? (
              <div className="text-center py-10">
                <p>Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {productsData?.data.products.map(product => {
                  // Safely get product image
                  let dialogProductImage: string | null = null;
                  
                  if (product.variants?.[0]?.images?.length) {
                    dialogProductImage = product.variants[0].images[0];
                  }
                  
                  return (
                    <div key={product._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                      <Checkbox
                        id={`product-${product._id}`}
                        checked={selectedProductIds.includes(product._id)}
                        onCheckedChange={() => handleProductSelection(product._id)}
                      />
                      <div className="flex items-center gap-3 flex-1">
                        {dialogProductImage ? (
                          <div className="h-12 w-12 relative">
                            <Image 
                              src={checkImageUrl(dialogProductImage)} 
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded-md">
                            <span className="text-xs text-gray-500">No IMG</span>
                          </div>
                        )}
                        <div>
                          <label htmlFor={`product-${product._id}`} className="font-medium cursor-pointer">
                            {product.name}
                          </label>
                          <p className="text-sm text-gray-500">Mã: {product.code}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {productsData?.data.pagination && productsData.data.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={productsData.data.pagination.currentPage <= 1}
                    onClick={() => handleProductPageChange(productsData.data.pagination.currentPage - 1)}
                  >
                    Trước
                  </Button>
                  {Array.from({ length: productsData.data.pagination.totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={page === productsData.data.pagination.currentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleProductPageChange(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      productsData.data.pagination.currentPage >= productsData.data.pagination.totalPages
                    }
                    onClick={() => handleProductPageChange(productsData.data.pagination.currentPage + 1)}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsProductDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={() => setIsProductDialogOpen(false)}
            >
              Xác nhận ({selectedProductIds.length} sản phẩm)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 