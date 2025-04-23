import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  updateAccountStatus,
  deleteAccount,
  addAddress,
  updateAddress,
  deleteAddress,
  getProfile,
  updateProfile,
  changePassword,
  getCustomerAccounts, // Thêm hàm API cho customer
  getCustomerAccountById, // Thêm hàm API cho customer
  updateCustomerAccount, // Thêm hàm API cho customer
} from "@/api/account";
import {
  IAccountFilter,
  IAccountCreate,
  IAccountUpdate,
  IAccountStatusUpdate,
  IAddressCreate,
  IAddressUpdate,
  IProfileUpdate,
  IChangePassword,
} from "@/interface/request/account";
import {
  IAccountsResponse,
  IAccountResponse,
  IAddressListResponse,
  IProfileResponse,
  IActionResponse
} from "@/interface/response/account";

// === Admin Account Hooks ===

export const useAccounts = (params: IAccountFilter = {}): UseQueryResult<IAccountsResponse, Error> => {
  return useQuery<IAccountsResponse, Error>({
    queryKey: ["accounts", params],
    queryFn: () => getAllAccounts(params),
  });
};

export const useAccountDetail = (accountId: string): UseQueryResult<IAccountResponse, Error> => {
  return useQuery<IAccountResponse, Error>({
    queryKey: ["account", accountId],
    queryFn: () => getAccountById(accountId),
    enabled: !!accountId, // Chỉ fetch khi có accountId
  });
};

export const useCreateAccount = (): UseMutationResult<IAccountResponse, Error, IAccountCreate> => {
  return useMutation<IAccountResponse, Error, IAccountCreate>({
    mutationFn: (payload) => createAccount(payload),
  });
};

export const useUpdateAccount = (): UseMutationResult<
  IAccountResponse,
  Error,
  { accountId: string; payload: IAccountUpdate }
> => {
  return useMutation<IAccountResponse, Error, { accountId: string; payload: IAccountUpdate }>({
    mutationFn: ({ accountId, payload }) => updateAccount(accountId, payload),
  });
};

export const useUpdateAccountStatus = (): UseMutationResult<
  IAccountResponse,
  Error,
  { accountId: string; payload: IAccountStatusUpdate }
> => {
  return useMutation<IAccountResponse, Error, { accountId: string; payload: IAccountStatusUpdate }>({
    mutationFn: ({ accountId, payload }) => updateAccountStatus(accountId, payload),
  });
};

export const useDeleteAccount = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (accountId) => deleteAccount(accountId),
  });
};

// === Address Hooks ===

export const useAddAddress = (): UseMutationResult<
  IAddressListResponse,
  Error,
  { accountId: string; payload: IAddressCreate }
> => {
  return useMutation<IAddressListResponse, Error, { accountId: string; payload: IAddressCreate }>({
    mutationFn: ({ accountId, payload }) => addAddress(accountId, payload),
  });
};

export const useUpdateAddress = (): UseMutationResult<
  IAddressListResponse,
  Error,
  { accountId: string; addressId: string; payload: IAddressUpdate }
> => {
  return useMutation<IAddressListResponse, Error, { accountId: string; addressId: string; payload: IAddressUpdate }>({
    mutationFn: ({ accountId, addressId, payload }) => updateAddress(accountId, addressId, payload),
  });
};

export const useDeleteAddress = (): UseMutationResult<
  IAddressListResponse,
  Error,
  { accountId: string; addressId: string }
> => {
  return useMutation<IAddressListResponse, Error, { accountId: string; addressId: string }>({
    mutationFn: ({ accountId, addressId }) => deleteAddress(accountId, addressId),
  });
};

// === Profile Hooks ===

export const useProfile = (): UseQueryResult<IProfileResponse, Error> => {
  return useQuery<IProfileResponse, Error>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};

export const useUpdateProfile = (): UseMutationResult<IProfileResponse, Error, IProfileUpdate> => {
  return useMutation<IProfileResponse, Error, IProfileUpdate>({
    mutationFn: (payload) => updateProfile(payload),
  });
};

export const useChangePassword = (): UseMutationResult<IActionResponse, Error, IChangePassword> => {
  return useMutation<IActionResponse, Error, IChangePassword>({
    mutationFn: (payload) => changePassword(payload),
  });
};

// === Customer Account Hooks (Dựa trên router) ===

export const useCustomerAccounts = (params: IAccountFilter = {}): UseQueryResult<IAccountsResponse, Error> => {
  return useQuery<IAccountsResponse, Error>({
    queryKey: ["customerAccounts", params],
    queryFn: () => getCustomerAccounts(params),
  });
};

export const useCustomerAccountDetail = (customerId: string): UseQueryResult<IAccountResponse, Error> => {
  return useQuery<IAccountResponse, Error>({
    queryKey: ["customerAccount", customerId],
    queryFn: () => getCustomerAccountById(customerId),
    enabled: !!customerId,
  });
};

export const useUpdateCustomerAccount = (): UseMutationResult<
  IAccountResponse,
  Error,
  { customerId: string; payload: IAccountUpdate }
> => {
  return useMutation<IAccountResponse, Error, { customerId: string; payload: IAccountUpdate }>({
    mutationFn: ({ customerId, payload }) => updateCustomerAccount(customerId, payload),
  });
};

// Lưu ý: Các hook cho địa chỉ khách hàng có thể được tạo tương tự như useAddAddress, useUpdateAddress, useDeleteAddress
// nhưng sử dụng các hàm API customer tương ứng (nếu có) hoặc tái sử dụng các hàm hiện có với customerId.
// Ví dụ:
// export const useAddCustomerAddress = (): UseMutationResult<...> => { ... mutationFn: ({ customerId, payload }) => addAddress(customerId, payload) ... }; 