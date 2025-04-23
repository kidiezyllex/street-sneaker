'use client';

import { useState, useEffect } from 'react';
import { useGetUsers, useDeleteUser, useUpdateUser } from '@/hooks/useUser';
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Link from 'next/link';
import { Icon } from '@mdi/react';
import { 
  mdiPlus, 
  mdiMagnify, 
  mdiPencilOutline, 
  mdiTrashCanOutline, 
  mdiEye,
  mdiRefresh,
  mdiAccountOutline,
  mdiFilterOutline,
  mdiEmail,
  mdiPhone,
  mdiBriefcaseOutline,
  mdiOfficeBuilding,
  mdiDotsVertical,
  mdiShieldAccount,
  mdiContentSave
} from '@mdi/js';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);

  // State cho phân quyền
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

  // State để lưu trữ avatar cho mỗi người dùng
  const [userAvatars, setUserAvatars] = useState<{[userId: string]: number}>({});

  const { data: usersData, isLoading, refetch } = useGetUsers();
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();

  // Tạo số ngẫu nhiên từ 1 đến 4 cho mỗi user nếu chưa có
  const getRandomAvatar = (userId: string) => {
    if (!userAvatars[userId]) {
      return userAvatars[userId];
    }
    return 1; // Fallback nếu không có ID
  };

  // Cập nhật userAvatars khi danh sách người dùng thay đổi
  useEffect(() => {
    if (usersData?.data) {
      const newAvatars = {...userAvatars};
      let hasChanges = false;
      
      usersData.data.forEach(user => {
        if (!newAvatars[user._id]) {
          newAvatars[user._id] = Math.floor(Math.random() * 4) + 1;
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setUserAvatars(newAvatars);
      }
    }
  }, [usersData?.data]);

  const filteredUsers = usersData?.data.filter(user => {
    // Lọc theo từ khóa tìm kiếm
    const searchMatch = 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Lọc theo vai trò
    const roleMatch = roleFilter === 'all' || user.role === roleFilter;
    
    return searchMatch && roleMatch;
  });

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    try {
      await deleteUser.mutateAsync(selectedUserId);
      toast.success('Thành công', {
        description: 'Xóa người dùng thành công'
      });
      setIsDeleteDialogOpen(false);
      refetch(); // Tải lại danh sách sau khi xóa
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể xóa người dùng'
      });
    }
  };

  const openDeleteDialog = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const openUserDetails = (user: any) => {
    setSelectedUserDetails(user);
    setIsUserDetailsOpen(true);
  };

  const handleOpenRoleDialog = (user: any) => {
    setSelectedUser(user);
    setSelectedRole(user.role || 'employee');
    
    // Thiết lập quyền dựa trên vai trò
    if (user.role === 'admin') {
      setPermissions({
        canManageUsers: true,
        canManageProjects: true,
        canManageDocuments: true,
        canViewReports: true,
        canManageSettings: true
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
        return 'Nhân viên';
    }
  };

  // Skeleton loading
  if (isLoading) {
    return (
      <div className="space-y-6 h-full">
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
              <Skeleton className="h-5 w-24" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
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
    <div className="space-y-6 h-full">
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
            <BreadcrumbPage>Danh sách người dùng</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-maintext">Danh sách người dùng</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Link href="/dashboard/admin/users/create" className="flex items-center">
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Thêm người dùng mới
          </Link>
        </Button>
      </div>

      <Card className="h-full flex flex-col">
        <CardHeader className="flex-none">
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row items-start md:items-center mb-4 gap-4 flex-none">
            <div className="relative flex-1 w-full">
              <Icon path={mdiMagnify} size={0.8} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo tên, email, chức vụ..."
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

          <div className="rounded-md border flex-1 h-full overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">STT</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Thông tin liên hệ</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Chức vụ</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="overflow-y-auto">
                {filteredUsers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
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
                          <Avatar className="h-10 w-10 border">
                            <AvatarImage src={`/images/dfavatar${getRandomAvatar(user._id)}.png`} alt={user.fullName} />
                            <AvatarFallback className="bg-primary/10 text-primary">{user.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-maintext">{user.fullName}</p>
                            <p className="text-xs text-gray-500">{user.username || 'N/A'}</p>
                            {user.department && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                <Icon path={mdiOfficeBuilding} size={0.5} />
                                <span>{user.department}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {user.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Icon path={mdiEmail} size={0.6} className="text-gray-500" />
                              <span>{user.email}</span>
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Icon path={mdiPhone} size={0.6} className="text-gray-500" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getRoleBadgeColor(user.role || 'user')} font-normal`}>
                          {getRoleDisplayName(user.role || 'user')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {user.position ? (
                            <>
                              <Icon path={mdiBriefcaseOutline} size={0.6} className="text-gray-500" />
                              <span>{user.position}</span>
                            </>
                          ) : (
                            <span className="text-gray-400 italic">Chưa thiết lập</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-full h-8 w-8 bg-gray"
                            >
                              <Icon path={mdiDotsVertical} size={0.7} className="text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => openUserDetails(user)}
                            >
                              <Icon path={mdiEye} size={0.7} className="mr-2 text-blue-500" />
                              <span>Xem chi tiết</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleOpenRoleDialog(user)}
                            >
                              <Icon path={mdiShieldAccount} size={0.7} className="mr-2 text-blue-500" />
                              <span>Phân quyền</span>
                            </DropdownMenuItem>
                            <Link href={`/dashboard/admin/users/edit/${user._id}`} className="w-full">
                              <DropdownMenuItem className="cursor-pointer">
                                <Icon path={mdiPencilOutline} size={0.7} className="mr-2 text-blue-500" />
                                <span>Chỉnh sửa</span>
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                              onClick={() => openDeleteDialog(user._id)}
                            >
                              <Icon path={mdiTrashCanOutline} size={0.7} className="mr-2" />
                              <span>Xóa</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog xem chi tiết người dùng */}
      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về người dùng trong hệ thống
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            {selectedUserDetails && (
              <div className="p-6 pt-2">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="h-24 w-24 border">
                      <AvatarImage src={`/images/dfavatar${getRandomAvatar(selectedUserDetails._id)}.png`} alt={selectedUserDetails.fullName} />
                      <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                        {selectedUserDetails.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-maintext">{selectedUserDetails.fullName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getRoleBadgeColor(selectedUserDetails.role || 'user')} font-normal`}>
                          {getRoleDisplayName(selectedUserDetails.role || 'user')}
                        </Badge>
                        {selectedUserDetails.position && (
                          <span className="text-gray-600">{selectedUserDetails.position}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-500">Thông tin tài khoản</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Tên đăng nhập:</span>
                            <span>{selectedUserDetails.username || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Email:</span>
                            <span>{selectedUserDetails.email || 'N/A'}</span>
                          </div>
                          {selectedUserDetails.createdAt && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Ngày tạo:</span>
                              <span>{format(new Date(selectedUserDetails.createdAt), 'dd/MM/yyyy', { locale: vi })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-500">Thông tin liên hệ</h4>
                        <div className="space-y-1">
                          {selectedUserDetails.phone && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Điện thoại:</span>
                              <span>{selectedUserDetails.phone}</span>
                            </div>
                          )}
                          {selectedUserDetails.address && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Địa chỉ:</span>
                              <span>{selectedUserDetails.address}</span>
                            </div>
                          )}
                          {selectedUserDetails.department && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Phòng ban:</span>
                              <span>{selectedUserDetails.department}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {selectedUserDetails.bio && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-500">Giới thiệu</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {selectedUserDetails.bio}
                        </p>
                      </div>
                    )}
                    
                    {selectedUserDetails.skills && selectedUserDetails.skills.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-500">Kỹ năng</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedUserDetails.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-gray-100">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={() => setIsUserDetailsOpen(false)}>
              Đóng
            </Button>
            {selectedUserDetails && (
              <Button className="bg-primary hover:bg-primary/90">
                <Link href={`/dashboard/admin/users/edit/${selectedUserDetails._id}`} className="flex items-center">
                  <Icon path={mdiPencilOutline} size={0.8} className="mr-2" />
                  Chỉnh sửa
                </Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa người dùng */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>Xác nhận xóa người dùng?</DialogTitle>
                <DialogDescription>
                  Hành động này không thể khôi phục. Việc xóa người dùng sẽ xóa tất cả dữ liệu liên quan
                  và xóa quyền truy cập của họ vào hệ thống.
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
                  onClick={handleDeleteUser}
                >
                  {deleteUser.isPending ? 'Đang xử lý...' : 'Xóa người dùng'}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog phân quyền */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[75vh]">
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
                      <AvatarImage src={`/images/dfavatar${getRandomAvatar(selectedUser._id)}.png`} alt={selectedUser.fullName} />
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
                          <span className="mt-2 font-medium">Nhân viên</span>
                          <p className="text-xs text-center text-gray-500 mt-1">Chỉ có quyền truy cập cơ bản</p>
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
                            <p className="text-xs text-gray-500">Truy cập và xem các báo cáo, </p>
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
          <DialogFooter className="h-16 rounded-b-lg border-t px-6 bg-gray-50 flex items-center justify-end">
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