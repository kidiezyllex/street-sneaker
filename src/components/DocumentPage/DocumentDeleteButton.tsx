'use client';

import { useState } from 'react';
import { useDeleteDocument } from '@/hooks/useDocument';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiDeleteOutline } from '@mdi/js';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentDeleteButtonProps {
  documentId: string;
  documentTitle: string;
  onSuccess?: () => void;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function DocumentDeleteButton({
  documentId,
  documentTitle,
  onSuccess,
  variant = 'outline',
  size = 'sm',
  className = '',
}: DocumentDeleteButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deleteDocument = useDeleteDocument();

  const handleDelete = async () => {
    try {
      await deleteDocument.mutateAsync(documentId);
      toast.success('Xóa tài liệu thành công');
      setIsConfirmOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error('Xóa tài liệu thất bại', {
        description: error.message || 'Đã có lỗi xảy ra khi xóa tài liệu',
      });
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsConfirmOpen(true)}
        className={`text-red-medium hover:text-red-medium/90 ${className}`}
      >
        <Icon path={mdiDeleteOutline} size={0.8} className="mr-1" />
        Xóa
      </Button>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <ScrollArea className="max-h-[80vh]">
            <div className="p-2">
              <DialogHeader className="pb-4">
                <DialogTitle>Xóa tài liệu</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa tài liệu "<span className="font-medium">{documentTitle}</span>"? 
                  Thao tác này không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              
              <DialogFooter className="pt-4 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsConfirmOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  onClick={handleDelete}
                  className="bg-red-medium hover:bg-red-medium/90"
                  disabled={deleteDocument.isPending}
                >
                  {deleteDocument.isPending ? 'Đang xử lý...' : 'Xóa tài liệu'}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
} 