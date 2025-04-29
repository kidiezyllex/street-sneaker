import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  sendNotification,
  sendNotificationToAllCustomers,
  getUserNotifications
} from "@/api/notification";
import {
  INotificationFilter,
  INotificationCreate,
  INotificationUpdate,
  ISendToAllCustomers
} from "@/interface/request/notification";
import {
  INotificationsResponse,
  INotificationResponse,
  IActionResponse
} from "@/interface/response/notification";

// === Admin Notification Hooks ===

export const useNotifications = (params: INotificationFilter = {}): UseQueryResult<INotificationsResponse, Error> => {
  return useQuery<INotificationsResponse, Error>({
    queryKey: ["notifications", params],
    queryFn: () => getAllNotifications(params),
  });
};

export const useNotificationDetail = (notificationId: string): UseQueryResult<INotificationResponse, Error> => {
  return useQuery<INotificationResponse, Error>({
    queryKey: ["notification", notificationId],
    queryFn: () => getNotificationById(notificationId),
    enabled: !!notificationId, // Chỉ fetch khi có notificationId
  });
};

export const useCreateNotification = (): UseMutationResult<INotificationResponse, Error, INotificationCreate> => {
  return useMutation<INotificationResponse, Error, INotificationCreate>({
    mutationFn: (payload) => createNotification(payload),
  });
};

export const useUpdateNotification = (): UseMutationResult<
  INotificationResponse,
  Error,
  { notificationId: string; payload: INotificationUpdate }
> => {
  return useMutation<INotificationResponse, Error, { notificationId: string; payload: INotificationUpdate }>({
    mutationFn: ({ notificationId, payload }) => updateNotification(notificationId, payload),
  });
};

export const useDeleteNotification = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (notificationId) => deleteNotification(notificationId),
  });
};

export const useSendNotification = (): UseMutationResult<INotificationResponse, Error, string> => {
  return useMutation<INotificationResponse, Error, string>({
    mutationFn: (notificationId) => sendNotification(notificationId),
  });
};

export const useSendNotificationToAllCustomers = (): UseMutationResult<INotificationResponse, Error, ISendToAllCustomers> => {
  return useMutation<INotificationResponse, Error, ISendToAllCustomers>({
    mutationFn: (payload) => sendNotificationToAllCustomers(payload),
  });
};

// === User Notification Hooks ===

export const useUserNotifications = (params: INotificationFilter = {}): UseQueryResult<INotificationsResponse, Error> => {
  return useQuery<INotificationsResponse, Error>({
    queryKey: ["userNotifications", params],
    queryFn: () => getUserNotifications(params),
  });
}; 