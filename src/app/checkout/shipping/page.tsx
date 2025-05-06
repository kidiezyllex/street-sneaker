'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { useCartStore } from '@/stores/useCartStore';
import { useAuth } from '@/hooks/useAuth';
import { createOrder } from '@/services/order';
import { createVNPayUrl } from '@/services/payment';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { checkImageUrl } from '@/lib/utils';
import { formatPrice } from '@/utils/formatters';

const shippingFormSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  ward: z.string().min(1, "Vui lòng chọn phường/xã"),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER"])
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;

export default function ShippingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { items, subtotal, tax, shipping, total, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: "",
      province: "",
      district: "",
      ward: "",
      paymentMethod: "COD",
    },
  });

  useEffect(() => {
    const checkCart = async () => {
      try {
        setIsLoading(true);

        if (items.length === 0) {
          showToast({
            title: "Thông báo",
            message: "Giỏ hàng trống",
            type: "error"
          });
          router.push('/');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error checking cart:', error);
      }
    };

    checkCart();
  }, [items, router, showToast]);

  const onSubmit = async (values: ShippingFormValues) => {
    try {
      setIsProcessing(true);
      const orderData = {
        customer: user?._id || '000000000000000000000000',
        items: items.map(item => ({
          product: item.id.toString(),
          quantity: item.quantity,
          price: item.price,
          variant: {
            colorId: undefined,
            sizeId: undefined
          }
        })),
        subTotal: Number(subtotal.toFixed(2)),
        total: Number(total.toFixed(2)),
        shippingAddress: {
          name: values.fullName,
          phoneNumber: values.phoneNumber,
          provinceId: values.province,
          districtId: values.district,
          wardId: values.ward,
          specificAddress: values.address
        },
        paymentMethod: values.paymentMethod
      };
      const response = await createOrderWithRetry(orderData);
      if (response && response.success && response.data) {
        clearCart();

        if (values.paymentMethod === 'BANK_TRANSFER') {
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const vnpayResponse = await createVNPayUrl(
              response.data._id,
              response.data.total,
              `Thanh toán đơn hàng ${response.data.code || response.data._id}`,
              response.data.code
            );

            if (vnpayResponse.success) {
              let paymentUrl = '';
              if (vnpayResponse.data?.paymentUrl) {
                paymentUrl = vnpayResponse.data.paymentUrl;
              } else if (typeof vnpayResponse.data === 'string') {
                paymentUrl = vnpayResponse.data;
              }

              if (paymentUrl) {
                localStorage.setItem('pendingOrderId', response.data._id);
                window.location.href = paymentUrl;
                return;
              } else {
                throw new Error('Không nhận được đường dẫn thanh toán từ VNPay');
              }
            } else {
              throw new Error(vnpayResponse.message || 'Không nhận được đường dẫn thanh toán');
            }
          } catch (error: any) {
            throw new Error(error.message || 'Đã xảy ra lỗi khi tạo đường dẫn thanh toán');
          }
        } else {
          router.push(`/checkout/success?orderId=${response.data._id}`);
        }
      } else {
        throw new Error(response?.message || 'Đã xảy ra lỗi khi tạo đơn hàng');
      }
    } catch (error: any) {
      showToast({
        title: "Lỗi",
        message: error.message || "Đã có lỗi xảy ra khi tạo đơn hàng",
        type: "error"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const createOrderWithRetry = async (orderData: any) => {
    const maxRetries = 3;
    const retryDelay = 2000; // 2 giây giữa các lần thử

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Thêm timestamp vào orderData để tránh trùng lặp
        const timestamp = Date.now();
        const uniqueSuffix = Math.floor(Math.random() * 10000);

        // Thêm các trường giúp backend tạo mã đơn hàng duy nhất
        const modifiedOrderData = {
          ...orderData,
          metadata: {
            clientTimestamp: timestamp,
            uniqueSuffix: uniqueSuffix,
            attemptNumber: attempt
          }
        };
        const result = await createOrder(modifiedOrderData);

        if (result.success) {
          return result;
        }

        // Kiểm tra lỗi duplicate key
        if (result.message && (
          result.message.includes('duplicate key error') ||
          result.message.includes('E11000') ||
          result.message.includes('orderCode_1 dup key')
        )) {
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          }
        }
        return result;
      } catch (error) {
        console.error(`Attempt ${attempt}: Error during order creation:`, error);

        if (attempt >= maxRetries) {
          throw error;
        }

        // Chờ một khoảng thời gian trước khi thử lại
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    return {
      success: false,
      message: `Không thể tạo đơn hàng sau ${maxRetries} lần thử. Vui lòng thử lại sau.`
    };
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-8 flex items-center justify-center">
        <div>Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Thanh toán đơn hàng</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao hàng</CardTitle>
              <CardDescription>
                Vui lòng điền đầy đủ thông tin để chúng tôi giao hàng đến bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
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
                          <Input placeholder="0123456789" {...field} />
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
                          <Input placeholder="example@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tỉnh/Thành phố</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quận/Huyện</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phường/Xã</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ cụ thể</FormLabel>
                        <FormControl>
                          <Input placeholder="Số nhà, tên đường..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phương thức thanh toán</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={field.disabled}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn phương thức thanh toán" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="COD">Thanh toán khi nhận hàng (COD)</SelectItem>
                              <SelectItem value="BANK_TRANSFER">Thanh toán qua VNPay</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? "Đang xử lý..." : "Hoàn tất đặt hàng"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded relative overflow-hidden">
                      <img
                        src={checkImageUrl(item.image)}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.brand}
                        {item.size && ` • Size ${item.size}`}
                      </p>
                      <div className="flex justify-between mt-2">
                        <span>x{item.quantity}</span>
                        <span>{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="flex justify-between w-full">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-muted-foreground">Thuế</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between w-full text-base font-semibold text-maintext pt-2 border-t">
                <span>Tổng cộng</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 