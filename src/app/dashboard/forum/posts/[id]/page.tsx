'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetForumPostById, useDeleteForumPost } from '@/hooks/useForumPost';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@mdi/react';
import { 
  mdiArrowLeft, 
  mdiPencil, 
  mdiDelete, 
  mdiFileDocumentOutline,
  mdiDownload
} from '@mdi/js';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';

export default function ForumPostDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const { data, isLoading, error } = useGetForumPostById(id);
  const deleteForumPost = useDeleteForumPost();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format ngày tháng
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  // Xử lý xóa bài viết
  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const response = await deleteForumPost.mutateAsync(id);
      if (response.success) {
        toast.success("Đã xóa bài viết", {
          description: "Bài viết đã được xóa thành công",
        });
        router.push('/dashboard/forum/posts');
      }
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Đã xảy ra lỗi khi xóa bài viết",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Chỉnh sửa bài viết
  const handleEdit = () => {
    router.push(`/dashboard/forum/edit/${id}`);
  };

  // Xử lý skeleton loading
  if (isLoading) {
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
            <Skeleton className="h-8 w-full mb-2" />
            <div className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full mr-2" />
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-500 mb-4">
          {(error as Error)?.message || "Không thể tải dữ liệu bài viết"}
        </div>
        <Button 
          onClick={() => router.push('/dashboard/forum/posts')}
          className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const post = data.data;
  const isAuthor = post.author && (post.author as any).isCurrentUser;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4 p-2"
            onClick={() => router.back()}
          >
            <Icon path={mdiArrowLeft} size={0.8} />
          </Button>
          <h1 className="text-2xl font-bold text-[#2C8B3D]">Chi tiết bài viết</h1>
        </div>
        
        {isAuthor && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-[#2C8B3D] text-[#2C8B3D] hover:bg-[#E9F3EB]"
              onClick={handleEdit}
            >
              <Icon path={mdiPencil} size={0.7} className="mr-2" />
              Chỉnh sửa
            </Button>
            <Button 
              variant="outline" 
              className="border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Icon path={mdiDelete} size={0.7} className="mr-2" />
              Xóa
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="mb-4">
            {post.project && (
              <Badge 
                variant="outline" 
                className="mb-3 bg-[#E9F3EB] text-[#2C8B3D] border-[#2C8B3D]/20"
              >
                {post.project.name}
              </Badge>
            )}
            <h2 className="text-2xl font-bold tracking-tight">{post.title}</h2>
          </div>
          
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={post.author?.avatar || ''} />
              <AvatarFallback>
                {post.author?.fullName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.author?.fullName || 'Người dùng'}</div>
              <div className="text-sm text-gray-500">
                {formatDate(post.createdAt)}
                {post.updatedAt !== post.createdAt && ' (đã chỉnh sửa)'}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="prose max-w-none">
          {/* Hiển thị nội dung bài viết với định dạng HTML */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          
          {/* Hiển thị file đính kèm */}
          {post.attachments && post.attachments.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-medium mb-3">Tệp đính kèm</h3>
              <div className="grid gap-2">
                {post.attachments.map((attachment) => (
                  <div 
                    key={attachment._id}
                    className="flex items-center p-3 rounded-md border hover:bg-gray-50"
                  >
                    <Icon path={mdiFileDocumentOutline} size={1} className="text-[#2C8B3D] mr-3" />
                    <div className="flex-1">
                      <div className="font-medium">{attachment.title}</div>
                      <div className="text-sm text-gray-500">
                        {(attachment.fileSize ? Math.round(attachment.fileSize / 1024) : 0) + ' KB'}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Icon path={mdiDownload} size={0.7} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t pt-6">
          <div className="text-sm text-gray-500">
            Lượt xem: {post.viewCount || 0}
          </div>
        </CardFooter>
      </Card>

      {/* Dialog xác nhận xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              
              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Đang xóa..." : "Xóa bài viết"}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
} 