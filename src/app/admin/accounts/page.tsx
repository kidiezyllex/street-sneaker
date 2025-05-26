'use client';

import { useState, useEffect } from 'react';
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
  mdiFilterOutline,
  mdiLoading,
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
  DialogClose,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'react-toastify';
import { useAccounts, useDeleteAccount, useUpdateAccountStatus } from '@/hooks/account';
import { IAccountFilter, IAccountStatusUpdate } from '@/interface/request/account';
import { IAccount } from '@/interface/response/account';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IAccountFilter>({
    page: 1,
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<IAccount | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [accountToUpdateStatus, setAccountToUpdateStatus] = useState<IAccount | null>(null);
  const [newStatus, setNewStatus] = useState<'HOAT_DONG' | 'KHONG_HOAT_DONG'>('HOAT_DONG');

  const { data, isLoading, error } = useAccounts(filters);
  const deleteAccount = useDeleteAccount();
  const updateAccountStatus = useUpdateAccountStatus(accountToUpdateStatus?._id || '');
  const queryClient = useQueryClient();

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
      } else {
        const { search, ...rest } = filters;
        setFilters({ ...rest, page: 1 });
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleFilterChange = (key: keyof IAccountFilter, value: string | number | undefined) => {
    if (value === '') {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters({ ...newFilters, page: 1 });
    } else {
      setFilters({ ...filters, [key]: value, page: 1 });
    }
  };

  const handleChangePage = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa xác định';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-purple-600 text-white hover:bg-purple-700">Quản trị viên</Badge>;
      case 'STAFF':
        return <Badge className="bg-blue-600 text-white hover:bg-blue-700">Nhân viên</Badge>;
      case 'CUSTOMER':
        return <Badge className="bg-slate-600 text-white hover:bg-slate-700">Khách hàng</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{role}</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HOAT_DONG':
        return <Badge className="bg-green-600 text-white hover:bg-green-700">Hoạt động</Badge>;
      case 'KHONG_HOAT_DONG':
        return <Badge className="bg-red-600 text-white hover:bg-red-700">Không hoạt động</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{status}</Badge>;
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRandomAvatar = () => {
    const avatarCount = 4; // Assuming you have dfavatar1.png to dfavatar4.png
    const randomIndex = Math.floor(Math.random() * avatarCount) + 1;
    return `/images/dfavatar${randomIndex}.png`;
  };

  const handleDeleteAccount = (account: IAccount) => {
    setAccountToDelete(account);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = async () => {
    if (!accountToDelete) return;

    try {
      await deleteAccount.mutateAsync(accountToDelete._id, {
        onSuccess: () => {
          toast.success('Xóa tài khoản thành công');
          setIsDeleteDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: (error) => {
          toast.error('Xóa tài khoản thất bại: ' + (error.message || 'Không xác định'));
        }
      });
    } catch (error) {
      toast.error('Xóa tài khoản thất bại');
    }
  };

  const handleUpdateStatus = (account: IAccount, status: 'HOAT_DONG' | 'KHONG_HOAT_DONG') => {
    setAccountToUpdateStatus(account);
    setNewStatus(status);
    setIsStatusDialogOpen(true);
  };

  const confirmUpdateStatus = async () => {
    if (!accountToUpdateStatus) return;

    const statusUpdate: IAccountStatusUpdate = {
      status: newStatus
    };

    try {
      await updateAccountStatus.mutateAsync(statusUpdate, {
        onSuccess: () => {
          toast.success(`Cập nhật trạng thái tài khoản thành công`);
          setIsStatusDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: (error) => {
          toast.error('Cập nhật trạng thái tài khoản thất bại: ' + (error.message || 'Không xác định'));
        }
      });
    } catch (error) {
      toast.error('Cập nhật trạng thái tài khoản thất bại');
    }
  };

  return (
    <div className="space-y-4">
      <div className='flex justify-between items-start'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Quản lý người dùng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Danh sách tài khoản</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link href="/admin/accounts/create">
          <Button className="flex items-center gap-2">
            <Icon path={mdiPlus} size={0.7} />
            Thêm tài khoản mới
          </Button>
        </Link>
      </div>

      <Card className="mb-4">
        <CardContent className="py-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <div className="relative flex-1 max-w-md">
              <Icon
                path={mdiMagnify}
                size={0.7}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maintext"
              />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                className="pl-10 pr-4 py-2 w-full border rounded-[6px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon path={mdiFilterOutline} size={0.7} className="mr-2" />
              {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-maintext mb-2 font-semibold">
                      Vai trò
                    </label>
                    <Select value={filters.role || ''} onValueChange={(value) => handleFilterChange('role', value === 'all' ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả vai trò</SelectItem>
                        <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                        <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-maintext mb-2 font-semibold">
                      Trạng thái
                    </label>
                    <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="HOAT_DONG">Hoạt động</SelectItem>
                        <SelectItem value="KHONG_HOAT_DONG">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Icon path={mdiLoading} size={2} className="animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <h2 className="text-xl font-bold text-red-500">Đã xảy ra lỗi</h2>
              <p className="text-maintext">{error.message || 'Không thể tải dữ liệu tài khoản'}</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tài khoản</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.accounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-maintext">
                        Không có tài khoản nào được tìm thấy
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data.accounts.map((account) => (
                      <TableRow key={account._id} className="hover:bg-gray-50">
                        <TableCell className="py-3 px-4">
                          <div className="flex items-center space-x-4">
                            <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                              <Avatar className="h-10 w-10 border-2 border-white rounded-full">
                                <AvatarImage src={getRandomAvatar()} alt={`${account.fullName} avatar`} />
                                <AvatarFallback className="bg-gray-200 text-maintext">{getInitials(account.fullName)}</AvatarFallback>
                              </Avatar>
                            </div>
                            <div>
                              <div className="font-medium text-maintext">{account.fullName}</div>
                              <div className="text-sm text-maintext">{account.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-sm text-maintext">
                          {account.phoneNumber && (
                            <div className="flex items-center">
                              <Icon path={mdiPhone} size={0.7} className="mr-2 text-maintext" />
                              {account.phoneNumber}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-3 px-4">{getRoleBadge(account.role)}</TableCell>
                        <TableCell className="py-3 px-4">{getStatusBadge(account.status)}</TableCell>
                        <TableCell className="py-3 px-4 text-sm text-maintext">{formatDate(account.createdAt)}</TableCell>
                        <TableCell className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                              >
                                <Icon path={mdiAccountKey} size={0.7} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Link href={`/admin/accounts/edit/${account._id}`} passHref>
                                <DropdownMenuItem className="cursor-pointer text-maintext">
                                  <Icon path={mdiPencil} size={0.7} className="mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                              </Link>

                              {account.status === 'HOAT_DONG' ? (
                                <DropdownMenuItem
                                  className="cursor-pointer text-maintext"
                                  onClick={() => handleUpdateStatus(account, 'KHONG_HOAT_DONG')}
                                >
                                  <Icon path={mdiLock} size={0.7} className="mr-2" />
                                  Vô hiệu hóa
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="cursor-pointer text-maintext"
                                  onClick={() => handleUpdateStatus(account, 'HOAT_DONG')}
                                >
                                  <Icon path={mdiLockReset} size={0.7} className="mr-2" />
                                  Kích hoạt
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600"
                                onClick={() => handleDeleteAccount(account)}
                              >
                                <Icon path={mdiDelete} size={0.7} className="mr-2" />
                                Xóa tài khoản
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {data?.data.pagination && data.data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="text-sm text-maintext">
                    Hiển thị {(data.data.pagination.currentPage - 1) * (filters.limit || 10) + 1} đến{' '}
                    {Math.min(data.data.pagination.currentPage * (filters.limit || 10), data.data.pagination.count)}{' '}
                    trong tổng số {data.data.pagination.count} tài khoản
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChangePage(data.data.pagination.currentPage - 1)}
                      disabled={data.data.pagination.currentPage === 1}
                    >
                      Trước
                    </Button>
                    {Array.from({ length: data.data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === data.data.pagination.currentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleChangePage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChangePage(data.data.pagination.currentPage + 1)}
                      disabled={data.data.pagination.currentPage === data.data.pagination.totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Account Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa tài khoản</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tài khoản <span className="font-semibold">{accountToDelete?.fullName}</span>?
              <br />
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteAccount}
              disabled={deleteAccount.isPending}
              className="flex items-center gap-2"
            >
              {deleteAccount.isPending ? (
                <>
                  <Icon path={mdiLoading} size={0.7} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Icon path={mdiDelete} size={0.7} />
                  Xác nhận xóa
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === 'HOAT_DONG' ? 'Kích hoạt tài khoản' : 'Vô hiệu hóa tài khoản'}
            </DialogTitle>
            <DialogDescription>
              {newStatus === 'HOAT_DONG' ? (
                <>
                  Bạn có chắc chắn muốn kích hoạt tài khoản <span className="font-semibold">{accountToUpdateStatus?.fullName}</span>?
                  <br />
                  Tài khoản này sẽ có thể đăng nhập và sử dụng hệ thống.
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn vô hiệu hóa tài khoản <span className="font-semibold">{accountToUpdateStatus?.fullName}</span>?
                  <br />
                  Tài khoản này sẽ không thể đăng nhập và sử dụng hệ thống cho đến khi được kích hoạt lại.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant={newStatus === 'HOAT_DONG' ? 'default' : 'destructive'}
              onClick={confirmUpdateStatus}
              disabled={updateAccountStatus.isPending}
              className="flex items-center gap-2"
            >
              {updateAccountStatus.isPending ? (
                <>
                  <Icon path={mdiLoading} size={0.7} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : newStatus === 'HOAT_DONG' ? (
                <>
                  <Icon path={mdiCheck} size={0.7} />
                  Kích hoạt
                </>
              ) : (
                <>
                  <Icon path={mdiLock} size={0.7} />
                  Vô hiệu hóa
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 