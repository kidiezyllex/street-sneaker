'use client';

import React, { useRef } from 'react';
import { IProductVariant } from '@/interface/request/product';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiUpload, mdiLoading, mdiTrashCanOutline, mdiImageOutline } from '@mdi/js';
import Image from 'next/image';
import { checkImageUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductVariantFormProps {
  variant: IProductVariant;
  onChange: (variant: IProductVariant) => void;
  onImageUpload: (file: File) => Promise<void>;
  onRemoveImage: (index: number) => void;
  uploading: boolean;
}

const ProductVariantForm: React.FC<ProductVariantFormProps> = ({
  variant,
  onChange,
  onImageUpload,
  onRemoveImage,
  uploading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'stock') {
      onChange({
        ...variant,
        [name]: parseInt(value) || 0
      });
    } else {
      onChange({
        ...variant,
        [name]: value
      });
    }
  };

  const handleColorChange = (value: string) => {
    onChange({
      ...variant,
      colorId: value
    });
  };

  const handleSizeChange = (value: string) => {
    onChange({
      ...variant,
      sizeId: value
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        await onImageUpload(files[i]);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`colorId-${variant.colorId}`}>Màu sắc <span className="text-red-500">*</span></Label>
          <Select
            value={variant.colorId}
            onValueChange={handleColorChange}
            required
          >
            <SelectTrigger id={`colorId-${variant.colorId}`} className="w-full">
              <SelectValue placeholder="Chọn màu sắc" />
            </SelectTrigger>
            <SelectContent>
              {[
                { id: 'black', name: 'Đen' },
                { id: 'white', name: 'Trắng' },
                { id: 'red', name: 'Đỏ' },
                { id: 'blue', name: 'Xanh dương' },
                { id: 'green', name: 'Xanh lá' },
                { id: 'yellow', name: 'Vàng' },
                { id: 'gray', name: 'Xám' }
              ].map(color => (
                <SelectItem key={color.id} value={color.id}>
                  {color.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`sizeId-${variant.sizeId}`}>Kích thước <span className="text-red-500">*</span></Label>
          <Select
            value={variant.sizeId}
            onValueChange={handleSizeChange}
            required
          >
            <SelectTrigger id={`sizeId-${variant.sizeId}`} className="w-full">
              <SelectValue placeholder="Chọn kích thước" />
            </SelectTrigger>
            <SelectContent>
              {[
                { id: 'eu35', name: 'EU 35' },
                { id: 'eu36', name: 'EU 36' },
                { id: 'eu37', name: 'EU 37' },
                { id: 'eu38', name: 'EU 38' },
                { id: 'eu39', name: 'EU 39' },
                { id: 'eu40', name: 'EU 40' },
                { id: 'eu41', name: 'EU 41' },
                { id: 'eu42', name: 'EU 42' },
                { id: 'eu43', name: 'EU 43' },
                { id: 'eu44', name: 'EU 44' },
                { id: 'eu45', name: 'EU 45' },
              ].map(size => (
                <SelectItem key={size.id} value={size.id}>
                  {size.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`price-${variant.price}`}>Giá <span className="text-red-500">*</span></Label>
          <Input
            id={`price-${variant.price}`}
            name="price"
            type="number"
            min="0"
            value={variant.price || ''}
            onChange={handleInputChange}
            placeholder="Nhập giá"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`stock-${variant.stock}`}>Số lượng tồn kho</Label>
          <Input
            id={`stock-${variant.stock}`}
            name="stock"
            type="number"
            min="0"
            value={variant.stock || ''}
            onChange={handleInputChange}
            placeholder="Nhập số lượng tồn kho"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Hình ảnh sản phẩm</Label>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Icon path={mdiLoading} size={0.9} className="animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <Icon path={mdiUpload} size={0.9} />
                  Tải lên hình ảnh
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {variant.images && variant.images.length > 0 ? (
              <AnimatePresence>
                {variant.images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="relative group rounded-md overflow-hidden border border-gray-200"
                    style={{ aspectRatio: '1/1' }}
                  >
                    <Image
                      src={checkImageUrl(image)}
                      alt={`Variant image ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onRemoveImage(index)}
                      >
                        <Icon path={mdiTrashCanOutline} size={0.9} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div
                className="flex items-center justify-center border border-dashed border-gray-300 rounded-md text-gray-400"
                style={{ aspectRatio: '1/1' }}
              >
                <div className="flex flex-col items-center p-4">
                  <Icon path={mdiImageOutline} size={1.5} />
                  <p className="text-xs mt-2">Chưa có hình ảnh</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductVariantForm; 