'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get('orderId');
  const success = searchParams.get('success') === 'true';
  const message = searchParams.get('message') || '';

  useEffect(() => {
    if (!orderId) {
      router.push('/');
    }
  }, [orderId, router]);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          {success ? (
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          ) : (
            <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
          )}

          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            {success ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
          </h2>

          <p className="mt-2 text-gray-600">{message}</p>

          {orderId && (
            <p className="mt-2 text-sm text-gray-500">
              Mã đơn hàng: {orderId}
            </p>
          )}

          <div className="mt-8 space-y-4">
            <Link
              href={`/orders/${orderId}`}
              className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Xem chi tiết đơn hàng
            </Link>

            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 