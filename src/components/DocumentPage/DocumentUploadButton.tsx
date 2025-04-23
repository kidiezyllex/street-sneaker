'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiUpload } from '@mdi/js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import FileUpload from '@/components/Common/FileUpload';

interface DocumentUploadButtonProps {
  type: 'personal' | 'project' | 'shared';
  projectId?: string;
}

export default function DocumentUploadButton({ 
  type, 
  projectId 
}: DocumentUploadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90">
          <Icon path={mdiUpload} size={0.8} className="mr-2" />
          Tải lên tài liệu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6">
            <DialogHeader className="pb-4">
              <DialogTitle className='text-maintext'>Tải lên tài liệu mới</DialogTitle>
            </DialogHeader>
            <FileUpload onSuccess={() => setIsOpen(false)} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 