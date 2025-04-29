import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getHomeData,
  getNewProducts,
  getPopularProducts,
  getProducts,
  getProductDetails,
  searchProducts,
  filterProducts,
  checkout,
  getPaymentMethods,
  getOrders,
  getOrderDetails,
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from "@/api/client";

import { 
  IClientFilter,
  ICheckoutPayload,
  IAddressCreate,
  IAddressUpdate,
  IProfileUpdate
} from "@/interface/request/client";

//                                                                                                                     Hook trang chủ
export const useHomeData = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["homeData"],
    queryFn: () => getHomeData(),
    staleTime: 60000 //                                                                                                                     1 phút
  });

  return {
    homeData: data,
    isLoading,
    isFetching,
    refetch
  };
};

//                                                                                                                     Hook sản phẩm mới
export const useNewProducts = (page: number = 1, limit: number = 12) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["newProducts", page, limit],
    queryFn: () => getNewProducts(page, limit),
    staleTime: 60000
  });

  return {
    newProductsData: data,
    isLoading,
    isFetching,
    refetch
  };
};

//                                                                                                                     Hook sản phẩm phổ biến
export const usePopularProducts = (page: number = 1, limit: number = 12) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["popularProducts", page, limit],
    queryFn: () => getPopularProducts(page, limit),
    staleTime: 60000
  });

  return {
    popularProductsData: data,
    isLoading,
    isFetching,
    refetch
  };
};

//                                                                                                                     Hook danh sách sản phẩm
export const useProducts = (params: IClientFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    staleTime: 60000
  });

  return {
    productsData: data,
    isLoading,
    isFetching,
    refetch
  };
};

//                                                                                                                     Hook chi tiết sản phẩm
export const useProductDetails = (productId: string) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["productDetail", productId],
    queryFn: () => getProductDetails(productId),
    enabled: !!productId,
    staleTime: 60000
  });

  return {
    productData: data,
    isLoading,
    isFetching,
    refetch
  };
};

//                                                                                                                     Hook tìm kiếm sản phẩm
export const useSearchProducts = (query: string, page: number = 1, limit: number = 12) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["searchProducts", query, page, limit],
    queryFn: () => searchProducts(query, page, limit),
    enabled: !!query,
    staleTime: 60000
  });

  return {
    searchData: data,
    isLoading,
    isFetching,
    refetch
  };
};

//                                                                                                                     Hook lọc sản phẩm
export const useFilterProducts = (params: IClientFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["filterProducts", params],
    queryFn: () => filterProducts(params),
    staleTime: 60000
  });

  return {
    filteredData: data,
    isLoading,
    isFetching,
    refetch
  };
};

//                                                                                                                     Hook thanh toán
export const useCheckout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: ICheckoutPayload) => checkout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });
};

//                                                                                                                     Hook phương thức thanh toán
export const usePaymentMethods = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: () => getPaymentMethods(),
    staleTime: 3600000 //                                                                                                                     1 giờ
  });

  return {
    paymentMethodsData: data,
    isLoading,
    isFetching,
    refetch
  };
};

//                                                                                                                     Hook danh sách đơn hàng
export const useOrders = (page: number = 1, limit: number = 10, status?: string) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["orders", page, limit, status],
    queryFn: () => getOrders(page, limit, status),
    staleTime: 30000 //                                                                                                                     30 giây
  });

  return {
    ordersData: data,
    isLoading,
    isFetching,
    refetch
  };
};

//                                                                                                                     Hook chi tiết đơn hàng
export const useOrderDetails = (orderId: string) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: () => getOrderDetails(orderId),
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

//                                                                                                                     Hook hồ sơ khách hàng
export const useProfile = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    staleTime: 60000
  });

  return {
    profileData: data,
    isLoading,
    isFetching,
    refetch
  };
};

//                                                                                                                     Hook cập nhật hồ sơ
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IProfileUpdate) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });
};

//                                                                                                                     Hook danh sách địa chỉ
export const useAddresses = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => getAddresses(),
    staleTime: 60000
  });

  return {
    addressesData: data,
    isLoading,
    isFetching,
    refetch
  };
};

//                                                                                                                     Hook thêm địa chỉ
export const useAddAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IAddressCreate) => addAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });
};

//                                                                                                                     Hook cập nhật địa chỉ
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ addressId, payload }: { addressId: string; payload: IAddressUpdate }) => 
      updateAddress(addressId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });
};

//                                                                                                                     Hook xóa địa chỉ
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (addressId: string) => deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });
}; 