import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  addOrderItem,
  updateOrderItem,
  removeOrderItem,
  processPayment,
  completeOrder,
  scanProductQRCode,
  printReceipt
} from "@/api/pos";

import { 
  IPOSOrderFilter, 
  IPOSOrderCreate, 
  IPOSOrderUpdate, 
  IPOSOrderItemCreate, 
  IPOSOrderItemUpdate, 
  IPOSPayment, 
  IPOSScanQR 
} from "@/interface/request/pos";

import { 
  IPOSOrderResponse, 
  IPOSOrdersResponse, 
  IPOSReceiptResponse, 
  IPOSQRProductResponse 
} from "@/interface/response/pos";

import {
  type UseMutationResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

// Hooks lấy danh sách đơn hàng POS
export const usePOSOrders = (params: IPOSOrderFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["posOrders", params],
    queryFn: () => getOrders(params),
  });

  return {
    ordersData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook lấy chi tiết đơn hàng POS
export const usePOSOrderDetail = (orderId: string) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["posOrder", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });

  return {
    orderData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook tạo đơn hàng POS mới
export const useCreatePOSOrder = (): UseMutationResult<
  IPOSOrderResponse,
  Error,
  IPOSOrderCreate
> => {
  return useMutation<IPOSOrderResponse, Error, IPOSOrderCreate>({
    mutationFn: (params: IPOSOrderCreate) => createOrder(params),
  });
};

// Hook cập nhật đơn hàng POS
export const useUpdatePOSOrder = (): UseMutationResult<
  IPOSOrderResponse,
  Error,
  { orderId: string; payload: IPOSOrderUpdate }
> => {
  return useMutation<IPOSOrderResponse, Error, { orderId: string; payload: IPOSOrderUpdate }>({
    mutationFn: ({ orderId, payload }) => updateOrder(orderId, payload),
  });
};

// Hook xóa đơn hàng POS
export const useDeletePOSOrder = (): UseMutationResult<any, Error, string> => {
  return useMutation<any, Error, string>({
    mutationFn: (orderId: string) => deleteOrder(orderId),
  });
};

// Hook thêm sản phẩm vào đơn hàng POS
export const useAddPOSOrderItem = (): UseMutationResult<
  IPOSOrderResponse,
  Error,
  { orderId: string; payload: IPOSOrderItemCreate }
> => {
  return useMutation<IPOSOrderResponse, Error, { orderId: string; payload: IPOSOrderItemCreate }>({
    mutationFn: ({ orderId, payload }) => addOrderItem(orderId, payload),
  });
};

// Hook cập nhật sản phẩm trong đơn hàng POS
export const useUpdatePOSOrderItem = (): UseMutationResult<
  IPOSOrderResponse,
  Error,
  { orderId: string; itemId: string; payload: IPOSOrderItemUpdate }
> => {
  return useMutation<IPOSOrderResponse, Error, { orderId: string; itemId: string; payload: IPOSOrderItemUpdate }>({
    mutationFn: ({ orderId, itemId, payload }) => updateOrderItem(orderId, itemId, payload),
  });
};

// Hook xóa sản phẩm khỏi đơn hàng POS
export const useRemovePOSOrderItem = (): UseMutationResult<
  IPOSOrderResponse,
  Error,
  { orderId: string; itemId: string }
> => {
  return useMutation<IPOSOrderResponse, Error, { orderId: string; itemId: string }>({
    mutationFn: ({ orderId, itemId }) => removeOrderItem(orderId, itemId),
  });
};

// Hook xử lý thanh toán cho đơn hàng POS
export const useProcessPOSPayment = (): UseMutationResult<
  IPOSOrderResponse,
  Error,
  { orderId: string; payload: IPOSPayment }
> => {
  return useMutation<IPOSOrderResponse, Error, { orderId: string; payload: IPOSPayment }>({
    mutationFn: ({ orderId, payload }) => processPayment(orderId, payload),
  });
};

// Hook hoàn thành đơn hàng POS
export const useCompletePOSOrder = (): UseMutationResult<
  IPOSOrderResponse,
  Error,
  string
> => {
  return useMutation<IPOSOrderResponse, Error, string>({
    mutationFn: (orderId: string) => completeOrder(orderId),
  });
};

// Hook quét mã QR sản phẩm
export const useScanPOSQRCode = (): UseMutationResult<
  IPOSQRProductResponse,
  Error,
  IPOSScanQR
> => {
  return useMutation<IPOSQRProductResponse, Error, IPOSScanQR>({
    mutationFn: (params: IPOSScanQR) => scanProductQRCode(params),
  });
};

// Hook in hóa đơn
export const usePrintPOSReceipt = (): UseMutationResult<
  IPOSReceiptResponse,
  Error,
  string
> => {
  return useMutation<IPOSReceiptResponse, Error, string>({
    mutationFn: (orderId: string) => printReceipt(orderId),
  });
}; 