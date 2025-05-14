'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IAccountCreate } from '@/interface/request/account';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@mdi/react';
import { mdiArrowLeft, mdiLoading } from '@mdi/js';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRegister } from '@/hooks/authentication';

const initialAccount: IAccountCreate = {
  fullName: '',
  email: '',
  password: '',
  phoneNumber: '',
  role: 'CUSTOMER',
  gender: 'male',
  birthday: '',
  citizenId: ''
};

export default function CreateAccountPage() {
  const router = useRouter();
  const [account, setAccount] = useState<IAccountCreate>(initialAccount);
  const [confirmPassword, setConfirmPassword] = useState('');
  const createAccount = useRegister();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccount({ ...account, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setAccount({ ...account, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!account.fullName || !account.email || !account.password || !account.phoneNumber) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (account.password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(account.email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    // Phone number validation (Vietnamese format)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(account.phoneNumber)) {
      toast.error('Số điện thoại không hợp lệ');
      return;
    }

    try {
      await createAccount.mutateAsync({
        ...account,
        birthday: account.birthday ? new Date(account.birthday) : undefined,
        gender: account.gender as 'male' | 'female' | 'other'
      }, {
        onSuccess: () => {
          toast.success('Tạo tài khoản thành công');
          router.push('/admin/accounts');
        },
        onError: (error: any) => {
          let specificMessage = 'Không xác định';
          if (error.response && error.response.data && typeof error.response.data.message === 'string') {
            specificMessage = error.response.data.message;
          } else if (error.message && typeof error.message === 'string') {
            specificMessage = error.message;
          }
          toast.error('Tạo tài khoản thất bại: ' + specificMessage);
        }
      });
    } catch (error) {
      console.error('Lỗi khi tạo tài khoản:', error);
      toast.error('Tạo tài khoản thất bại');
    }
  };

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-start'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/accounts">Quản lý tài khoản</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Thêm tài khoản mới</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <Icon path={mdiArrowLeft} size={0.9} />
          Quay lại
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-maintext">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên <span className="text-red-500">*</span></Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={account.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={account.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu <span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={account.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Xác nhận mật khẩu"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại <span className="text-red-500">*</span></Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={account.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Vai trò <span className="text-red-500">*</span></Label>
                <Select 
                  value={account.role} 
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                    <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="citizenId">CCCD/CMND</Label>
                <Input
                  id="citizenId"
                  name="citizenId"
                  value={account.citizenId || ''}
                  onChange={handleInputChange}
                  placeholder="Nhập số CCCD/CMND"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">Ngày sinh</Label>
                <Input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={account.birthday ? (typeof account.birthday === 'string' ? account.birthday : account.birthday.toISOString().split('T')[0]) : ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Giới tính</Label>
                <RadioGroup 
                  value={account.gender || 'male'}
                  onValueChange={(value) => handleSelectChange('gender', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="gender-nam" />
                    <Label htmlFor="gender-nam">Nam</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="gender-nu" />
                    <Label htmlFor="gender-nu">Nữ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="gender-khac" />
                    <Label htmlFor="gender-khac">Khác</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => router.back()}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={createAccount.isPending}
              className="flex items-center gap-2"
            >
              {createAccount.isPending ? (
                <>
                  <Icon path={mdiLoading} size={0.9} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Tạo tài khoản'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
} 