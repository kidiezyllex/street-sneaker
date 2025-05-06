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

//                                                                                                                     Mock data cho khuyến mãi
const promotions = [
  {
    id: '1',
    name: 'Mùa hè sôi động',
    description: 'Giảm giá đến 50% cho tất cả giày thể thao',
    discount: 50,
    type: 'percentage',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    status: 'active',
    conditions: [
      'Áp dụng cho tất cả giày thể thao',
      'Không áp dụng cùng với mã giảm giá khác',
      'Giảm tối đa 2,000,000đ'
    ],
    productCategories: ['Thể thao', 'Chạy bộ']
  },
  //                                                                                                                     Thêm các khuyến mãi khác ở đây
];

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPromotions = promotions.filter((promotion) => {
    return searchQuery
      ? promotion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promotion.description.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleDeletePromotion = (id: string) => {
    toast.success('Xóa khuyến mãi thành công');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
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
              <BreadcrumbPage className='font-medium'>Khuyến mãi</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Link href="/admin/discounts/promotions/new">
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Icon path={mdiPlus} size={1} />
            Thêm khuyến mãi
          </button>
        </Link>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Icon path={mdiMagnify} size={1} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khuyến mãi..."
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
        {filteredPromotions.map((promotion) => (
          <motion.div
            key={promotion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{promotion.name}</h3>
                    <p className="text-gray-600">{promotion.description}</p>
                    <p className="text-gray-600">
                      Giảm {promotion.discount}{promotion.type === 'percentage' ? '%' : 'đ'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Điều kiện áp dụng:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {promotion.conditions.map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      {promotion.productCategories.map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
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
                      onClick={() => handleDeletePromotion(promotion.id)}
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