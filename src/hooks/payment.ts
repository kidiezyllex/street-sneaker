import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  deletePayment,
  getPaymentsByOrderId
} from "@/api/payment";
import {
  IPaymentFilter,
  IPaymentCreate,
  IPaymentStatusUpdate
} from "@/interface/request/payment";
import {
  IPaymentsResponse,
  IPaymentResponse,
  IActionResponse
} from "@/interface/response/payment";

// === Admin/Staff Payment Hooks ===

export const usePayments = (params: IPaymentFilter = {}): UseQueryResult<IPaymentsResponse, Error> => {
  return useQuery<IPaymentsResponse, Error>({
    queryKey: ["payments", params],
    queryFn: () => getAllPayments(params),
  });
};

export const usePaymentDetail = (paymentId: string): UseQueryResult<IPaymentResponse, Error> => {
  return useQuery<IPaymentResponse, Error>({
    queryKey: ["payment", paymentId],
    queryFn: () => getPaymentById(paymentId),
    enabled: !!paymentId, // Chỉ fetch khi có paymentId
  });
};

export const useCreatePayment = (): UseMutationResult<IPaymentResponse, Error, IPaymentCreate> => {
  return useMutation<IPaymentResponse, Error, IPaymentCreate>({
    mutationFn: (payload) => createPayment(payload),
  });
};

export const useUpdatePaymentStatus = (): UseMutationResult<
  IPaymentResponse,
  Error,
  { paymentId: string; payload: IPaymentStatusUpdate }
> => {
  return useMutation<IPaymentResponse, Error, { paymentId: string; payload: IPaymentStatusUpdate }>({
    mutationFn: ({ paymentId, payload }) => updatePaymentStatus(paymentId, payload),
  });
};

export const useDeletePayment = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (paymentId) => deletePayment(paymentId),
  });
};

export const useOrderPayments = (orderId: string): UseQueryResult<IPaymentsResponse, Error> => {
  return useQuery<IPaymentsResponse, Error>({
    queryKey: ["orderPayments", orderId],
    queryFn: () => getPaymentsByOrderId(orderId),
    enabled: !!orderId, // Chỉ fetch khi có orderId
  });
}; 