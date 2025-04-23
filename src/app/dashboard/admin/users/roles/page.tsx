'use client';

import { useState } from 'react';
import { useGetUsers, useUpdateUser } from '@/hooks/useUser';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Link from 'next/link';
import { Icon } from '@mdi/react';
import { 
  mdiMagnify, 
  mdiRefresh, 
  mdiShieldAccount,
  mdiAccountOutline,
  mdiContentSave,
  mdiFilterOutline
} from '@mdi/js';

export default function UserRolesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [permissions, setPermissions] = useState({
    canManageUsers: false,
    canManageProjects: false,
    canManageDocuments: false,
    canViewReports: false,
    canManageSettings: false
  });

  const { data: usersData, isLoading, refetch } = useGetUsers();
  const updateUser = useUpdateUser();

  const filteredUsers = usersData?.data.filter(user => {
    // Lọc theo từ khóa tìm kiếm
    const searchMatch = 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Lọc theo vai trò
    const roleMatch = roleFilter === 'all' || user.role === roleFilter;
    
    return searchMatch && roleMatch;
  });

  const handleOpenRoleDialog = (user: any) => {
    setSelectedUser(user);
    setSelectedRole(user.role || 'user');
    
    // Thiết lập quyền dựa trên vai trò
    if (user.role === 'admin') {
      setPermissions({
        canManageUsers: true,
        canManageProjects: true,
        canManageDocuments: true,
        canViewReports: true,
        canManageSettings: true
      });
    } else if (user.role === 'manager') {
      setPermissions({
        canManageUsers: false,
        canManageProjects: true,
        canManageDocuments: true,
        canViewReports: true,
        canManageSettings: false
      });
    } else {
      setPermissions({
        canManageUsers: false,
        canManageProjects: false,
        canManageDocuments: false,
        canViewReports: false,
        canManageSettings: false
      });
    }
    
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;
    
    try {
      await updateUser.mutateAsync({
        id: selectedUser._id,
        payload: {
          role: selectedRole
        }
      });

      toast.success('Thành công', {
        description: 'Đã cập nhật vai trò người dùng'
      });
      
      setIsRoleDialogOpen(false);
      refetch(); // Tải lại danh sách sau khi cập nhật
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể cập nhật vai trò người dùng'
      });
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-green-100 text-green-800 hover:bg-green-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch(role) {
      case 'admin':
        return 'Quản trị viên';
      case 'manager':
        return 'Quản lý';
      default:
        return 'Người dùng';
    }
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
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-7 w-1/3 mb-2" />
            <Skeleton className="h-5 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="flex mb-4 gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="border rounded-md">
              <div className="border-b h-12 flex items-center px-4">
                <Skeleton className="h-5 w-full" />
              </div>
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="border-b h-16 flex items-center px-4">
                  <Skeleton className="h-8 w-full" />
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
            <BreadcrumbLink href="/dashboard/admin">Quản lý người dùng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin/users">Danh sách người dùng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Phân quyền</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-maintext">Phân quyền người dùng</h1>
      </div>

      <Card className='p-6'>
        <CardContent className='p-0'>
          <div className="flex flex-col md:flex-row items-start md:items-center mb-4 gap-4">
            <div className="relative flex-1 w-full">
              <Icon path={mdiMagnify} size={0.8} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo tên, email, tài khoản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div className="w-full md:w-48">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-white focus:border-primary focus:ring-primary">
                  <Icon path={mdiFilterOutline} size={0.8} className="mr-2 text-gray-500" />
                  <SelectValue placeholder="Lọc theo vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="employee">Nhân viên</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <ScrollArea className="h-[calc(70vh-12rem)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">STT</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vai trò hiện tại</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Icon path={mdiAccountOutline} size={2} className="text-gray-300 mb-2" />
                          <p className="text-lg font-medium text-gray-900">Không tìm thấy người dùng</p>
                          <p className="text-sm text-gray-500">
                            Không có người dùng nào phù hợp với tìm kiếm của bạn
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers?.map((user, index) => (
                      <TableRow key={user._id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-8 w-8 border">
                              <AvatarImage src={user.avatar} alt={user.fullName} />
                              <AvatarFallback className="bg-primary/10 text-primary">{user.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-maintext">{user.fullName}</p>
                              <p className="text-xs text-gray-500">{user.username || 'N/A'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={`${getRoleBadgeColor(user.role || 'employee')} font-normal`}>
                            {getRoleDisplayName(user.role || 'employee')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600"
                            onClick={() => handleOpenRoleDialog(user)}
                          >
                            <Icon path={mdiShieldAccount} size={0.7} className="mr-2" /> 
                            Phân quyền
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Dialog phân quyền */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>Phân quyền người dùng</DialogTitle>
                <DialogDescription>
                  Thiết lập vai trò và quyền hạn cho <span className="font-medium text-primary text-base">{selectedUser?.fullName}</span>
                </DialogDescription>
              </DialogHeader>

              {selectedUser && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border">
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.fullName} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">{selectedUser.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedUser.fullName}</h3>
                      <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-500">Vai trò người dùng</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div 
                          className={`flex flex-col items-center justify-center border rounded-md p-4 cursor-pointer transition-all hover:border-primary ${selectedRole === 'user' ? 'bg-primary/5 border-primary' : ''}`}
                          onClick={() => setSelectedRole('user')}
                        >
                          <div className={`size-10 rounded-full flex items-center justify-center ${selectedRole === 'user' ? 'bg-primary/20' : 'bg-gray-100'}`}>
                            <Icon path={mdiAccountOutline} size={1} className={selectedRole === 'user' ? 'text-primary' : 'text-gray-500'} />
                          </div>
                          <span className="mt-2 font-medium">Người dùng</span>
                          <p className="text-xs text-center text-gray-500 mt-1">Chỉ có quyền truy cập cơ bản</p>
                        </div>
                        
                        <div 
                          className={`flex flex-col items-center justify-center border rounded-md p-4 cursor-pointer transition-all hover:border-blue-500 ${selectedRole === 'manager' ? 'bg-blue-50 border-blue-500' : ''}`}
                          onClick={() => setSelectedRole('manager')}
                        >
                          <div className={`size-10 rounded-full flex items-center justify-center ${selectedRole === 'manager' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <Icon path={mdiShieldAccount} size={1} className={selectedRole === 'manager' ? 'text-blue-600' : 'text-gray-500'} />
                          </div>
                          <span className="mt-2 font-medium">Quản lý</span>
                          <p className="text-xs text-center text-gray-500 mt-1">Quản lý dự án và tài liệu</p>
                        </div>
                        
                        <div 
                          className={`flex flex-col items-center justify-center border rounded-md p-4 cursor-pointer transition-all hover:border-red-500 ${selectedRole === 'admin' ? 'bg-red-50 border-red-500' : ''}`}
                          onClick={() => setSelectedRole('admin')}
                        >
                          <div className={`size-10 rounded-full flex items-center justify-center ${selectedRole === 'admin' ? 'bg-red-100' : 'bg-gray-100'}`}>
                            <Icon path={mdiShieldAccount} size={1} className={selectedRole === 'admin' ? 'text-red-600' : 'text-gray-500'} />
                          </div>
                          <span className="mt-2 font-medium">Quản trị viên</span>
                          <p className="text-xs text-center text-gray-500 mt-1">Toàn quyền quản trị hệ thống</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-500">Quyền hạn chi tiết</h4>
                        <div className="text-xs text-gray-500">
                          Các quyền sẽ được thiết lập tự động dựa trên vai trò
                        </div>
                      </div>
                      
                      <div className="space-y-3 border rounded-md p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="manage-users" className="text-sm font-medium">Quản lý người dùng</Label>
                            <p className="text-xs text-gray-500">Thêm, sửa, xóa và phân quyền người dùng</p>
                          </div>
                          <Switch 
                            id="manage-users" 
                            checked={selectedRole === 'admin' || permissions.canManageUsers}
                            disabled={selectedRole === 'admin'} 
                            onCheckedChange={(checked) => setPermissions(prev => ({ ...prev, canManageUsers: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="manage-projects" className="text-sm font-medium">Quản lý dự án</Label>
                            <p className="text-xs text-gray-500">Tạo và quản lý tất cả các dự án</p>
                          </div>
                          <Switch 
                            id="manage-projects" 
                            checked={selectedRole === 'admin' || selectedRole === 'manager' || permissions.canManageProjects}
                            disabled={selectedRole === 'admin' || selectedRole === 'manager'} 
                            onCheckedChange={(checked) => setPermissions(prev => ({ ...prev, canManageProjects: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="manage-documents" className="text-sm font-medium">Quản lý tài liệu</Label>
                            <p className="text-xs text-gray-500">Quản lý tất cả các tài liệu trong hệ thống</p>
                          </div>
                          <Switch 
                            id="manage-documents" 
                            checked={selectedRole === 'admin' || selectedRole === 'manager' || permissions.canManageDocuments}
                            disabled={selectedRole === 'admin' || selectedRole === 'manager'} 
                            onCheckedChange={(checked) => setPermissions(prev => ({ ...prev, canManageDocuments: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="view-reports" className="text-sm font-medium">Xem báo cáo thống kê</Label>
                            <p className="text-xs text-gray-500">Truy cập và xem các báo cáo, thống kê</p>
                          </div>
                          <Switch 
                            id="view-reports" 
                            checked={selectedRole === 'admin' || selectedRole === 'manager' || permissions.canViewReports}
                            disabled={selectedRole === 'admin' || selectedRole === 'manager'} 
                            onCheckedChange={(checked) => setPermissions(prev => ({ ...prev, canViewReports: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="manage-settings" className="text-sm font-medium">Quản lý cài đặt hệ thống</Label>
                            <p className="text-xs text-gray-500">Thay đổi cấu hình và cài đặt toàn hệ thống</p>
                          </div>
                          <Switch 
                            id="manage-settings" 
                            checked={selectedRole === 'admin' || permissions.canManageSettings}
                            disabled={selectedRole === 'admin'} 
                            onCheckedChange={(checked) => setPermissions(prev => ({ ...prev, canManageSettings: checked }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Hủy</Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={handleSaveRole}
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 