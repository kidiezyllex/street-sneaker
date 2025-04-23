'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetUserById, useUpdateUser } from '@/hooks/useUser';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Icon } from '@mdi/react';
import { mdiContentSave, mdiArrowLeft, mdiRefresh } from '@mdi/js';
import Link from 'next/link';

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const router = useRouter();
  const { data: userData, isLoading } = useGetUserById(params.id);
  const updateUser = useUpdateUser();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    bio: '',
    position: '',
    department: '',
    skills: [] as string[],
  });

  // Cập nhật form khi có dữ liệu người dùng
  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user.role || '',
        bio: user.bio || '',
        position: user.position || '',
        department: user.department || '',
        skills: user.skills || [],
      });
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra nếu nhập password thì phải khớp nhau
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Lỗi', {
        description: 'Mật khẩu và xác nhận mật khẩu không khớp'
      });
      return;
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Lỗi', {
        description: 'Email không hợp lệ'
      });
      return;
    }

    try {
      // Chỉ gửi password nếu có nhập
      const payload: any = {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        bio: formData.bio,
        position: formData.position,
        department: formData.department,
        skills: formData.skills,
      };
      
      if (formData.password) {
        payload.password = formData.password;
      }

      await updateUser.mutateAsync({
        id: params.id,
        payload
      });

      toast.success('Thành công', {
        description: 'Đã cập nhật thông tin người dùng'
      });

      // Đặt lại trường mật khẩu
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể cập nhật thông tin người dùng'
      });
    }
  };
  
  // Hiển thị skeleton khi đang tải dữ liệu
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
              <BreadcrumbLink href="/dashboard/admin">Quản trị</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/admin/users">Người dùng</BreadcrumbLink>
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

        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-1/3 mb-2" />
            <Skeleton className="h-5 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
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
            <BreadcrumbLink href="/dashboard/admin">Quản trị</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin/users">Người dùng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Chỉnh sửa</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-maintext">Chỉnh sửa người dùng</h1>
        <Button variant="outline">
          <Link href="/dashboard/admin/users" className="flex items-center">
            <Icon path={mdiArrowLeft} size={0.8} className="mr-2" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin người dùng</CardTitle>
          <CardDescription>
            Chỉnh sửa thông tin người dùng trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[70vh]">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên <span className="text-red-500">*</span></Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Nhập họ và tên người dùng"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="bg-white focus:border-primary focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-white focus:border-primary focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu mới (để trống nếu không đổi)</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-white focus:border-primary focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-white focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleSelectChange(value, 'role')}
                  >
                    <SelectTrigger id="role" className='bg-white focus:border-primary focus:ring-primary'>
                      <SelectValue placeholder="Chọn vai trò người dùng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Nhân viên</SelectItem>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Chức vụ</Label>
                  <Input
                    id="position"
                    name="position"
                    placeholder="Nhập chức vụ"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="bg-white focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Phòng ban</Label>
                  <Input
                    id="department"
                    name="department"
                    placeholder="Nhập phòng ban"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="bg-white focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Giới thiệu</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Nhập thông tin giới thiệu"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="bg-white focus:border-primary focus:ring-primary min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => router.push('/dashboard/admin/users')}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90"
                  disabled={updateUser.isPending}
                >
                  {updateUser.isPending ? (
                    <>Đang xử lý...</>
                  ) : (
                    <>
                      <Icon path={mdiContentSave} size={0.8} className="mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 