"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from "@mdi/react"
import { mdiPrinter, mdiPencil, mdiArrowLeft, mdiFileDocument, mdiDelete } from "@mdi/js"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Link from "next/link"
import { useOrderDetail, useUpdateOrderStatus, useCancelOrder } from "@/hooks/order"
import { useParams, useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { CheckCircle, Circle } from "lucide-react"

// Order stepper component
interface OrderStep {
  status: string
  label: string
}

const orderSteps: OrderStep[] = [
  { status: "CHO_XAC_NHAN", label: "Chờ xác nhận" },
  { status: "CHO_GIAO_HANG", label: "Chờ giao hàng" },
  { status: "DANG_VAN_CHUYEN", label: "Đang vận chuyển" },
  { status: "DA_GIAO_HANG", label: "Đã giao hàng" },
  { status: "HOAN_THANH", label: "Hoàn thành" },
];

const OrderStepper = ({ currentStatus }: { currentStatus: string }) => {
  const getCurrentStep = () => {
    const index = orderSteps.findIndex(step => step.status === currentStatus);
    if (index === -1) return 0;
    return index;
  };

  const currentStep = getCurrentStep();

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between relative">
          {orderSteps.map((step, index) => (
            <div key={step.label} className="flex flex-col items-center z-10">
              <motion.div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  index <= currentStep 
                    ? 'bg-blue-500/15 text-blue-500 border-2 border-blue-500' 
                    : 'bg-gray-100 text-maintext border-2 border-gray-200'
                }`}
                initial={false}
                animate={{ scale: index === currentStep ? 1.2 : 1 }}
              >
                {index < currentStep ? (
                  <CheckCircle size={24} />
                ) : (
                  <Circle size={20} />
                )}
              </motion.div>
              <div className="mt-2 text-sm font-medium text-center">{step.label}</div>
            </div>
          ))}
          <div className="absolute top-4 left-0 right-0 flex -z-0">
            {orderSteps.map((_, index) => {
              if (index === orderSteps.length - 1) return null;
              return (
                <div 
                  key={`line-${index}`}
                  className={`h-0.5 flex-1 mx-6 ${
                    index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              );
            })}
          </div>
        </div>
        <motion.div
          className="mt-4 h-1.5 rounded-full bg-blue-500"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / (orderSteps.length - 1)) * 100}%` }}
        />
      </CardContent>
    </Card>
  );
};

// Order Status Badge Component
const OrderStatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "CHO_XAC_NHAN":
        return { label: "Chờ xác nhận", className: "!bg-amber-50 !text-amber-500 !border-amber-500" }
      case "CHO_GIAO_HANG":
        return { label: "Chờ giao hàng", className: "!bg-blue-50 !text-blue-500 !border-blue-500" }
      case "DANG_VAN_CHUYEN":
        return { label: "Đang vận chuyển", className: "!bg-orange-50 !text-orange-500 !border-orange-500" }
      case "DA_GIAO_HANG":
        return { label: "Đã giao hàng", className: "!bg-green-50 !text-green-500 !border-green-500" }
      case "HOAN_THANH":
        return { label: "Hoàn thành", className: "!bg-green-50 !text-green-500 !border-green-500" }
      case "DA_HUY":
        return { label: "Đã hủy", className: "!bg-red-50 !text-red-500 !border-red-500" }
      default:
        return { label: "Không xác định", className: "!bg-gray-50 !text-maintext !border-gray-500" }
    }
  }

  const config = getStatusConfig(status)
  return <Badge className={config.className}>{config.label}</Badge>
}

// Payment Status Badge Component
const PaymentStatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Chưa thanh toán", className: "!bg-yellow-50 !text-yellow-500 !border-yellow-500" }
      case "PARTIAL_PAID":
        return { label: "Thanh toán một phần", className: "!bg-blue-50 !text-blue-500 !border-blue-500" }
      case "PAID":
        return { label: "Đã thanh toán", className: "!bg-green-50 !text-green-500 !border-green-500" }
      default:
        return { label: "Không xác định", className: "!bg-gray-50 !text-maintext !border-gray-500" }
    }
  }

  const config = getStatusConfig(status)
  return <Badge className={config.className}>{config.label}</Badge>
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isConfirmCancelDialogOpen, setIsConfirmCancelDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState<string>("");
  const { data: orderDetail, isLoading, isError } = useOrderDetail(orderId);
  const updateOrderStatus = useUpdateOrderStatus();
  const cancelOrder = useCancelOrder();
  const queryClient = useQueryClient();

  const handleStatusUpdate = async () => {
    if (!statusToUpdate) return;

    try {
      await updateOrderStatus.mutateAsync(
        {
          orderId,
          payload: { status: statusToUpdate as any },
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật trạng thái đơn hàng thành công");
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
            setIsStatusDialogOpen(false);
          },
        }
      );
    } catch (error) {
      toast.error("Cập nhật trạng thái đơn hàng thất bại");
    }
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrder.mutateAsync(orderId, {
        onSuccess: () => {
          toast.success("Hủy đơn hàng thành công");
          queryClient.invalidateQueries({ queryKey: ["order", orderId] });
          setIsConfirmCancelDialogOpen(false);
        },
      });
    } catch (error) {
      toast.error("Hủy đơn hàng thất bại");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "CASH":
        return "Tiền mặt";
      case "BANK_TRANSFER":
        return "Chuyển khoản ngân hàng";
      case "COD":
        return "Thanh toán khi nhận hàng";
      case "MIXED":
        return "Thanh toán nhiều phương thức";
      default:
        return "Không xác định";
    }
  };

  if (isLoading) {
    return <div className="p-4 text-white">Đang tải thông tin đơn hàng...</div>;
  }

  if (isError || !orderDetail) {
    return (
      <div className="p-4">
        <div className="text-center py-10">
          <p className="text-red-500">Đã xảy ra lỗi khi tải thông tin đơn hàng hoặc đơn hàng không tồn tại.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/orders")}>
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  const order = orderDetail.data;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/orders")}>
            <Icon path={mdiArrowLeft} size={0.9} />
          </Button>
          <h1 className="text-xl font-semibold">Chi tiết đơn hàng: {order.orderNumber}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsInvoiceDialogOpen(true)}>
            <Icon path={mdiFileDocument} size={0.9} className="mr-2" />
            Xem hóa đơn
          </Button>
          <Link href={`/admin/orders/edit/${orderId}`}>
            <Button variant="outline">
              <Icon path={mdiPencil} size={0.9} className="mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
          <Button variant="outline">
            <Icon path={mdiPrinter} size={0.9} className="mr-2" />
            In đơn
          </Button>
        </div>
      </div>

      {/* Order Progress Stepper */}
      {order.orderStatus !== "DA_HUY" && (
        <OrderStepper currentStatus={order.orderStatus} />
      )}

      {/* Order Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Order Information */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-maintext">Mã đơn hàng:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-maintext">Ngày tạo:</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-maintext">Trạng thái đơn hàng:</span>
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-maintext">Trạng thái thanh toán:</span>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-maintext">Phương thức thanh toán:</span>
                  <span>{getPaymentMethodName(order.paymentMethod)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Thông tin khách hàng</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-maintext">Tên khách hàng:</span>
                  <span className="font-medium">{order.customer?.fullName}</span>
                </div>
                {order.customer?.email && (
                  <div className="flex justify-between items-center">
                    <span className="text-maintext">Email:</span>
                    <span>{order.customer.email}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-maintext">Số điện thoại:</span>
                  <span>{order.customer?.phoneNumber}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Địa chỉ giao hàng</h2>
              {order.shippingAddress ? (
                <div className="space-y-2">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.phoneNumber}</p>
                  <p>
                    {order.shippingAddress.specificAddress}, {order.shippingAddress.wardName},{" "}
                    {order.shippingAddress.districtName}, {order.shippingAddress.provinceName}
                  </p>
                </div>
              ) : (
                <p className="text-maintext">Không có thông tin địa chỉ giao hàng</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Order Items */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Sản phẩm đã đặt</h2>
              <div className="border rounded-[6px] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">SL</TableHead>
                      <TableHead className="text-right">Tổng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.product && item.product.imageUrl && (
                              <div className="w-10 h-10 rounded border overflow-hidden bg-gray-100">
                                <img
                                  src={item.product.imageUrl || "/placeholder.svg"}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-sm">{item.product?.name}</div>
                              <div className="text-xs text-maintext">
                                {item.variant?.colorName &&
                                  item.variant?.sizeName &&
                                  `${item.variant.colorName} / ${item.variant.sizeName}`}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Tổng quan đơn hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-maintext">Tổng tiền hàng:</span>
                  <span>{formatCurrency(order.subTotal)}</span>
                </div>
                {order.voucher && (
                  <div className="flex justify-between items-center">
                    <span className="text-maintext">
                      Mã giảm giá ({order.voucher.code}):
                    </span>
                    <span className="text-red-500">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-medium">Tổng thanh toán:</span>
                  <span className="text-lg font-bold">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Thao tác</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="w-full"
                  disabled={["DA_HUY", "HOAN_THANH"].includes(order.orderStatus)}
                  onClick={() => {
                    setStatusToUpdate(order.orderStatus);
                    setIsStatusDialogOpen(true);
                  }}
                >
                  Cập nhật trạng thái
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={["DA_HUY", "HOAN_THANH"].includes(order.orderStatus)}
                  onClick={() => setIsConfirmCancelDialogOpen(true)}
                >
                  <Icon path={mdiDelete} size={0.8} className="mr-2" />
                  Hủy đơn hàng
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={statusToUpdate} onValueChange={setStatusToUpdate}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CHO_XAC_NHAN">Chờ xác nhận</SelectItem>
                <SelectItem value="CHO_GIAO_HANG">Chờ giao hàng</SelectItem>
                <SelectItem value="DANG_VAN_CHUYEN">Đang vận chuyển</SelectItem>
                <SelectItem value="DA_GIAO_HANG">Đã giao hàng</SelectItem>
                <SelectItem value="HOAN_THANH">Hoàn thành</SelectItem>
                <SelectItem value="DA_HUY">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleStatusUpdate}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Cancel Dialog */}
      <Dialog open={isConfirmCancelDialogOpen} onOpenChange={setIsConfirmCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmCancelDialogOpen(false)}>
              Không
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder}>
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hóa đơn đơn hàng #{order.orderNumber}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl mb-2">STREET SNEAKER</h3>
                  <p className="text-sm text-maintext">Hóa đơn bán hàng</p>
                  <p className="text-sm text-maintext">Ngày: {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-xl mb-2">Mã hóa đơn: #{order.orderNumber}</h3>
                  <p className="text-sm text-maintext">
                    <OrderStatusBadge status={order.orderStatus} />
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Thông tin khách hàng:</h3>
                <p>{order.customer?.fullName}</p>
                <p>{order.customer?.phoneNumber}</p>
                {order.customer?.email && <p>{order.customer.email}</p>}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Địa chỉ giao hàng:</h3>
                {order.shippingAddress ? (
                  <>
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.phoneNumber}</p>
                    <p>
                      {order.shippingAddress.specificAddress}, {order.shippingAddress.wardName},{" "}
                      {order.shippingAddress.districtName}, {order.shippingAddress.provinceName}
                    </p>
                  </>
                ) : (
                  <p>Không có thông tin địa chỉ giao hàng</p>
                )}
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-right">Đơn giá</TableHead>
                  <TableHead className="text-right">Số lượng</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.product?.name}</div>
                        <div className="text-sm text-maintext">
                          {item.variant?.colorName &&
                            item.variant?.sizeName &&
                            `${item.variant.colorName} / ${item.variant.sizeName}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>Tổng tiền hàng:</span>
                <span>{formatCurrency(order.subTotal)}</span>
              </div>
              {order.voucher && (
                <div className="flex justify-between">
                  <span>Giảm giá ({order.voucher.code}):</span>
                  <span className="text-red-500">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t font-bold">
                <span>Tổng thanh toán:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phương thức thanh toán:</span>
                <span>{getPaymentMethodName(order.paymentMethod)}</span>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-maintext">
              <p>Cảm ơn quý khách đã mua hàng tại STREET SNEAKER</p>
              <p>Hotline: 1900 1234</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>
              Đóng
            </Button>
            <Button>
              <Icon path={mdiPrinter} size={0.8} className="mr-2" />
              In hóa đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 