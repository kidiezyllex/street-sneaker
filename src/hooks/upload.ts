import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { uploadImage } from "@/api/upload";
import { IUploadImageResponseData } from "@/interface/response/upload";

export const useUploadImage = (): UseMutationResult<
  IUploadImageResponseData,
  Error,
  FormData
> => {
  return useMutation<IUploadImageResponseData, Error, FormData>({
    mutationFn: (payload: FormData) => uploadImage(payload),
  });
}; 