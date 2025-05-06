'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      router.push('/');
    }
  }, [orderId, router]);

  return (
    <div className="container max-w-lg py-16">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Đặt hàng thành công!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Cảm ơn bạn đã đặt hàng tại Street Sneaker</p>
          <p className="text-muted-foreground">
            Mã đơn hàng của bạn là: <span className="font-medium text-foreground">{orderId}</span>
          </p>
          <p className="text-muted-foreground">
            Chúng tôi sẽ sớm liên hệ với bạn để xác nhận đơn hàng
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => router.push('/orders')}>
            Xem đơn hàng
          </Button>
          <Button onClick={() => router.push('/')}>
            Tiếp tục mua sắm
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <SuccessContent />
    </Suspense>
  );
} 