'use client';

import { useState, useEffect } from 'react';
import { useGetTaskById, useUpdateTaskStatus, useUpdateTaskProgress, useDeleteTask, useCreateTaskNote, useUpdateTaskNote, useDeleteTaskNote } from '@/hooks/useTask';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
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
import { Icon } from '@mdi/react';
import { 
  mdiArrowLeft, 
  mdiCalendarClock, 
  mdiChevronRight, 
  mdiClockOutline,
  mdiAlertCircleOutline,
  mdiTrashCanOutline,
  mdiPencilOutline,
  mdiChartTimelineVariant,
  mdiAccount,
  mdiProjector,
  mdiTagOutline,
  mdiChevronDoubleUp,
} from '@mdi/js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { ScrollArea } from '@/components/ui/scroll-area';

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

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data, isLoading } = useGetTaskById(params.id);
  const updateTaskStatus = useUpdateTaskStatus();
  const updateTaskProgress = useUpdateTaskProgress();
  const deleteTask = useDeleteTask();
  const createTaskNote = useCreateTaskNote();
  const updateTaskNote = useUpdateTaskNote();
  const deleteTaskNote = useDeleteTaskNote();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskProgress, setTaskProgress] = useState<number>(0);
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  // Cập nhật state khi dữ liệu được tải
  useEffect(() => {
    if (data?.data) {
      setTaskProgress(data.data.progress || 0);
    }
  }, [data]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTaskStatus.mutateAsync({ id: params.id, status: newStatus });
      toast.success('Thành công', {
        description: 'Cập nhật trạng thái nhiệm vụ thành công'
      });
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể cập nhật trạng thái nhiệm vụ'
      });
    }
  };

  const handleProgressChange = async () => {
    try {
      await updateTaskProgress.mutateAsync({ id: params.id, progress: taskProgress });
      toast.success('Thành công', {
        description: 'Cập nhật tiến độ nhiệm vụ thành công'
      });
      setIsEditingProgress(false);
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể cập nhật tiến độ nhiệm vụ'
      });
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask.mutateAsync(params.id);
      toast.success('Thành công', {
        description: 'Xóa nhiệm vụ thành công'
      });
      setIsDeleteDialogOpen(false);
      router.push('/dashboard/tasks');
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể xóa nhiệm vụ'
      });
    }
  };

  // Xử lý tạo ghi chú
  const handleCreateNote = () => {
    if (!noteContent.trim()) return;

    createTaskNote.mutate({
      content: noteContent,
      taskId: params.id,
      isPersonal: true
    }, {
      onSuccess: () => {
        setNoteContent('');
        toast.success('Đã thêm ghi chú');
      },
      onError: () => {
        toast.error('Không thể thêm ghi chú');
      }
    });
  };

  // Xử lý cập nhật ghi chú
  const handleUpdateNote = () => {
    if (!editNoteId || !editNoteContent.trim()) return;

    updateTaskNote.mutate({
      taskId: params.id,
      noteId: editNoteId,
      data: {
        content: editNoteContent,
        isPersonal: true
      }
    }, {
      onSuccess: () => {
        setEditNoteId(null);
        setEditNoteContent('');
        toast.success('Đã cập nhật ghi chú');
      },
      onError: () => {
        toast.error('Không thể cập nhật ghi chú');
      }
    });
  };

  // Xử lý xóa ghi chú
  const handleDeleteNote = (noteId: string) => {
    deleteTaskNote.mutate({
      taskId: params.id,
      noteId: noteId
    }, {
      onSuccess: () => {
        toast.success('Đã xóa ghi chú');
      },
      onError: () => {
        toast.error('Không thể xóa ghi chú');
      }
    });
  };

  // Bắt đầu chỉnh sửa ghi chú
  const startEditNote = (note: any) => {
    setEditNoteId(note._id);
    setEditNoteContent(note.content);
  };

  // Hủy chỉnh sửa ghi chú
  const cancelEditNote = () => {
    setEditNoteId(null);
    setEditNoteContent('');
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

  // Loading state
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
              <Skeleton className="h-5 w-28" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-8 w-56" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const task = data?.data;
  if (!task) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-maintext mb-2">Không tìm thấy nhiệm vụ</h2>
          <p className="text-gray-500 mb-4">Nhiệm vụ không tồn tại hoặc đã bị xóa</p>
          <Button asChild>
            <Link href="/dashboard/tasks">
              <Icon path={mdiArrowLeft} size={0.8} className="mr-2" />
              Quay lại danh sách nhiệm vụ
            </Link>
          </Button>
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
            <BreadcrumbPage>{task.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild className="h-9 w-9 rounded-full">
            <Link href="/dashboard/tasks">
              <Icon path={mdiArrowLeft} size={0.8} />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-maintext">{task.title}</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial" asChild>
            <Link href={`/dashboard/tasks/${task._id}/edit`}>
              <Icon path={mdiPencilOutline} size={0.8} className="mr-2" />
              Chỉnh sửa
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1 sm:flex-initial"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Icon path={mdiTrashCanOutline} size={0.8} className="mr-2" />
            Xóa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-maintext">Thông tin nhiệm vụ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.description ? (
                <div className="text-gray-700 whitespace-pre-line">
                  {task.description}
                </div>
              ) : (
                <div className="text-gray-500 italic">Không có mô tả cho nhiệm vụ này</div>
              )}

              <div className="flex flex-wrap gap-3 mt-4">
                {getStatusBadge(task.status)}
                {getPriorityBadge(task.priority)}
              </div>
            </CardContent>
          </Card>

          {/* Phần ghi chú cá nhân */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-maintext">Ghi chú & Bình luận</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Phần thêm ghi chú mới */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Ghi chú cá nhân</h3>
                <Textarea 
                  placeholder="Thêm ghi chú cá nhân..." 
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="bg-white text-maintext"
                />
                <Button 
                  type="button" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleCreateNote}
                  disabled={!noteContent.trim() || createTaskNote.isPending}
                >
                  {createTaskNote.isPending ? 'Đang thêm...' : 'Thêm ghi chú'}
                </Button>
              </div>

              <Separator />

              {/* Danh sách ghi chú */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Danh sách ghi chú</h3>
                
                {task.notes && task.notes.length > 0 ? (
                  task.notes
                    .filter(note => note.isPersonal && note.author._id === 'currentUserId') // Thay currentUserId bằng id thực tế của người dùng hiện tại
                    .map(note => (
                      <div key={note._id} className="p-3 bg-gray-50 rounded-md space-y-2">
                        {editNoteId === note._id ? (
                          <div className="space-y-2">
                            <Textarea 
                              value={editNoteContent}
                              onChange={(e) => setEditNoteContent(e.target.value)}
                              className="bg-white text-maintext"
                            />
                            <div className="flex gap-2">
                              <Button 
                                type="button" 
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                                onClick={handleUpdateNote}
                                disabled={updateTaskNote.isPending}
                              >
                                {updateTaskNote.isPending ? 'Đang lưu...' : 'Lưu'}
                              </Button>
                              <Button 
                                type="button" 
                                size="sm"
                                variant="outline"
                                onClick={cancelEditNote}
                              >
                                Hủy
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="whitespace-pre-line text-gray-700">
                              {note.content}
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>
                                {formatDate(note.createdAt)}
                              </span>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 rounded-full hover:bg-blue-500/10 hover:text-blue-500"
                                  onClick={() => startEditNote(note)}
                                >
                                  <Icon path={mdiPencilOutline} size={0.6} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 rounded-full hover:bg-red-500/10 hover:text-red-500"
                                  onClick={() => handleDeleteNote(note._id)}
                                  disabled={deleteTaskNote.isPending}
                                >
                                  <Icon path={mdiTrashCanOutline} size={0.6} />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Chưa có ghi chú nào
                  </div>
                )}
              </div>

              <Separator />

              {/* Phần bình luận */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Bình luận</h3>
                <div className="text-gray-500 text-center py-4">
                  Chức năng bình luận sẽ sớm được cập nhật
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-maintext">Chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Icon path={mdiProjector} size={0.6} className="mr-2" />
                  Dự án
                </span>
                <span className="font-medium text-maintext">
                  {task.project?.name || 'Không có'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Icon path={mdiAccount} size={0.6} className="mr-2" />
                  Phân công
                </span>
                <span className="font-medium text-maintext">
                  {task.assignedTo?.fullName || 'Chưa phân công'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Icon path={mdiClockOutline} size={0.6} className="mr-2" />
                  Thời hạn
                </span>
                <span className="font-medium text-maintext">
                  {task.dueDate ? formatDate(task.dueDate) : 'Chưa thiết lập'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Icon path={mdiCalendarClock} size={0.6} className="mr-2" />
                  Ngày bắt đầu
                </span>
                <span className="font-medium text-maintext">
                  {task.startDate ? formatDate(task.startDate) : 'Chưa bắt đầu'}
                </span>
              </div>

              <Separator />

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">
                  Cập nhật trạng thái
                </label>
                <Select 
                  value={task.status} 
                  onValueChange={handleStatusChange}
                  disabled={updateTaskStatus.isPending}
                >
                  <SelectTrigger className='bg-white focus:border-primary focus:ring-primary'>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {updateTaskStatus.isPending && (
                  <div className="text-xs text-blue-500 mt-1">Đang cập nhật...</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-maintext">Tiến độ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Hoàn thành</span>
                  <span className="font-medium">{isEditingProgress ? taskProgress : (task.progress || 0)}%</span>
                </div>
                
                {isEditingProgress ? (
                  <>
                    <Slider
                      value={[taskProgress]}
                      max={100}
                      step={5}
                      className="mb-2"
                      onValueChange={values => setTaskProgress(values[0])}
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => setIsEditingProgress(false)}
                      >
                        Hủy
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={handleProgressChange}
                        disabled={updateTaskProgress.isPending}
                      >
                        {updateTaskProgress.isPending ? 'Đang lưu...' : 'Lưu'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${task.progress || 0}%` }}
                      ></div>
                    </div>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => {
                        setTaskProgress(task.progress || 0);
                        setIsEditingProgress(true);
                      }}
                    >
                      <Icon path={mdiChartTimelineVariant} size={0.7} className="mr-2" />
                      Cập nhật tiến độ
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog xác nhận xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>Xác nhận xóa nhiệm vụ</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa nhiệm vụ "{task.title}" không? Hành động này không thể hoàn tác.
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