'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import { mdiMagnify, mdiPlus, mdiPencilCircle, mdiDeleteCircle } from '@mdi/js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSizes, useDeleteSize, useSizeDetail, useUpdateSize, useCreateSize } from '@/hooks/attributes';
import { ISizeFilter } from '@/interface/request/attributes';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SizesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ISizeFilter>({});
  const { data, isLoading, isError } = useSizes(filters);
  const deleteSize = useDeleteSize();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sizeToDelete, setSizeToDelete] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sizeToEdit, setSizeToEdit] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredSizes = useMemo(() => {
    if (!data?.data || !searchQuery.trim()) return data?.data;

    const query = searchQuery.toLowerCase().trim();
    const numericQuery = Number(query);
    return data.data.filter(size =>
      !isNaN(numericQuery) ? size.value === numericQuery : String(size.value).includes(query)
    );
  }, [data?.data, searchQuery]);

  const handleFilterChange = (key: keyof ISizeFilter, value: any) => {
    if (value === 'all' || value === '') {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  const handleDeleteSize = async (id: string) => {
    try {
      await deleteSize.mutateAsync(id, {
        onSuccess: () => {
          toast.success('Đã xóa kích cỡ thành công');
          queryClient.invalidateQueries({ queryKey: ['sizes'] });
        },
      });
    } catch (error) {
      toast.error('Xóa kích cỡ thất bại');
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-start'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/products">Quản lý sản phẩm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Kích cỡ</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

      </div>

      <Card className="mb-4">
        <CardContent className="py-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <div className="relative flex-1 max-w-md">
              <Icon
                path={mdiMagnify}
                size={0.9}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                placeholder="Tìm kiếm theo giá trị kích cỡ..."
                className="pl-10 pr-4 py-2 w-full border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2'>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="HOAT_DONG">Hoạt động</SelectItem>
                  <SelectItem value="KHONG_HOAT_DONG">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Icon path={mdiPlus} size={0.9} />
                    Thêm kích cỡ mới
                  </Button>
                </DialogTrigger>
                <CreateSizeDialog
                  isOpen={isCreateDialogOpen}
                  onClose={() => setIsCreateDialogOpen(false)}
                />
              </Dialog>
            </div>
          </div>

        </CardContent>
      </Card>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm overflow-visible">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-gray-500">ID</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-gray-500">Kích cỡ</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-gray-500">Trạng thái</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-gray-500">Ngày cập nhật</TableHead>
                  <TableHead className="px-4 py-4 text-right text-sm font-medium text-gray-500">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <Skeleton className="h-6 w-[100px] rounded-full" />
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : isError ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['sizes'] })}
          >
            Thử lại
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-visible">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-gray-500">ID</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-gray-500">Kích cỡ</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-gray-500">Trạng thái</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-gray-500">Ngày cập nhật</TableHead>
                  <TableHead className="px-4 py-4 text-right text-sm font-medium text-gray-500">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSizes?.length ? (
                  filteredSizes.map((size) => (
                    <TableRow key={size._id} className="hover:bg-gray-50">
                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {size._id}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                            <span className="text-sm font-medium">{size.value}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${size.status === 'HOAT_DONG'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {size.status === 'HOAT_DONG' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(size.updatedAt)}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Dialog open={isEditDialogOpen && sizeToEdit === size._id} onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (!open) setSizeToEdit(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                title="Sửa"
                                onClick={() => {
                                  setSizeToEdit(size._id);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Icon path={mdiPencilCircle} size={0.9} />
                              </Button>
                            </DialogTrigger>
                            {sizeToEdit === size._id && (
                              <EditSizeDialog
                                sizeId={size._id}
                                isOpen={isEditDialogOpen}
                                onClose={() => {
                                  setIsEditDialogOpen(false);
                                  setSizeToEdit(null);
                                }}
                              />
                            )}
                          </Dialog>
                          <Dialog open={isDeleteDialogOpen && sizeToDelete === size._id} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setSizeToDelete(size._id);
                                  setIsDeleteDialogOpen(true);
                                }}
                                title="Xóa"
                              >
                                <Icon path={mdiDeleteCircle} size={0.9} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Xác nhận xóa kích cỡ</DialogTitle>
                              </DialogHeader>
                              <p>Bạn có chắc chắn muốn xóa kích cỡ này không?</p>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
                                </DialogClose>
                                <Button variant="destructive" onClick={() => {
                                  if (sizeToDelete) {
                                    handleDeleteSize(sizeToDelete);
                                    setIsDeleteDialogOpen(false);
                                  }
                                }}>Xóa</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      Không tìm thấy kích cỡ nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

// Edit Size Dialog Component
interface EditSizeDialogProps {
  sizeId: string;
  isOpen: boolean;
  onClose: () => void;
}

function EditSizeDialog({ sizeId, isOpen, onClose }: EditSizeDialogProps) {
  const queryClient = useQueryClient();
  const { data: sizeData, isLoading, isError } = useSizeDetail(sizeId);
  const updateSize = useUpdateSize();

  const [formData, setFormData] = useState({
    value: 0,
    status: 'HOAT_DONG' as 'HOAT_DONG' | 'KHONG_HOAT_DONG'
  });

  const [errors, setErrors] = useState({
    value: ''
  });

  useEffect(() => {
    if (sizeData?.data) {
      setFormData({
        value: sizeData.data.value,
        status: sizeData.data.status
      });
    }
  }, [sizeData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'value') {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setFormData((prev) => ({ ...prev, [name]: numValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as 'HOAT_DONG' | 'KHONG_HOAT_DONG' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (formData.value <= 0) {
      newErrors.value = 'Giá trị kích cỡ phải lớn hơn 0';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await updateSize.mutateAsync(
        {
          sizeId: sizeId,
          payload: formData
        },
        {
          onSuccess: () => {
            toast.success('Cập nhật kích cỡ thành công');
            queryClient.invalidateQueries({ queryKey: ['size', sizeId] });
            queryClient.invalidateQueries({ queryKey: ['sizes'] });
            onClose();
          },
          onError: (error) => {
            toast.error('Cập nhật kích cỡ thất bại: ' + error.message);
          }
        }
      );
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi cập nhật kích cỡ');
    }
  };

  if (isLoading) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle><Skeleton className="h-8 w-[200px]" /></DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex justify-end space-x-4">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[150px]" />
          </div>
        </div>
      </DialogContent>
    );
  }

  if (isError || !sizeData) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lỗi</DialogTitle>
        </DialogHeader>
        <div className="py-6 text-center">
          <p className="text-red-500 mb-4">Đã xảy ra lỗi khi tải dữ liệu kích cỡ.</p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['size', sizeId] })}>
              Thử lại
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Chỉnh sửa kích cỡ: {sizeData.data.value}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="value">Giá trị kích cỡ</Label>
          <Input
            id="value"
            name="value"
            type="number"
            placeholder="Nhập giá trị kích cỡ"
            value={formData.value}
            onChange={handleInputChange}
            className={errors.value ? 'border-red-500' : ''}
          />
          {errors.value && <p className="text-red-500 text-sm">{errors.value}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái</Label>
          <Select value={formData.status} onValueChange={handleStatusChange}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOAT_DONG">Hoạt động</SelectItem>
              <SelectItem value="KHONG_HOAT_DONG">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={updateSize.isPending}>
            {updateSize.isPending ? 'Đang xử lý...' : 'Cập nhật kích cỡ'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

// Create Size Dialog Component
interface CreateSizeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateSizeDialog({ isOpen, onClose }: CreateSizeDialogProps) {
  const queryClient = useQueryClient();
  const createSize = useCreateSize();

  const [formData, setFormData] = useState({
    value: 0,
    status: 'HOAT_DONG' as 'HOAT_DONG' | 'KHONG_HOAT_DONG'
  });

  const [errors, setErrors] = useState({
    value: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'value') {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setFormData((prev) => ({ ...prev, [name]: numValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as 'HOAT_DONG' | 'KHONG_HOAT_DONG' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (formData.value <= 0) {
      newErrors.value = 'Giá trị kích cỡ phải lớn hơn 0';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createSize.mutateAsync(
        formData,
        {
          onSuccess: () => {
            toast.success('Thêm kích cỡ thành công');
            queryClient.invalidateQueries({ queryKey: ['sizes'] });
            // Reset form
            setFormData({
              value: 0,
              status: 'HOAT_DONG'
            });
            onClose();
          },
          onError: (error) => {
            toast.error('Thêm kích cỡ thất bại: ' + error.message);
          }
        }
      );
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi thêm kích cỡ');
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Thêm kích cỡ mới</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="create-value">Giá trị kích cỡ</Label>
          <Input
            id="create-value"
            name="value"
            type="number"
            placeholder="Nhập giá trị kích cỡ"
            value={formData.value || ''}
            onChange={handleInputChange}
            className={errors.value ? 'border-red-500' : ''}
          />
          {errors.value && <p className="text-red-500 text-sm">{errors.value}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="create-status">Trạng thái</Label>
          <Select value={formData.status} onValueChange={handleStatusChange}>
            <SelectTrigger id="create-status">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOAT_DONG">Hoạt động</SelectItem>
              <SelectItem value="KHONG_HOAT_DONG">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={createSize.isPending}>
            {createSize.isPending ? 'Đang xử lý...' : 'Thêm kích cỡ'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
} 