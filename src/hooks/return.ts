import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getAllReturns,
  getReturnById,
  createReturn,
  updateReturn,
  updateReturnStatus,
  deleteReturn,
  searchReturn,
  getReturnStats
} from "@/api/return";
import {
  IReturnFilter,
  IReturnCreate,
  IReturnUpdate,
  IReturnStatusUpdate,
  IReturnSearchParams,
  IReturnStatsParams
} from "@/interface/request/return";
import {
  IReturnsResponse,
  IReturnResponse,
  IReturnSearchResponse,
  IReturnStatsResponse,
  IActionResponse
} from "@/interface/response/return";

// === Admin Return Hooks ===

export const useReturns = (params: IReturnFilter = {}): UseQueryResult<IReturnsResponse, Error> => {
  return useQuery<IReturnsResponse, Error>({
    queryKey: ["returns", params],
    queryFn: () => getAllReturns(params),
  });
};

export const useReturnDetail = (returnId: string): UseQueryResult<IReturnResponse, Error> => {
  return useQuery<IReturnResponse, Error>({
    queryKey: ["return", returnId],
    queryFn: () => getReturnById(returnId),
    enabled: !!returnId, // Chỉ fetch khi có returnId
  });
};

export const useCreateReturn = (): UseMutationResult<IReturnResponse, Error, IReturnCreate> => {
  return useMutation<IReturnResponse, Error, IReturnCreate>({
    mutationFn: (payload) => createReturn(payload),
  });
};

export const useUpdateReturn = (): UseMutationResult<
  IReturnResponse,
  Error,
  { returnId: string; payload: IReturnUpdate }
> => {
  return useMutation<IReturnResponse, Error, { returnId: string; payload: IReturnUpdate }>({
    mutationFn: ({ returnId, payload }) => updateReturn(returnId, payload),
  });
};

export const useUpdateReturnStatus = (): UseMutationResult<
  IReturnResponse,
  Error,
  { returnId: string; payload: IReturnStatusUpdate }
> => {
  return useMutation<IReturnResponse, Error, { returnId: string; payload: IReturnStatusUpdate }>({
    mutationFn: ({ returnId, payload }) => updateReturnStatus(returnId, payload),
  });
};

export const useDeleteReturn = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (returnId) => deleteReturn(returnId),
  });
};

export const useSearchReturn = (params: IReturnSearchParams): UseQueryResult<IReturnSearchResponse, Error> => {
  return useQuery<IReturnSearchResponse, Error>({
    queryKey: ["returnSearch", params],
    queryFn: () => searchReturn(params),
    enabled: !!params.query, // Chỉ fetch khi có query
  });
};

export const useReturnStats = (params: IReturnStatsParams = {}): UseQueryResult<IReturnStatsResponse, Error> => {
  return useQuery<IReturnStatsResponse, Error>({
    queryKey: ["returnStats", params],
    queryFn: () => getReturnStats(params),
  });
}; 