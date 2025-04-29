import { sendPost } from "./axios";

export interface IUploadImageResponseData {
  imageUrl: string;
  publicId: string;
}

export const uploadImage = async (payload: FormData): Promise<IUploadImageResponseData> => {
  const res = await sendPost("/upload/image", payload);
  const data: IUploadImageResponseData = res.data;
  return data;
};
