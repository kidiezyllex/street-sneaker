'use client';

import { useState, useEffect } from 'react';
import { useGetProjectById, useUpdateProject } from '@/hooks/useProject';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Icon } from '@mdi/react';
import { mdiCalendar, mdiLoading } from '@mdi/js';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const projectSchema = z.object({
  name: z.string().min(3, 'Tên dự án phải có ít nhất 3 ký tự'),
  description: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.string().min(1, 'Vui lòng chọn trạng thái dự án'),
  gameGenre: z.string().optional(),
  gamePlatform: z.string().optional(),
});

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useGetProjectById(params.id);
  const updateProject = useUpdateProject();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: '',
      gameGenre: '',
      gamePlatform: '',
    },
  });

  useEffect(() => {
    if (data?.data) {
      const project = data.data;
      form.reset({
        name: project.name,
        description: project.description || '',
        status: project.status,
        gameGenre: project.gameGenre || '',
        gamePlatform: project.gamePlatform || '',
        startDate: project.startDate ? new Date(project.startDate) : undefined,
        endDate: project.endDate ? new Date(project.endDate) : undefined,
      });
    }
  }, [data, form]);

  const onSubmit = async (formData: z.infer<typeof projectSchema>) => {
    try {
      const payload = {
        ...formData,
        startDate: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : undefined,
        endDate: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : undefined,
      };
      
      await updateProject.mutateAsync({
        id: params.id,
        payload,
      });
      
      toast.success('Thành công', {
        description: 'Dự án đã được cập nhật thành công'
      });
      
      router.push(`/dashboard/projects/${params.id}`);
    } catch (error: any) {
      toast.error('Lỗi', {
        description: error.message || 'Đã xảy ra lỗi khi cập nhật dự án'
      });
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
              <BreadcrumbLink href="/dashboard/projects/list">Danh sách dự án</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-5 w-32" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-end gap-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
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
            <BreadcrumbLink href="/dashboard/projects">Quản lý dự án</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/projects/list">Danh sách dự án</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold !text-maintext">Chỉnh sửa dự án</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Chỉnh sửa dự án: {data?.data.name}</h1>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Thông tin dự án</CardTitle>
          
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên dự án</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nhập tên dự án" 
                        {...field} 
                        className='bg-white focus:border-primary focus:ring-primary'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả dự án</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Nhập mô tả dự án" 
                        className="min-h-[120px] bg-white focus:border-primary focus:ring-primary" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-white focus:border-primary focus:ring-primary",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: vi })
                              ) : (
                                <span>Chọn ngày bắt đầu</span>
                              )}
                              <Icon path={mdiCalendar} size={0.8} className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-white focus:border-primary focus:ring-primary",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: vi })
                              ) : (
                                <span>Chọn ngày kết thúc</span>
                              )}
                              <Icon path={mdiCalendar} size={0.8} className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='bg-white focus:border-primary focus:ring-primary'>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Chờ xử lý</SelectItem>
                          <SelectItem value="active">Đang diễn ra</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gameGenre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thể loại game</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ví dụ: RPG, FPS, MOBA, Puzzle, Action, Adventure, Strategy, Simulation..." 
                          {...field} 
                          className='bg-white focus:border-primary focus:ring-primary'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gamePlatform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nền tảng game</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ví dụ: PC, Mobile (iOS/Android), PS5, Xbox, Nintendo Switch, Web..." 
                          {...field} 
                          className='bg-white focus:border-primary focus:ring-primary'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/projects/${params.id}`)}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
                  disabled={updateProject.isPending}
                >
                  {updateProject.isPending ? (
                    <>
                      <Icon path={mdiLoading} size={0.8} className="mr-2 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    'Cập nhật dự án'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 