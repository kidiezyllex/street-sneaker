'use client';

import { useGetProjects } from '@/hooks/useProject';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Icon } from '@mdi/react';
import { mdiPlus, mdiViewDashboard, mdiAccountMultiple, mdiChartLine } from '@mdi/js';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProjectsPage() {
  const { data, isLoading } = useGetProjects();

  const getProjectsByStatus = (status: string) => {
    if (!data?.data) return 0;
    return data.data.filter(project => project.status.toLowerCase() === status.toLowerCase()).length;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-5 w-24" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold !text-maintext">Quản lý dự án</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Quản lý dự án</h1>
        <Link href="/dashboard/projects/create">
          <Button className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90">
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Tạo dự án mới
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng số dự án</CardTitle>
            <Icon path={mdiViewDashboard} size={1} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.data.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đang diễn ra</CardTitle>
            <Icon path={mdiChartLine} size={1} className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getProjectsByStatus('active')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
            <Icon path={mdiChartLine} size={1} className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getProjectsByStatus('completed')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
            <Icon path={mdiChartLine} size={1} className="text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getProjectsByStatus('pending')}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quản lý dự án</CardTitle>
            <CardDescription>
              Truy cập nhanh các tính năng quản lý dự án
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/dashboard/projects/list" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Icon path={mdiViewDashboard} size={0.8} className="mr-2" />
                Danh sách dự án
              </Button>
            </Link>
            <Link href="/dashboard/projects/create" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Icon path={mdiPlus} size={0.8} className="mr-2" />
                Tạo dự án mới
              </Button>
            </Link>
            <Link href="/dashboard/projects/members" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Icon path={mdiAccountMultiple} size={0.8} className="mr-2" />
                Quản lý thành viên
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Dự án gần đây</CardTitle>
            <CardDescription>
              Danh sách dự án gần đây được cập nhật
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.data.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Không có dự án nào.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data?.data.slice(0, 5).map((project) => (
                  <Link key={project._id} href={`/dashboard/projects/${project._id}`} className="block">
                    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.members.length} thành viên
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {project.status === 'active' && <span className="text-green-500">Đang diễn ra</span>}
                        {project.status === 'completed' && <span className="text-blue-500">Hoàn thành</span>}
                        {project.status === 'pending' && <span className="text-yellow-500">Chờ xử lý</span>}
                        {project.status === 'cancelled' && <span className="text-red-500">Đã hủy</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/projects/list" className="w-full">
              <Button variant="outline" className="w-full">
                Xem tất cả dự án
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 