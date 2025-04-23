'use client';

import { useEffect, useState } from 'react';
import { useDeleteDocument, useGetDocuments, useShareDocument } from '@/hooks/useDocument';
import { useGetDocumentCategories } from '@/hooks/useDocumentCategory';
import { useGetUsers } from '@/hooks/useUser';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { 
  mdiDownload, 
  mdiShareVariant, 
  mdiDotsVertical, 
  mdiMagnify,
  mdiNoteRemove,
  mdiFileImage,
  mdiFilePdfBox,
  mdiFileWordBox,
  mdiFileExcelBox,
  mdiFilePowerpointBox,
  mdiFileVideo,
  mdiFileMusic,
  mdiFileDocument,
  mdiEye,
  mdiTrashCanOutline,
  mdiShieldAccount,
  mdiEmail,
  mdiRefresh,
} from '@mdi/js';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IDocument } from '@/interface/response/document';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mdiFileOutline, mdiFilterOutline } from '@mdi/js';

interface DocumentListProps {
  type: 'personal' | 'project' | 'shared' | 'all';
  projectId?: string;
  onViewDocument?: (documentId: string) => void;
  data?: {
    data: IDocument[];
    isLoading?: boolean;
    error?: Error;
  };
}

export default function DocumentList({ type, projectId, onViewDocument, data }: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [filteredDocuments, setFilteredDocuments] = useState<IDocument[]>([]);
  const [viewDocument, setViewDocument] = useState<IDocument | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
  const [shareEmail, setShareEmail] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{id: string, title: string} | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const params: any = {};
  if (type === 'personal') {
    params.project = undefined;
  } else if (type === 'project' && projectId) {
    params.project = projectId;
  } else if (type === 'shared') {
    params.project = "shared";
  } else if (type === 'all') {
    // Không cần thêm tham số
  }
  
  const { 
    data: documentsData, 
    isLoading: isLoadingDocuments, 
    error: documentsError,
    refetch: refetchDocuments
  } = useGetDocuments(data ? undefined : params);

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetDocumentCategories();
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsers();
  const { mutate: deleteDocument } = useDeleteDocument();
  const { mutate: shareDocument, isPending: isSharing } = useShareDocument();

  // Định nghĩa các loại file phổ biến
  const fileTypes = [
    { value: 'image', label: 'Hình ảnh', pattern: 'image/' },
    { value: 'pdf', label: 'PDF', pattern: 'application/pdf' },
    { value: 'word', label: 'Word', pattern: 'word' },
    { value: 'excel', label: 'Excel', pattern: 'excel' },
    { value: 'powerpoint', label: 'PowerPoint', pattern: 'powerpoint' },
    { value: 'video', label: 'Video', pattern: 'video/' },
    { value: 'audio', label: 'Âm thanh', pattern: 'audio/' },
    { value: 'text', label: 'Văn bản', pattern: 'text/' },
    { value: 'other', label: 'Khác', pattern: '' }
  ];

  // Hàm kiểm tra loại file phù hợp với pattern
  const matchFileType = (fileType: string, pattern: string) => {
    if (pattern === '') return true; // 'Khác' sẽ hiển thị tất cả
    return fileType.includes(pattern);
  };

  useEffect(() => {
    // Sử dụng data từ prop hoặc từ useGetDocuments
    const documents = data?.data || documentsData?.data;
    if (!documents) return;
    
    let filtered = [...documents];
    
    // Lọc theo danh mục  
    if (selectedCategory) {
      filtered = filtered.filter(doc => doc.category?._id === selectedCategory);
    }
    
    // Lọc theo loại file
    if (selectedFileType) {
      const selectedPattern = fileTypes.find(ft => ft.value === selectedFileType)?.pattern || '';
      if (selectedFileType === 'other') {
        // Loại 'Khác' sẽ lọc ra các file không thuộc các loại đã định nghĩa
        filtered = filtered.filter(doc => {
          return !fileTypes.some(ft => 
            ft.value !== 'other' && ft.pattern && doc.fileType.includes(ft.pattern)
          );
        });
      } else if (selectedPattern) {
        filtered = filtered.filter(doc => doc.fileType.includes(selectedPattern));
      }
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        doc => 
          doc.title.toLowerCase().includes(query) || 
          doc.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredDocuments(filtered);
  }, [documentsData, data, selectedCategory, selectedFileType, searchQuery]);

  // Xác định icon cho từng loại file
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return mdiFileImage;
    } else if (fileType === 'application/pdf') {
      return mdiFilePdfBox;
    } else if (fileType.includes('word') || fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return mdiFileWordBox;
    } else if (fileType.includes('excel') || fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return mdiFileExcelBox;
    } else if (fileType.includes('powerpoint') || fileType === 'application/vnd.ms-powerpoint' || fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      return mdiFilePowerpointBox;
    } else if (fileType.startsWith('video/')) {
      return mdiFileVideo;
    } else if (fileType.startsWith('audio/')) {
      return mdiFileMusic;
    } else if (fileType.startsWith('text/')) {
      return mdiFileDocument;
    } else {
      return mdiNoteRemove;
    }
  };

  // Lấy màu cho từng loại file
  const getIconColor = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return "text-blue-500"; // Màu xanh dương cho hình ảnh
    } else if (fileType === 'application/pdf') {
      return "text-red-500"; // Màu đỏ cho PDF
    } else if (fileType.includes('word') || fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return "text-blue-700"; // Màu xanh đậm cho Word
    } else if (fileType.includes('excel') || fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return "text-green-600"; // Màu xanh lá cho Excel
    } else if (fileType.includes('powerpoint') || fileType === 'application/vnd.ms-powerpoint' || fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      return "text-orange-500"; // Màu cam cho PowerPoint
    } else if (fileType.startsWith('video/')) {
      return "text-purple-600"; // Màu tím cho video
    } else if (fileType.startsWith('audio/')) {
      return "text-pink-500"; // Màu hồng cho âm thanh
    } else if (fileType.startsWith('text/')) {
      return "text-gray-700"; // Màu xám đậm cho văn bản
    } else {
      return "text-gray-400"; // Màu xám nhạt cho các file khác
    }
  };

  // Format kích thước file
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  // Xử lý tải xuống
  const handleDownload = (fileUrl: string, fileName: string) => {
    try {
      // Tạo một request mới để tải file
      fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => {
          // Tạo một URL từ blob
          const blobUrl = window.URL.createObjectURL(blob);
          
          // Tạo thẻ a và cấu hình
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName || 'download';
          
          // Thêm vào body, kích hoạt sự kiện click, và xóa đi
          document.body.appendChild(link);
          link.click();
          
          // Dọn dẹp
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
          }, 100);
          
          toast.success('Đang tải xuống tài liệu');
        })
        .catch(error => {
          console.error('Download error:', error);
          // Fallback: Mở URL trong tab mới
          window.open(fileUrl, '_blank');
          toast.info('Đang mở tài liệu trong tab mới');
        });
    } catch (error) {
      toast.error('Không thể tải xuống tài liệu');
      console.error('Download error:', error);
    }
  };

  // Tìm tên người dùng theo ID
  const findUserNameById = (userId: string) => {
    const user = usersData?.data.find(user => user._id === userId);
    return user ? user.fullName : '';
  };

  // Xử lý chia sẻ
  const handleShare = (docId: string) => {
    setSelectedDocumentId(docId);
    setSelectedUserId('');
    setSelectedUserName('');
    setShareDialogOpen(true);
  };
  
  const handleShareSubmit = () => {
    if (!selectedUserId || !selectedDocumentId) {
      toast.error('Vui lòng chọn người dùng');
      return;
    }
    
    shareDocument(
      { 
        id: selectedDocumentId, 
        payload: { userIds: [selectedUserId] } 
      },
      {
        onSuccess: () => {
          toast.success('Đã chia sẻ tài liệu thành công');
          setShareDialogOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Không thể chia sẻ tài liệu');
        }
      }
    );
  };

  // Xử lý xem chi tiết
  const handleViewDocument = (docId: string) => {
    if (onViewDocument) {
      onViewDocument(docId);
      return;
    }
    
    const document = filteredDocuments.find(doc => doc._id === docId);
    if (!document) {
      toast.error('Không tìm thấy tài liệu');
      return;
    }
    
    setViewDocument(document);
    setViewDialogOpen(true);
  };

  // Hiển thị nội dung phù hợp với loại file
  const renderDocumentContent = (document: IDocument) => {
    const { fileType, fileUrl } = document;
    
    if (fileType.startsWith('image/')) {
      return (
        <div className="flex justify-center overflow-auto max-h-[70vh]">
          <img 
            src={fileUrl} 
            alt={document.title} 
            className="max-w-full object-contain"
          />
        </div>
      );
    } else if (fileType.startsWith('video/')) {
      return (
        <div className="flex justify-center">
          <video 
            src={fileUrl} 
            controls 
            className="max-w-full max-h-[70vh]"
          >
            Trình duyệt của bạn không hỗ trợ video này.
          </video>
        </div>
      );
    } else if (fileType.startsWith('audio/')) {
      return (
        <div className="flex justify-center p-4">
          <audio 
            src={fileUrl} 
            controls 
            className="w-full"
          >
            Trình duyệt của bạn không hỗ trợ audio này.
          </audio>
        </div>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <div className="h-[70vh] w-full">
          <iframe 
            src={fileUrl} 
            className="w-full h-full border-none" 
            title={document.title}
          ></iframe>
        </div>
      );
    } else if (fileType === 'text/plain') {
      return (
        <div className="bg-gray-50 p-4 rounded overflow-auto max-h-[70vh]">
          <iframe 
            src={fileUrl} 
            className="w-full h-[60vh] border-none" 
            title={document.title}
          ></iframe>
        </div>
      );
    } else {
      return (
        <div className="text-center py-8">
          <Icon 
            path={getFileIcon(fileType)} 
            size={4} 
            className={`mx-auto mb-4 ${getIconColor(fileType)}`}
          />
          <p className="text-gray-500 mb-4">
            Trình duyệt không thể hiển thị loại file này. Vui lòng tải về để xem.
          </p>
          <Button
            onClick={() => handleDownload(fileUrl, document.title)}
            className="bg-primary hover:bg-primary/90"
          >
            <Icon path={mdiDownload} size={0.7} className="mr-2" />
            Tải xuống
          </Button>
        </div>
      );
    }
  };

  // Xử lý xóa tài liệu
  const handleDeleteDocument = (docId: string, docTitle: string) => {
    setDocumentToDelete({id: docId, title: docTitle});
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteDocument = () => {
    if (!documentToDelete) return;
    
    deleteDocument(documentToDelete.id, {
      onSuccess: () => {
        toast.success('Đã xóa tài liệu thành công');
        setDeleteDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Không thể xóa tài liệu');
      }
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetchDocuments().finally(() => {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 800);
    });
  };

  if (data?.isLoading || isLoadingDocuments || isLoadingCategories || isLoadingUsers) {
    return (
      <div>
        <div className="flex relative flex-1 max-w-md mb-4">
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="flex gap-2 flex-wrap mb-6">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-40 bg-muted/30 flex items-center justify-center">
                <Skeleton className="h-20 w-20 rounded-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (data?.error || documentsError) {
    return <div className="text-red-500 p-4">{((data?.error || documentsError) as Error).message}</div>;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Icon 
            path={mdiMagnify} 
            size={0.8}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            className="pl-10 bg-white focus:border-primary focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 md:gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            title="Làm mới tài liệu"
            className='w-8'
          >
            <Icon path={mdiRefresh} size={0.7} className={`text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <div className="w-44">
            <Select value={selectedFileType || "all"} onValueChange={(value) => setSelectedFileType(value === "all" ? null : value)}>
              <SelectTrigger className="bg-white">
                <div className="flex items-center gap-2">
                  <Icon path={mdiFilterOutline} size={0.7} className="text-gray-500" />
                  <span>{selectedFileType ? fileTypes.find(ft => ft.value === selectedFileType)?.label : 'Loại file'}</span>
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-sm">
                <SelectItem value="all">Tất cả loại file</SelectItem>
                {fileTypes.map(fileType => (
                  <SelectItem key={fileType.value} value={fileType.value}>
                    <div className="flex items-center gap-2">
                      <Icon 
                        path={getFileIcon(fileType.pattern || 'unknown')} 
                        size={0.7} 
                        className={getIconColor(fileType.pattern || 'unknown')}
                      />
                      <span>{fileType.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-[#2C8B3D] hover:bg-[#2C8B3D]/90" : ""}
            >
              Tất cả
            </Button>
            {categoriesData?.data.map((category) => (
              <Button
                key={category._id}
                variant={selectedCategory === category._id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category._id)}
                className={selectedCategory === category._id ? "bg-[#2C8B3D] hover:bg-[#2C8B3D]/90" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white rounded-lg border border-dashed flex flex-col items-center justify-center">
          <div className="bg-gray-50 p-6 rounded-full mb-4">
            <Icon 
              path={mdiNoteRemove} 
              size={3} 
              className="text-gray-400" 
            />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">Không tìm thấy tài liệu nào</h3>
          <p className="text-sm text-gray-500 max-w-md">
            {searchQuery 
              ? 'Không tìm thấy kết quả phù hợp. Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn.' 
              : 'Hiện chưa có tài liệu nào. Tạo tài liệu mới để bắt đầu.'}
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredDocuments.map((document) => (
            <motion.div key={document._id} variants={item}>
              <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md border-gray-100 bg-white">
                <div 
                  className="h-40 bg-gray-50 flex items-center justify-center cursor-pointer relative group"
                  onClick={() => handleViewDocument(document._id)}
                >
                  <Icon 
                    path={getFileIcon(document.fileType)} 
                    size={3} 
                    className={`${getIconColor(document.fileType)} opacity-80 transition-transform group-hover:scale-110`}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="mb-2 flex justify-between items-start">
                    <h3 
                      className="text-base font-semibold text-gray-800 line-clamp-2 hover:text-primary cursor-pointer" 
                      onClick={() => handleViewDocument(document._id)}
                      title={document.title}
                    >
                      {document.title}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full h-8 w-8 -mr-2 -mt-1 hover:bg-gray-100"
                        >
                          <Icon path={mdiDotsVertical} size={0.7} className="text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => handleViewDocument(document._id)}
                        >
                          <Icon path={mdiEye} size={0.7} className="mr-2 text-blue-500" />
                          <span>Xem chi tiết</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => handleDownload(document.fileUrl, document.title)}
                        >
                          <Icon path={mdiDownload} size={0.7} className="mr-2 text-blue-500" />
                          <span>Tải xuống</span>
                        </DropdownMenuItem>
                        {type !== 'shared' && (
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleShare(document._id)}
                          >
                            <Icon path={mdiShareVariant} size={0.7} className="mr-2 text-blue-500" />
                            <span>Chia sẻ</span>
                          </DropdownMenuItem>
                        )}
                        {type !== 'shared' && (
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                            onClick={() => handleDeleteDocument(document._id, document.title)}
                          >
                            <Icon path={mdiTrashCanOutline} size={0.7} className="mr-2" />
                            <span>Xóa</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[40px]">
                    {document.description 
                      ? document.description
                      : 'Không có mô tả'}
                  </div>
                  
                  <div className="mb-2 flex flex-wrap gap-2">
                    {document.category && (
                      <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20 px-2 py-0.5 rounded-md">
                        {document.category.name}
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 px-2 py-0.5 rounded-md">
                      {document.fileType.split('/')[1].toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 px-2 py-0.5 rounded-md">
                      {formatFileSize(document.fileSize)}
                    </Badge>
                  </div>
                  
                  <div className="mt-auto pt-3 flex justify-between items-center text-xs text-gray-500 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700 mb-0.5">{document.creator.fullName}</span>
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-gray-300 rounded-full"></span>
                        {formatDate(document.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Dialog xem tài liệu */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh]">
          {viewDocument && (
            <>
              <DialogHeader className="border-b pb-2">
                <DialogTitle className="text-xl">{viewDocument.title}</DialogTitle>
                <div className="text-sm text-gray-500 flex flex-wrap gap-2 mt-1">
                  {viewDocument.category && (
                    <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20 px-2 py-0.5 rounded-md">
                      {viewDocument.category.name}
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 px-2 py-0.5 rounded-md">
                    {viewDocument.fileType.split('/')[1].toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 px-2 py-0.5 rounded-md">
                    {formatFileSize(viewDocument.fileSize)}
                  </Badge>
                </div>
              </DialogHeader>
              <ScrollArea className="flex-1 h-[60vh]">
                <div className="py-4">
                  {viewDocument.description && (
                    <p className="text-sm text-gray-600 mb-4 italic">
                      {viewDocument.description}
                    </p>
                  )}
                  {renderDocumentContent(viewDocument)}
                </div>
              </ScrollArea>
              <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
                <div className="text-xs text-gray-500 mr-auto">
                  <span>Người tạo: {viewDocument.creator.fullName}</span>
                  <span className="mx-2">|</span>
                  <span>Ngày tạo: {formatDate(viewDocument.createdAt)}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleDownload(viewDocument.fileUrl, viewDocument.title)}
                >
                  <Icon path={mdiDownload} size={0.7} className="mr-2" />
                  Tải xuống
                </Button>
                <DialogClose asChild>
                  <Button variant="default" className="bg-primary hover:bg-primary/90">
                    Đóng
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog chia sẻ tài liệu */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chia sẻ tài liệu</DialogTitle>
            <div className="text-sm text-gray-500 mt-1">
              Chọn người dùng bạn muốn chia sẻ tài liệu này
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Người dùng
              </label>
              <Select
                value={selectedUserId}
                onValueChange={(value) => {
                  setSelectedUserId(value);
                  setSelectedUserName(findUserNameById(value));
                }}
              >
                <SelectTrigger className="bg-white focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Chọn người dùng">
                    {selectedUserName || "Chọn người dùng"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {isLoadingUsers ? (
                    <div className="flex items-center justify-center py-2">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                      <span>Đang tải...</span>
                    </div>
                  ) : (
                    usersData?.data.map((user: any) => (
                      <SelectItem key={user._id} value={user._id} className="py-2">
                        <div className="flex flex-col">
                          <span className="font-medium text-maintext">{user.fullName}</span>
                          <div className="flex text-xs text-muted-foreground mt-1 items-center">
                            <Icon path={mdiShieldAccount} size={0.6} className="mr-2 text-gray-400" />
                            <span className="mr-2">{user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</span>
                            <Icon path={mdiEmail} size={0.6} className="mr-2 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShareDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleShareSubmit}
              disabled={isSharing || !selectedUserId}
              className="bg-primary hover:bg-primary/90"
            >
              {isSharing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                  Đang chia sẻ...
                </>
              ) : (
                <>
                  <Icon path={mdiShareVariant} size={0.7} className="mr-2" />
                  Chia sẻ
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa tài liệu */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <div className="text-sm text-gray-500 mt-1">
              {documentToDelete && `Bạn có chắc chắn muốn xóa tài liệu "${documentToDelete.title}"?`}
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button 
              onClick={confirmDeleteDocument}
              variant="destructive"
            >
              Xóa tài liệu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 