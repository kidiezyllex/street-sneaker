import { IUserResponse } from "@/interface/response/user";
import { httpDelete, httpGet, httpPost, httpPut } from "./axios";
import { camelizeConvert } from "@/utils";
import { IQueryParams } from "@/interface/request/managedocument";
import { IPasswordRequest, IUserRequest } from "@/interface/request/user";

export const getAllUser = async (): Promise<IUserResponse[]> => {
    const res = await httpGet('/v1/users');
    const { data }: { data: IUserResponse[] } = camelizeConvert(res);
    return data;
  };

  export const getListAllUser = async (params:IQueryParams): Promise<any> => {
    const res = await httpGet('/v1/users/list',params);
    const { data }: { data: any } = res;
    return data;
  };

  export const getUserById = async (
    userId: string
  ): Promise<any> => {
    const res = await httpGet(`/v1/users/${userId}`);
    const { data }: { data: any } =res;
    return data;
  };



  export const deleteUserById: (userId: string) => Promise<any> = async (
    userId: string
  ) => {
    const res = await httpDelete(
      `/v1/users/${userId}`
    );
    const { data } = camelizeConvert(res);
    return data;
  };

  export const createUser: (
    payload: IUserRequest
  ) => Promise<any> = async (payload: IUserRequest) => {
    const res = await httpPost('/v1/users', payload);
    const { data }: { data: any } = camelizeConvert(res?.data);
    return data;
  };


  export const updateUserById: (
    id: string,
    payload: IUserRequest
  ) => Promise<any> = async (
    userId: string,
    payload: IUserRequest
  ) => {
    const res = await httpPut(
      `/v1/users/${userId}`,
      payload
    );
    const { data }: { data: any } = res;
    return data;
  };
  
  export const updatePassWord: (
    payload: IPasswordRequest
  ) => Promise<any> = async (
    payload: IPasswordRequest,
   
  ) => {
    const res = await httpPut(
      `/v1/users/update-password`,
      payload
    );
    const { data }: { data: any } = res;
    return data;
  };



  export const deleteUserSelect: (
    payload: any
  ) => Promise<any> = async (payload: any) => {
    const res = await httpPut( `/v1/users/deleted`, payload);
    const { data }: { data: any } = camelizeConvert(res?.data);
    return data;
  };
