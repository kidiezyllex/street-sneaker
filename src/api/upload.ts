import { sendPost } from "./axios";

export const stringToSlug = (str: string) => {
  // remove accents
  var from =
      "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
    to =
      "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }

  return str.toLocaleLowerCase();
};

export const uploadFile = async (
  file: any,
  callback?: (param: any) => void
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file, stringToSlug(file.name));

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress(progressEvent: any) {
      if (callback) {
        callback(progressEvent);
      }
    },
  };

  const res = await sendPost(`/upload`, formData, config);
  return res;
};
