'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icon } from '@mdi/react';
import {
  mdiMagnify,
  mdiPlus,
  mdiPencil,
  mdiDelete,
  mdiAccountKey,
  mdiCheck,
  mdiClose,
  mdiLock,
  mdiLockReset,
  mdiEmail,
  mdiPhone,
} from '@mdi/js';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

//                                                                                                                     Types
type AccountRole = 'admin' | 'manager' | 'staff' | 'customer';
type AccountStatus = 'active' | 'inactive' | 'locked';

interface Account {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: AccountRole;
  status: AccountStatus;
  createdAt: string;
  lastLoginAt?: string;
}

//                                                                                                                     Mock data
const mockAccounts: Account[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'Quản Trị Viên',
    email: 'admin@streetsneaker.vn',
    phone: '0987654321',
    avatar: '/images/avatars/admin.jpg',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    lastLoginAt: '2023-11-05T08:30:00Z',
  },
  {
    id: '2',
    username: 'tranminh',
    fullName: 'Trần Văn Minh',
    email: 'minh.tran@streetsneaker.vn',
    phone: '0912345678',
    avatar: '/images/avatars/minh.jpg',
    role: 'manager',
    status: 'active',
    createdAt: '2023-02-15T00:00:00Z',
    lastLoginAt: '2023-11-04T14:20:00Z',
  },
  {
    id: '3',
    username: 'nguyenhuong',
    fullName: 'Nguyễn Thị Hương',
    email: 'huong.nguyen@streetsneaker.vn',
    phone: '0923456789',
    avatar: '/images/avatars/huong.jpg',
    role: 'staff',
    status: 'active',
    createdAt: '2023-03-20T00:00:00Z',
    lastLoginAt: '2023-11-05T09:45:00Z',
  },
  {
    id: '4',
    username: 'levanduc',
    fullName: 'Lê Văn Đức',
    email: 'duc.le@streetsneaker.vn',
    phone: '0934567890',
    role: 'staff',
    status: 'inactive',
    createdAt: '2023-04-05T00:00:00Z',
    lastLoginAt: '2023-10-25T11:30:00Z',
  },
  {
    id: '5',
    username: 'phamthihoa',
    fullName: 'Phạm Thị Hoa',
    email: 'hoa.pham@streetsneaker.vn',
    phone: '0945678901',
    avatar: '/images/avatars/hoa.jpg',
    role: 'staff',
    status: 'locked',
    createdAt: '2023-04-15T00:00:00Z',
    lastLoginAt: '2023-09-10T10:15:00Z',
  },
  {
    id: '6',
    username: 'hoangnam',
    fullName: 'Hoàng Văn Nam',
    email: 'nam.hoang@streetsneaker.vn',
    phone: '0956789012',
    role: 'staff',
    status: 'active',
    createdAt: '2023-05-20T00:00:00Z',
    lastLoginAt: '2023-11-03T16:40:00Z',
  },
  {
    id: '7',
    username: 'nguyenanh',
    fullName: 'Nguyễn Văn Anh',
    email: 'anh.nguyen@example.com',
    phone: '0967890123',
    role: 'customer',
    status: 'active',
    createdAt: '2023-06-10T00:00:00Z',
    lastLoginAt: '2023-11-01T20:30:00Z',
  },
  {
    id: '8',
    username: 'tranthuy',
    fullName: 'Trần Thị Thúy',
    email: 'thuy.tran@example.com',
    phone: '0978901234',
    role: 'customer',
    status: 'active',
    createdAt: '2023-07-05T00:00:00Z',
    lastLoginAt: '2023-10-28T19:15:00Z',
  },
];

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [accountToResetPassword, setAccountToResetPassword] = useState<Account | null>(null);

  //                                                                                                                     Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa đăng nhập';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  //                                                                                                                     Filter accounts based on search query, role, and status
  const filteredAccounts = mockAccounts.filter((account) => {
    //                                                                                                                     Filter by role
    if (selectedRole !== 'all' && account.role !== selectedRole) {
      return false;
    }

    //                                                                                                                     Filter by status
    if (selectedStatus !== 'all' && account.status !== selectedStatus) {
      return false;
    }

    //                                                                                                                     Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        account.username.toLowerCase().includes(query) ||
        account.fullName.toLowerCase().includes(query) ||
        account.email.toLowerCase().includes(query) ||
        (account.phone && account.phone.includes(query))
      );
    }

    return true;
  });

  //                                                                                                                     Get role badge
  const getRoleBadge = (role: AccountRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Quản trị viên</Badge>;
      case 'manager':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Quản lý</Badge>;
      case 'staff':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Nhân viên</Badge>;
      case 'customer':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Khách hàng</Badge>;
    }
  };

  //                                                                                                                     Get status badge
  const getStatusBadge = (status: AccountStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hoạt động</Badge>;
      case 'inactive':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Không hoạt động</Badge>;
      case 'locked':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã khóa</Badge>;
    }
  };

  //                                                                                                                     Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  //                                                                                                                     Handle delete account
  const handleDeleteAccount = (account: Account) => {
    setAccountToDelete(account);
    setIsDeleteDialogOpen(true);
  };

  //                                                                                                                     Confirm delete account
  const confirmDeleteAccount = () => {
    setIsDeleteDialogOpen(false);
    setAccountToDelete(null);
  };

  //                                                                                                                     Handle reset password
  const handleResetPassword = (account: Account) => {
    setAccountToResetPassword(account);
    setIsResetPasswordDialogOpen(true);
  };

  //                                                                                                                     Confirm reset password
  const confirmResetPassword = () => {
    setIsResetPasswordDialogOpen(false);
    setAccountToResetPassword(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">Quản lý tài khoản</h1>
        <Button className="flex items-center">
          <Icon path={mdiPlus} size={0.8} className="mr-2" />
          Tạo tài khoản mới
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row w-full gap-3">
              <div className="relative w-full sm:w-80">
                <Input
                  placeholder="Tìm tài khoản..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Icon path={mdiMagnify} size={0.9} />
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                Bộ lọc
                {(selectedRole !== 'all' || selectedStatus !== 'all') && (
                  <Badge className="ml-2 bg-primary h-5 w-5 p-0 flex items-center justify-center">
                    {(selectedRole !== 'all' ? 1 : 0) + (selectedStatus !== 'all' ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-slate-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Vai trò</label>
                <Select
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tất cả vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả vai trò</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                    <SelectItem value="manager">Quản lý</SelectItem>
                    <SelectItem value="staff">Nhân viên</SelectItem>
                    <SelectItem value="customer">Khách hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Trạng thái</label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="locked">Đã khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedRole('all');
                    setSelectedStatus('all');
                  }}
                  className="flex items-center text-gray-400"
                >
                  <Icon path={mdiClose} size={0.7} className="mr-1" />
                  Đặt lại bộ lọc
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Đăng nhập lần cuối</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      <p className="text-gray-400">Không tìm thấy tài khoản nào phù hợp.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAccounts.map((account) => (
                    <TableRow key={account.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={account.avatar} alt={account.fullName} />
                            <AvatarFallback>{getInitials(account.fullName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{account.fullName}</div>
                            <div className="text-xs text-gray-400">@{account.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm">
                            <Icon path={mdiEmail} size={0.5} className="mr-1.5 text-gray-400" />
                            <span>{account.email}</span>
                          </div>
                          {account.phone && (
                            <div className="flex items-center text-sm mt-1">
                              <Icon path={mdiPhone} size={0.5} className="mr-1.5 text-gray-400" />
                              <span>{account.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(account.role)}</TableCell>
                      <TableCell>{getStatusBadge(account.status)}</TableCell>
                      <TableCell>{formatDate(account.createdAt)}</TableCell>
                      <TableCell>{formatDate(account.lastLoginAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <span className="sr-only">Mở menu</span>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center cursor-pointer">
                              <Icon path={mdiPencil} size={0.7} className="mr-2" />
                              <span>Chỉnh sửa</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                              className="flex items-center cursor-pointer"
                              onClick={() => handleResetPassword(account)}
                            >
                              <Icon path={mdiLockReset} size={0.7} className="mr-2" />
                              <span>Đặt lại mật khẩu</span>
                            </DropdownMenuItem>

                            {account.status === 'active' ? (
                              <DropdownMenuItem className="flex items-center cursor-pointer">
                                <Icon path={mdiLock} size={0.7} className="mr-2" />
                                <span>Khóa tài khoản</span>
                              </DropdownMenuItem>
                            ) : account.status === 'locked' ? (
                              <DropdownMenuItem className="flex items-center cursor-pointer">
                                <Icon path={mdiAccountKey} size={0.7} className="mr-2" />
                                <span>Mở khóa tài khoản</span>
                              </DropdownMenuItem>
                            ) : null}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="flex items-center text-red-600 cursor-pointer"
                              onClick={() => handleDeleteAccount(account)}
                            >
                              <Icon path={mdiDelete} size={0.7} className="mr-2" />
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa tài khoản</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tài khoản <span className="font-medium">{accountToDelete?.username}</span>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDeleteAccount}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Confirmation Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đặt lại mật khẩu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản <span className="font-medium">{accountToResetPassword?.username}</span>? Người dùng sẽ nhận được email với mật khẩu mới.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>Hủy</Button>
            <Button onClick={confirmResetPassword}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 