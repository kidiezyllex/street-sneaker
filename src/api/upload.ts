import { sendPost } from "./axios";

export interface IUploadResponse {
  success: boolean;
  data: {
    url: string;
    publicId: string;
  };
}

/**
 * Upload hình ảnh
 */
export const uploadImage = async (file: FormData): Promise<IUploadResponse> => {
  const res = await sendPost("/upload/image", file);
  return res as IUploadResponse;
};
