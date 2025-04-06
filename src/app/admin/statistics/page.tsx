'use client';

import { StatSummary } from '@/components/StatisticsPage/StatSummary';
import { SalesChart } from '@/components/StatisticsPage/SalesChart';
import { OrdersChart } from '@/components/StatisticsPage/OrdersChart';
import { TopProducts } from '@/components/StatisticsPage/TopProducts';
import { OutOfStockProducts } from '@/components/StatisticsPage/OutOfStockProducts';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function StatisticsPage() {
  return (
    <div>
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='font-medium'>Thống kê</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <StatSummary />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SalesChart />
        <OrdersChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopProducts />
        </div>
        <div>
          <OutOfStockProducts />
        </div>
      </div>
    </div>
  );
} 