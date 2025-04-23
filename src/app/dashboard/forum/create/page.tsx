'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateForumPost } from '@/hooks/useForumPost';
import { useGetProjects } from '@/hooks/useProject';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import { 
  mdiArrowLeft, 
  mdiUpload, 
  mdiClose,
  mdiFileDocumentOutline
} from '@mdi/js';
import { toast } from 'sonner';
import { ICreateForumPost } from '@/interface/request/forumPost';
import { useUpload } from '@/hooks/useDocumentCategory';

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
}

export default function CreateForumPostPage() {
  const router = useRouter();
  const createForumPost = useCreateForumPost();
  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjects();
  const { uploadFile } = useUpload();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    projectId: '',
    attachments: [] as AttachmentFile[]
  });
  const [submitting, setSubmitting] = useState(false);

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
        uploaded: false,
        title: file.name,
        fileSize: file.size,
        fileType: file.type
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

    if (!formData.projectId) {
      toast.error("Thiếu thông tin", {
        description: "Vui lòng chọn dự án cho bài viết",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Upload các file đính kèm chưa được upload
      const attachmentsToUpload = formData.attachments.filter(att => !att.uploaded && att.file);
      const attachmentIds: string[] = [];
      
      // Upload từng file
      for (const attachment of attachmentsToUpload) {
        if (!attachment.file) continue;
        
        const uploadResponse = await uploadFile(attachment.file);
        if (!uploadResponse || !(uploadResponse as any).success) {
          throw new Error("Không thể tải file đính kèm lên hệ thống");
        }
        
        attachmentIds.push(uploadResponse.data.document._id);
      }
      
      // Dữ liệu bài viết
      const createData: ICreateForumPost = {
        title: formData.title,
        content: formData.content,
        project: formData.projectId,
        attachments: attachmentIds.length > 0 ? attachmentIds : undefined
      };
      
      const response = await createForumPost.mutateAsync(createData);

      if (!response || !response.status) {
        throw new Error("Không thể tạo bài viết mới");
      }

      toast.success("Thành công", {
        description: "Đã tạo bài viết mới thành công",
      });

      // Chuyển hướng đến trang danh sách bài viết
      router.push('/dashboard/forum/posts');
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Đã xảy ra lỗi khi xử lý bài viết",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Skeleton loading cho trang tạo bài viết
  if (isLoadingProjects) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-4 p-2">
            <Skeleton className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="pt-4">
                <Skeleton className="h-10 w-32 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-[#2C8B3D]">Tạo bài viết mới</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thông tin bài viết</CardTitle>
          <CardDescription>
            Điền đầy đủ thông tin để tạo bài viết mới trên diễn đàn
          </CardDescription>
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
                  className="bg-white focus:border-primary focus:ring-primary"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="projectId">Dự án</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) => handleSelectChange('projectId', value)}
                  disabled={submitting}
                >
                  <SelectTrigger id="projectId" className="bg-white focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Chọn dự án" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectsData?.data?.map((project: any) => (
                      <SelectItem key={project._id} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Nhập nội dung bài viết"
                  className="min-h-[200px] bg-white focus:border-primary focus:ring-primary"
                  value={formData.content}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <div className="grid gap-2">
                <Label>Tệp đính kèm</Label>
                
                <div className="grid gap-3">
                  {formData.attachments.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center p-3 rounded-md border"
                    >
                      <Icon path={mdiFileDocumentOutline} size={1} className="text-[#2C8B3D] mr-3" />
                      <div className="flex-1">
                        <div className="font-medium">{file.title}</div>
                        {file.fileSize && (
                          <div className="text-sm text-gray-500">
                            {typeof file.fileSize === 'number' 
                              ? Math.round(file.fileSize / 1024) + ' KB'
                              : file.fileSize
                            }
                          </div>
                        )}
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        className="ml-2 text-gray-500 hover:text-red-500"
                        onClick={() => removeAttachment(index)}
                      >
                        <Icon path={mdiClose} size={0.7} />
                      </Button>
                    </div>
                  ))}

                  <div className="flex justify-start">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <div className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border border-gray-300 shadow-sm bg-white hover:bg-gray-50">
                        <Icon path={mdiUpload} size={0.7} className="mr-2 text-[#2C8B3D]" />
                        Tải lên tệp đính kèm
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileChange}
                        disabled={submitting}
                      />
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
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
                  {submitting ? "Đang tạo..." : "Tạo bài viết"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 