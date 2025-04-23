'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiPlus, mdiPencil, mdiTrashCan, mdiFolder, mdiRefresh, mdiFolderCancel, mdiImagePlus, mdiHistory } from '@mdi/js';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  useCreateDocumentCategory, 
  useGetDocumentCategories,
  useUpdateDocumentCategory,
  useDeleteDocumentCategory
} from '@/hooks/useDocumentCategory';
import { IDocumentCategory } from '@/interface/response/documentCategory';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useUpload } from '@/hooks/useDocumentCategory';
import Image from 'next/image';

export default function DocumentCategoriesPage() {
  // State cho form thêm mới
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: '',
    description: '',
    icon: '',
  });

  // State cho form chỉnh sửa
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editCategoryForm, setEditCategoryForm] = useState({
    id: '',
    name: '',
    description: '',
    icon: '',
  });

  // State cho dialog xác nhận xóa
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<IDocumentCategory | null>(null);

  // Sử dụng các hooks
  const { data: categoriesData, isLoading, refetch } = useGetDocumentCategories();
  const createCategory = useCreateDocumentCategory();
  const updateCategory = useUpdateDocumentCategory();
  const deleteCategory = useDeleteDocumentCategory();
  // Sử dụng hook upload
  const { uploadFile, loading: uploadLoading } = useUpload();
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Handler cho form thêm mới
  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler cho form chỉnh sửa
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditCategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler cho việc chọn file hình ảnh - form thêm mới
  const handleAddFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadFile(file);
      if (response?.status) {
        const imageUrl = response.data.document.fileUrl;
        setNewCategoryForm(prev => ({
          ...prev,
          icon: imageUrl
        }));
        toast.success("Tải lên thành công", {
          description: "Đã tải lên hình ảnh icon"
        });
      }
    } catch (error: any) {
      toast.error("Lỗi khi tải lên", {
        description: error.message || "Đã xảy ra lỗi khi tải lên hình ảnh"
      });
    }
  };

  // Handler cho việc chọn file hình ảnh - form chỉnh sửa
  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadFile(file);
      if (response?.status) {
        const imageUrl = response.data.document.fileUrl;
        setEditCategoryForm(prev => ({
          ...prev,
          icon: imageUrl
        }));
        toast.success("Tải lên thành công", {
          description: "Đã tải lên hình ảnh icon"
        });
      }
    } catch (error: any) {
      toast.error("Lỗi khi tải lên", {
        description: error.message || "Đã xảy ra lỗi khi tải lên hình ảnh"
      });
    }
  };

  // Mở hộp thoại chọn file
  const handleOpenFileDialog = () => {
    addFileInputRef.current?.click();
  };

  // Xóa ảnh trong form thêm mới
  const handleRemoveAddImage = () => {
    setNewCategoryForm(prev => ({
      ...prev,
      icon: ''
    }));
  };

  // Xóa ảnh trong form chỉnh sửa
  const handleRemoveEditImage = () => {
    setEditCategoryForm(prev => ({
      ...prev,
      icon: ''
    }));
  };

  // Mở form chỉnh sửa với dữ liệu của danh mục được chọn
  const handleOpenEditDialog = (category: IDocumentCategory) => {
    setEditCategoryForm({
      id: category._id,
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
    });
    setIsEditDialogOpen(true);
  };

  // Mở dialog xác nhận xóa
  const handleOpenDeleteDialog = (category: IDocumentCategory) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  // Hàm tạo danh mục mới
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryForm.name.trim()) {
      toast.error("Thiếu thông tin", {
        description: "Vui lòng nhập tên danh mục"
      });
      return;
    }

    try {
      await createCategory.mutateAsync({
        name: newCategoryForm.name,
        description: newCategoryForm.description,
        icon: newCategoryForm.icon,
      });

      toast.success("Thành công", {
        description: "Đã tạo danh mục mới thành công"
      });

      // Reset form và đóng dialog
      setNewCategoryForm({
        name: '',
        description: '',
        icon: '',
      });
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Đã xảy ra lỗi khi tạo danh mục"
      });
    }
  };

  // Hàm cập nhật danh mục
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editCategoryForm.name.trim()) {
      toast.error("Thiếu thông tin", {
        description: "Vui lòng nhập tên danh mục"
      });
      return;
    }

    try {
      await updateCategory.mutateAsync({
        id: editCategoryForm.id,
        payload: {
          name: editCategoryForm.name,
          description: editCategoryForm.description,
          icon: editCategoryForm.icon,
        }
      });

      toast.success("Thành công", {
        description: "Đã cập nhật danh mục thành công"
      });

      // Reset form và đóng dialog
      setEditCategoryForm({
        id: '',
        name: '',
        description: '',
        icon: '',
      });
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Đã xảy ra lỗi khi cập nhật danh mục"
      });
    }
  };

  // Hàm xóa danh mục
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory.mutateAsync(categoryToDelete._id);

      toast.success("Thành công", {
        description: "Đã xóa danh mục thành công"
      });

      // Đóng dialog
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Đã xảy ra lỗi khi xóa danh mục"
      });
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Danh mục tài liệu</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold !text-maintext">Danh mục tài liệu</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Quản lý danh mục tài liệu</h1>
          <p className="text-muted-foreground mt-1">Tạo và quản lý các danh mục tài liệu trong hệ thống</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Icon path={mdiPlus} size={0.8} className="mr-1" />
                Thêm danh mục
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0">
              <ScrollArea className="max-h-[80vh]">
                <div className="p-6">
                  <DialogHeader className="pb-4">
                    <DialogTitle className='text-maintext'>Thêm danh mục tài liệu mới</DialogTitle>
                    <DialogDescription>
                      Điền thông tin để tạo danh mục tài liệu mới trong hệ thống.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateCategory}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className='text-maintext'>Tên danh mục</Label>
                        <Input
                          id="name"
                          className='bg-white focus:border-primary focus:ring-primary'
                          name="name"
                          value={newCategoryForm.name}
                          onChange={handleAddInputChange}
                          placeholder="Nhập tên danh mục"
                          required
                          disabled={createCategory.isPending}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="description" className='text-maintext'>Mô tả</Label>
                        <Textarea
                          id="description"
                          className='bg-white focus:border-primary focus:ring-primary'
                          name="description"
                          value={newCategoryForm.description}
                          onChange={handleAddInputChange}
                          placeholder="Nhập mô tả danh mục (tùy chọn)"
                          rows={3}
                          disabled={createCategory.isPending}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="icon" className='text-maintext'>Icon (hình ảnh)</Label>
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-start gap-3">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              onClick={handleOpenFileDialog}
                              disabled={createCategory.isPending || uploadLoading}
                              className="h-9 text-maintext bg-gray-200 transition-all duration-300 hover:bg-gray-300 rounded-sm border border-gray-100 w-full"
                            >
                              {uploadLoading ? "Đang tải lên..." : "Chọn hình ảnh"}
                              <Icon path={mdiImagePlus} size={0.8} className="ml-1 text-gray-500" />
                            </Button>
                            {newCategoryForm.icon && (
                              <div className="relative w-[158px] h-[158px] border rounded-md overflow-hidden shadow-sm group">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={handleRemoveAddImage}
                                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full z-10 flex items-center justify-center"
                                >
                                  <Icon path={mdiTrashCan} size={0.6} />
                                </Button>
                                <Image 
                                  src={newCategoryForm.icon} 
                                  alt="Icon preview" 
                                  height={200}
                                  width={200}
                                  className="object-contain h-full w-full"
                                  draggable={false}
                                  quality={100}
                                />
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            ref={addFileInputRef}
                            onChange={handleAddFileChange}
                            className="hidden"
                            accept="image/*"
                          />
                          <Input
                            id="icon"
                            className='bg-white focus:border-primary focus:ring-primary flex-1'
                            name="icon"
                            value={newCategoryForm.icon}
                            onChange={handleAddInputChange}
                            placeholder="Hoặc nhập URL hình ảnh"
                            disabled={createCategory.isPending}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddDialogOpen(false)}
                        disabled={createCategory.isPending}
                      >
                        Hủy
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={createCategory.isPending}
                      >
                        {createCategory.isPending ? 'Đang xử lý...' : 'Thêm danh mục'}
                      </Button>
                    </div>
                  </form>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Danh sách danh mục */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="pb-2">
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter>
                <div className="flex justify-between items-center w-full">
                  <Skeleton className="h-4 w-1/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : categoriesData?.data.length === 0 ? (
        <Card className="border border-dashed bg-white">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icon path={mdiFolderCancel} size={3} className="text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-maintext">Chưa có danh mục nào</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Bạn chưa tạo danh mục tài liệu nào. Hãy tạo danh mục để tổ chức tài liệu của bạn hiệu quả hơn.
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Icon path={mdiPlus} size={0.8} className="mr-2" />
                  Thêm danh mục đầu tiên
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {categoriesData?.data.map((category) => (
            <motion.div key={category._id} variants={item}>
              <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 border-l-emerald-600 border-t-0 border-r-0 border-b-0 rounded-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-maintext">
                    {category.icon ? (
                      <div className="h-8 w-8 min-w-8 overflow-hidden rounded-full bg-emerald-50 flex items-center justify-center">
                        <Image 
                          src={category.icon} 
                          alt={category.name} 
                          width={32} 
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="bg-emerald-100 p-1.5 rounded-full">
                        <Icon path={mdiFolder} size={0.9} className="text-emerald-600" />
                      </div>
                    )}
                    <span className="font-medium truncate">{category.name}</span>
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-1 flex items-center">
                    <Icon path={mdiHistory} size={0.7} className="mr-1 opacity-70" />
                    Tạo lúc: {formatDate(category.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2 flex-1 pt-4">
                  <p className="text-sm text-maintext leading-relaxed line-clamp-3">
                    {category.description || <span className="text-muted-foreground italic text-xs">Không có mô tả</span>}
                  </p>
                </CardContent>
                <CardFooter className="bg-slate-50 pt-3 pb-3">
                  <div className="w-full flex justify-end">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenEditDialog(category)}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-blue-200 transition-colors shadow-sm"
                      >
                        <Icon path={mdiPencil} size={0.7} className="mr-1" />
                        Sửa
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(category)}
                        className="bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 border-rose-200 transition-colors shadow-sm"
                      >
                        <Icon path={mdiTrashCan} size={0.7} className="mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Dialog chỉnh sửa danh mục */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>Chỉnh sửa danh mục tài liệu</DialogTitle>
                <DialogDescription>
                  Cập nhật thông tin danh mục tài liệu.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateCategory}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Tên danh mục</Label>
                    <Input
                      id="edit-name"
                      className='bg-white focus:border-primary focus:ring-primary'
                      name="name"
                      value={editCategoryForm.name}
                      onChange={handleEditInputChange}
                      placeholder="Nhập tên danh mục"
                      required
                      disabled={updateCategory.isPending}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Mô tả</Label>
                    <Textarea
                      id="edit-description"
                      className='bg-white focus:border-primary focus:ring-primary'
                      name="description"
                      value={editCategoryForm.description}
                      onChange={handleEditInputChange}
                      placeholder="Nhập mô tả danh mục (tùy chọn)"
                      rows={3}
                      disabled={updateCategory.isPending}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-icon">Icon (hình ảnh)</Label>
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-start gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => editFileInputRef.current?.click()}
                          disabled={updateCategory.isPending || uploadLoading}
                          className="!h-9 text-maintext w-full"
                        >
                          {uploadLoading ? "Đang tải lên..." : "Chọn hình ảnh"}
                          <Icon path={mdiImagePlus} size={0.8} className="ml-1 text-gray-400" />
                        </Button>
                        {editCategoryForm.icon && (
                          <div className="relative w-[158px] h-[158px] border rounded-md overflow-hidden shadow-sm group">
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={handleRemoveEditImage}
                              className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                              <Icon path={mdiTrashCan} size={0.7} />
                            </Button>
                            <Image 
                              src={editCategoryForm.icon} 
                              alt="Icon preview" 
                              height={200}
                              width={200}
                              className="object-contain h-full w-full"
                              draggable={false}
                              quality={100}
                            />
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={editFileInputRef}
                        onChange={handleEditFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <Input
                        id="edit-icon"
                        className='bg-white focus:border-primary focus:ring-primary flex-1'
                        name="icon"
                        value={editCategoryForm.icon}
                        onChange={handleEditInputChange}
                        placeholder="Hoặc nhập URL hình ảnh"
                        disabled={updateCategory.isPending}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                    disabled={updateCategory.isPending}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={updateCategory.isPending}
                  >
                    {updateCategory.isPending ? 'Đang xử lý...' : 'Cập nhật'}
                  </Button>
                </div>
              </form>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa danh mục */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>Xóa danh mục</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa danh mục "{categoryToDelete?.name}"? 
                  Thao tác này không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              
              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={deleteCategory.isPending}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                  onClick={handleDeleteCategory}
                  disabled={deleteCategory.isPending}
                >
                  {deleteCategory.isPending ? 'Đang xử lý...' : 'Xóa danh mục'}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
} 