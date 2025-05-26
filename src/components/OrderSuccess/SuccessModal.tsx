'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderCode?: string;
}

export default function SuccessModal({ isOpen, onClose, orderId, orderCode }: SuccessModalProps) {
  const router = useRouter();

  const handleViewOrder = () => {
    onClose();
    router.push('/account#account-tabs?tab=orders');
  };

  const handleContinueShopping = () => {
    onClose();
    router.push('/products');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Đặt hàng thành công</DialogTitle>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Đặt hàng thành công!</h2>
          </CardHeader>
          
          <CardContent className="space-y-4 text-center">
            <p className="text-maintext">Cảm ơn bạn đã đặt hàng tại Street Sneaker</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-maintext mb-1">Mã đơn hàng của bạn là:</p>
              <p className="font-bold text-lg text-gray-900">{orderCode || orderId}</p>
            </div>
            <p className="text-sm text-maintext">
              Chúng tôi sẽ sớm liên hệ với bạn để xác nhận đơn hàng
            </p>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button 
              onClick={handleViewOrder} 
              className="w-full"
              variant="default"
            >
              Xem đơn hàng
            </Button>
            <Button 
              onClick={handleContinueShopping} 
              className="w-full"
              variant="outline"
            >
              Tiếp tục mua sắm
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
} 