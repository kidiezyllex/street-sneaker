'use client';

import { useEffect, useState } from 'react';
import { 
  useGetDocumentById, 
  useUpdateDocument, 
  useShareDocument, 
  useUnshareDocument 
} from '@/hooks/useDocument';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@mdi/react';
import { 
  mdiDownload, 
  mdiPencil,
  mdiCheck,
  mdiClose,
  mdiShareVariant,
  mdiAccountMultiplePlus,
  mdiAccountRemove,
  mdiFileImage,
  mdiFilePdfBox,
  mdiFileWordBox,
  mdiFileExcelBox,
  mdiFilePowerpointBox,
  mdiFile
} from '@mdi/js';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import { ICreator } from '@/interface/response/document';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetDocumentCategories } from '@/hooks/useDocumentCategory';
import { useGetUsers } from '@/hooks/useUser';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface DocumentDetailProps {
  id: string;
  onBack?: () => void;
}

export default function DocumentDetail({ id, onBack }: DocumentDetailProps) {
  const { data, isLoading, error } = useGetDocumentById(id);
  const updateDocument = useUpdateDocument();
  const shareDocument = useShareDocument();
  const unshareDocument = useUnshareDocument();
  const { data: categoriesData } = useGetDocumentCategories();
  const { data: usersData } = useGetUsers();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    categoryId: '',
  });
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (data?.data) {
      setEditForm({
        title: data.data.title,
        description: data.data.description || '',
        categoryId: data.data.category?._id || '',
      });
    }
  }, [data]);

  const getFileIcon = (fileUrl: string) => {
    const extension = fileUrl?.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return mdiFileImage;
      case 'pdf':
        return mdiFilePdfBox;
      case 'doc':
      case 'docx':
        return mdiFileWordBox;
      case 'xls':
      case 'xlsx':
        return mdiFileExcelBox;
      case 'ppt':
      case 'pptx':
        return mdiFilePowerpointBox;
      default:
        return mdiFile;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (!data?.data) return;
    toast.info('Đang tải xuống tài liệu...');
    // Giả lập tải xuống
    setTimeout(() => {
      toast.success('Tài liệu đã được tải xuống thành công!');
    }, 1500);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (data?.data) {
      setEditForm({
        title: data.data.title,
        description: data.data.description || '',
        categoryId: data.data.category?._id || '',
      });
    }
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    try {
      await updateDocument.mutateAsync({
        id,
        payload: {
          title: editForm.title,
          description: editForm.description,
          category: editForm.categoryId || undefined,
        }
      });
      setIsEditing(false);
      toast.success('Cập nhật tài liệu thành công!');
    } catch (error: any) {
      toast.error('Không thể cập nhật tài liệu', {
        description: error.message
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setEditForm(prev => ({
      ...prev,
      categoryId: value
    }));
  };

  const handleShareDocument = async () => {
    if (!selectedUsers.length) {
      toast.warning('Vui lòng chọn ít nhất một người dùng để chia sẻ');
      return;
    }

    try {
      await shareDocument.mutateAsync({
        id,
        payload: {
          userIds: selectedUsers
        }
      });
      setShowShareDialog(false);
      setSelectedUsers([]);
      toast.success('Chia sẻ tài liệu thành công!');
    } catch (error: any) {
      toast.error('Không thể chia sẻ tài liệu', {
        description: error.message
      });
    }
  };

  const handleUnshareDocument = async (userId: string) => {
    try {
      await unshareDocument.mutateAsync({
        documentId: id,
        userId
      });
      toast.success('Đã hủy chia sẻ tài liệu với người dùng này!');
    } catch (error: any) {
      toast.error('Không thể hủy chia sẻ tài liệu', {
        description: error.message
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md border border-red-200">
        {error?.message || 'Không thể tải thông tin tài liệu'}
      </div>
    );
  }

  const document = data.data;

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/documents">Quản lý tài liệu</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold !text-maintext">Chi tiết tài liệu</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Chi tiết tài liệu</h1>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
        )}
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          {!isEditing ? (
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-maintext mb-2">{document.title}</CardTitle>
                {document.category && (
                  <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                    {document.category.name}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEdit}
                  className="text-blue-medium"
                >
                  <Icon path={mdiPencil} size={0.8} className="mr-1" />
                  Chỉnh sửa
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowShareDialog(true)}
                  className="text-extra"
                >
                  <Icon path={mdiShareVariant} size={0.8} className="mr-1" />
                  Chia sẻ
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownload}
                  className="text-primary"
                >
                  <Icon path={mdiDownload} size={0.8} className="mr-1" />
                  Tải xuống
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={editForm.title} 
                  onChange={handleInputChange} 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Danh mục</Label>
                <Select 
                  value={editForm.categoryId} 
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Không có danh mục</SelectItem>
                    {categoriesData?.data.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCancelEdit}>
                  <Icon path={mdiClose} size={0.8} className="mr-1" />
                  Hủy
                </Button>
                <Button onClick={handleSaveEdit} className="bg-primary hover:bg-primary/90">
                  <Icon path={mdiCheck} size={0.8} className="mr-1" />
                  Lưu
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Mô tả</h3>
            {!isEditing ? (
              <p className="text-maintext">{document.description || 'Không có mô tả'}</p>
            ) : (
              <Textarea 
                name="description" 
                value={editForm.description} 
                onChange={handleInputChange} 
                rows={4}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-medium text-sm text-muted-foreground">Thông tin tập tin</h3>
                <div className="flex items-center gap-4 p-4 bg-background rounded-md border border-border">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon 
                      path={getFileIcon(document.filePath)} 
                      size={1} 
                      className="text-primary" 
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{document.filePath.split('/').pop()}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(document.fileSize)} • {document.fileType}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-medium text-sm text-muted-foreground">Tạo bởi</h3>
                <div className="flex items-center gap-4 p-3 bg-background rounded-md border border-border">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    {document.creator.avatar ? (
                      <img 
                        src={document.creator.avatar} 
                        alt={document.creator.fullName} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-primary font-medium">{document.creator.fullName.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{document.creator.fullName}</div>
                    <div className="text-xs text-muted-foreground">{document.creator.email}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-medium text-sm text-muted-foreground">Thông tin thời gian</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-background rounded-md border border-border">
                    <div className="text-xs text-muted-foreground">Ngày tạo</div>
                    <div className="text-sm font-medium">{formatDate(document.createdAt)}</div>
                  </div>
                  <div className="p-3 bg-background rounded-md border border-border">
                    <div className="text-xs text-muted-foreground">Cập nhật lần cuối</div>
                    <div className="text-sm font-medium">{formatDate(document.updatedAt)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm text-muted-foreground">Chia sẻ với ({document.sharedWith.length})</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowShareDialog(true)}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    <Icon path={mdiAccountMultiplePlus} size={0.6} className="mr-1" />
                    Thêm người dùng
                  </Button>
                </div>
                
                {document.sharedWith.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {document.sharedWith.map((user: ICreator) => (
                      <div 
                        key={user._id} 
                        className="flex justify-between items-center p-2 bg-background rounded-md border border-border"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.fullName} 
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-primary font-medium">{user.fullName.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{user.fullName}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUnshareDocument(user._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Icon path={mdiAccountRemove} size={0.8} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-muted/20 rounded-md border border-dashed border-muted">
                    <p className="text-muted-foreground text-sm">Tài liệu này chưa được chia sẻ với ai</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog chia sẻ tài liệu */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chia sẻ tài liệu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label>Chọn người dùng để chia sẻ</Label>
            <Select onValueChange={(value) => setSelectedUsers([value])}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn người dùng" />
              </SelectTrigger>
              <SelectContent>
                {usersData?.data
                  .filter(user => 
                    // Lọc ra các người dùng chưa được chia sẻ
                    !document.sharedWith.some(shared => shared._id === user._id) && 
                    // Loại trừ người tạo
                    user._id !== document.creator._id
                  )
                  .map(user => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.fullName} ({user.email})
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowShareDialog(false);
                setSelectedUsers([]);
              }}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleShareDocument}
              className="bg-primary hover:bg-primary/90"
              disabled={shareDocument.isPending || selectedUsers.length === 0}
            >
              {shareDocument.isPending ? 'Đang xử lý...' : 'Chia sẻ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 