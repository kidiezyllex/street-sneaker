'use client';

import { useState } from 'react';
import { useCreateTask } from '@/hooks/useTask';
import { useGetProjects } from '@/hooks/useProject';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import { 
  mdiArrowLeft,
  mdiCalendarRange,
} from '@mdi/js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý', color: 'bg-yellow-500' },
  { value: 'in_progress', label: 'Đang thực hiện', color: 'bg-blue-500' },
  { value: 'review', label: 'Đang kiểm tra', color: 'bg-purple-500' },
  { value: 'completed', label: 'Hoàn thành', color: 'bg-green-500' },
  { value: 'cancelled', label: 'Đã hủy', color: 'bg-red-500' },
];

const priorityOptions = [
  { value: 'low', label: 'Thấp' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'high', label: 'Cao' },
  { value: 'urgent', label: 'Khẩn cấp' },
];

export default function CreateTaskPage() {
  const router = useRouter();
  const { data: projectsData, isLoading: isProjectsLoading } = useGetProjects();
  const createTask = useCreateTask();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    phase: '',
    assignedTo: '',  // Trong tình huống thực tế, đây có thể là danh sách người dùng từ API
    status: 'pending',
    priority: 'medium',
    startDate: '',
    dueDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Lỗi', {
        description: 'Vui lòng nhập tên nhiệm vụ'
      });
      return;
    }

    if (!formData.project) {
      toast.error('Lỗi', {
        description: 'Vui lòng chọn dự án'
      });
      return;
    }

    try {
      await createTask.mutateAsync({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        assignedTo: formData.assignedTo || undefined,
        phase: formData.phase || undefined,
        startDate: formData.startDate || undefined,
        dueDate: formData.dueDate || undefined,
      });

      toast.success('Thành công', {
        description: 'Tạo nhiệm vụ mới thành công'
      });

      router.push('/dashboard/tasks');
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể tạo nhiệm vụ mới'
      });
    }
  };

  // Loading skeleton
  if (isProjectsLoading) {
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

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-8 w-56" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
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
            <BreadcrumbPage>Tạo nhiệm vụ mới</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild className="h-9 w-9 rounded-full">
          <Link href="/dashboard/tasks">
            <Icon path={mdiArrowLeft} size={0.8} />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-maintext">Tạo nhiệm vụ mới</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-lg text-maintext">Thông tin nhiệm vụ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-maintext">Tên nhiệm vụ <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tên nhiệm vụ"
                className='bg-white focus:border-primary focus:ring-primary'
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project" className="text-maintext">Dự án <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.project} 
                onValueChange={(value) => handleSelectChange('project', value)}
                required
              >
                <SelectTrigger className='bg-white focus:border-primary focus:ring-primary'>
                  <SelectValue placeholder="Chọn dự án" />
                </SelectTrigger>
                <SelectContent>
                  {projectsData?.data.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-maintext">Mô tả nhiệm vụ</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả chi tiết nhiệm vụ"
                className='bg-white focus:border-primary focus:ring-primary min-h-[120px]'
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-maintext">Trạng thái</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-maintext">Mức độ ưu tiên</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger className='bg-white focus:border-primary focus:ring-primary'>
                    <SelectValue placeholder="Chọn mức độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phase" className="text-maintext">Giai đoạn</Label>
                <Input
                  id="phase"
                  name="phase"
                  value={formData.phase}
                  onChange={handleChange}
                  placeholder="Nhập giai đoạn của dự án (nếu có)"
                  className='bg-white focus:border-primary focus:ring-primary'
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo" className="text-maintext">Người thực hiện</Label>
                <Input
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  placeholder="Nhập ID người thực hiện (nếu có)"
                  className='bg-white focus:border-primary focus:ring-primary'
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-maintext">Ngày bắt đầu</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className='bg-white focus:border-primary focus:ring-primary'
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-maintext">Ngày kết thúc</Label>
                <div className="relative">
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className='bg-white focus:border-primary focus:ring-primary'
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.back()}
            >
              Hủy bỏ
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={createTask.isPending}
            >
              {createTask.isPending ? 'Đang tạo...' : 'Tạo nhiệm vụ'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 