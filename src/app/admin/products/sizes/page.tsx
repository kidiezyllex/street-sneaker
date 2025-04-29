'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import {
  mdiMagnify,
  mdiPlus,
  mdiPencil,
  mdiDelete,
  mdiSort,
  mdiSortAscending,
  mdiSortDescending,
} from '@mdi/js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSizes, useCreateSize, useUpdateSize } from '@/hooks/product';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const sizeFormSchema = z.object({
  name: z.string().min(1, "Tên kích thước không được để trống"),
  euSize: z.coerce.number().min(15, "Kích thước EU phải ≥ 15").max(50, "Kích thước EU phải ≤ 50"),
  usSize: z.coerce.number().min(1, "Kích thước US phải ≥ 1").max(20, "Kích thước US phải ≤ 20"),
  ukSize: z.coerce.number().min(1, "Kích thước UK phải ≥ 1").max(20, "Kích thước UK phải ≤ 20"),
});

type SizeFormValues = z.infer<typeof sizeFormSchema>;

export default function SizesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sizeToDelete, setSizeToDelete] = useState<any | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<any | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { sizesData, isLoading, refetch } = useSizes();
  const createSizeMutation = useCreateSize();
  const updateSizeMutation = useUpdateSize();

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues: {
      name: '',
      euSize: 40,
      usSize: 7,
      ukSize: 6.5,
    },
  });

  const filteredSizes = sizesData?.data
    ?.filter((size: any) => {
      if (searchQuery) {
        return size.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               String(size.euSize).includes(searchQuery) ||
               String(size.usSize).includes(searchQuery) ||
               String(size.ukSize).includes(searchQuery);
      }
      return true;
    })
    .sort((a: any, b: any) => {
      if (!sortField) return 0;
      
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    }) || [];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return mdiSort;
    return sortDirection === 'asc' ? mdiSortAscending : mdiSortDescending;
  };

  const handleDeleteSize = (size: any) => {
    setSizeToDelete(size);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSize = () => {
    toast.success(`Đã xóa kích thước: ${sizeToDelete?.name}`);
    setIsDeleteDialogOpen(false);
    setSizeToDelete(null);
  };

  const handleOpenForm = (size?: any) => {
    if (size) {
      setEditingSize(size);
      form.reset({
        name: size.name,
        euSize: size.euSize,
        usSize: size.usSize,
        ukSize: size.ukSize,
      });
    } else {
      setEditingSize(null);
      form.reset({
        name: '',
        euSize: 40,
        usSize: 7,
        ukSize: 6.5,
      });
    }
    setIsFormDialogOpen(true);
  };

  const onSubmit = (values: SizeFormValues) => {
    if (editingSize) {
      updateSizeMutation.mutate(
        {
          sizeId: editingSize._id,
          payload: values,
        },
        {
          onSuccess: () => {
            toast.success(`Đã cập nhật kích thước: ${values.name}`);
            setIsFormDialogOpen(false);
            refetch();
          },
          onError: (error) => {
            toast.error(`Lỗi: ${error.message}`);
          },
        }
      );
    } else {
      createSizeMutation.mutate(values, {
        onSuccess: () => {
          toast.success(`Đã thêm kích thước: ${values.name}`);
          setIsFormDialogOpen(false);
          refetch();
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        },
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">Quản lý kích thước giày</h1>
        <Button 
          className="flex items-center" 
          onClick={() => handleOpenForm()}
          disabled={createSizeMutation.isPending}
        >
          <Icon path={mdiPlus} size={0.8} className="mr-2" />
          Thêm kích thước mới
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="relative w-full sm:w-80">
              <Input
                placeholder="Tìm kích thước..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Icon path={mdiMagnify} size={0.9} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Tên kích thước
                      <Icon path={getSortIcon('name')} size={0.6} className="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('euSize')}
                  >
                    <div className="flex items-center">
                      EU Size
                      <Icon path={getSortIcon('euSize')} size={0.6} className="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('usSize')}
                  >
                    <div className="flex items-center">
                      US Size
                      <Icon path={getSortIcon('usSize')} size={0.6} className="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('ukSize')}
                  >
                    <div className="flex items-center">
                      UK Size
                      <Icon path={getSortIcon('ukSize')} size={0.6} className="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      <p className="text-gray-400">Đang tải dữ liệu...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredSizes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      <p className="text-gray-400">Không tìm thấy kích thước nào phù hợp.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSizes.map((size: any) => (
                    <TableRow key={size._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{size.name}</TableCell>
                      <TableCell>{size.euSize}</TableCell>
                      <TableCell>{size.usSize}</TableCell>
                      <TableCell>{size.ukSize}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          size.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {size.status === 'active' ? 'Đang hoạt động' : 'Đã vô hiệu'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title="Chỉnh sửa"
                            onClick={() => handleOpenForm(size)}
                            disabled={updateSizeMutation.isPending}
                          >
                            <Icon path={mdiPencil} size={0.7} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500"
                            title="Xóa"
                            onClick={() => handleDeleteSize(size)}
                          >
                            <Icon path={mdiDelete} size={0.7} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa kích thước</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa kích thước <span className="font-medium">{sizeToDelete?.name}</span>? Hành động này không thể hoàn tác và sẽ ảnh hưởng đến các sản phẩm liên quan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDeleteSize}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <AnimatePresence>
        {isFormDialogOpen && (
          <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSize ? 'Chỉnh sửa kích thước' : 'Thêm kích thước mới'}</DialogTitle>
              </DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên kích thước</FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: Size 40" {...field} />
                          </FormControl>
                          <FormDescription>
                            Nhập tên hiển thị của kích thước này.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="euSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>EU Size</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="40" 
                                {...field}
                                min={15}
                                max={50}
                                step={0.5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="usSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>US Size</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="7" 
                                {...field}
                                min={1}
                                max={20}
                                step={0.5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ukSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>UK Size</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="6.5" 
                                {...field}
                                min={1}
                                max={20}
                                step={0.5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsFormDialogOpen(false)}
                      >
                        Hủy
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createSizeMutation.isPending || updateSizeMutation.isPending}
                      >
                        {editingSize ? 'Cập nhật' : 'Thêm mới'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
} 