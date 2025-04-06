import { createUser, deleteUserById, deleteUserSelect, getAllUser, getListAllUser, getUserById, updatePassWord, updateUserById } from "@/api/user";
import { IQueryParams } from "@/interface/request/managedocument";
import { IPasswordRequest, IUserRequest } from "@/interface/request/user";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";

export const useListUser = () => {
    const {
      data: listAllUser,
      isLoading,
      isFetching,
      refetch,
    } = useQuery({
      queryKey: ['listUser'],
      queryFn: () => getAllUser(),
    });
    return {
       listAllUser,
      isLoading,
      isFetching,
      refetch,
    };
  };

  export const useListAllUser = (params:IQueryParams) => {
    const {
      data: listAllUserData,
      isLoading,
      isFetching,
    } = useQuery({
      queryKey: ['listAllListUser', params],
      queryFn: () => getListAllUser(params),
    });
    return {
      listAllUserData,
      isLoading,
      isFetching,
    };
  };
  export const useDeleteUserById = (): UseMutationResult<any, Error, any> => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, any>({
      mutationFn: (userId: string) => deleteUserById(userId),
      onSuccess: async (result: any) => {
        await queryClient.invalidateQueries({
          queryKey: ['listAllListUser'],
        });
        return result;
      },
      onError: (result) => {
        return result;
      },
    });
  };

  
export const useCreateUser= (): UseMutationResult<
any,
Error,
IUserRequest
> => {
const queryClient = useQueryClient();

return useMutation<any, Error, IUserRequest>({
  mutationFn: (params: IUserRequest) => createUser(params),
  onSuccess: (result: any) => {
    queryClient.invalidateQueries({
      queryKey: ['listAllListUser'],
    });
    return result;
  },
  onError: (result) => {
    return result;
  },
});
};


export const useGetUserDetail= (userId: string) => {
  const {
    data: dataUserDetail,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['listUserDetail'],
    queryFn: () => getUserById(userId),
  });

  return {
    dataUserDetail,
    isLoading,
    isFetching,
   
  };
};


export const useUpdateUser = (
  userId: string
): UseMutationResult<any, Error, IUserRequest> => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, IUserRequest>({
    mutationFn: (payload: IUserRequest) =>
      updateUserById(userId, payload),
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({
        queryKey: ['listUserDetail'],
      });
      return result;
    },
    onError: (result) => {
      return result;
    },
  });
};



export const useUpdatePassWord = (

): UseMutationResult<any, Error, IPasswordRequest> => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, IPasswordRequest>({
    mutationFn: (payload: IPasswordRequest) =>
      updatePassWord(payload),
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({
        queryKey: [''],
      });
      return result;
    },
    onError: (result) => {
      return result;
    },
  });
};
export const useDeleteUserSelect = (): UseMutationResult<any, Error, any> => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: (payload: string[]) => deleteUserSelect(payload),
    onSuccess: async (result: any) => {
      await queryClient.invalidateQueries({
        queryKey: ['listAllListUser'],
      });
      return result;
    },
    onError: (result) => {
      return result;
    },
  });
};