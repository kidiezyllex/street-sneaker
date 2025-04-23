import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { IFileData } from '@/interface/response/upload';

/**
 * Phương thức tạo form data cho file upload
 */
export const createFileFormData = (file: File, metadata: Record<string, any>): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Thêm metadata
  Object.keys(metadata).forEach(key => {
    if (metadata[key] !== undefined && metadata[key] !== null) {
      if (Array.isArray(metadata[key])) {
        formData.append(key, JSON.stringify(metadata[key]));
      } else {
        formData.append(key, metadata[key].toString());
      }
    }
  });
  
  return formData;
};

/**
 * Xác định loại resource dựa vào mime type
 */
export const getResourceType = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  } else {
    return 'auto';
  }
};

/**
 * Tạo tên file duy nhất
 */
export const createUniqueFileName = (originalName: string): string => {
  const fileExtension = originalName.split('.').pop() || '';
  return `${uuidv4()}.${fileExtension}`;
};

/**
 * Tạo đường dẫn thư mục lưu trữ
 */
export const createFolderPath = (userId: string, categoryId: string): string => {
  return `street-sneakers/${userId}/${categoryId}`;
};

/**
 * Định dạng kích thước file
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 