'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@mdi/react';
import { mdiCreditCard, mdiBank, mdiShield, mdiLoading, mdiCheckCircle, mdiClose } from '@mdi/js';
import { toast } from 'react-toastify';
import { formatPrice } from '@/utils/formatters';
import Image from 'next/image';

interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
}

interface VNPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    orderId: string;
    amount: number;
    orderInfo: string;
    orderCode?: string;
  };
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export default function VNPayModal({ 
  isOpen, 
  onClose, 
  orderData, 
  onPaymentSuccess, 
  onPaymentError 
}: VNPayModalProps) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'select' | 'processing' | 'success' | 'error'>('select');
  const [paymentResult, setPaymentResult] = useState<any>(null);

  // Fetch banks from VietQR API
  useEffect(() => {
    if (isOpen) {
      fetchBanks();
    }
  }, [isOpen]);

  const fetchBanks = async () => {
    try {
      setIsLoadingBanks(true);
      const response = await fetch('https://api.vietqr.io/v2/banks');
      const result = await response.json();
      
      if (result.code === '00' && result.data) {
        // Filter banks that support transfer
        const supportedBanks = result.data.filter((bank: Bank) => bank.transferSupported === 1);
        setBanks(supportedBanks);
      } else {
        throw new Error('Không thể tải danh sách ngân hàng');
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      toast.error('Không thể tải danh sách ngân hàng');
      // Fallback to some popular banks
      setBanks([
        {
          id: 1,
          name: 'Ngân hàng TMCP Công Thương Việt Nam',
          code: 'ICB',
          bin: '970415',
          shortName: 'VietinBank',
          logo: 'https://img.vietqr.io/image/970415-logo.png',
          transferSupported: 1,
          lookupSupported: 1
        },
        {
          id: 2,
          name: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
          code: 'VCB',
          bin: '970436',
          shortName: 'Vietcombank',
          logo: 'https://img.vietqr.io/image/970436-logo.png',
          transferSupported: 1,
          lookupSupported: 1
        },
        {
          id: 3,
          name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
          code: 'BIDV',
          bin: '970418',
          shortName: 'BIDV',
          logo: 'https://img.vietqr.io/image/970418-logo.png',
          transferSupported: 1,
          lookupSupported: 1
        }
      ]);
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedBank) {
      toast.error('Vui lòng chọn ngân hàng');
      return;
    }

    try {
      setIsProcessing(true);
      setCurrentStep('processing');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate random success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        const paymentData = {
          orderId: orderData.orderId,
          amount: orderData.amount,
          bankCode: selectedBank,
          transactionId: `TXN${Date.now()}`,
          paymentTime: new Date().toISOString(),
          status: 'SUCCESS'
        };
        
        setPaymentResult(paymentData);
        setCurrentStep('success');
        
        // Call success callback after a short delay
        setTimeout(() => {
          onPaymentSuccess(paymentData);
        }, 2000);
      } else {
        setCurrentStep('error');
        setTimeout(() => {
          onPaymentError('Giao dịch không thành công. Vui lòng thử lại.');
        }, 2000);
      }
    } catch (error) {
      setCurrentStep('error');
      onPaymentError('Đã xảy ra lỗi trong quá trình thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (currentStep !== 'processing') {
      setCurrentStep('select');
      setSelectedBank('');
      setPaymentResult(null);
      onClose();
    }
  };

  const renderBankSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Icon path={mdiCreditCard} size={1.5} className="text-blue-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Thanh toán qua VNPay</h3>
        <p className="text-gray-600">Chọn ngân hàng để thực hiện thanh toán</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Thông tin đơn hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Mã đơn hàng:</span>
            <span className="font-medium">{orderData.orderCode || orderData.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số tiền:</span>
            <span className="font-bold text-lg text-red-600">{formatPrice(orderData.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nội dung:</span>
            <span className="font-medium text-right max-w-[200px] truncate">{orderData.orderInfo}</span>
          </div>
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="bank-select" className="text-sm font-medium mb-3 block">
          Chọn ngân hàng
        </Label>
        {isLoadingBanks ? (
          <div className="flex items-center justify-center py-8">
            <Icon path={mdiLoading} size={1} className="animate-spin text-blue-600" />
            <span className="ml-2">Đang tải danh sách ngân hàng...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
            {banks.map((bank) => (
              <div
                key={bank.code}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedBank === bank.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedBank(bank.code)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 relative">
                    <Image
                      src={bank.logo}
                      alt={bank.shortName}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/bank-placeholder.png';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{bank.shortName}</div>
                    <div className="text-xs text-gray-500 truncate">{bank.name}</div>
                  </div>
                  {selectedBank === bank.code && (
                    <Icon path={mdiCheckCircle} size={0.8} className="text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
        <Icon path={mdiShield} size={0.7} />
        <span>Giao dịch được bảo mật bởi VNPay</span>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center py-8">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-blue-100 p-4 rounded-full">
          <Icon path={mdiLoading} size={2} className="text-blue-600 animate-spin" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">Đang xử lý thanh toán</h3>
      <p className="text-gray-600 mb-4">Vui lòng không đóng cửa sổ này</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          Bạn đang được chuyển hướng đến trang thanh toán của ngân hàng...
        </p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-green-100 p-4 rounded-full">
          <Icon path={mdiCheckCircle} size={2} className="text-green-600" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-green-600">Thanh toán thành công!</h3>
      <p className="text-gray-600 mb-4">Đơn hàng của bạn đã được thanh toán thành công</p>
      {paymentResult && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Mã giao dịch:</span>
                <span className="font-medium">{paymentResult.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span>Số tiền:</span>
                <span className="font-medium">{formatPrice(paymentResult.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Thời gian:</span>
                <span className="font-medium">
                  {new Date(paymentResult.paymentTime).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderError = () => (
    <div className="text-center py-8">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-red-100 p-4 rounded-full">
          <Icon path={mdiClose} size={2} className="text-red-600" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-red-600">Thanh toán thất bại</h3>
      <p className="text-gray-600 mb-4">Giao dịch không thể hoàn tất. Vui lòng thử lại.</p>
      <Button onClick={() => setCurrentStep('select')} variant="outline">
        Thử lại
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Icon path={mdiBank} size={1} className="text-blue-600" />
            <span>VNPay - Cổng thanh toán</span>
          </DialogTitle>
        </DialogHeader>

        {currentStep === 'select' && renderBankSelection()}
        {currentStep === 'processing' && renderProcessing()}
        {currentStep === 'success' && renderSuccess()}
        {currentStep === 'error' && renderError()}

        {currentStep === 'select' && (
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Hủy
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={!selectedBank || isLoadingBanks}
              className="flex-1"
            >
              Thanh toán
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 