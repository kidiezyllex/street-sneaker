"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from "@mdi/react"
import { mdiPrinter, mdiPencil, mdiArrowLeft, mdiFileDocument, mdiDelete, mdiFileSign, mdiPackageVariantClosedPlus, mdiTruckDeliveryOutline, mdiMapMarkerCheckOutline, mdiCheckDecagramOutline } from "@mdi/js"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useOrderDetail, useUpdateOrderStatus, useCancelOrder } from "@/hooks/order"
import { useParams, useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { CheckCircle, Circle } from "lucide-react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderStep {
    status: string;
    label: string;
    icon: string; // MDI path
    colors: {
        bgClass: string;
        textClass: string;
        borderClass: string;
        progressFillClass: string;
    };
}

const orderSteps: OrderStep[] = [
    {
        status: "CHO_XAC_NHAN", label: "Chờ xác nhận", icon: mdiFileSign,
        colors: { bgClass: 'bg-amber-100 dark:bg-amber-800/30', textClass: 'text-amber-600 dark:text-amber-400', borderClass: 'border-amber-500 dark:border-amber-500', progressFillClass: 'bg-amber-500' }
    },
    {
        status: "CHO_GIAO_HANG", label: "Chờ lấy hàng", icon: mdiPackageVariantClosedPlus,
        colors: { bgClass: 'bg-blue-100 dark:bg-blue-800/30', textClass: 'text-blue-600 dark:text-blue-400', borderClass: 'border-blue-500 dark:border-blue-500', progressFillClass: 'bg-blue-500' }
    },
    {
        status: "DANG_VAN_CHUYEN", label: "Đang giao hàng", icon: mdiTruckDeliveryOutline,
        colors: { bgClass: 'bg-orange-100 dark:bg-orange-800/30', textClass: 'text-orange-600 dark:text-orange-400', borderClass: 'border-orange-500 dark:border-orange-500', progressFillClass: 'bg-orange-500' }
    },
    {
        status: "DA_GIAO_HANG", label: "Đã giao hàng", icon: mdiMapMarkerCheckOutline,
        colors: { bgClass: 'bg-teal-100 dark:bg-teal-800/30', textClass: 'text-teal-600 dark:text-teal-400', borderClass: 'border-teal-500 dark:border-teal-500', progressFillClass: 'bg-teal-500' }
    },
    {
        status: "HOAN_THANH", label: "Hoàn thành", icon: mdiCheckDecagramOutline,
        colors: { bgClass: 'bg-green-100 dark:bg-green-800/30', textClass: 'text-primary dark:text-green-400', borderClass: 'border-green-500 dark:border-green-500', progressFillClass: 'bg-green-500' }
    },
];

const OrderStepper = ({ currentStatus }: { currentStatus: string }) => {
    const getCurrentStep = () => {
        const index = orderSteps.findIndex(step => step.status === currentStatus);
        if (index === -1 && currentStatus === "DA_HUY") return -1;
        if (index === -1) return 0;
        return index;
    };
    const currentStepIdx = getCurrentStep();
    return (
        <Card className="mb-4 overflow-hidden">
            <CardContent className="p-4">
                <div className="flex justify-between items-start relative">
                    {orderSteps.map((step, index) => {
                        const isCompleted = index < currentStepIdx;
                        const isCurrent = index === currentStepIdx;
                        const isActive = index <= currentStepIdx;

                        let circleClasses = 'bg-gray-100 dark:bg-gray-700 text-maintext dark:text-maintext border-gray-300 dark:border-gray-600';
                        let iconToShow;
                        let labelClasses = 'text-maintext dark:text-maintext font-medium';

                        if (isActive) {
                            circleClasses = `${step.colors.bgClass} ${step.colors.textClass} ${step.colors.borderClass} border-2 shadow-sm`;
                            labelClasses = `${step.colors.textClass} font-semibold`;
                            if (isCompleted) {
                                iconToShow = <CheckCircle size={28} className={step.colors.textClass} />;
                            } else {
                                iconToShow = <Icon path={step.icon} size={1} className={step.colors.textClass} />;
                            }
                        } else {
                            iconToShow = <Icon path={step.icon} size={1} className="text-maintext/50 dark:text-maintext" />;
                        }

                        return (
                            <div key={step.status} className="flex flex-col items-center z-10 flex-1 min-w-0 px-1">
                                <motion.div
                                    className={`flex h-14 w-14 items-center justify-center rounded-full ${circleClasses}`}
                                    initial={false}
                                    animate={{ scale: isCurrent ? 1.15 : 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                >
                                    {iconToShow}
                                </motion.div>
                                <div className={`mt-2.5 text-xs sm:text-sm text-center text-nowrap ${labelClasses} w-full sm:w-24 break-words leading-tight`}>
                                    {step.label}
                                </div>
                            </div>
                        );
                    })}
                    {/* Progress lines container */}
                    <div className="absolute top-7 left-0 right-0 flex items-center -z-0 px-4 sm:px-8 md:px-12">
                        {orderSteps.map((step, index) => {
                            if (index === orderSteps.length - 1) return null;
                            const lineProgressClass = index < currentStepIdx ? orderSteps[index].colors.progressFillClass : 'bg-gray-300 dark:bg-gray-600';
                            return (
                                <div
                                    key={`line-${index}`}
                                    className={`h-1 flex-1 ${lineProgressClass}`}
                                    style={{ margin: '0 2px' }}
                                />
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

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

const PaymentStatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "PENDING":
                return { label: "Chưa thanh toán", className: "!bg-amber-50 !text-amber-500 !border-amber-500" }
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
    const [paymentStatusToUpdate, setPaymentStatusToUpdate] = useState<string>("");
    const { data: orderDetail, isLoading, isError } = useOrderDetail(orderId);
    const updateOrderStatus = useUpdateOrderStatus();
    const cancelOrder = useCancelOrder();
    const queryClient = useQueryClient();

    // Helper function to get available order statuses based on current status
    const getAvailableOrderStatuses = (currentStatus: string) => {
        const statusOrder = ["CHO_XAC_NHAN", "CHO_GIAO_HANG", "DANG_VAN_CHUYEN", "DA_GIAO_HANG", "HOAN_THANH"];
        const currentIndex = statusOrder.indexOf(currentStatus);

        if (currentIndex === -1) return statusOrder; // If status not found, show all

        // Return statuses from current position onwards
        return statusOrder.slice(currentIndex);
    };

    const handleStatusUpdate = async () => {
        if (!statusToUpdate) return;

        // Validation: Check if trying to complete order with pending payment
        if (statusToUpdate === "HOAN_THANH" && paymentStatusToUpdate === "PENDING") {
            toast.error("Không thể hoàn thành đơn hàng khi chưa thanh toán");
            return;
        }

        try {
            const payload: any = { status: statusToUpdate };
            if (paymentStatusToUpdate) {
                payload.paymentStatus = paymentStatusToUpdate;
            }

            await updateOrderStatus.mutateAsync(
                {
                    orderId,
                    payload,
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
        return (
            <div className="space-y-4">
                {/* Header skeleton */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="mb-0 md:mb-0">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/orders">Quản lý đơn hàng</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="font-medium">Chi tiết đơn hàng #{orderId}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex space-x-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                </div>

                {/* Order stepper skeleton */}
                <Card className="mb-4 overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start relative">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="flex flex-col items-center z-10 flex-1 min-w-0 px-1">
                                    <Skeleton className="h-14 w-14 rounded-full" />
                                    <Skeleton className="h-4 w-16 mt-2.5" />
                                </div>
                            ))}
                        </div>
                        <Skeleton className="mt-6 h-2 w-full rounded-full" />
                    </CardContent>
                </Card>

                {/* Main content skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Order info card skeleton */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin đơn hàng</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer info card skeleton */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin khách hàng</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <Skeleton className="h-4 w-28" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping address card skeleton */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Địa chỉ giao hàng</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Products card skeleton */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sản phẩm đã đặt</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
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
                                        {[...Array(3)].map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Skeleton className="w-10 h-10 rounded" />
                                                        <div>
                                                            <Skeleton className="h-4 w-32 mb-1" />
                                                            <Skeleton className="h-3 w-20" />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Skeleton className="h-4 w-16 ml-auto" />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Skeleton className="h-4 w-8 ml-auto" />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Skeleton className="h-4 w-20 ml-auto" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Order summary card skeleton */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tổng quan đơn hàng</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    {[...Array(2)].map((_, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center pt-3 border-t">
                                        <Skeleton className="h-5 w-36" />
                                        <Skeleton className="h-6 w-28" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
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
        <div className="space-y-4 text-maintext">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="mb-0 md:mb-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin/orders">Quản lý đơn hàng</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="font-medium">Chi tiết đơn hàng #{orderId}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setIsInvoiceDialogOpen(true)}>
                        <Icon path={mdiFileDocument} size={0.7} />
                        Xem hóa đơn
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        disabled={["DA_HUY", "HOAN_THANH"].includes(order.orderStatus)}
                        onClick={() => setIsConfirmCancelDialogOpen(true)}
                    >
                        <Icon path={mdiDelete} size={0.7} />
                        Hủy đơn hàng
                    </Button>
                    <Button
                        className="w-full"
                        disabled={["DA_HUY", "HOAN_THANH"].includes(order.orderStatus)}
                        onClick={() => {
                            setStatusToUpdate(order.orderStatus);
                            setPaymentStatusToUpdate(order.paymentStatus);
                            setIsStatusDialogOpen(true);
                        }}
                    >
                        Cập nhật trạng thái
                    </Button>
                </div>
            </div>
            {order.orderStatus !== "DA_HUY" && (
                <OrderStepper currentStatus={order.orderStatus} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin đơn hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-maintext">Mã đơn hàng:</span>
                                    <span className="font-medium text-maintext">{(order as any).code}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-maintext">Ngày tạo:</span>
                                    <span className="text-maintext">{formatDate(order.createdAt)}</span>
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
                                    <span className="text-maintext">{getPaymentMethodName(order.paymentMethod)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {typeof order.customer === 'object' ? (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-maintext">Tên khách hàng:</span>
                                            <span className="font-medium text-maintext">{order.customer?.fullName}</span>
                                        </div>
                                        {order.customer?.email && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-maintext">Email:</span>
                                                <span className="text-maintext">{order.customer.email}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span className="text-maintext">Số điện thoại:</span>
                                            <span className="text-maintext">{order.customer?.phoneNumber}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <span className="text-maintext">Tên khách hàng:</span>
                                        <span className="font-medium text-maintext">{order.customer}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Staff Information (Optional) */}
                    {(order as any).staff && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin nhân viên</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-maintext">Tên nhân viên:</span>
                                        <span className="font-medium text-maintext">{(order as any).staff.fullName}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Địa chỉ giao hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {order.shippingAddress ? (
                                <div className="space-y-2">
                                    {order.shippingAddress.specificAddress === "Tại quầy" ? (
                                        <p className="text-maintext">Tại quầy</p>
                                    ) : (
                                        <>
                                            {order.shippingAddress.name && <p className="text-maintext">Người nhận: {order.shippingAddress.name}</p>}
                                            {order.shippingAddress.phoneNumber && <p className="text-maintext">Số điện thoại: {order.shippingAddress.phoneNumber}</p>}
                                            <p className="text-maintext">
                                                Địa chỉ:{' '}
                                                {order.shippingAddress.specificAddress && `${order.shippingAddress.specificAddress}`}
                                            </p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <p className="text-maintext">Không có thông tin địa chỉ giao hàng</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sản phẩm đã đặt</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
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
                                    {order.items.map((item: any, index: number) => {
                                        // Find the matching variant from the product variants
                                        const matchingVariant = item.product?.variants?.find((v: any) => 
                                            v.colorId === item.variant?.colorId && v.sizeId === item.variant?.sizeId
                                        );
                                        
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="flex items- flex-col gap-2">
                                                        {matchingVariant?.images?.[0] && (
                                                            <div className="w-40 h-40 rounded border overflow-hidden bg-gray-100 flex-shrink-0">
                                                                <img
                                                                    draggable={false}
                                                                    src={matchingVariant.images[0]}
                                                                    alt={item.product?.name || "Sản phẩm"}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-semibold text-sm text-maintext/70 line-clamp-2">
                                                                {item.product?.name || "Sản phẩm không rõ"}
                                                            </div>
                                                            {item.product?.brand && (
                                                                <div className="text-sm text-maintext/70 mt-0.5">
                                                                    Thương hiệu: {item.product.brand.name}
                                                                </div>
                                                            )}
                                                            <div className="text-sm text-maintext/70 mt-0.5">
                                                                Mã: {item.product?.code || "N/A"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right font-medium">{formatCurrency(item.price * item.quantity)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tổng quan đơn hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-maintext">Tổng tiền hàng:</span>
                                    <span className="text-maintext">{formatCurrency(order.subTotal)}</span>
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
                                    <span className="font-bold text-maintext">Tổng thanh toán:</span>
                                    <span className="text-lg font-bold text-primary">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>

            {/* Status Update Dialog */}
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật trạng thái</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold mb-2 block">Trạng thái đơn hàng</label>
                            <Select value={statusToUpdate} onValueChange={setStatusToUpdate}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái đơn hàng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getAvailableOrderStatuses(order.orderStatus).map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status === "CHO_XAC_NHAN" && "Chờ xác nhận"}
                                            {status === "CHO_GIAO_HANG" && "Chờ giao hàng"}
                                            {status === "DANG_VAN_CHUYEN" && "Đang vận chuyển"}
                                            {status === "DA_GIAO_HANG" && "Đã giao hàng"}
                                            {status === "HOAN_THANH" && "Hoàn thành"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-bold mb-2 block">Trạng thái thanh toán</label>
                            <Select value={paymentStatusToUpdate} onValueChange={setPaymentStatusToUpdate}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái thanh toán" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Chưa thanh toán</SelectItem>
                                    <SelectItem value="PAID">Đã thanh toán</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <h3 className="font-semibold mb-2">Thông tin khách hàng:</h3>
                                {typeof order.customer === 'object' ? (
                                    <>
                                        <p>{order.customer?.fullName}</p>
                                        <p>{order.customer?.phoneNumber}</p>
                                        {order.customer?.email && <p>{order.customer.email}</p>}
                                    </>
                                ) : (
                                    <p>{order.customer}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Địa chỉ giao hàng:</h3>
                                {order.shippingAddress ? (
                                    <>
                                        {order.shippingAddress.specificAddress === "Tại quầy" ? (
                                            <p>Tại quầy</p>
                                        ) : (
                                            <>
                                                {order.shippingAddress.name && <p>Người nhận: {order.shippingAddress.name}</p>}
                                                {order.shippingAddress.phoneNumber && <p>Số điện thoại: {order.shippingAddress.phoneNumber}</p>}
                                                <p>
                                                    Địa chỉ:
                                                    {order.shippingAddress.specificAddress}
                                                </p>
                                            </>
                                        )}
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
                                {order.items.map((item: any, index: number) => {
                                    // Find the matching variant from the product variants
                                    const matchingVariant = item.product?.variants?.find((v: any) => 
                                        v.colorId === item.variant?.colorId && v.sizeId === item.variant?.sizeId
                                    );
                                    
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {matchingVariant?.images?.[0] && (
                                                        <div className="w-10 h-10 rounded border overflow-hidden bg-gray-100 flex-shrink-0">
                                                            <img
                                                                src={matchingVariant.images[0]}
                                                                alt={item.product?.name || "Sản phẩm"}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-medium text-sm">
                                                            {item.product?.name || "Sản phẩm không rõ"}
                                                        </div>
                                                        {item.product?.brand && (
                                                            <div className="text-xs text-maintext/70 mt-0.5">
                                                                {item.product.brand.name}
                                                            </div>
                                                        )}
                                                        <div className="text-xs text-maintext/70 mt-0.5">
                                                            Mã: {item.product?.code || "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                                        </TableRow>
                                    );
                                })}
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
                            <Icon path={mdiPrinter} size={0.7} className="mr-2" />
                            In hóa đơn
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 