import {
  INotificationFilter,
  INotificationCreate,
  INotificationUpdate,
  INotificationStatusUpdate,
  ISendToAllCustomers
} from "@/interface/request/notification";
import {
  INotificationsResponse,
  INotificationResponse,
  IActionResponse
} from "@/interface/response/notification";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// === Admin Notification API ===
export const getAllNotifications = async (params: INotificationFilter): Promise<INotificationsResponse> => {
  const res = await sendGet("/notifications", { params });
  return res as INotificationsResponse;
};

export const getNotificationById = async (notificationId: string): Promise<INotificationResponse> => {
  const res = await sendGet(`/notifications/${notificationId}`);
  return res as INotificationResponse;
};

export const createNotification = async (payload: INotificationCreate): Promise<INotificationResponse> => {
  const res = await sendPost("/notifications", payload);
  return res as INotificationResponse;
};

export const updateNotification = async (notificationId: string, payload: INotificationUpdate): Promise<INotificationResponse> => {
  const res = await sendPut(`/notifications/${notificationId}`, payload);
  return res as INotificationResponse;
};

export const deleteNotification = async (notificationId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/notifications/${notificationId}`);
  return res as IActionResponse;
};

export const sendNotification = async (notificationId: string): Promise<INotificationResponse> => {
  const res = await sendPost(`/notifications/${notificationId}/send`);
  return res as INotificationResponse;
};

export const sendNotificationToAllCustomers = async (payload: ISendToAllCustomers): Promise<INotificationResponse> => {
  const res = await sendPost("/notifications/send-all", payload);
  return res as INotificationResponse;
};

// === User Notification API ===
export const getUserNotifications = async (params: INotificationFilter = {}): Promise<INotificationsResponse> => {
  const res = await sendGet("/notifications/user", { params });
  return res as INotificationsResponse;
}; 