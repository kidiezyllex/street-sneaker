'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetForumPosts, useDeleteForumPost } from '@/hooks/useForumPost';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icon } from '@mdi/react';
import { 
  mdiMagnify, 
  mdiComment, 
  mdiEye, 
  mdiPencil, 
  mdiDelete,
  mdiPlus,
  mdiEmoticonSadOutline
} from '@mdi/js';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function MyForumPostsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data, isLoading, error } = useGetForumPosts({ myPosts: true });
  const deleteForumPost = useDeleteForumPost();

  useEffect(() => {
    if (!data?.data) return;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredPosts(
        data.data.filter(
          post => 
            post.title.toLowerCase().includes(query) || 
            post.content.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredPosts(data.data);
    }
  }, [data, searchQuery]);

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };
  
  // Rút gọn nội dung
  const truncateContent = (content: string, length = 120) => {
    if (content.length <= length) return content;
    return content.substring(0, length) + '...';
  };

  // Xử lý xóa bài viết
  const handleDelete = async () => {
    if (!deletePostId) return;
    
    setIsDeleting(true);
    try {
      const response = await deleteForumPost.mutateAsync(deletePostId);
      
      if (response.success) {
        toast.success("Đã xóa bài viết", {
          description: "Bài viết đã được xóa thành công",
        });
      }
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Đã xảy ra lỗi khi xóa bài viết",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDeletePostId(null);
    }
  };

  const openDeleteDialog = (postId: string) => {
    setDeletePostId(postId);
    setIsDeleteDialogOpen(true);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Hiển thị skeleton loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-36" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Skeleton className="h-10 w-72" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <Skeleton className="h-6 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex gap-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        <div className="mb-4">{(error as Error).message}</div>
        <Button
          onClick={() => router.push('/dashboard/forum/posts')}
          className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
        >
          Quay lại diễn đàn
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#2C8B3D]">Bài viết của tôi</h1>
        <Button 
          className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
          onClick={() => router.push('/dashboard/forum/create')}
        >
          <Icon path={mdiPlus} size={0.8} className="mr-2" />
          Tạo bài viết mới
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Icon 
            path={mdiMagnify} 
            size={0.8}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <Input
            placeholder="Tìm kiếm bài viết..."
            className="pl-10 bg-white focus:border-primary focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
          <Icon path={mdiEmoticonSadOutline} size={3} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">Bạn chưa có bài viết nào</h3>
          <p className="text-sm text-gray-400 mt-1">
            {searchQuery 
              ? 'Không tìm thấy bài viết nào phù hợp với từ khóa tìm kiếm.'
              : 'Hãy tạo bài viết đầu tiên của bạn trên diễn đàn.' }
          </p>
          <Button 
            className="mt-4 bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
            onClick={() => router.push('/dashboard/forum/create')}
          >
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Tạo bài viết mới
          </Button>
        </div>
      ) : (
        <motion.div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredPosts.map((post) => (
            <motion.div key={post._id} variants={item}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-3">
                    <div className="flex justify-between">
                      <Badge 
                        variant="outline" 
                        className="mb-2 bg-[#E9F3EB] text-[#2C8B3D] border-[#2C8B3D]/20"
                      >
                        {post.project?.name || 'Chung'}
                      </Badge>
                      
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-[#2C8B3D]"
                          onClick={() => router.push(`/dashboard/forum/edit/${post._id}`)}
                        >
                          <Icon path={mdiPencil} size={0.7} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => openDeleteDialog(post._id)}
                        >
                          <Icon path={mdiDelete} size={0.7} />
                        </Button>
                      </div>
                    </div>
                    
                    <Link href={`/dashboard/forum/posts/${post._id}`} className="block">
                      <h3 className="text-lg font-semibold hover:text-[#2C8B3D] transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                  </div>
                  
                  <Link href={`/dashboard/forum/posts/${post._id}`} className="block">
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {truncateContent(post.content)}
                    </p>
                  </Link>
                  
                  <div className="pt-3 border-t flex flex-col items-start">
                    <div className="flex items-center w-full justify-between mb-3">
                      <div className="flex items-center text-gray-500 text-sm gap-4">
                        <div className="flex items-center">
                          <Icon path={mdiEye} size={0.7} className="mr-1.5" />
                          <span>{post.viewCount || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Icon path={mdiComment} size={0.7} className="mr-1.5" />
                          <span>{post.commentCount || 0}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(post.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-7 w-7 mr-2">
                        <AvatarImage src={post.author?.avatar || ''} />
                        <AvatarFallback>
                          {post.author?.fullName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">
                        {post.author?.fullName || 'Tôi'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

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