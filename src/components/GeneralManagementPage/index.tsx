"use client"

import React, { useEffect, useState, createContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@mdi/react';
import { 
  mdiAccount, 
  mdiLock, 
  mdiAccountEdit, 
  mdiCog, 
  mdiChevronRight, 
  mdiOrderBoolAscending,
  mdiEye,
  mdiPrinter,
  mdiClose,
  mdiMapMarker,
  mdiPhone,
  mdiEmail,
  mdiCreditCardOutline,
  mdiCashMultiple,
  mdiCalendarRange,
  mdiAlertCircleOutline,
  mdiCheck,
  mdiPencil,
  mdiAccountBoxOutline,
  mdiBellOutline,
  mdiShieldLockOutline,
  mdiLockReset,
  mdiContentSaveOutline,
  mdiTicketPercentOutline,
  mdiContentCopy
} from '@mdi/js';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useUser } from '@/context/useUserContext';
import { useOrdersByUser, useOrderDetail } from '@/hooks/order';
import { useToast } from '@/hooks/useToast';
import { useUserProfile, useUpdateUserProfile, useChangePassword } from '@/hooks/account';
import { useAvailableVouchersForUser } from '@/hooks/voucher';
import { IVoucher } from '@/interface/response/voucher';
import { IOrder } from '@/interface/response/order';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from '@/lib/utils';
import { formatPrice } from '@/utils/formatters';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const sidebarAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

const contentAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.2 } }
};

export const AccountTabContext = createContext({
  activeTab: 'overview',
  setActiveTab: (tab: string) => {},
});

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    'CHO_XAC_NHAN': { label: 'Chờ xác nhận', className: '!bg-yellow-400 !text-yellow-900 !border-yellow-500' },
    'CHO_GIAO_HANG': { label: 'Chờ giao hàng', className: '!bg-blue-400 !text-blue-900 !border-blue-500' },
    'DANG_VAN_CHUYEN': { label: 'Đang vận chuyển', className: '!bg-orange-400 !text-orange-900 !border-orange-500' },
    'DA_GIAO_HANG': { label: 'Đã giao hàng', className: '!bg-green-400 !text-green-900 !border-green-500' },
    'HOAN_THANH': { label: 'Hoàn thành', className: '!bg-emerald-400 !text-emerald-900 !border-emerald-500' },
    'DA_HUY': { label: 'Đã hủy', className: '!bg-red-400 !text-red-900 !border-red-500' },
  };

  const config = statusConfig[status] || { label: status, className: 'bg-gray-400 text-gray-900 border-gray-500' };

  return (
    <Badge className={`${config.className} rounded-[6px] font-normal`}>
      {config.label}
    </Badge>
  );
};

// Component Dialog Chi tiết đơn hàng
interface OrderDetailDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({ 
  orderId, 
  open, 
  onOpenChange 
}) => {
  const { data: orderData, isLoading, isError } = useOrderDetail(orderId || '');
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'COD':
        return 'Thanh toán khi nhận hàng';
      case 'VNPAY':
        return 'Thanh toán qua VNPay';
      default:
        return method;
    }
  };
  
  const getPaymentStatusName = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ thanh toán';
      case 'PAID':
        return 'Đã thanh toán';
      case 'FAILED':
        return 'Thanh toán thất bại';
      case 'REFUNDED':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  };

  if (!open || !orderId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="text-red-500">Đã xảy ra lỗi khi tải thông tin đơn hàng.</p>
          </div>
        ) : orderData && orderData.data ? (
          <>
            <DialogHeader className="border-b pb-4">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold">
                  Chi tiết đơn hàng #{(orderData.data as any).code}
                </DialogTitle>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => window.print()}
                    title="In hóa đơn"
                  >
                    <Icon path={mdiPrinter} size={0.9} />
                  </Button>
                  <DialogClose asChild>
                    <Button variant="ghost" size="icon" title="Đóng">
                      <Icon path={mdiClose} size={0.9} />
                    </Button>
                  </DialogClose>
                </div>
              </div>
              <DialogDescription className="mt-2">
                Ngày đặt: {formatDate(orderData.data.createdAt)}
              </DialogDescription>
              <div className="mt-2">
                <OrderStatusBadge status={orderData.data.orderStatus} />
              </div>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Thông tin khách hàng */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Icon path={mdiAccount} size={0.8} className="mr-2" />
                      Thông tin khách hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">Họ và tên:</span>
                      <span className="font-medium">{orderData.data.customer.fullName}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">Email:</span>
                      <span>{orderData.data.customer.email}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Thông tin giao hàng */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Icon path={mdiMapMarker} size={0.8} className="mr-2" />
                      Địa chỉ giao hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">Người nhận:</span>
                      <span className="font-medium">{orderData.data.shippingAddress.name}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">Số điện thoại:</span>
                      <span>{orderData.data.shippingAddress.phoneNumber}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">Địa chỉ:</span>
                      <span>
                        {orderData.data.shippingAddress.specificAddress}, {orderData.data.shippingAddress.wardId}, {orderData.data.shippingAddress.districtId}, {orderData.data.shippingAddress.provinceId}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Thông tin đơn hàng */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Icon path={mdiOrderBoolAscending} size={0.8} className="mr-2" />
                    Chi tiết đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-center">Số lượng</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderData.data.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {item.product.name}
                            <div className="text-xs text-muted-foreground">
                              Mã: {item.product.code}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6 space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tạm tính:</span>
                      <span>{formatPrice(orderData.data.subTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Giảm giá:</span>
                      <span>{formatPrice(orderData.data.discount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-medium border-t pt-4">
                      <span>Tổng tiền:</span>
                      <span className="text-primary">{formatPrice(orderData.data.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Thông tin thanh toán */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Icon path={mdiCreditCardOutline} size={0.8} className="mr-2" />
                    Thông tin thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <span className="text-muted-foreground w-32">Phương thức:</span>
                    <div className="flex items-center">
                      <Icon 
                        path={orderData.data.paymentMethod === 'COD' ? mdiCashMultiple : mdiCreditCardOutline} 
                        size={0.8} 
                        className="mr-2 text-primary" 
                      />
                      <span>{getPaymentMethodName(orderData.data.paymentMethod)}</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-muted-foreground w-32">Trạng thái:</span>
                    <span>
                      <Badge className={orderData.data.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800 border-green-200' : '!bg-extra text-white'}>
                        {getPaymentStatusName(orderData.data.paymentStatus)}
                      </Badge>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="border-t pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Không tìm thấy thông tin đơn hàng.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Tab Tổng quan
const OverviewTab = () => {
  const { profile } = useUser();
  const userData = profile?.data;
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold">
              {userData?.fullName?.charAt(0) || userData?.email?.charAt(0) || "U"}
            </div>
            
            <div className="space-y-2 text-center sm:text-left flex-1">
              <h3 className="text-xl font-semibold">{userData?.fullName || "Khách hàng"}</h3>
              <div className="flex gap-2 items-center justify-center sm:justify-start">
                <Icon path={mdiEmail} size={0.8} className="text-muted-foreground" />
                <span className="text-muted-foreground">{userData?.email}</span>
              </div>
              {userData?.phoneNumber && (
                <div className="flex gap-2 items-center justify-center sm:justify-start">
                  <Icon path={mdiPhone} size={0.8} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{userData?.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>
          
          <hr className="border-t border-border" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center gap-2 justify-center" asChild>
              <a href="#account-tabs?tab=profile">
                <Icon path={mdiAccountEdit} size={0.9} />
                <span>Cập nhật thông tin</span>
              </a>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 justify-center" asChild>
              <a href="#account-tabs?tab=password">
                <Icon path={mdiLock} size={0.9} />
                <span>Đổi mật khẩu</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Icon path={mdiOrderBoolAscending} size={0.9} />
              <span>Đơn hàng gần đây</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-3 text-center text-muted-foreground">
              <a href="#account-tabs?tab=orders" className="text-sm hover:underline">
                Xem tất cả đơn hàng
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Icon path={mdiBellOutline} size={0.9} />
              <span>Thông báo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-3 text-center text-muted-foreground">
              <span className="text-sm">Không có thông báo mới</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Tab Thông tin cá nhân
const ProfileTab = () => {
  const { profile } = useUser();
  const userData = profile?.data;
  const { showToast } = useToast();
  const updateProfileMutation = useUpdateUserProfile();
  
  // Form validation schema
  const formSchema = z.object({
    fullName: z.string().min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    phoneNumber: z.string().regex(/^[0-9]{10,11}$/, { message: "Số điện thoại không hợp lệ" }).optional().or(z.literal(''))
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      phoneNumber: userData?.phoneNumber || ""
    }
  });

  // Update form when user data changes
  useEffect(() => {
    if (userData) {
      form.reset({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || ""
      });
    }
  }, [userData, form]);

  // Submit handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateProfileMutation.mutate(
      {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber || undefined
      },
      {
        onSuccess: (response) => {
          showToast({
            title: "Cập nhật thành công",
            message: "Thông tin cá nhân đã được cập nhật",
            type: "success"
          });
        },
        onError: (error) => {
          showToast({
            title: "Lỗi",
            message: error.message || "Đã xảy ra lỗi khi cập nhật thông tin",
            type: "error"
          });
        }
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon path={mdiAccountEdit} size={0.9} />
          <span>Cập nhật thông tin cá nhân</span>
        </CardTitle>
        <CardDescription>
          Quản lý thông tin cá nhân của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="sm:w-1/3 flex flex-col items-center space-y-3">
                <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-semibold">
                  {userData?.fullName?.charAt(0) || userData?.email?.charAt(0) || "U"}
                </div>
                <Button variant="outline" className="w-full max-w-[160px]" type="button">
                  Thay đổi ảnh
                </Button>
              </div>
              
              <div className="sm:w-2/3 space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email" {...field} disabled />
                      </FormControl>
                      <FormDescription>
                        Email không thể thay đổi
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => form.reset()}>
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={updateProfileMutation.isPending}
                className="gap-2"
              >
                {updateProfileMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white" />
                ) : (
                  <Icon path={mdiContentSaveOutline} size={0.8} />
                )}
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Tab Đổi mật khẩu
const PasswordTab = () => {
  const changePasswordMutation = useChangePassword();
  const { showToast } = useToast();
  
  // Form validation schema
  const formSchema = z
    .object({
      currentPassword: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
      newPassword: z.string().min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" }),
      confirmPassword: z.string().min(6, { message: "Mật khẩu xác nhận phải có ít nhất 6 ký tự" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Mật khẩu xác nhận không khớp",
      path: ["confirmPassword"],
    });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Submit handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    changePasswordMutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.newPassword
      },
      {
        onSuccess: (response) => {
          showToast({
            title: "Thành công",
            message: "Đổi mật khẩu thành công",
            type: "success",
          });
          form.reset();
        },
        onError: (error) => {
          showToast({
            title: "Lỗi",
            message: error.message || "Đã xảy ra lỗi khi đổi mật khẩu",
            type: "error",
          });
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon path={mdiLock} size={0.9} />
          <span>Đổi mật khẩu</span>
        </CardTitle>
        <CardDescription>
          Cập nhật mật khẩu để bảo vệ tài khoản của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu hiện tại</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Nhập mật khẩu hiện tại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Nhập mật khẩu mới" {...field} />
                  </FormControl>
                  <FormDescription>
                    Mật khẩu phải có ít nhất 6 ký tự
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Nhập lại mật khẩu mới" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={() => form.reset()}>
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={changePasswordMutation.isPending}
                className="gap-2"
              >
                {changePasswordMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white" />
                ) : (
                  <Icon path={mdiLock} size={0.8} />
                )}
                Cập nhật mật khẩu
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Tab Mã giảm giá
const VouchersTab = () => {
  const { profile } = useUser();
  const userId = profile?.data?._id;
  const { data: vouchersData, isLoading, isError } = useAvailableVouchersForUser(userId || '', {}); 

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Đã sao chép mã: ${text}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }).catch(err => {
      toast.error("Không thể sao chép mã giảm giá.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
  };

  const formatDiscountValue = (type: 'PERCENTAGE' | 'FIXED_AMOUNT', value: number) => {
    if (type === 'PERCENTAGE') {
      return `${value}%`;
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-1/3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon path={mdiAlertCircleOutline} size={0.9} className="text-red-500" />
            <span>Lỗi tải mã giảm giá</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Đã xảy ra lỗi khi tải danh sách mã giảm giá của bạn. Vui lòng thử lại sau.</p>
        </CardContent>
      </Card>
    );
  }

  const vouchers = vouchersData?.data?.vouchers;

  if (!vouchers || vouchers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon path={mdiTicketPercentOutline} size={0.9} />
            <span>Mã giảm giá</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Bạn không có mã giảm giá nào hiện có.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <Icon path={mdiTicketPercentOutline} size={1} className="text-primary" />
                <span>Mã giảm giá của bạn</span>
            </CardTitle>
            <CardDescription>
                Danh sách các mã giảm giá bạn có thể sử dụng để tiết kiệm khi mua sắm.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            {vouchers.map((voucher: IVoucher) => (
                <Card 
                    key={voucher._id} 
                    className={`relative overflow-hidden shadow-lg transition-all hover:shadow-xl group
                                ${voucher.status === 'KHONG_HOAT_DONG' || new Date(voucher.endDate) < new Date() 
                                    ? 'bg-muted/30 border-dashed' 
                                    : 'bg-card border-primary/20 hover:border-primary/50'}`}
                >
                { (voucher.status === 'KHONG_HOAT_DONG' || new Date(voucher.endDate) < new Date()) && (
                    <div className="absolute top-3 right-3 z-10">
                        <Badge variant="destructive" className="text-xs px-2 py-1 rounded-full shadow-md">
                            {new Date(voucher.endDate) < new Date() ? 'Đã hết hạn' : 'Ngừng hoạt động'}
                        </Badge>
                    </div>
                )}
                <CardHeader className="pb-3 relative">
                    {!(voucher.status === 'KHONG_HOAT_DONG' || new Date(voucher.endDate) < new Date()) && (
                         <div className="absolute -top-5 -left-5 w-16 h-16 bg-primary/10 rounded-full transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    )}
                    <div className="relative z-0">
                        <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-primary tracking-wide">
                            {voucher.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                            Mã: <span className="font-semibold text-foreground tracking-wider bg-primary/10 px-1.5 py-0.5 rounded">{voucher.code}</span>
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3.5 text-sm pt-2">
                    <div className="border-t border-border pt-3 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-muted-foreground">Giá trị giảm:</span> 
                            <span className="font-bold text-lg text-green-600">{formatDiscountValue(voucher.type, voucher.value)}</span>
                        </div>
                        {voucher.type === 'PERCENTAGE' && voucher.maxDiscount && (
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>Tối đa:</span>
                                <span>{formatPrice(voucher.maxDiscount)}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-muted-foreground">Đơn tối thiểu:</span> 
                        <span className="font-semibold">{formatPrice(voucher.minOrderValue || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-muted-foreground">Hiệu lực:</span> 
                        <span className="font-semibold">{formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}</span>
                    </div>
                     {voucher.quantity - voucher.usedCount > 0 && voucher.quantity < Infinity && (
                        <div className="text-xs text-blue-600 flex justify-between items-center">
                           <span className="font-medium text-muted-foreground">Lượt sử dụng còn lại:</span> 
                           <span className="font-semibold">{voucher.quantity - voucher.usedCount}</span>
                        </div>
                    )}

                    {(voucher.status === 'HOAT_DONG' && new Date(voucher.endDate) >= new Date()) ? (
                        <Button 
                            variant="default"
                            size="sm" 
                            className="w-full mt-4 bg-primary hover:bg-primary/80 text-primary-foreground gap-2 shadow-md hover:shadow-lg transition-shadow"
                            onClick={() => copyToClipboard(voucher.code)}
                        >
                            <Icon path={mdiContentCopy} size={0.7} />
                            Sao chép mã
                        </Button>
                    ) : (
                        <Button 
                            variant="outline"
                            size="sm" 
                            className="w-full mt-4 cursor-not-allowed"
                            disabled
                        >
                            Không thể sử dụng
                        </Button>
                    )}
                </CardContent>
                </Card>
            ))}
            </div>
            {/* TODO: Add pagination if vouchersData.data.pagination exists and totalPages > 1 */}
        </CardContent>
      </Card>
    </div>
  );
};

// Tab Cài đặt
const SettingsTab = () => {
  const [notifications, setNotifications] = useState({
    order: true,
    promotion: true,
    system: false,
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon path={mdiBellOutline} size={0.9} />
          <span>Thông báo</span>
        </CardTitle>
        <CardDescription>
          Quản lý thông báo bạn nhận được
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="order-notifications">Thông báo đơn hàng</Label>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo về trạng thái đơn hàng của bạn
              </p>
            </div>
            <Switch
              id="order-notifications"
              checked={notifications.order}
              onCheckedChange={(checked) => setNotifications({ ...notifications, order: checked })}
            />
          </div>
          
          <hr className="border-t border-border" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="promotion-notifications">Thông báo khuyến mãi</Label>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo về chương trình khuyến mãi, giảm giá
              </p>
            </div>
            <Switch
              id="promotion-notifications"
              checked={notifications.promotion}
              onCheckedChange={(checked) => setNotifications({ ...notifications, promotion: checked })}
            />
          </div>
          
          <hr className="border-t border-border" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="system-notifications">Thông báo hệ thống</Label>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo về cập nhật hệ thống và bảo trì
              </p>
            </div>
            <Switch
              id="system-notifications"
              checked={notifications.system}
              onCheckedChange={(checked) => setNotifications({ ...notifications, system: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function GeneralManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('overview');
  const { isAuthenticated, profile, isLoadingProfile } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const userId = profile?.data?._id;
  const { data: ordersData, isLoading, isError, refetch } = useOrdersByUser(userId || '');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);

  useEffect(() => {
    const updateActiveTabFromHash = () => {
      if (typeof window !== 'undefined' && window.location.hash === '#account-tabs') {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        
        if (tabParam && ['overview', 'profile', 'password', 'settings', 'orders', 'vouchers'].includes(tabParam)) {
          setActiveTab(tabParam);
        } else {
          setActiveTab('overview');
        }
      }
    };
    updateActiveTabFromHash();
    window.addEventListener('hashchange', updateActiveTabFromHash);
    
    return () => {
      window.removeEventListener('hashchange', updateActiveTabFromHash);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isLoadingProfile) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoadingProfile, router]);

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const tabs = [
    {
      title: 'Tổng quan',
      icon: mdiAccount,
      value: 'overview',
    },
    {
      title: 'Thông tin cá nhân',
      icon: mdiAccountEdit,
      value: 'profile',
    },
    {
      title: 'Đổi mật khẩu',
      icon: mdiLock,
      value: 'password',
    },
    {
      title: 'Đơn hàng của bạn',
      icon: mdiOrderBoolAscending,
      value: 'orders',
    },
    {
      title: 'Mã giảm giá',
      icon: mdiTicketPercentOutline,
      value: 'vouchers',
    },
    {
      title: 'Cài đặt',
      icon: mdiCog,
      value: 'settings',
    },
  ];

  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOrderDetailOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <AccountTabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div 
            className="md:col-span-1"
            initial="hidden"
            animate="visible"
            variants={sidebarAnimation}
          >
            <Card className="sticky">
              <CardHeader className="pb-3">
                <CardTitle>Quản lý chung</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {profile?.data?.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col" id="account-sidebar-tabs">
                  {tabs.map((tab) => (
                    <motion.div 
                      key={tab.value}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a
                        href={`#account-tabs?tab=${tab.value}`}
                        data-value={tab.value}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-muted ${
                          activeTab === tab.value ? 'bg-muted text-primary font-medium' : ''
                        }`}
                        onClick={() => {
                          setActiveTab(tab.value);
                          const tabContentElement = document.getElementById('account-tabs');
                          if (tabContentElement) {
                            tabContentElement.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <Icon path={tab.icon} size={0.8} className={`mr-3 text-maintext ${activeTab === tab.value ? 'text-primary' : ''}`} />
                          <span className='text-maintext'>{tab.title}</span>
                        </div>
                        {activeTab === tab.value && (
                          <Icon path={mdiChevronRight} size={0.8} className="text-primary" />
                        )}
                      </a>
                    </motion.div>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="md:col-span-3"
            initial="hidden"
            animate="visible"
            variants={contentAnimation}
          >
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="overview">
                {activeTab === 'overview' && <OverviewTab />}
              </TabsContent>
              <TabsContent value="profile">
                {activeTab === 'profile' && <ProfileTab />}
              </TabsContent>
              <TabsContent value="password">
                {activeTab === 'password' && <PasswordTab />}
              </TabsContent>
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Đơn hàng của bạn</CardTitle>
                    <CardDescription>Quản lý và theo dõi đơn hàng mua tại cửa hàng</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : isError ? (
                      <div className="py-8 text-center">
                        <p className="text-red-500">Đã xảy ra lỗi khi tải đơn hàng. Vui lòng thử lại sau.</p>
                      </div>
                    ) : !ordersData || !ordersData.data || !ordersData.data.orders || ordersData.data.orders.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground mb-4">Bạn chưa có đơn hàng nào.</p>
                        <Button variant="outline" asChild>
                          <a href="/products">Mua sắm ngay</a>
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[120px] px-3 py-2">Mã đơn hàng</TableHead>
                              <TableHead className="px-3 py-2">Ngày đặt</TableHead>
                              <TableHead className="px-3 py-2">Sản phẩm</TableHead>
                              <TableHead className="text-right px-3 py-2">Tổng tiền</TableHead>
                              <TableHead className="px-3 py-2">Trạng thái</TableHead>
                              <TableHead className="text-center px-3 py-2">Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ordersData.data.orders.map((order: IOrder) => (
                              <TableRow key={order._id}>
                                <TableCell className="font-medium px-3 py-2">{order.code}</TableCell>
                                <TableCell className="px-3 py-2">{formatDate(order.createdAt)}</TableCell>
                                <TableCell className="px-3 py-2">
                                  <div className="flex flex-col gap-1">
                                    {order.items.slice(0, 2).map((item, index) => (
                                      <div key={index} className="text-xs">
                                        {item.product.name} x{item.quantity}
                                      </div>
                                    ))}
                                    {order.items.length > 2 && (
                                      <div className="text-xs text-muted-foreground">
                                        +{order.items.length - 2} sản phẩm khác
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-medium px-3 py-2">
                                  {formatPrice(order.total)}
                                </TableCell>
                                <TableCell className="px-3 py-2">
                                  <OrderStatusBadge status={order.orderStatus} />
                                </TableCell>
                                <TableCell className="text-center px-3 py-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleViewOrderDetails(order._id)}
                                    title="Xem chi tiết"
                                  >
                                    <Icon path={mdiEye} size={0.8} />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        {ordersData.data.pagination && ordersData.data.pagination.totalPages > 1 && (
                          <div className="flex items-center justify-center space-x-2 py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={currentPage === 1}
                              onClick={() => setCurrentPage(currentPage - 1)}
                            >
                              Trang trước
                            </Button>
                            <div className="text-sm text-muted-foreground">
                              Trang {currentPage} / {ordersData.data.pagination.totalPages}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={currentPage === ordersData.data.pagination.totalPages}
                              onClick={() => setCurrentPage(currentPage + 1)}
                            >
                              Trang sau
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="vouchers">
                {activeTab === 'vouchers' && <VouchersTab />}
              </TabsContent>
              <TabsContent value="settings">
                {activeTab === 'settings' && <SettingsTab />}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Dialog chi tiết đơn hàng */}
      <OrderDetailDialog
        orderId={selectedOrderId}
        open={orderDetailOpen}
        onOpenChange={setOrderDetailOpen}
      />
    </AccountTabContext.Provider>
  );
} 