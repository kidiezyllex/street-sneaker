'use client';

import { useState, useEffect, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import { mdiPlus, mdiDeleteCircle } from '@mdi/js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSizes, useDeleteSize, useCreateSize } from '@/hooks/attributes';
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
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const filteredSizes = useMemo(() => {
        if (!data?.data || !searchQuery.trim()) return data?.data;

        const query = searchQuery.toLowerCase().trim();
        const numericQuery = Number(query);
        return data.data.filter(size =>
            !isNaN(numericQuery) ? size.value === numericQuery : String(size.value).includes(query)
        );
    }, [data?.data, searchQuery]);

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
        <div className="space-y-4">
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

            {isLoading ? (
                <div className="bg-white rounded-[6px] shadow-sm overflow-visible">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">ID</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Kích cỡ</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Trạng thái</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Ngày cập nhật</TableHead>
                                    <TableHead className="px-4 py-4 text-right text-sm font-medium text-maintext">Thao tác</TableHead>
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
                                                <Skeleton className="h-8 w-8 rounded-[6px]" />
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
                                                <Skeleton className="h-8 w-8 rounded-[6px]" />
                                                <Skeleton className="h-8 w-8 rounded-[6px]" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            ) : isError ? (
                <div className="bg-white rounded-[6px] shadow-sm p-4 text-center">
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
                <div className="bg-white rounded-[6px] shadow-sm overflow-visible">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">ID</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Kích cỡ</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Trạng thái</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Ngày cập nhật</TableHead>
                                    <TableHead className="px-4 py-4 text-right text-sm font-medium text-maintext">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSizes?.length ? (
                                    filteredSizes.map((size) => (
                                        <TableRow key={size._id} className="hover:bg-gray-50">
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-maintext">
                                                {size._id}
                                            </TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-[6px] bg-gray-100 flex items-center justify-center border border-gray-200">
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
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-maintext">
                                                {formatDate(size.updatedAt)}
                                            </TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end space-x-2">
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
                                        <TableCell colSpan={5} className="px-4 py-8 text-center text-maintext">
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
                        setFormData({
                            value: 0,
                            status: 'HOAT_DONG'
                        });
                        onClose();
                    },
                    onError: (error) => {
                        if (error.message === "Duplicate entry. This record already exists.") {
                        } else {
                            toast.error('Thêm kích cỡ thất bại: Giá trị kích cỡ đã tồn tại.');
                        }
                    }
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle>Thêm kích cỡ mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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