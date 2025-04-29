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
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCategories, useCreateCategory, useUpdateCategory } from '@/hooks/product';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const typeFormSchema = z.object({
  name: z.string().min(1, "Tên loại giày không được để trống"),
});

export default function ShoeTypesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<any | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<any | null>(null);

  const { categoriesData, isLoading, refetch } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const form = useForm<z.infer<typeof typeFormSchema>>({
    resolver: zodResolver(typeFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const filteredTypes = categoriesData?.data?.filter((type: any) => {
    if (searchQuery) {
      return type.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  }) || [];

  const handleDeleteType = (type: any) => {
    setTypeToDelete(type);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteType = () => {
    toast.success(`Đã xóa loại giày: ${typeToDelete?.name}`);
    setIsDeleteDialogOpen(false);
    setTypeToDelete(null);
  };

  const handleOpenForm = (type?: any) => {
    if (type) {
      setEditingType(type);
      form.setValue('name', type.name);
    } else {
      setEditingType(null);
      form.reset();
    }
    setIsFormDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof typeFormSchema>) => {
    if (editingType) {
      updateCategoryMutation.mutate(
        {
          categoryId: editingType._id,
          payload: values,
        },
        {
          onSuccess: () => {
            toast.success(`Đã cập nhật loại giày: ${values.name}`);
            setIsFormDialogOpen(false);
            refetch();
          },
          onError: (error) => {
            toast.error(`Lỗi: ${error.message}`);
          },
        }
      );
    } else {
      createCategoryMutation.mutate(values, {
        onSuccess: () => {
          toast.success(`Đã thêm loại giày: ${values.name}`);
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
        <h1 className="text-2xl font-bold">Quản lý loại giày</h1>
        <Button 
          className="flex items-center" 
          onClick={() => handleOpenForm()}
          disabled={createCategoryMutation.isPending}
        >
          <Icon path={mdiPlus} size={0.8} className="mr-2" />
          Thêm loại giày mới
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="relative w-full sm:w-80">
              <Input
                placeholder="Tìm loại giày..."
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
                  <TableHead>Tên loại giày</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      <p className="text-gray-400">Đang tải dữ liệu...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      <p className="text-gray-400">Không tìm thấy loại giày nào phù hợp.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTypes.map((type: any) => (
                    <TableRow key={type._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          type.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {type.status === 'active' ? 'Đang hoạt động' : 'Đã vô hiệu'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title="Chỉnh sửa"
                            onClick={() => handleOpenForm(type)}
                            disabled={updateCategoryMutation.isPending}
                          >
                            <Icon path={mdiPencil} size={0.7} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500"
                            title="Xóa"
                            onClick={() => handleDeleteType(type)}
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
            <DialogTitle>Xác nhận xóa loại giày</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa loại giày <span className="font-medium">{typeToDelete?.name}</span>? Hành động này không thể hoàn tác và sẽ ảnh hưởng đến các sản phẩm liên quan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDeleteType}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <AnimatePresence>
        {isFormDialogOpen && (
          <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingType ? 'Chỉnh sửa loại giày' : 'Thêm loại giày mới'}</DialogTitle>
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
                          <FormLabel>Tên loại giày</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên loại giày" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                        disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                      >
                        {editingType ? 'Cập nhật' : 'Thêm mới'}
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