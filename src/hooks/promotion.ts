import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getProductPromotions,
} from "@/api/promotion";
import {
  IPromotionFilter,
  IPromotionCreate,
  IPromotionUpdate
} from "@/interface/request/promotion";
import {
  IPromotionsResponse,
  IPromotionResponse,
  IProductPromotionsResponse,
  IActionResponse
} from "@/interface/response/promotion";

export const usePromotions = (params: IPromotionFilter = {}): UseQueryResult<IPromotionsResponse, Error> => {
  return useQuery<IPromotionsResponse, Error>({
    queryKey: ["promotions", params],
    queryFn: () => getAllPromotions(params),
  });
};

export const usePromotionDetail = (promotionId: string): UseQueryResult<IPromotionResponse, Error> => {
  return useQuery<IPromotionResponse, Error>({
    queryKey: ["promotion", promotionId],
    queryFn: () => getPromotionById(promotionId),
    enabled: !!promotionId, // Chỉ fetch khi có promotionId
  });
};

export const useCreatePromotion = (): UseMutationResult<IPromotionResponse, Error, IPromotionCreate> => {
  return useMutation<IPromotionResponse, Error, IPromotionCreate>({
    mutationFn: (payload) => createPromotion(payload),
  });
};

export const useUpdatePromotion = (): UseMutationResult<
  IPromotionResponse,
  Error,
  { promotionId: string; payload: IPromotionUpdate }
> => {
  return useMutation<IPromotionResponse, Error, { promotionId: string; payload: IPromotionUpdate }>({
    mutationFn: ({ promotionId, payload }) => updatePromotion(promotionId, payload),
  });
};

export const useDeletePromotion = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (promotionId) => deletePromotion(promotionId),
  });
};

export const useProductPromotions = (productId: string): UseQueryResult<IProductPromotionsResponse, Error> => {
  return useQuery<IProductPromotionsResponse, Error>({
    queryKey: ["productPromotions", productId],
    queryFn: () => getProductPromotions(productId),
    enabled: !!productId, // Chỉ fetch khi có productId
  });
};

