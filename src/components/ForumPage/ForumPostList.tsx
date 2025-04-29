'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetForumPosts, useDeleteForumPost } from '@/hooks/useForumPost';
import { useRouter } from 'next/navigation';
import { Icon } from '@mdi/react';
import { 
  mdiMagnify, 
  mdiComment, 
  mdiEye, 
  mdiPencil, 
  mdiDotsVertical,
  mdiPlus,
  mdiDelete
} from '@mdi/js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ForumPostListProps {
  projectId?: string;
  isMyPosts?: boolean;
}

export default function ForumPostList({ projectId, isMyPosts = false }: ForumPostListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userAvatars, setUserAvatars] = useState<{ [userId: string]: number }>({});
  
  const params: any = {};
  if (projectId) {
    params.projectId = projectId;
  }
  if (isMyPosts) {
    params.myPosts = true;
  }
  
  const { data, isLoading, error } = useGetForumPosts(params);
  const deleteForumPost = useDeleteForumPost();

  //                                                                                                                     Lấy avatar ngẫu nhiên cho user
  const getRandomAvatar = (userId: string) => {
    if (userAvatars[userId]) {
      return userAvatars[userId];
    }
    return 1;
  };

  //                                                                                                                     Khởi tạo avatar ngẫu nhiên cho tất cả các tác giả
  useEffect(() => {
    if (data?.data) {
      const newAvatars = { ...userAvatars };
      let hasChanges = false;

      data.data.forEach((post: any) => {
        if (post.author && post.author._id && !newAvatars[post.author._id]) {
          newAvatars[post.author._id] = Math.floor(Math.random() * 4) + 1;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setUserAvatars(newAvatars);
      }
    }
  }, [data?.data]);

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

  //                                                                                                                     Format ngày tháng
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };
  
  //                                                                                                                     Rút gọn nội dung
  const truncateContent = (content: string, length = 120) => {
    if (content.length <= length) return content;
    return content.substring(0, length) + '...';
  };

  //                                                                                                                     Xử lý xóa bài viết
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

  const openDeleteDialog = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletePostId(postId);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{(error as Error).message}</div>;
  }

  //                                                                                                                     Animation variants
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#2C8B3D]">
          {isMyPosts ? 'Bài viết của tôi' : 'Thảo luận dự án'}
        </h1>
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
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <Icon path={mdiComment} size={3} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">Không có bài viết nào</h3>
          <p className="text-sm text-gray-400 mt-1">
            {searchQuery 
              ? 'Không tìm thấy bài viết nào phù hợp với từ khóa tìm kiếm.'
              : isMyPosts 
                ? 'Bạn chưa tạo bài viết nào.'
                : 'Hãy bắt đầu cuộc thảo luận bằng cách tạo bài viết đầu tiên.' }
          </p>
          {!isMyPosts && (
            <Button 
              className="mt-4 bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
              onClick={() => router.push('/dashboard/forum/create')}
            >
              <Icon path={mdiPlus} size={0.8} className="mr-2" />
              Tạo bài viết mới
            </Button>
          )}
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
              <Link href={`/dashboard/forum/posts/${post._id}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-none relative group bg-gradient-to-br from-white via-[#f7fcf8] to-[#e6f3e9] before:absolute before:inset-0 before:bg-gradient-to-tr before:from-[#e1f5e4]/30 before:to-[#c7e9ce]/5 before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-500 border">
                  {/* Dải ribbon cho badge */}
                  <div className="absolute top-4 left-0">
                    <Badge 
                      variant="outline" 
                      className="rounded-r-full rounded-l-none py-1.5 px-4 bg-[#E9F3EB] text-[#2C8B3D] border-[#2C8B3D]/20 font-medium shadow-sm group-hover:bg-[#2C8B3D] group-hover:text-white transition-colors duration-300"
                    >
                      {post.project?.name || 'Chung'}
                    </Badge>
                  </div>
                  
                  {/* Menu tùy chọn */}
                  {(post as any).isAuthor && (
                    <div className="absolute top-3 right-3 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white">
                            <Icon path={mdiDotsVertical} size={0.7} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={(e) => {
                            e.preventDefault();
                            router.push(`/dashboard/forum/edit/${post._id}`);
                          }} className="flex items-center">
                            <Icon path={mdiPencil} size={0.7} className="mr-2 text-[#2C8B3D]" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="flex items-center text-red-600"
                            onClick={(e) => openDeleteDialog(e, post._id)}
                          >
                            <Icon path={mdiDelete} size={0.7} className="mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                  
                  <div className="pt-14 px-5"> {/* Padding top để tránh badge */}
                    <CardTitle className="text-xl font-bold text-[#333] group-hover:text-[#2C8B3D] transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
                      {post.title}
                    </CardTitle>
                    
                    <CardContent className="px-0 py-4">
                      <p className="text-gray-600 line-clamp-3 min-h-[4.5rem]">
                        {truncateContent(post.content)}
                      </p>
                    </CardContent>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-[#2C8B3D] bg-[#E9F3EB] px-2 py-1 rounded-full">
                          <Icon path={mdiEye} size={0.7} className="mr-1" />
                          <span className="text-sm font-medium">{post.viewCount || 0}</span>
                        </div>
                        <div className="flex items-center text-[#2C8B3D] bg-[#E9F3EB] px-2 py-1 rounded-full">
                          <Icon path={mdiComment} size={0.7} className="mr-1" />
                          <span className="text-sm font-medium">{post.commentCount || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardFooter className="p-0 pb-4 pt-3 border-t border-green-100 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative p-[2px] h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center">
                          <div className="p-[2px] bg-white rounded-full">
                            <Avatar className="!h-8 !w-8 flex-shrink-0">
                              {post.author?.avatar ? (
                                <AvatarImage src={post.author?.avatar} alt={post.author?.fullName} />
                              ) : (
                                <AvatarImage 
                                  src={`/images/dfavatar${getRandomAvatar(post.author?._id)}.png`} 
                                  alt={post.author?.fullName} 
                                />
                              )}
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {post.author?.fullName?.substring(0, 2).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-semibold">
                            {post.author?.fullName || 'Người dùng'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(post.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <motion.div 
                        className="bg-[#2C8B3D]/0 group-hover:bg-[#2C8B3D] w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Icon path={mdiEye} size={0.6} className="text-[#2C8B3D] group-hover:text-white" />
                      </motion.div>
                    </CardFooter>
                  </div>
                </Card>
              </Link>
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