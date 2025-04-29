import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from "@/api/cart";

import { 
  ICartItemAdd, 
  ICartItemUpdate 
} from "@/interface/request/cart";

//                                                                                                                     Hook lấy giỏ hàng
export const useCart = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    staleTime: 10000
  });

  return {
    cartData: data,
    isLoading,
    isFetching,
    refetch
  };
};

//                                                                                                                     Hook thêm sản phẩm vào giỏ hàng
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: ICartItemAdd) => addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });
};

//                                                                                                                     Hook cập nhật số lượng sản phẩm trong giỏ hàng
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: ICartItemUpdate }) => 
      updateCartItem(itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });
};

//                                                                                                                     Hook xóa sản phẩm khỏi giỏ hàng
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: string) => removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });
};

//                                                                                                                     Hook xóa toàn bộ giỏ hàng
export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });
}; 