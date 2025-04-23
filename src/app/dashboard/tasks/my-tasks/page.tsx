'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetTasks, useUpdateTaskProgress } from '@/hooks/useTask';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icon } from '@mdi/react';
import { 
  mdiFilterOutline, 
  mdiRefresh, 
  mdiChevronRight, 
  mdiClockOutline,
  mdiAlertCircleOutline,
  mdiPencilOutline,
  mdiEye,
  mdiFileDocumentOutline,
  mdiChartTimelineVariant,
  mdiCalendarRange,
} from '@mdi/js';
import Link from 'next/link';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { getStatusBadge } from '@/utils/constant';
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

export default function MyTasksPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [progressDialog, setProgressDialog] = useState<{
    isOpen: boolean;
    taskId: string;
    currentProgress: number;
    newProgress: number;
  }>({
    isOpen: false,
    taskId: '',
    currentProgress: 0,
    newProgress: 0,
  });

  // Giả định ID người dùng đăng nhập - trong thực tế sẽ lấy từ context xác thực
  const currentUserId = 'current-user-id'; 

  const { data: tasksData, isLoading } = useGetTasks({
    assignedTo: currentUserId,
    status: statusFilter || undefined,
  });

  const updateTaskProgress = useUpdateTaskProgress();

  const handleUpdateProgress = async () => {
    try {
      await updateTaskProgress.mutateAsync({
        id: progressDialog.taskId,
        progress: progressDialog.newProgress,
      });
      
      toast.success('Thành công', {
        description: 'Cập nhật tiến độ nhiệm vụ thành công'
      });
      
      // Đóng dialog
      setProgressDialog({
        isOpen: false,
        taskId: '',
        currentProgress: 0,
        newProgress: 0,
      });
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể cập nhật tiến độ nhiệm vụ'
      });
    }
  };

  const openProgressDialog = (taskId: string, currentProgress: number) => {
    setProgressDialog({
      isOpen: true,
      taskId,
      currentProgress,
      newProgress: currentProgress,
    });
  };

  const resetFilters = () => {
    setStatusFilter('');
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
              <BreadcrumbLink href="/dashboard/tasks">Nhiệm vụ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-5 w-36" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-10 w-full md:w-1/3 max-w-xs" />
          <Skeleton className="h-10 w-full md:w-1/3 max-w-xs" />
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
            <BreadcrumbLink href="/dashboard/tasks">Nhiệm vụ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nhiệm vụ của tôi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-maintext">Nhiệm vụ được giao cho tôi</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='bg-white focus:border-primary focus:ring-primary w-full md:w-56'>
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

        <Button 
          variant="outline" 
          className="md:w-auto w-full" 
          onClick={resetFilters}
        >
          <Icon path={mdiRefresh} size={0.8} className="mr-2" />
          Đặt lại
        </Button>
      </div>

      {!tasksData || tasksData.data.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Icon path={mdiFileDocumentOutline} size={3} className="text-gray-300" />
            <h3 className="text-xl font-semibold text-maintext">Không có nhiệm vụ nào</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Bạn chưa được giao nhiệm vụ nào hoặc không có nhiệm vụ phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasksData.data.map((task) => (
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
                <div className="text-sm text-gray-700 line-clamp-2 mb-2">
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
                </div>

                <div className="mt-2">
                  <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                    <span>Tiến độ:</span>
                    <span>{task.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full" 
                      style={{ width: `${task.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center text-xs text-gray-500">
                    <Icon path={mdiCalendarRange} size={0.6} className="mr-1" />
                    {task.startDate ? formatDate(task.startDate) : 'Chưa bắt đầu'}
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-green-500/10 hover:text-green-500"
                      onClick={() => openProgressDialog(task._id, task.progress || 0)}
                    >
                      <Icon path={mdiChartTimelineVariant} size={0.7} />
                    </Button>
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
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog cập nhật tiến độ */}
      <Dialog open={progressDialog.isOpen} onOpenChange={(open) => {
        if (!open) {
          setProgressDialog({
            isOpen: false,
            taskId: '',
            currentProgress: 0,
            newProgress: 0,
          });
        }
      }}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl">Cập nhật tiến độ nhiệm vụ</DialogTitle>
                <DialogDescription>
                  Di chuyển thanh trượt để cập nhật tiến độ hoàn thành nhiệm vụ.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">Tiến độ hiện tại: {progressDialog.currentProgress}%</span>
                  <span className="text-lg font-semibold text-primary">Tiến độ mới: {progressDialog.newProgress}%</span>
                </div>
                
                <Slider
                  value={[progressDialog.newProgress]}
                  max={100}
                  step={5}
                  className="py-4"
                  onValueChange={(values) => {
                    setProgressDialog(prev => ({
                      ...prev,
                      newProgress: values[0],
                    }));
                  }}
                />
                
                <div className="flex justify-between">
                  <div className="text-xs">0%</div>
                  <div className="text-xs">25%</div>
                  <div className="text-xs">50%</div>
                  <div className="text-xs">75%</div>
                  <div className="text-xs">100%</div>
                </div>
              </div>
              
              <DialogFooter className="pt-4 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setProgressDialog({
                      isOpen: false,
                      taskId: '',
                      currentProgress: 0,
                      newProgress: 0,
                    });
                  }}
                >
                  Hủy bỏ
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleUpdateProgress}
                  disabled={updateTaskProgress.isPending}
                >
                  {updateTaskProgress.isPending ? 'Đang cập nhật...' : 'Cập nhật tiến độ'}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
} 