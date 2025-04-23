'use client';

import { useState } from 'react';
import { useGetProjects, useDeleteProject } from '@/hooks/useProject';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from '@mdi/react';
import { mdiPlus, mdiEye, mdiPencil, mdiDelete, mdiLoading, mdiDotsVertical } from '@mdi/js';
import { toast } from 'sonner';
import Link from 'next/link';
import { IProject } from '@/interface/response/project';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getStatusBadge } from '@/utils/constant';
export default function ProjectListPage() {
  const { data, isLoading, refetch } = useGetProjects();
  const deleteProject = useDeleteProject();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<IProject | null>(null);

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
      toast.success('Thành công', {
        description: 'Đã xóa dự án thành công'
      });
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error('Lỗi', {
        description: error.message || 'Đã xảy ra lỗi khi xóa dự án'
      });
    }
  };

  const openDeleteDialog = (project: IProject) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'Invalid date';
    }
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
              <BreadcrumbLink href="/dashboard/projects">Quản lý dự án</BreadcrumbLink>
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
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]"><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-4 w-20" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-52" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
            <BreadcrumbLink href="/dashboard/projects">Quản lý dự án</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold !text-maintext">Danh sách dự án</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Danh sách dự án</h1>
        <Link href="/dashboard/projects/create">
          <Button className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90">
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Tạo dự án mới
          </Button>
        </Link>
      </div>

      {data?.data.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
          <h3 className="text-lg font-medium text-muted-foreground">Không có dự án nào</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Bạn chưa có dự án nào. Hãy tạo dự án mới để bắt đầu.
          </p>
        </div>
      ) : (
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Tên dự án</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((project) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>{formatDate(project.startDate)}</TableCell>
                  <TableCell>{formatDate(project.endDate)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full h-8 w-8 bg-gray"
                        >
                          <Icon path={mdiDotsVertical} size={0.7} className="text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <Link href={`/dashboard/projects/${project._id}`} className="w-full">
                          <DropdownMenuItem className="cursor-pointer">
                            <Icon path={mdiEye} size={0.7} className="mr-2 text-blue-500" />
                            <span>Xem chi tiết</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/dashboard/projects/edit/${project._id}`} className="w-full">
                          <DropdownMenuItem className="cursor-pointer">
                            <Icon path={mdiPencil} size={0.7} className="mr-2 text-blue-500" />
                            <span>Chỉnh sửa</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                          onClick={() => openDeleteDialog(project)}
                        >
                          <Icon path={mdiDelete} size={0.7} className="mr-2" />
                          <span>Xóa</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog xác nhận xóa dự án */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>Xác nhận xóa dự án</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa dự án "{projectToDelete?.name}"? Hành động này không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => projectToDelete && handleDeleteProject(projectToDelete._id)}
                  disabled={deleteProject.isPending}
                >
                  {deleteProject.isPending ? (
                    <>
                      <Icon path={mdiLoading} size={0.8} className="mr-2 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    'Xóa dự án'
                  )}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
} 