import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getActivePromotions,
  getVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  addCustomerToVoucher,
  removeCustomerFromVoucher,
  searchVouchers,
  createProductPromotion,
  getProductPromotions,
  searchProductPromotions,
  updateProductPromotion,
  deleteProductPromotion
} from "@/api/promotion";

import { 
  IPromotionFilter,
  IPromotionCreate,
  IPromotionUpdate,
  IVoucherFilter,
  IVoucherCreate,
  IVoucherUpdate,
  ICustomerVoucher,
  IProductPromotionFilter,
  IProductPromotionCreate,
  IProductPromotionUpdate
} from "@/interface/request/promotion";

// =================== Khuyến mãi chung ===================
// Hook lấy danh sách khuyến mãi
export const usePromotions = (params: IPromotionFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["promotions", params],
    queryFn: () => getPromotions(params),
    staleTime: 60000 // 1 phút
  });

  return {
    promotionsData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook lấy chi tiết khuyến mãi
export const usePromotionDetail = (promotionId: string | undefined) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["promotion", promotionId],
    queryFn: () => getPromotionById(promotionId as string),
    enabled: !!promotionId,
    staleTime: 60000
  });

  return {
    promotionData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook tạo khuyến mãi mới
export const useCreatePromotion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IPromotionCreate) => createPromotion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    }
  });
};

// Hook cập nhật khuyến mãi
export const useUpdatePromotion = (promotionId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IPromotionUpdate) => updatePromotion(promotionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotion", promotionId] });
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    }
  });
};

// Hook xóa khuyến mãi
export const useDeletePromotion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (promotionId: string) => deletePromotion(promotionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    }
  });
};

// Hook lấy danh sách khuyến mãi đang hoạt động
export const useActivePromotions = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["activePromotions"],
    queryFn: () => getActivePromotions(),
    staleTime: 60000
  });

  return {
    activePromotionsData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// =================== Voucher ===================
// Hook lấy danh sách voucher
export const useVouchers = (params: IVoucherFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["vouchers", params],
    queryFn: () => getVouchers(params),
    staleTime: 60000
  });

  return {
    vouchersData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook lấy chi tiết voucher
export const useVoucherDetail = (voucherId: string | undefined) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["voucher", voucherId],
    queryFn: () => getVoucherById(voucherId as string),
    enabled: !!voucherId,
    staleTime: 60000
  });

  return {
    voucherData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook tạo voucher mới
export const useCreateVoucher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IVoucherCreate) => createVoucher(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    }
  });
};

// Hook cập nhật voucher
export const useUpdateVoucher = (voucherId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IVoucherUpdate) => updateVoucher(voucherId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voucher", voucherId] });
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    }
  });
};

// Hook thêm khách hàng vào voucher
export const useAddCustomerToVoucher = (voucherId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: ICustomerVoucher) => addCustomerToVoucher(voucherId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voucher", voucherId] });
    }
  });
};

// Hook xóa khách hàng khỏi voucher
export const useRemoveCustomerFromVoucher = (voucherId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (customerId: string) => removeCustomerFromVoucher(voucherId, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voucher", voucherId] });
    }
  });
};

// Hook tìm kiếm voucher
export const useSearchVouchers = (params: IVoucherFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["searchVouchers", params],
    queryFn: () => searchVouchers(params),
    staleTime: 60000
  });

  return {
    searchVouchersData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// =================== Khuyến mãi sản phẩm ===================
// Hook tạo khuyến mãi sản phẩm
export const useCreateProductPromotion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IProductPromotionCreate) => createProductPromotion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productPromotions"] });
    }
  });
};

// Hook lấy danh sách khuyến mãi sản phẩm
export const useProductPromotions = (params: IProductPromotionFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["productPromotions", params],
    queryFn: () => getProductPromotions(params),
    staleTime: 60000
  });

  return {
    productPromotionsData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook tìm kiếm khuyến mãi sản phẩm
export const useSearchProductPromotions = (params: IProductPromotionFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["searchProductPromotions", params],
    queryFn: () => searchProductPromotions(params),
    staleTime: 60000
  });

  return {
    searchProductPromotionsData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook cập nhật khuyến mãi sản phẩm
export const useUpdateProductPromotion = (promotionId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IProductPromotionUpdate) => updateProductPromotion(promotionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productPromotions"] });
    }
  });
};

// Hook xóa khuyến mãi sản phẩm
export const useDeleteProductPromotion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (promotionId: string) => deleteProductPromotion(promotionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productPromotions"] });
    }
  });
}; 