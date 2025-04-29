import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  updateShippingInfo, 
  updateOrderItems 
} from "@/api/order";

import { 
  IOrderFilter, 
  IOrderStatusUpdate, 
  IShippingInfoUpdate, 
  IOrderItemsUpdate 
} from "@/interface/request/order";

// Hook lấy danh sách đơn hàng
export const useOrders = (params: IOrderFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    staleTime: 30000 // 30 giây
  });

  return {
    ordersData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook lấy chi tiết đơn hàng
export const useOrderDetail = (orderId: string | undefined) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId as string),
    enabled: !!orderId,
    staleTime: 30000
  });

  return {
    orderData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook cập nhật trạng thái đơn hàng
export const useUpdateOrderStatus = (orderId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IOrderStatusUpdate) => updateOrderStatus(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });
};

// Hook cập nhật thông tin vận chuyển
export const useUpdateShippingInfo = (orderId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IShippingInfoUpdate) => updateShippingInfo(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    }
  });
};

// Hook cập nhật sản phẩm trong đơn hàng
export const useUpdateOrderItems = (orderId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IOrderItemsUpdate) => updateOrderItems(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    }
  });
}; 