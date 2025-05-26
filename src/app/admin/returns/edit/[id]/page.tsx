'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useReturnDetail, useUpdateReturn } from '@/hooks/return';
import { IReturnUpdate, IReturnItem } from '@/interface/request/return';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@mdi/react';
import { mdiArrowLeft, mdiLoading, mdiMagnify, mdiPlus, mdiTrashCanOutline } from '@mdi/js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const reasonOptions = [
  { value: 'wrong_size', label: 'Sai kích cỡ' },
  { value: 'wrong_item', label: 'Sản phẩm không đúng' },
  { value: 'damaged', label: 'Sản phẩm bị hỏng' },
  { value: 'defective', label: 'Sản phẩm bị lỗi' },
  { value: 'changed_mind', label: 'Đổi ý' },
  { value: 'other', label: 'Lý do khác' }
];

export default function EditReturnPage({ params }: { params: { id: string } }) {
  const returnId = params.id;
  const router = useRouter();
  const { data: returnDetail, isLoading, isError } = useReturnDetail(returnId);
  const updateReturn = useUpdateReturn();
  
  const [returnRequest, setReturnRequest] = useState<IReturnUpdate>({
    items: [],
    totalRefund: 0
  });
  const [items, setItems] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (returnDetail && returnDetail.data) {
      const returnData = returnDetail.data;
      
      // Map items with additional UI properties
      const mappedItems = returnData.items.map((item: any) => {
        const product = typeof item.product === 'string' 
          ? { _id: item.product, name: 'Loading...', code: '', images: [] } 
          : item.product;
          
        return {
          ...item,
          product,
          returnQuantity: item.quantity,
          maxQuantity: item.quantity
        };
      });
      
      setItems(mappedItems);
      setReturnRequest({
        totalRefund: returnData.totalRefund
      });
    }
  }, [returnDetail]);

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index].returnQuantity = quantity;
    setItems(newItems);
    updateTotalRefund(newItems);
  };

  const handleReasonChange = (index: number, reason: string) => {
    const newItems = [...items];
    newItems[index].reason = reason;
    setItems(newItems);
  };

  const updateTotalRefund = (updatedItems: any[]) => {
    const totalRefund = updatedItems.reduce((total, item) => {
      return total + (item.price * (item.returnQuantity || 1));
    }, 0);
    
    setReturnRequest({
      ...returnRequest,
      totalRefund
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (items.length === 0) {
      newErrors.items = 'Vui lòng chọn ít nhất một sản phẩm để trả';
    }

    if (items.some(item => !item.reason)) {
      newErrors.reason = 'Vui lòng chọn lý do trả hàng cho tất cả sản phẩm';
    }
    
    if ((returnRequest.totalRefund || 0) <= 0) {
      newErrors.totalRefund = 'Tổng tiền hoàn trả phải lớn hơn 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare items for submission
    const formattedItems = items.map(item => ({
      product: typeof item.product === 'string' ? item.product : item.product._id,
      variant: item.variant,
      quantity: item.returnQuantity || 1,
      price: item.price,
      reason: item.reason
    }));
    
    const payload: IReturnUpdate = {
      items: formattedItems,
      totalRefund: returnRequest.totalRefund
    };
    
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }
    
    try {
      await updateReturn.mutateAsync(
        { returnId, payload },
        {
          onSuccess: () => {
            toast.success('Cập nhật yêu cầu trả hàng thành công');
            router.push('/admin/returns');
          },
          onError: (error) => {
            console.error('Chi tiết lỗi:', error);
            toast.error('Cập nhật yêu cầu trả hàng thất bại: ' + (error.message || 'Không xác định'));
          }
        }
      );
    } catch (error) {
      console.error('Lỗi khi cập nhật yêu cầu trả hàng:', error);
      toast.error('Cập nhật yêu cầu trả hàng thất bại');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !returnDetail) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/returns">Quản lý trả hàng</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Chỉnh sửa yêu cầu trả hàng</BreadcrumbPage>
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
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-500 mb-2">Đã xảy ra lỗi</h3>
              <p className="text-maintext">Không thể tải thông tin yêu cầu trả hàng. Vui lòng thử lại sau.</p>
              <Button 
                className="mt-4" 
                onClick={() => router.push('/admin/returns')}
              >
                Quay lại danh sách
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const returnData = returnDetail.data;
  const customerInfo = typeof returnData.customer === 'string' 
    ? { fullName: 'Không có thông tin', email: '', phoneNumber: '' } 
    : returnData.customer;
    
  const orderInfo = typeof returnData.originalOrder === 'string'
    ? { code: returnData.originalOrder }
    : returnData.originalOrder;

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
              <BreadcrumbLink href="/admin/returns">Quản lý trả hàng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chỉnh sửa yêu cầu trả hàng</BreadcrumbPage>
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
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin yêu cầu trả hàng #{returnData.code}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Thông tin đơn hàng</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-maintext">Mã yêu cầu:</span>
                      <span className="font-medium">{returnData.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maintext">Trạng thái:</span>
                      <span>
                        {returnData.status === 'CHO_XU_LY' ? (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Chờ xử lý</Badge>
                        ) : returnData.status === 'DA_HOAN_TIEN' ? (
                          <Badge variant="outline" className="bg-green-50 text-primary border-green-200">Đã hoàn tiền</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Đã hủy</Badge>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maintext">Đơn hàng gốc:</span>
                      <span>{orderInfo.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maintext">Ngày tạo:</span>
                      <span>{formatDate(returnData.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-maintext">Tên khách hàng:</span>
                      <span className="font-medium">{customerInfo.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maintext">Email:</span>
                      <span>{customerInfo.email || 'Không có'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maintext">Số điện thoại:</span>
                      <span>{customerInfo.phoneNumber || 'Không có'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách sản phẩm trả lại</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.length > 0 ? (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Sản phẩm</TableHead>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead>Biến thể</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Lý do trả</TableHead>
                        <TableHead>Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {item.product.images && item.product.images.length > 0 ? (
                              <div className="relative h-16 w-16 rounded-[6px] overflow-hidden">
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-16 w-16 bg-gray-100 rounded-[6px]"></div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-sm text-maintext">SKU: {item.product.code}</div>
                          </TableCell>
                          <TableCell>
                            <div>Màu: {item.variant.colorId}</div>
                            <div>Size: {item.variant.sizeId}</div>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <Input
                              type="number"
                              min={1}
                              max={item.maxQuantity}
                              value={item.returnQuantity || 1}
                              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                              className="w-16"
                              disabled={returnData.status !== 'CHO_XU_LY'}
                            />
                          </TableCell>
                          <TableCell className="w-[200px]">
                            <Select
                              value={item.reason || ''}
                              onValueChange={(value) => handleReasonChange(index, value)}
                              disabled={returnData.status !== 'CHO_XU_LY'}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn lý do" />
                              </SelectTrigger>
                              <SelectContent>
                                {reasonOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {formatCurrency(item.price * (item.returnQuantity || 1))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {errors.reason && (
                    <p className="text-red-500 text-sm">{errors.reason}</p>
                  )}

                  <div className="bg-gray-50 p-4 rounded-[6px]">
                    <div className="flex justify-between font-medium">
                      <span>Tổng tiền hoàn trả:</span>
                      <span className="text-primary text-lg">{formatCurrency(returnRequest.totalRefund || 0)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-[6px]">
                  <p className="text-maintext">Không có sản phẩm nào được chọn</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
              {returnData.status === 'CHO_XU_LY' && (
                <Button
                  type="submit"
                  disabled={updateReturn.isPending}
                >
                  {updateReturn.isPending ? (
                    <>
                      <Icon path={mdiLoading} size={0.9} className="mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Cập nhật yêu cầu'
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
} 