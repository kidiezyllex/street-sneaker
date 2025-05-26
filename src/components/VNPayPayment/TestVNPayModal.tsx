'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import VNPayModal from './VNPayModal';

export default function TestVNPayModal() {
  const [showModal, setShowModal] = useState(false);

  const testOrderData = {
    orderId: 'TEST_123',
    amount: 1000000,
    orderInfo: 'Test payment',
    orderCode: 'TEST_CODE'
  };

  const handleSuccess = (paymentData: any) => {
    console.log('Payment success:', paymentData);
    setShowModal(false);
  };

  const handleError = (error: string) => {
    console.log('Payment error:', error);
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <Button onClick={() => setShowModal(true)}>
        Test VNPay Modal
      </Button>
      
      <VNPayModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        orderData={testOrderData}
        onPaymentSuccess={handleSuccess}
        onPaymentError={handleError}
      />
    </div>
  );
} 