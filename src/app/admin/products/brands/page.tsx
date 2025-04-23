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
  mdiWeb,
  mdiImageOutline,
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
import Image from 'next/image';
import { Brand, brands } from '@/components/ProductsPage/mockData';

// Thêm dữ liệu bổ sung cho brands
const enhancedBrands = brands.map(brand => ({
  ...brand,
  description: brand.name === 'Nike' ? 'Thương hiệu giày thể thao hàng đầu thế giới.' : 
               brand.name === 'Adidas' ? 'Thương hiệu thể thao từ Đức với công nghệ Boost tiên tiến.' :
               brand.name === 'Puma' ? 'Thương hiệu thể thao và thời trang từ Đức.' :
               brand.name === 'New Balance' ? 'Nhà sản xuất giày thể thao từ Mỹ.' :
               brand.name === 'Converse' ? 'Thương hiệu giày thời trang nổi tiếng toàn cầu.' : '',
  website: brand.name === 'Nike' ? 'https://www.nike.com' : 
           brand.name === 'Adidas' ? 'https://www.adidas.com' :
           brand.name === 'Puma' ? 'https://www.puma.com' :
           brand.name === 'New Balance' ? 'https://www.newbalance.com' :
           brand.name === 'Converse' ? 'https://www.converse.com' : '',
}));

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [viewLogo, setViewLogo] = useState<string | null>(null);

  // Filter brands based on search query
  const filteredBrands = enhancedBrands.filter((brand: Brand & { description?: string; website?: string }) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        brand.name.toLowerCase().includes(query) ||
        (brand.description && brand.description.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Handle delete brand
  const handleDeleteBrand = (brand: Brand & { description?: string; website?: string }) => {
    setBrandToDelete(brand);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete brand
  const confirmDeleteBrand = () => {
    console.log(`Deleted brand: ${brandToDelete?.name}`);
    setIsDeleteDialogOpen(false);
    setBrandToDelete(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">Quản lý thương hiệu</h1>
        <Button className="flex items-center">
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
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      <p className="text-gray-400">Không tìm thấy thương hiệu nào phù hợp.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBrands.map((brand: any) => (
                    <TableRow key={brand.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div 
                          className="relative h-14 w-14 cursor-pointer border rounded overflow-hidden flex items-center justify-center bg-gray-50"
                          onClick={() => setViewLogo(brand.logo)}
                        >
                          {brand.logo && (
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              width={56}
                              height={56}
                              className="object-contain"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{brand.name}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">
                          {brand.description || "Không có mô tả"}
                        </div>
                      </TableCell>
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
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title="Chỉnh sửa"
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
              Bạn có chắc chắn muốn xóa thương hiệu <span className="font-medium">{brandToDelete?.name}</span>? Hành động này không thể hoàn tác và sẽ xóa tất cả sản phẩm liên quan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDeleteBrand}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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