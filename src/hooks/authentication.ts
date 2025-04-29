import {
  signIn,
  register,
  getProfile,
  changePassword,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/api/authentication";
import type {
  ISignIn,
  IRegister,
} from "@/interface/request/authentication";
import type {
  IAuthResponse,
} from "@/interface/response/authentication";
import {
  type UseMutationResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

export const useSignIn = (): UseMutationResult<
  IAuthResponse,
  Error,
  ISignIn
> => {
  return useMutation<IAuthResponse, Error, ISignIn>({
    mutationFn: (params: ISignIn) => signIn(params),
    onSuccess: (result: IAuthResponse) => {
      return result;
    },
    onError: (result) => {
      return result;
    },
  });
};

export const useRegister = (): UseMutationResult<
  IAuthResponse,
  Error,
  IRegister
> => {
  return useMutation<IAuthResponse, Error, IRegister>({
    mutationFn: (params: IRegister) => register(params),
    onSuccess: (result: IAuthResponse) => {
      return result;
    },
    onError: (result) => {
      return result;
    },
  });
};

export const useProfile = () => {
  const {
    data: profileData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getProfile(),
    enabled: typeof window !== 'undefined' && (!!localStorage.getItem('accessToken') || (typeof document !== 'undefined' && !!document.cookie.includes('accessToken='))),
  });

  return {
    profileData,
    isLoading,
    isFetching,
    refetch,
  };
};

export const useChangePassword = (): UseMutationResult<any, Error, any> => {
  return useMutation<any, Error, any>({
    mutationFn: (params: any) => changePassword(params),
  });
};

export const useUpdateProfile = (): UseMutationResult<any, Error, any> => {
  return useMutation<any, Error, any>({
    mutationFn: (params: any) => updateProfile(params),
  });
};

export const useAddAddress = (): UseMutationResult<any, Error, any> => {
  return useMutation<any, Error, any>({
    mutationFn: (params: any) => addAddress(params),
  });
};

export const useUpdateAddress = (): UseMutationResult<any, Error, { addressId: string; payload: any }> => {
  return useMutation<any, Error, { addressId: string; payload: any }>({
    mutationFn: ({ addressId, payload }) => updateAddress(addressId, payload),
  });
};

export const useDeleteAddress = (): UseMutationResult<any, Error, string> => {
  return useMutation<any, Error, string>({
    mutationFn: (addressId: string) => deleteAddress(addressId),
  });
};

export const useSetDefaultAddress = (): UseMutationResult<any, Error, string> => {
  return useMutation<any, Error, string>({
    mutationFn: (addressId: string) => setDefaultAddress(addressId),
  });
};
