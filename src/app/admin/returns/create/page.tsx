'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateReturn } from '@/hooks/return';
import { IReturnCreate, IReturnItem } from '@/interface/request/return';
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
import { useSearchReturn } from '@/hooks/return';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

const initialReturn: IReturnCreate = {
  originalOrder: '',
  customer: '',
  items: [],
  totalRefund: 0
};

const reasonOptions = [
  { value: 'wrong_size', label: 'Sai kích cỡ' },
  { value: 'wrong_item', label: 'Sản phẩm không đúng' },
  { value: 'damaged', label: 'Sản phẩm bị hỏng' },
  { value: 'defective', label: 'Sản phẩm bị lỗi' },
  { value: 'changed_mind', label: 'Đổi ý' },
  { value: 'other', label: 'Lý do khác' }
];

export default function CreateReturnPage() {
  const router = useRouter();
  const [returnRequest, setReturnRequest] = useState<IReturnCreate>(initialReturn);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('order');
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<Array<any>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const createReturn = useCreateReturn();
  const { data: searchResult, refetch: searchOrder } = useSearchReturn({ query: searchQuery });

  const handleSearchOrder = () => {
    if (searchQuery.trim()) {
      searchOrder();
    } else {
      toast.error('Vui lòng nhập mã đơn hàng để tìm kiếm');
    }
  };

  const handleSelectOrder = (order: any) => {
    setOrderInfo(order);
    setReturnRequest({
      ...returnRequest,
      originalOrder: order._id,
      customer: order.customer._id
    });
    setActiveTab('items');
  };

  const handleAddProduct = (product: any) => {
    const productExists = selectedProducts.some(
      (p) => p.product._id === product._id && 
             p.variant.colorId === product.variant.colorId && 
             p.variant.sizeId === product.variant.sizeId
    );

    if (productExists) {
      toast.error('Sản phẩm này đã được thêm vào danh sách trả hàng');
      return;
    }

    setSelectedProducts([...selectedProducts, product]);
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newProducts = [...selectedProducts];
    newProducts[index].returnQuantity = quantity;
    setSelectedProducts(newProducts);
  };

  const handleReasonChange = (index: number, reason: string) => {
    const newProducts = [...selectedProducts];
    newProducts[index].reason = reason;
    setSelectedProducts(newProducts);
  };

  const calculateTotalRefund = () => {
    return selectedProducts.reduce((total, product) => {
      const quantity = product.returnQuantity || 1;
      return total + (product.price * quantity);
    }, 0);
  };

  useEffect(() => {
    const totalRefund = calculateTotalRefund();
    setReturnRequest({
      ...returnRequest,
      totalRefund: totalRefund
    });
  }, [selectedProducts]);

  useEffect(() => {
    const items: IReturnItem[] = selectedProducts.map(product => ({
      product: product.product._id,
      variant: {
        colorId: product.variant.colorId,
        sizeId: product.variant.sizeId
      },
      quantity: product.returnQuantity || 1,
      price: product.price,
      reason: product.reason
    }));

    setReturnRequest({
      ...returnRequest,
      items: items
    });
  }, [selectedProducts]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!returnRequest.originalOrder) {
      newErrors.originalOrder = 'Vui lòng chọn đơn hàng';
    }
    
    if (!returnRequest.customer) {
      newErrors.customer = 'Thông tin khách hàng không được để trống';
    }
    
    if (returnRequest.items.length === 0) {
      newErrors.items = 'Vui lòng chọn ít nhất một sản phẩm để trả';
    }

    if (returnRequest.items.some(item => !item.reason)) {
      newErrors.reason = 'Vui lòng chọn lý do trả hàng cho tất cả sản phẩm';
    }
    
    if (returnRequest.totalRefund <= 0) {
      newErrors.totalRefund = 'Tổng tiền hoàn trả phải lớn hơn 0';
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
      await createReturn.mutateAsync(returnRequest, {
        onSuccess: () => {
          toast.success('Tạo yêu cầu trả hàng thành công');
          router.push('/admin/returns');
        },
        onError: (error) => {
          console.error('Chi tiết lỗi:', error);
          toast.error('Tạo yêu cầu trả hàng thất bại: ' + (error.message || 'Không xác định'));
        }
      });
    } catch (error) {
      console.error('Lỗi khi tạo yêu cầu trả hàng:', error);
      toast.error('Tạo yêu cầu trả hàng thất bại');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className='flex justify-between items-start'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/returns">Quản lý trả hàng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tạo yêu cầu trả hàng mới</BreadcrumbPage>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="order">Tìm đơn hàng</TabsTrigger>
            <TabsTrigger value="items">Chọn sản phẩm trả</TabsTrigger>
          </TabsList>

          <TabsContent value="order" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tìm kiếm đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã đơn hàng hoặc quét mã QR"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleSearchOrder}
                    className="flex items-center gap-2"
                  >
                    <Icon path={mdiMagnify} size={0.9} />
                    Tìm kiếm
                  </Button>
                </div>

                {errors.originalOrder && (
                  <p className="text-red-500 text-sm">{errors.originalOrder}</p>
                )}

                {searchResult && searchResult.data && searchResult.data.length > 0 ? (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Kết quả tìm kiếm</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã đơn hàng</TableHead>
                          <TableHead>Khách hàng</TableHead>
                          <TableHead>Ngày đặt</TableHead>
                          <TableHead>Tổng tiền</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResult.data.map((order: any) => (
                          <TableRow key={order._id}>
                            <TableCell className="font-medium">{order.code}</TableCell>
                            <TableCell>{order.customer.fullName}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                            <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                onClick={() => handleSelectOrder(order)}
                              >
                                Chọn
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : searchResult && searchResult.data && searchResult.data.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-maintext">Không tìm thấy đơn hàng nào phù hợp</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderInfo ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Thông tin đơn hàng</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-maintext">Mã đơn hàng:</span>
                          <span className="font-medium">{orderInfo.code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-maintext">Ngày đặt:</span>
                          <span>{new Date(orderInfo.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-maintext">Tổng tiền:</span>
                          <span>{formatCurrency(orderInfo.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-maintext">Khách hàng:</span>
                          <span className="font-medium">{orderInfo.customer.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-maintext">Email:</span>
                          <span>{orderInfo.customer.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-maintext">Số điện thoại:</span>
                          <span>{orderInfo.customer.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-maintext">Vui lòng chọn đơn hàng trước</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {orderInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Chọn sản phẩm trả</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="font-medium">Sản phẩm trong đơn hàng</h3>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Sản phẩm</TableHead>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead>Biến thể</TableHead>
                        <TableHead>Giá</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderInfo.items.map((item: any, index: number) => (
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
                              <div className="h-16 w-16 bg-gray-100 rounded-[6px] flex items-center justify-center">
                                <Icon path={mdiMagnify} size={1} className="text-maintext" />
                              </div>
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
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => handleAddProduct({
                                product: item.product,
                                variant: item.variant,
                                price: item.price,
                                maxQuantity: item.quantity,
                                returnQuantity: 1
                              })}
                              className="flex items-center gap-1"
                            >
                              <Icon path={mdiPlus} size={0.7} />
                              Trả
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {errors.items && (
                    <p className="text-red-500 text-sm">{errors.items}</p>
                  )}

                  <h3 className="font-medium mt-6">Sản phẩm trả lại</h3>
                  
                  <AnimatePresence>
                    {selectedProducts.length > 0 ? (
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
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedProducts.map((item, index) => (
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
                                  />
                                </TableCell>
                                <TableCell className="w-[200px]">
                                  <Select
                                    value={item.reason || ''}
                                    onValueChange={(value) => handleReasonChange(index, value)}
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
                                <TableCell>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleRemoveProduct(index)}
                                  >
                                    <Icon path={mdiTrashCanOutline} size={0.8} />
                                  </Button>
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
                            <span className="text-primary text-lg">{formatCurrency(calculateTotalRefund())}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-gray-50 rounded-[6px]">
                        <p className="text-maintext">Chưa có sản phẩm nào được chọn</p>
                      </div>
                    )}
                  </AnimatePresence>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('order')}
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    disabled={createReturn.isPending || selectedProducts.length === 0}
                  >
                    {createReturn.isPending ? (
                      <>
                        <Icon path={mdiLoading} size={0.9} className="mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      'Tạo yêu cầu trả hàng'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
} 