'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateForumPost, useUpdateForumPost, useGetForumPostById } from '@/hooks/useForumPost';
import { useGetProjects } from '@/hooks/useProject';
import { useUpload } from '@/hooks/useDocumentCategory';
import { toast } from 'sonner';
import { Icon } from '@mdi/react';
import { 
  mdiUpload, 
  mdiClose, 
  mdiArrowLeft,
  mdiFileDocumentOutline
} from '@mdi/js';
import { motion } from 'framer-motion';
import { ICreateForumPost, IUpdateForumPost } from '@/interface/request/forumPost';

interface IAttachment {
  _id: string;
  title: string;
  fileType: string;
  filePath?: string;
  fileSize?: number;
  category?: string;
}

interface ForumPostFormProps {
  postId?: string;
  isEdit?: boolean;
}

interface AttachmentFile {
  file?: File;
  preview: boolean;
  uploaded: boolean;
  url?: string;
  _id?: string;
  title?: string;
  fileType?: string;
  filePath?: string;
  fileSize?: string | number;
  category?: string;
}

export default function ForumPostForm({ postId, isEdit = false }: ForumPostFormProps) {
  const router = useRouter();
  const createForumPost = useCreateForumPost();
  const updateForumPost = useUpdateForumPost();
  const { data: postData, isLoading: isLoadingPost } = useGetForumPostById(isEdit && postId ? postId : '');
  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjects();
  const { uploadFile } = useUpload();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    projectId: '',
    attachments: [] as AttachmentFile[]
  });
  const [submitting, setSubmitting] = useState(false);

  // Cập nhật dữ liệu form khi có dữ liệu bài viết
  useEffect(() => {
    if (isEdit && postData?.data) {
      setFormData({
        title: postData.data.title,
        content: postData.data.content,
        projectId: postData.data.project?._id || '',
        attachments: postData.data.attachments?.map((attachment: IAttachment) => ({
          _id: attachment._id,
          title: attachment.title,
          fileType: attachment.fileType,
          filePath: attachment.filePath,
          fileSize: attachment.fileSize,
          category: attachment.category,
          preview: attachment.fileType?.includes('image') || false,
          uploaded: true
        })) || []
      });
    }
  }, [isEdit, postData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: file.type.includes('image'),
        uploaded: false
      }));

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu
    if (!formData.title.trim()) {
      toast.error("Thiếu thông tin", {
        description: "Vui lòng nhập tiêu đề bài viết",
      });
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Thiếu thông tin", {
        description: "Vui lòng nhập nội dung bài viết",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Upload các file đính kèm chưa được upload
      const attachmentsToUpload = formData.attachments.filter(att => !att.uploaded && att.file);
      const attachmentIds = formData.attachments
        .filter(att => att.uploaded && att._id)
        .map(att => att._id as string);
      
      // Upload từng file
      for (const attachment of attachmentsToUpload) {
        if (!attachment.file) continue;
        
        const uploadResponse = await uploadFile(attachment.file);
        if (!uploadResponse || !uploadResponse.status) {
          throw new Error("Không thể tải file đính kèm lên hệ thống");
        }
        
        attachmentIds.push(uploadResponse.data.document._id);
      }
      
      // Dữ liệu bài viết
      let response;
      if (isEdit && postId) {
        const updateData: IUpdateForumPost = {
          title: formData.title,
          content: formData.content,
          attachments: attachmentIds
        };
        
        response = await updateForumPost.mutateAsync({ id: postId, payload: updateData });
      } else {
        const createData: ICreateForumPost = {
          title: formData.title,
          content: formData.content,
          project: formData.projectId || '',
          attachments: attachmentIds
        };
        
        response = await createForumPost.mutateAsync(createData);
      }

      if (!response || !response.success) {
        throw new Error(isEdit ? "Không thể cập nhật bài viết" : "Không thể tạo bài viết mới");
      }

      toast.success("Thành công", {
        description: isEdit ? "Đã cập nhật bài viết thành công" : "Đã tạo bài viết mới thành công",
      });

      // Chuyển hướng đến trang chi tiết bài viết
      router.push(`/dashboard/forum/posts/${response.data._id}`);
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Đã xảy ra lỗi khi xử lý bài viết",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Lấy icon cho từng loại file
  const getFileIcon = (filename: string) => {
    return mdiFileDocumentOutline;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="mr-4 p-2"
          onClick={() => router.back()}
        >
          <Icon path={mdiArrowLeft} size={0.8} />
        </Button>
        <h1 className="text-2xl font-bold text-[#2C8B3D]">
          {isEdit ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
        </h1>
      </div>

      {(isLoadingPost || isLoadingProjects) ? (
        <div className="flex justify-center p-8">Đang tải dữ liệu...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin bài viết</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Nhập tiêu đề bài viết"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                {!isEdit && (
                  <div className="grid gap-2">
                    <Label htmlFor="projectId">Dự án</Label>
                    <Select 
                      value={formData.projectId} 
                      onValueChange={(value) => handleSelectChange('projectId', value)}
                      disabled={submitting}
                    >
                      <SelectTrigger id="projectId">
                        <SelectValue placeholder="Chọn dự án" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Chung (Không thuộc dự án cụ thể)</SelectItem>
                        {projectsData?.data.map((project) => (
                          <SelectItem key={project._id} value={project._id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="content">Nội dung</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Nhập nội dung bài viết"
                    value={formData.content}
                    onChange={handleChange}
                    rows={10}
                    disabled={submitting}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Tệp đính kèm</Label>
                  <div className="border border-dashed rounded-md p-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.attachments.map((attachment, index) => (
                        <motion.div
                          key={index}
                          className="border rounded-md p-2 flex items-center gap-2 bg-gray-50"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          <Icon 
                            path={getFileIcon(attachment.title || attachment.file?.name || '')} 
                            size={0.7}
                            className="text-blue-600"
                          />
                          <span className="text-sm truncate max-w-[120px]">
                            {attachment.title || attachment.file?.name || 'Tệp đính kèm'}
                          </span>
                          <Button 
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            onClick={() => removeAttachment(index)}
                            disabled={submitting}
                          >
                            <Icon path={mdiClose} size={0.7} />
                          </Button>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center">
                      <label 
                        htmlFor="file-upload"
                        className={`flex items-center gap-2 p-3 text-sm font-medium rounded-md cursor-pointer ${
                          submitting 
                            ? 'bg-gray-100 text-gray-400' 
                            : 'bg-gray-50 hover:bg-gray-100 text-[#2C8B3D]'
                        } transition-colors`}
                      >
                        <Icon path={mdiUpload} size={0.8} />
                        <span>Chọn tệp đính kèm</span>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="sr-only"
                          disabled={submitting}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
                  disabled={submitting}
                >
                  {submitting ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Tạo bài viết'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 