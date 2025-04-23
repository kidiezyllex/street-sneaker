'use client';

import { useState } from 'react';
import { useCreateProject } from '@/hooks/useProject';
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
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
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

const projectSchema = z.object({
  name: z.string().min(3, 'Tên dự án phải có ít nhất 3 ký tự'),
  description: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.string().min(1, 'Vui lòng chọn trạng thái dự án'),
  gameGenre: z.string().optional(),
  gamePlatform: z.string().optional(),
});

export default function CreateProjectPage() {
  const createProject = useCreateProject();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'planning',
    },
  });

  const onSubmit = async (data: z.infer<typeof projectSchema>) => {
    try {
      const formattedData = {
        ...data,
        startDate: data.startDate ? format(data.startDate, 'yyyy-MM-dd') : undefined,
        endDate: data.endDate ? format(data.endDate, 'yyyy-MM-dd') : undefined,
      };
      
      await createProject.mutateAsync(formattedData);
      
      toast.success('Thành công', {
        description: 'Dự án đã được tạo thành công'
      });
      
      router.push('/dashboard/projects/list');
    } catch (error: any) {
      toast.error('Lỗi', {
        description: error.message || 'Đã xảy ra lỗi khi tạo dự án'
      });
    }
  };

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
            <BreadcrumbPage className="font-semibold !text-maintext">Tạo dự án mới</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Tạo dự án mới</h1>
      </div>

      <Card className='pt-6'>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-maintext'>Tên dự án</FormLabel>
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
                    <FormLabel className='text-maintext'>Mô tả dự án</FormLabel>
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
                      <FormLabel className='text-maintext'>Ngày bắt đầu</FormLabel>
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
                      <FormLabel className='text-maintext'>Ngày kết thúc</FormLabel>
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
                      <FormLabel className='text-maintext'>Trạng thái</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='bg-white focus:border-primary focus:ring-primary rounded-sm'>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='rounded-sm'>
                          <SelectItem value="planning">Lập kế hoạch</SelectItem>
                          <SelectItem value="in-progress">Đang tiến hành</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                          <SelectItem value="on-hold">Tạm hoãn</SelectItem>
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
                      <FormLabel className='text-maintext'>Thể loại game</FormLabel>
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
                      <FormLabel className='text-maintext'>Nền tảng game</FormLabel>
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
                  onClick={() => router.push('/dashboard/projects/list')}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
                  disabled={createProject.isPending}
                >
                  {createProject.isPending ? (
                    <>
                      <Icon path={mdiLoading} size={0.8} className="mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    'Tạo dự án'
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