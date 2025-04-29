import {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  addCustomerToVoucher,
  removeCustomerFromVoucher,
  checkVoucher,
  getCustomerVouchers
} from "@/api/voucher";

import { IVoucherFilter, IVoucherCreate, IVoucherUpdate, IAddCustomerToVoucher, ICheckVoucher } from "@/interface/request/voucher";
import { IVoucherResponse, IVouchersResponse, ICheckVoucherResponse } from "@/interface/response/voucher";

import {
  type UseMutationResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

export const useVouchers = (params: IVoucherFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["vouchers", params],
    queryFn: () => getAllVouchers(params),
  });

  return {
    vouchersData: data,
    isLoading,
    isFetching,
    refetch
  };
};

export const useVoucherDetail = (voucherId: string) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["voucher", voucherId],
    queryFn: () => getVoucherById(voucherId),
    enabled: !!voucherId,
  });

  return {
    voucherData: data,
    isLoading,
    isFetching,
    refetch
  };
};

export const useCreateVoucher = (): UseMutationResult<
  IVoucherResponse,
  Error,
  IVoucherCreate
> => {
  return useMutation<IVoucherResponse, Error, IVoucherCreate>({
    mutationFn: (params: IVoucherCreate) => createVoucher(params),
  });
};

export const useUpdateVoucher = (): UseMutationResult<
  IVoucherResponse,
  Error,
  { voucherId: string; payload: IVoucherUpdate }
> => {
  return useMutation<IVoucherResponse, Error, { voucherId: string; payload: IVoucherUpdate }>({
    mutationFn: ({ voucherId, payload }) => updateVoucher(voucherId, payload),
  });
};

export const useDeleteVoucher = (): UseMutationResult<any, Error, string> => {
  return useMutation<any, Error, string>({
    mutationFn: (voucherId: string) => deleteVoucher(voucherId),
  });
};

export const useAddCustomerToVoucher = (): UseMutationResult<
  IVoucherResponse,
  Error,
  { voucherId: string; payload: IAddCustomerToVoucher }
> => {
  return useMutation<IVoucherResponse, Error, { voucherId: string; payload: IAddCustomerToVoucher }>({
    mutationFn: ({ voucherId, payload }) => addCustomerToVoucher(voucherId, payload),
  });
};

export const useRemoveCustomerFromVoucher = (): UseMutationResult<
  IVoucherResponse,
  Error,
  { voucherId: string; customerId: string }
> => {
  return useMutation<IVoucherResponse, Error, { voucherId: string; customerId: string }>({
    mutationFn: ({ voucherId, customerId }) => removeCustomerFromVoucher(voucherId, customerId),
  });
};

export const useCheckVoucher = (): UseMutationResult<
  ICheckVoucherResponse,
  Error,
  ICheckVoucher
> => {
  return useMutation<ICheckVoucherResponse, Error, ICheckVoucher>({
    mutationFn: (params: ICheckVoucher) => checkVoucher(params),
  });
};

export const useCustomerVouchers = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["customerVouchers"],
    queryFn: () => getCustomerVouchers(),
  });

  return {
    customerVouchersData: data,
    isLoading,
    isFetching,
    refetch
  };
}; 