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
  mdiWeb,
  mdiImageOutline,
  mdiUpload,
  mdiClose,
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
import Image from 'next/image';
import { useBrands, useCreateBrand, useUpdateBrand } from '@/hooks/product';
import { useUploadImage } from '@/hooks/upload';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const brandFormSchema = z.object({
  name: z.string().min(1, "Tên thương hiệu không được để trống"),
  website: z.string().url("URL website không hợp lệ").or(z.string().length(0)),
  logo: z.any()
    .refine((file) => !file || !file.name || file.size <= MAX_FILE_SIZE, `Kích thước file tối đa là 5MB`)
    .refine(
      (file) => !file || !file.name || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Chỉ chấp nhận định dạng .jpg, .jpeg, .png và .webp"
    )
    .optional(),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<any | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [viewLogo, setViewLogo] = useState<string | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { brandsData, isLoading, refetch } = useBrands();
  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();
  const uploadImageMutation = useUploadImage();

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: '',
      website: '',
      logo: undefined,
    },
  });

  const filteredBrands = brandsData?.data?.filter((brand: any) => {
    if (searchQuery) {
      return brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  }) || [];

  const handleDeleteBrand = (brand: any) => {
    setBrandToDelete(brand);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteBrand = () => {
    toast.success(`Đã xóa thương hiệu: ${brandToDelete?.name}`);
    setIsDeleteDialogOpen(false);
    setBrandToDelete(null);
  };

  const handleOpenForm = (brand?: any) => {
    if (brand) {
      setEditingBrand(brand);
      form.setValue('name', brand.name);
      form.setValue('website', brand.website || '');
      setPreviewLogo(brand.logo);
    } else {
      setEditingBrand(null);
      form.reset();
      setPreviewLogo(null);
    }
    setIsFormDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('logo', file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    form.setValue('logo', undefined);
    setPreviewLogo(editingBrand?.logo || null);
  };

  const uploadLogoImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await uploadImageMutation.mutateAsync(formData);
      return response.imageUrl;
    } catch (error) {
      toast.error('Không thể tải lên hình ảnh');
      throw error;
    }
  };

  const onSubmit = async (values: BrandFormValues) => {
    let logoUrl = editingBrand?.logo || null;

    try {
      if (values.logo && (values.logo as File).name) {
        logoUrl = await uploadLogoImage(values.logo as File);
      }

      const payload = {
        name: values.name,
        website: values.website,
        logo: logoUrl,
      };

      if (editingBrand) {
        updateBrandMutation.mutate(
          {
            brandId: editingBrand._id,
            payload,
          },
          {
            onSuccess: () => {
              toast.success(`Đã cập nhật thương hiệu: ${values.name}`);
              setIsFormDialogOpen(false);
              refetch();
            },
            onError: (error) => {
              toast.error(`Lỗi: ${error.message}`);
            },
          }
        );
      } else {
        createBrandMutation.mutate(payload, {
          onSuccess: () => {
            toast.success(`Đã thêm thương hiệu: ${values.name}`);
            setIsFormDialogOpen(false);
            refetch();
          },
          onError: (error) => {
            toast.error(`Lỗi: ${error.message}`);
          },
        });
      }
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">Quản lý thương hiệu</h1>
        <Button 
          className="flex items-center" 
          onClick={() => handleOpenForm()}
          disabled={createBrandMutation.isPending}
        >
          <Icon path={mdiPlus} size={0.8} className="mr-2" />
          Thêm thương hiệu mới
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="relative w-full sm:w-80">
              <Input
                placeholder="Tìm thương hiệu..."
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
                  <TableHead className="w-[100px]">Logo</TableHead>
                  <TableHead>Tên thương hiệu</TableHead>
                  <TableHead>Website</TableHead>
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
                ) : filteredBrands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      <p className="text-gray-400">Không tìm thấy thương hiệu nào phù hợp.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBrands.map((brand: any) => (
                    <TableRow key={brand._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div 
                          className="relative h-14 w-14 cursor-pointer border rounded overflow-hidden flex items-center justify-center bg-gray-50"
                          onClick={() => setViewLogo(brand.logo)}
                        >
                          {brand.logo ? (
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              width={56}
                              height={56}
                              className="object-contain"
                            />
                          ) : (
                            <Icon path={mdiImageOutline} size={1.2} className="text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{brand.name}</TableCell>
                      <TableCell>
                        {brand.website ? (
                          <a 
                            href={brand.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:underline"
                          >
                            <Icon path={mdiWeb} size={0.6} className="mr-1.5" />
                            <span className="truncate max-w-[180px]">
                              {brand.website.replace(/^https?:\/\//, '')}
                            </span>
                          </a>
                        ) : (
                          <span className="text-gray-400">Không có website</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          brand.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {brand.status === 'active' ? 'Đang hoạt động' : 'Đã vô hiệu'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title="Chỉnh sửa"
                            onClick={() => handleOpenForm(brand)}
                            disabled={updateBrandMutation.isPending}
                          >
                            <Icon path={mdiPencil} size={0.7} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500"
                            title="Xóa"
                            onClick={() => handleDeleteBrand(brand)}
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
            <DialogTitle>Xác nhận xóa thương hiệu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa thương hiệu <span className="font-medium">{brandToDelete?.name}</span>? Hành động này không thể hoàn tác và sẽ ảnh hưởng đến các sản phẩm liên quan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDeleteBrand}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <AnimatePresence>
        {isFormDialogOpen && (
          <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}</DialogTitle>
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
                          <FormLabel>Tên thương hiệu</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên thương hiệu" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (không bắt buộc)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                          <FormLabel>Logo thương hiệu</FormLabel>
                          <div className="space-y-4">
                            {previewLogo && (
                              <div className="relative h-32 w-32 mx-auto border rounded">
                                <Image
                                  src={previewLogo}
                                  alt="Logo preview"
                                  fill
                                  className="object-contain p-2"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200"
                                  onClick={clearFileInput}
                                >
                                  <Icon path={mdiClose} size={0.6} />
                                </Button>
                              </div>
                            )}
                            <div className="flex items-center justify-center">
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full flex items-center justify-center"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Icon path={mdiUpload} size={0.8} className="mr-2" />
                                {previewLogo ? 'Chọn logo khác' : 'Tải lên logo'}
                              </Button>
                              <input
                                type="file"
                                ref={fileInputRef}
                                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                className="hidden"
                                onChange={handleFileChange}
                                {...rest}
                              />
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
                        disabled={createBrandMutation.isPending || updateBrandMutation.isPending || uploadImageMutation.isPending}
                      >
                        {uploadImageMutation.isPending ? 'Đang tải lên...' : editingBrand ? 'Cập nhật' : 'Thêm mới'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Logo Viewer Dialog */}
      <Dialog open={!!viewLogo} onOpenChange={(open) => !open && setViewLogo(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Logo thương hiệu</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {viewLogo && (
              <div className="relative h-64 w-full">
                <Image
                  src={viewLogo}
                  alt="Logo thương hiệu"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 