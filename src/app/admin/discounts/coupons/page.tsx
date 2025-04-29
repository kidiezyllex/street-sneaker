'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@mdi/react';
import { mdiMagnify, mdiPlus, mdiPencilOutline, mdiTrashCanOutline, mdiFilterOutline } from '@mdi/js';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

//                                                                                                                     Mock data cho mã giảm giá
const coupons = [
  {
    id: '1',
    code: 'SUMMER2024',
    discount: 20,
    type: 'percentage',
    minPurchase: 500000,
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    usageLimit: 100,
    usedCount: 45,
    status: 'active'
  },
  //                                                                                                                     Thêm các mã giảm giá khác ở đây
];

export default function CouponsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCoupons = coupons.filter((coupon) => {
    return searchQuery
      ? coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleDeleteCoupon = (id: string) => {
    toast.success('Xóa mã giảm giá thành công');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/discounts">Giảm giá</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='font-medium'>Mã giảm giá</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/discounts/coupons/new">
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Icon path={mdiPlus} size={1} />
            Thêm mã giảm giá
          </button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Icon path={mdiMagnify} size={1} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm mã giảm giá..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="p-2 border rounded-lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon path={mdiFilterOutline} size={1} />
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredCoupons.map((coupon) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{coupon.code}</h3>
                    <p className="text-gray-600">
                      Giảm {coupon.discount}{coupon.type === 'percentage' ? '%' : 'đ'} 
                      {coupon.minPurchase ? ` (Tối thiểu ${formatCurrency(coupon.minPurchase)})` : ''}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Đã sử dụng: {coupon.usedCount}/{coupon.usageLimit}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      onClick={() => {}}
                    >
                      <Icon path={mdiPencilOutline} size={1} />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      onClick={() => handleDeleteCoupon(coupon.id)}
                    >
                      <Icon path={mdiTrashCanOutline} size={1} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 