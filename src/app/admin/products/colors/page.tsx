'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import {
  mdiMagnify,
  mdiPlus,
  mdiPencil,
  mdiDelete,
  mdiEyedropper,
  mdiCheck,
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
import { useColors, useCreateColor, useUpdateColor } from '@/hooks/product';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HexColorPicker, HexColorInput } from "react-colorful";

const colorFormSchema = z.object({
  name: z.string().min(1, "Tên màu không được để trống"),
  code: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Mã màu không hợp lệ (ví dụ: #FF5733)"),
});

type ColorFormValues = z.infer<typeof colorFormSchema>;

const predefinedColors = [
  { name: "Đen", hex: "#000000" },
  { name: "Trắng", hex: "#FFFFFF" },
  { name: "Đỏ", hex: "#FF0000" },
  { name: "Xanh lá", hex: "#00FF00" },
  { name: "Xanh dương", hex: "#0000FF" },
  { name: "Vàng", hex: "#FFFF00" },
  { name: "Hồng", hex: "#FF00FF" },
  { name: "Cam", hex: "#FFA500" },
  { name: "Tím", hex: "#800080" },
  { name: "Nâu", hex: "#A52A2A" },
  { name: "Xám", hex: "#808080" },
  { name: "Bạc", hex: "#C0C0C0" },
  { name: "Vàng nhạt", hex: "#FFFACD" },
  { name: "Xanh biển", hex: "#00FFFF" },
  { name: "Xanh ngọc", hex: "#40E0D0" },
  { name: "Đỏ đô", hex: "#800000" },
];

export default function ColorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<any | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("custom");

  const { colorsData, isLoading, refetch } = useColors();
  const createColorMutation = useCreateColor();
  const updateColorMutation = useUpdateColor();

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(colorFormSchema),
    defaultValues: {
      name: '',
      code: '#000000',
    },
  });

  const filteredColors = colorsData?.data?.filter((color: any) => {
    if (searchQuery) {
      return color.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  }) || [];

  const handleDeleteColor = (color: any) => {
    setColorToDelete(color);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteColor = () => {
    toast.success(`Đã xóa màu: ${colorToDelete?.name}`);
    setIsDeleteDialogOpen(false);
    setColorToDelete(null);
  };

  const handleOpenForm = (color?: any) => {
    if (color) {
      setEditingColor(color);
      form.setValue('name', color.name);
      form.setValue('code', color.code);
    } else {
      setEditingColor(null);
      form.reset({
        name: '',
        code: '#000000'
      });
    }
    setIsFormDialogOpen(true);
  };

  const handleSelectPredefinedColor = (color: { name: string, hex: string }) => {
    form.setValue('name', color.name);
    form.setValue('code', color.hex);
  };

  const onSubmit = (values: ColorFormValues) => {
    if (editingColor) {
      updateColorMutation.mutate(
        {
          colorId: editingColor._id,
          payload: values,
        },
        {
          onSuccess: () => {
            toast.success(`Đã cập nhật màu: ${values.name}`);
            setIsFormDialogOpen(false);
            refetch();
          },
          onError: (error) => {
            toast.error(`Lỗi: ${error.message}`);
          },
        }
      );
    } else {
      createColorMutation.mutate(values, {
        onSuccess: () => {
          toast.success(`Đã thêm màu: ${values.name}`);
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
        <h1 className="text-2xl font-bold">Quản lý màu sắc</h1>
        <Button 
          className="flex items-center" 
          onClick={() => handleOpenForm()}
          disabled={createColorMutation.isPending}
        >
          <Icon path={mdiPlus} size={0.8} className="mr-2" />
          Thêm màu mới
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div className="relative w-full sm:w-80">
              <Input
                placeholder="Tìm màu sắc..."
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
                  <TableHead className="w-[80px]">Mẫu màu</TableHead>
                  <TableHead>Tên màu</TableHead>
                  <TableHead>Mã màu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      <p className="text-gray-400">Đang tải dữ liệu...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredColors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      <p className="text-gray-400">Không tìm thấy màu sắc nào phù hợp.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredColors.map((color: any) => (
                    <TableRow key={color._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div 
                          className="w-10 h-10 rounded-md border border-gray-200"
                          style={{ backgroundColor: color.code }}
                        ></div>
                      </TableCell>
                      <TableCell className="font-medium">{color.name}</TableCell>
                      <TableCell className="font-mono text-sm">{color.code}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          color.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {color.status === 'active' ? 'Đang hoạt động' : 'Đã vô hiệu'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title="Chỉnh sửa"
                            onClick={() => handleOpenForm(color)}
                            disabled={updateColorMutation.isPending}
                          >
                            <Icon path={mdiPencil} size={0.7} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500"
                            title="Xóa"
                            onClick={() => handleDeleteColor(color)}
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
            <DialogTitle>Xác nhận xóa màu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa màu <span className="font-medium">{colorToDelete?.name}</span>? Hành động này không thể hoàn tác và sẽ ảnh hưởng đến các sản phẩm liên quan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDeleteColor}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <AnimatePresence>
        {isFormDialogOpen && (
          <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingColor ? 'Chỉnh sửa màu' : 'Thêm màu mới'}</DialogTitle>
              </DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Tabs defaultValue="custom" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="custom">Tùy chỉnh</TabsTrigger>
                    <TabsTrigger value="preset">Màu có sẵn</TabsTrigger>
                  </TabsList>
                  <TabsContent value="custom" className="mt-4">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tên màu</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập tên màu" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mã màu</FormLabel>
                              <div className="flex flex-col gap-4">
                                <div className="flex gap-3 items-center">
                                  <div 
                                    className="w-10 h-10 rounded-md border border-gray-200"
                                    style={{ backgroundColor: field.value }}
                                  ></div>
                                  <FormControl>
                                    <div className="relative flex-1">
                                      <HexColorInput
                                        className="w-full p-2 border rounded-md pl-6"
                                        color={field.value}
                                        onChange={field.onChange}
                                        prefixed
                                      />
                                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        #
                                      </span>
                                    </div>
                                  </FormControl>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="icon"
                                        className="h-10 w-10"
                                      >
                                        <Icon path={mdiEyedropper} size={0.7} />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64">
                                      <HexColorPicker
                                        color={field.value}
                                        onChange={field.onChange}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter className="pt-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsFormDialogOpen(false)}
                          >
                            Hủy
                          </Button>
                          <Button 
                            type="submit"
                            disabled={createColorMutation.isPending || updateColorMutation.isPending}
                          >
                            {editingColor ? 'Cập nhật' : 'Thêm mới'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </TabsContent>
                  <TabsContent value="preset" className="mt-4">
                    <div className="grid grid-cols-4 gap-2 pb-4">
                      {predefinedColors.map((color) => (
                        <Button
                          key={color.hex}
                          type="button"
                          variant="outline"
                          className="h-14 px-2 flex flex-col items-center justify-center gap-1 relative border"
                          onClick={() => handleSelectPredefinedColor(color)}
                        >
                          <div 
                            className="w-8 h-8 rounded-full border"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <span className="text-xs overflow-hidden text-ellipsis w-full text-center">
                            {color.name}
                          </span>
                          {form.getValues('code') === color.hex && (
                            <div className="absolute top-1 right-1 bg-primary rounded-full w-4 h-4 flex items-center justify-center">
                              <Icon path={mdiCheck} size={0.5} className="text-white" />
                            </div>
                          )}
                        </Button>
                      ))}
                    </div>
                    <div className="flex justify-between pt-4 border-t">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsFormDialogOpen(false)}
                      >
                        Hủy
                      </Button>
                      <Button 
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={createColorMutation.isPending || updateColorMutation.isPending}
                      >
                        {editingColor ? 'Cập nhật' : 'Thêm mới'}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
} 