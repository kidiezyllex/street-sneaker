// import React, { useState, useRef } from 'react';
// import { useUpload } from '@/hooks/useDocumentCategory';
// import { useGetDocumentCategories } from '@/hooks/useDocumentCategory';
// import { createFileFormData, formatFileSize } from '@/utils/cloudinary';
// import { IUploadResponse } from '@/interface/response/upload';
// import { Input } from '../ui/input';
// import { Textarea } from '../ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { Button } from '../ui/button';
// import { toast } from 'sonner';

// interface FileUploadProps {
//   onSuccess?: () => void;
// }

// const FileUpload = ({ onSuccess }: FileUploadProps) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');
//   const [isShared, setIsShared] = useState(false);
//   const [tags, setTags] = useState<string[]>([]);
//   const [tagInput, setTagInput] = useState('');
  
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   const { uploadFile, loading: isPending } = useUpload();
//   const { data: categoriesData, isLoading: isCategoriesLoading } = useGetDocumentCategories();
  
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const selectedFile = e.target.files[0];
//       setFile(selectedFile);
//       if (!title) {
//         setTitle(selectedFile.name.split('.')[0]);
//       }
//     }
//   };
  
//   const handleAddTag = () => {
//     if (tagInput.trim() && !tags.includes(tagInput.trim())) {
//       setTags([...tags, tagInput.trim()]);
//       setTagInput('');
//     }
//   };
  
//   const handleRemoveTag = (tagToRemove: string) => {
//     setTags(tags.filter(tag => tag !== tagToRemove));
//   };
  
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!file || !title || !category) {
//       toast.error('Vui lòng điền các thông tin bắt buộc: File, Tiêu đề và Danh mục');
//       return;
//     }
    
//     uploadFile(file, {
//       title,
//       description,
//       category,
//       isShared,
//       tags: tags.length > 0 ? tags : undefined
//     })
//       .then((data: IUploadResponse) => {
//         if (data.status) {
//           toast.success(data.message || 'Tải tài liệu lên thành công');
//           setFile(null);
//           setTitle('');
//           setDescription('');
//           setCategory('');
//           setIsShared(false);
//           setTags([]);
//           if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//           }
//           if (onSuccess) {
//             onSuccess();
//           }
//         } else {
//           toast.error(data.message || 'Có lỗi xảy ra khi tải tài liệu');
//         }
//       })
//       .catch((error) => {
//         console.error('Error uploading file:', error);
//         toast.error(error?.message || 'Có lỗi xảy ra khi tải tài liệu');
//       });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           className="hidden"
//           id="fileInput"
//         />
//         <label
//           htmlFor="fileInput"
//           className="cursor-pointer block mx-auto py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Chọn file
//         </label>
        
//         {file && (
//           <div className="mt-4 text-left bg-gray-100 p-3 rounded">
//             <p className="font-medium">{file.name}</p>
//             <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
//           </div>
//         )}
//       </div>
      
//       <div>
//         <label className="block text-sm font-medium mb-1">
//           Tiêu đề <span className="text-red-500">*</span>
//         </label>
//         <Input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full p-2 bg-white focus:border-primary focus:ring-primary"
//           required
//         />
//       </div>
      
//       <div>
//         <label className="block text-sm font-medium mb-1">
//           Mô tả
//         </label>
//         <Textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full p-2 focus:border-primary focus:ring-primary"
//           rows={3}
//         />
//       </div>
      
//       <div>
//         <label className="block text-sm font-medium mb-1">
//           Danh mục <span className="text-red-500">*</span>
//         </label>
//         <Select value={category} onValueChange={(value) => setCategory(value)}>
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Chọn danh mục" />
//           </SelectTrigger>
//           <SelectContent>
//             {!isCategoriesLoading && categoriesData?.data.map((cat) => (
//               <SelectItem key={cat._id} value={cat._id}>
//                 {cat.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
      
//       <div>
//         <label className="block text-sm font-medium mb-1">Tags</label>
//         <div className="flex">
//           <Input
//             type="text"
//             value={tagInput}
//             onChange={(e) => setTagInput(e.target.value)}
//             className="w-full p-2 mr-2 bg-white focus:border-primary focus:ring-primary"
//             placeholder="Nhập tag và nhấn Thêm"
//           />
//           <button
//             type="button"
//             onClick={handleAddTag}
//             className="bg-gray-200 px-4 rounded-sm hover:bg-gray-300"
//           >
//             Thêm
//           </button>
//         </div>
        
//         {tags.length > 0 && (
//           <div className="mt-2 flex flex-wrap gap-2">
//             {tags.map(tag => (
//               <span
//                 key={tag}
//                 className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
//               >
//                 {tag}
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveTag(tag)}
//                   className="ml-1 text-blue-800 hover:text-blue-900"
//                 >
//                   &times;
//                 </button>
//               </span>
//             ))}
//           </div>
//         )}
//       </div>
      
//       <div className="flex items-center">
//         <input
//           type="checkbox"
//           id="isShared"
//           checked={isShared}
//           onChange={(e) => setIsShared(e.target.checked)}
//           className="mr-2"
//         />
//         <label htmlFor="isShared" className="text-sm">
//           Công khai cho tất cả người dùng
//         </label>
//       </div>
//       <div className='flex justify-end'>
//       <Button
//         variant="default"
//         type="submit"
//         disabled={isPending}
//         className={`w-24 text-white 
//           ${isPending ? 'bg-gray-400 cursor-not-allowed' : ''}`}
//       >
//         {isPending ? 'Đang tải lên...' : 'Tải lên'}
//       </Button>
//       </div>
     
//     </form>
//   );
// };

// export default FileUpload; 