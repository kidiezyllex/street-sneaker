'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Icon } from '@mdi/react';
import { mdiArrowLeft, mdiLoading, mdiPercent, mdiCalendar, mdiInformation } from '@mdi/js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCreatePromotion } from '@/hooks/promotion';
import { useProducts } from '@/hooks/product';
import { IPromotionCreate } from '@/interface/request/promotion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function CreatePromotionPage() {
  const router = useRouter();
  const createPromotion = useCreatePromotion();
  const { data: productsData } = useProducts({ limit: 100, status: 'HOAT_DONG' });

  const [formData, setFormData] = useState<IPromotionCreate>({
    name: '',
    description: '',
    discountPercent: 0,
    products: [],
    startDate: '',
    endDate: '',
  });

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [applyToAllProducts, setApplyToAllProducts] = useState(true);

  const handleInputChange = (field: keyof IPromotionCreate, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductSelection = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleSelectAllProducts = (checked: boolean) => {
    setApplyToAllProducts(checked);
    if (checked) {
      setSelectedProducts([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên chiến dịch');
      return;
    }

    if (formData.discountPercent <= 0 || formData.discountPercent > 100) {
      toast.error('Phần trăm giảm giá phải từ 1% đến 100%');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Vui lòng chọn thời gian bắt đầu và kết thúc');
      return;
    }

    const now = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (startDate <= now) {
      toast.error('Thời gian bắt đầu phải sau thời điểm hiện tại');
      return;
    }

    if (endDate <= now) {
      toast.error('Thời gian kết thúc phải sau thời điểm hiện tại');
      return;
    }

    if (startDate >= endDate) {
      toast.error('Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }

    const submitData: IPromotionCreate = {
      ...formData,
      products: applyToAllProducts ? [] : selectedProducts,
    };

    try {
      await createPromotion.mutateAsync(submitData, {
        onSuccess: () => {
          toast.success('Tạo chiến dịch khuyến mãi thành công');
          router.push('/admin/discounts/promotions');
        },
      });
    } catch (error) {
      toast.error('Tạo chiến dịch khuyến mãi thất bại');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
              <BreadcrumbLink href="/admin/discounts/promotions">Chiến dịch khuyến mãi</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tạo mới</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <Icon path={mdiArrowLeft} size={0.7} />
          Quay lại
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon path={mdiPercent} size={1} className="text-primary" />
              Tạo chiến dịch khuyến mãi mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên chiến dịch *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nhập tên chiến dịch khuyến mãi"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPercent">Phần trăm giảm giá (%) *</Label>
                  <Input
                    id="discountPercent"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discountPercent}
                    onChange={(e) => handleInputChange('discountPercent', parseInt(e.target.value) || 0)}
                    placeholder="Nhập phần trăm giảm giá"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Nhập mô tả cho chiến dịch khuyến mãi"
                  rows={3}
                />
              </div>

              {/* Thời gian */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Thời gian bắt đầu *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={typeof formData.startDate === 'string' ? formData.startDate : ''}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Thời gian kết thúc *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={typeof formData.endDate === 'string' ? formData.endDate : ''}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={typeof formData.startDate === 'string' && formData.startDate ? formData.startDate : new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>
              </div>

              {/* Áp dụng sản phẩm */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Áp dụng cho sản phẩm</Label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="applyToAll"
                    checked={applyToAllProducts}
                    onCheckedChange={handleSelectAllProducts}
                  />
                  <Label htmlFor="applyToAll" className="text-sm font-medium">
                    Áp dụng cho tất cả sản phẩm
                  </Label>
                </div>

                {!applyToAllProducts && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                      <div className="space-y-3">
                        {productsData?.data?.products?.map((product) => (
                          <div key={product._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <Checkbox
                              id={`product-${product._id}`}
                              checked={selectedProducts.includes(product._id)}
                              onCheckedChange={(checked) => handleProductSelection(product._id, checked as boolean)}
                            />
                            <div className="flex-1">
                              <Label htmlFor={`product-${product._id}`} className="text-sm font-medium cursor-pointer">
                                {product.name}
                              </Label>
                              <div className="text-xs text-maintext">
                                Mã: {product.code} | Thương hiệu: {typeof product.brand === 'string' ? product.brand : product.brand.name}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedProducts.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Đã chọn {selectedProducts.length} sản phẩm:
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedProducts.map((productId) => {
                            const product = productsData?.data?.products?.find(p => p._id === productId);
                            return product ? (
                              <Badge key={productId} variant="secondary" className="text-xs">
                                {product.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Thông tin tóm tắt */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Icon path={mdiInformation} size={1} className="text-blue-600 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-900">Tóm tắt chiến dịch</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p><strong>Tên:</strong> {formData.name || 'Chưa nhập'}</p>
                        <p><strong>Giảm giá:</strong> {formData.discountPercent}%</p>
                        <p><strong>Thời gian:</strong> {formData.startDate ? new Date(formData.startDate).toLocaleString('vi-VN') : 'Chưa chọn'} - {formData.endDate ? new Date(formData.endDate).toLocaleString('vi-VN') : 'Chưa chọn'}</p>
                        <p><strong>Áp dụng:</strong> {applyToAllProducts ? 'Tất cả sản phẩm' : `${selectedProducts.length} sản phẩm được chọn`}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={createPromotion.isPending}
                  className="min-w-[120px]"
                >
                  {createPromotion.isPending ? (
                    <>
                      <Icon path={mdiLoading} size={0.7} className="mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    'Tạo chiến dịch'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 