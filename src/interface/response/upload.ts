import { IBaseResponse } from "./authentication";

export interface IUploadImageResponseData {
  imageUrl: string;
  publicId: string;
}

export interface IUploadImageResponse extends IBaseResponse<IUploadImageResponseData> {}
