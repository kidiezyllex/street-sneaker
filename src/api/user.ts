import { 
  IUpdateUser,
  ICreateUserComment,
  IUpdateUserComment,
  IGetUserCommentsParams
} from "@/interface/request/user";
import {
  IUserResponse,
  IUsersListResponse,
  IDeleteUserResponse,
  IUserCommentResponse,
  IUserCommentsListResponse,
  IDeleteUserCommentResponse
} from "@/interface/response/user";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const getUsers = async (): Promise<IUsersListResponse> => {
  const res = await sendGet("/users");
  const data: IUsersListResponse = res;
  return data;
};

export const getUserById = async (
  id: string
): Promise<IUserResponse> => {
  const res = await sendGet(`/users/${id}`);
  const data: IUserResponse = res;
  return data;
};

export const updateUser = async (
  id: string,
  userData: IUpdateUser
): Promise<IUserResponse> => {
  const res = await sendPut(`/users/${id}`, userData);
  const data: IUserResponse = res;
  return data;
};

export const deleteUser = async (
  id: string
): Promise<IDeleteUserResponse> => {
  const res = await sendDelete(`/users/${id}`);
  const data: IDeleteUserResponse = res;
  return data;
};

export const updateUserProfile = async (
  userId: string,
  data: any
): Promise<IUserResponse> => {
  const res = await sendPut(`/users/${userId}`, data);
  const resData: IUserResponse = res;
  return resData;
};

// API cho bình luận về thành viên
export const createUserComment = async (
  payload: ICreateUserComment
): Promise<IUserCommentResponse> => {
  const res = await sendPost(`/users/${payload.userId}/comments`, payload);
  const data: IUserCommentResponse = res;
  return data;
};

export const getUserComments = async (
  params?: IGetUserCommentsParams
): Promise<IUserCommentsListResponse> => {
  const res = await sendGet("/users/comments", params);
  const data: IUserCommentsListResponse = res;
  return data;
};

export const updateUserComment = async (
  commentId: string,
  payload: IUpdateUserComment
): Promise<IUserCommentResponse> => {
  const res = await sendPut(`/users/comments/${commentId}`, payload);
  const data: IUserCommentResponse = res;
  return data;
};

export const deleteUserComment = async (
  commentId: string
): Promise<IDeleteUserCommentResponse> => {
  const res = await sendDelete(`/users/comments/${commentId}`);
  const data: IDeleteUserCommentResponse = res;
  return data;
}; 