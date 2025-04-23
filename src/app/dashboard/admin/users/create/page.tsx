'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRegister } from '@/hooks/authentication';
import { Icon } from '@mdi/react';
import { mdiContentSave, mdiArrowLeft } from '@mdi/js';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function CreateUserPage() {
  const router = useRouter();
  const register = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    position: '',
    department: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
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
      await register.mutateAsync({
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      toast.success('Thành công', {
        description: 'Đã tạo người dùng mới'
      });

      // Chuyển về trang danh sách người dùng
      router.push('/dashboard/admin/users');
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể tạo người dùng mới'
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
            <BreadcrumbLink href="/dashboard/admin/users">Quản lý người dùng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className='text-maintext font-semibold'>Thêm người dùng mới</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-maintext">Thêm người dùng mới</h1>
        <Button variant="default">
          <Link href="/dashboard/admin/users" className="flex items-center">
            <Icon path={mdiArrowLeft} size={0.8} className="mr-2" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="username" className='text-maintext'>Tên đăng nhập <span className="text-red-500">*</span></Label>
              <Input
                id="username"
                name="username"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="bg-white focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className='text-maintext'>Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="bg-white focus:border-primary focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className='text-maintext'>Email <span className="text-red-500">*</span></Label>
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
              <Label htmlFor="role" className='text-maintext'>Vai trò <span className="text-red-500">*</span></Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange(value, 'role')}
              >
                <SelectTrigger id="role" className='bg-white focus:border-primary focus:ring-primary'>
                  <SelectValue placeholder="Chọn vai trò người dùng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="employee">Nhân viên</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className='text-maintext'>Họ và tên <span className="text-red-500">*</span></Label>
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
              <Label htmlFor="position" className='text-maintext'>Chức vụ</Label>
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
              <Label htmlFor="password" className='text-maintext'>Mật khẩu <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="bg-white focus:border-primary focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className='text-maintext'>Phòng ban</Label>
              <Input
                id="department"
                name="department"
                placeholder="Nhập phòng ban"
                value={formData.department}
                onChange={handleInputChange}
                className="bg-white focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-6">
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
              disabled={register.isPending}
            >
              {register.isPending ? (
                <>Đang xử lý...</>
              ) : (
                <>
                  <Icon path={mdiContentSave} size={0.8} className="mr-2" />
                  Lưu người dùng
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 