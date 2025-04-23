'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetTasks, useUpdateTaskStatus, useDeleteTask } from '@/hooks/useTask';
import { useGetProjects } from '@/hooks/useProject';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Icon } from '@mdi/react';
import { 
  mdiPlus, 
  mdiFilterOutline, 
  mdiRefresh, 
  mdiChevronRight, 
  mdiCheckCircleOutline,
  mdiClockOutline,
  mdiAlertCircleOutline,
  mdiTrashCanOutline,
  mdiPencilOutline,
  mdiEye,
  mdiFileDocumentOutline
} from '@mdi/js';
import Link from 'next/link';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { getStatusBadge } from '@/utils/constant';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý', color: 'bg-yellow-500' },
  { value: 'in_progress', label: 'Đang thực hiện', color: 'bg-blue-500' },
  { value: 'review', label: 'Đang kiểm tra', color: 'bg-purple-500' },
  { value: 'completed', label: 'Hoàn thành', color: 'bg-green-500' },
  { value: 'cancelled', label: 'Đã hủy', color: 'bg-red-500' },
];

const priorityOptions = [
  { value: 'low', label: 'Thấp', color: 'bg-blue-400' },
  { value: 'medium', label: 'Trung bình', color: 'bg-yellow-400' },
  { value: 'high', label: 'Cao', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Khẩn cấp', color: 'bg-red-500' },
];

export default function TasksPage() {
  const router = useRouter();
  const [projectFilter, setProjectFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const { data: tasksData, isLoading: isTasksLoading, refetch: refetchTasks } = useGetTasks({
    project: projectFilter || undefined,
    status: statusFilter || undefined,
  });

  const { data: projectsData, isLoading: isProjectsLoading } = useGetProjects();
  const updateTaskStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus.mutateAsync({ id: taskId, status: newStatus });
      toast.success('Thành công', {
        description: 'Cập nhật trạng thái nhiệm vụ thành công'
      });
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể cập nhật trạng thái nhiệm vụ'
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTaskId) return;
    try {
      await deleteTask.mutateAsync(selectedTaskId);
      toast.success('Thành công', {
        description: 'Xóa nhiệm vụ thành công'
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể xóa nhiệm vụ'
      });
    }
  };

  const openDeleteDialog = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDeleteDialogOpen(true);
  };

  const resetFilters = () => {
    setProjectFilter('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  const getPriorityBadge = (priority: string) => {
    const priorityOption = priorityOptions.find(option => option.value === priority);
    if (!priorityOption) return null;

    return (
      <Badge className={`${priorityOption.color} text-white`}>
        {priorityOption.label}
      </Badge>
    );
  };

  // Skeleton loading
  if (isTasksLoading || isProjectsLoading) {
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
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-10 w-full md:w-1/3" />
          <Skeleton className="h-10 w-full md:w-1/3" />
          <Skeleton className="h-10 w-full md:w-1/3" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="pb-2">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <div className="flex justify-between items-center w-full">
                  <Skeleton className="h-5 w-20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
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
            <BreadcrumbPage>Nhiệm vụ</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-maintext">Quản lý nhiệm vụ</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Link href="/dashboard/tasks/create" className="flex items-center">
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Tạo nhiệm vụ mới
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className='bg-white focus:border-primary focus:ring-primary'>
            <SelectValue placeholder="Lọc theo dự án" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả dự án</SelectItem>
            {projectsData?.data.map((project) => (
              <SelectItem key={project._id} value={project._id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='bg-white focus:border-primary focus:ring-primary'>
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả trạng thái</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className='bg-white focus:border-primary focus:ring-primary'>
            <SelectValue placeholder="Lọc theo độ ưu tiên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả độ ưu tiên</SelectItem>
            {priorityOptions.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          className="hidden md:flex" 
          onClick={resetFilters}
        >
          <Icon path={mdiRefresh} size={0.8} className="mr-2" />
          Đặt lại
        </Button>
      </div>

      {/* Nút đặt lại lọc cho mobile */}
      <Button 
        variant="outline" 
        className="w-full md:hidden mb-4" 
        onClick={resetFilters}
      >
        <Icon path={mdiRefresh} size={0.8} className="mr-2" />
        Đặt lại bộ lọc
      </Button>

      {tasksData?.data.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Icon path={mdiFileDocumentOutline} size={3} className="text-gray-300" />
            <h3 className="text-xl font-semibold text-maintext">Không có nhiệm vụ nào</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Bạn chưa có nhiệm vụ nào hoặc không có nhiệm vụ phù hợp với bộ lọc hiện tại.
            </p>
            <Button className="bg-primary hover:bg-primary/90 mt-2">
              <Link href="/dashboard/tasks/create" className="flex items-center">
                <Icon path={mdiPlus} size={0.8} className="mr-2" />
                Tạo nhiệm vụ mới
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasksData?.data.map((task) => (
            <Card key={task._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-maintext">
                  <Link href={`/dashboard/tasks/${task._id}`}>
                    {task.title}
                  </Link>
                </CardTitle>
                <div className="text-sm text-gray-500">
                  {task.project?.name && (
                    <span className="flex items-center">
                      <Icon path={mdiChevronRight} size={0.6} className="mr-1" />
                      {task.project.name}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-gray-700 line-clamp-3 mb-2">
                  {task.description || "Không có mô tả"}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <div className="flex items-center">
                    <Icon path={mdiClockOutline} size={0.6} className="mr-1" />
                    {task.dueDate ? formatDate(task.dueDate) : 'Không có hạn'}
                  </div>
                  {task.progress !== undefined && (
                    <div>Tiến độ: {task.progress}%</div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">
                      {task.assignedTo?.fullName || 'Chưa gán'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                      asChild
                    >
                      <Link href={`/dashboard/tasks/${task._id}`}>
                        <Icon path={mdiEye} size={0.7} />
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-yellow-500/10 hover:text-yellow-500"
                      asChild
                    >
                      <Link href={`/dashboard/tasks/${task._id}/edit`}>
                        <Icon path={mdiPencilOutline} size={0.7} />
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => openDeleteDialog(task._id)}
                    >
                      <Icon path={mdiTrashCanOutline} size={0.7} />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog xác nhận xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>Xác nhận xóa nhiệm vụ</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa nhiệm vụ này không? Hành động này không thể hoàn tác.
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
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleDeleteTask}
                >
                  Xóa
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
} 