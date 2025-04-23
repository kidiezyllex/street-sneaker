'use client';

import { useState, useEffect } from 'react';
import { useGetProjectById, useUpdateProject, useRemoveProjectMember, useAddProjectMember } from '@/hooks/useProject';
import { useGetUsers } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Icon } from '@mdi/react';
import { mdiPencil, mdiDelete, mdiPlus, mdiLoading, mdiAccountPlus, mdiShieldAccount, mdiEmail } from '@mdi/js';
import { toast } from 'sonner';
import Link from 'next/link';
import { IProject } from '@/interface/response/project';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { getStatusBadge } from '@/utils/constant';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { data, isLoading, refetch } = useGetProjectById(params.id);
  const updateProject = useUpdateProject();
  const removeProjectMember = useRemoveProjectMember();
  const addProjectMember = useAddProjectMember();
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsers();
  const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string, name: string } | null>(null);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [newMemberInfo, setNewMemberInfo] = useState({ userId: '', role: 'member' });
  const [userAvatars, setUserAvatars] = useState<{ [userId: string]: number }>({});
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const router = useRouter();

  const getRandomAvatar = (userId: string) => {
    if (userAvatars[userId]) {
      return userAvatars[userId];
    }
    return 1;
  };

  useEffect(() => {
    if (data?.data?.members) {
      const newAvatars = { ...userAvatars };
      let hasChanges = false;

      data.data.members.forEach((member: any) => {
        if (!newAvatars[member.user._id]) {
          newAvatars[member.user._id] = Math.floor(Math.random() * 4) + 1;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setUserAvatars(newAvatars);
      }
    }
  }, [data?.data?.members]);

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      await removeProjectMember.mutateAsync({
        projectId: params.id,
        userId: memberToRemove.id
      });
      toast.success('Thành công', {
        description: 'Đã xóa thành viên khỏi dự án thành công'
      });
      setIsRemoveMemberDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error('Lỗi', {
        description: error.message || 'Đã xảy ra lỗi khi xóa thành viên'
      });
    }
  };

  const handleAddMember = async () => {
    if (!newMemberInfo.userId) {
      toast.error('Lỗi', {
        description: 'Vui lòng nhập ID người dùng'
      });
      return;
    }

    try {
      await addProjectMember.mutateAsync({
        projectId: params.id,
        memberData: {
          userId: newMemberInfo.userId,
          role: newMemberInfo.role as 'lead' | 'member'
        }
      });
      toast.success('Thành công', {
        description: 'Đã thêm thành viên vào dự án thành công'
      });
      setIsAddMemberDialogOpen(false);
      setNewMemberInfo({ userId: '', role: 'member' });
      refetch();
    } catch (error: any) {
      toast.error('Lỗi', {
        description: error.message || 'Đã xảy ra lỗi khi thêm thành viên'
      });
    }
  };

  // Hàm tìm tên người dùng từ ID
  const findUserNameById = (userId: string) => {
    if (!usersData?.data) return '';
    const user = usersData.data.find((user: any) => user._id === userId);
    return user ? user.fullName : '';
  };

  const openRemoveMemberDialog = (id: string, name: string) => {
    setMemberToRemove({ id, name });
    setIsRemoveMemberDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'Invalid date';
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
              <Skeleton className="h-5 w-24" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-muted-foreground">Không tìm thấy thông tin dự án</h2>
      </div>
    );
  }

  const project = data.data;

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
            <BreadcrumbPage className="font-semibold !text-maintext">{project.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">{project.name}</h1>
          {getStatusBadge(project.status)}
        </div>
        <Link href={`/dashboard/projects/edit/${params.id}`}>
          <Button className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90">
            <Icon path={mdiPencil} size={0.8} className="mr-2" />
            Chỉnh sửa dự án
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-transparent">
          <TabsTrigger value="details" className='data-[state=active]:bg-[#F3F8F4] data-[state=active]:text-primary border-b-2 data-[state=active]:border-primary rounded-none border-transparent'>Thông tin dự án</TabsTrigger>
          <TabsTrigger value="members" className='data-[state=active]:bg-[#F3F8F4] data-[state=active]:text-primary border-b-2 data-[state=active]:border-primary rounded-none border-transparent'>Số thành viên ({project.members.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-primary">
                <CardHeader className="bg-gradient-to-r from-[#F3F8F4] to-white border-b">
                  <CardTitle className='text-maintext flex items-center gap-2'>
                    Chi tiết dự án
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="bg-[#F9FBFA] p-3 rounded-md">
                    <h3 className="text-sm font-medium text-primary mb-1">Mô tả</h3>
                    <p className="mt-1 text-maintext">
                      {project.description || 'Không có mô tả.'}
                    </p>
                  </div>
                  {(project.gameGenre || project.gamePlatform) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.gameGenre && (
                        <div className="bg-[#F9FBFA] p-3 rounded-md">
                          <h3 className="text-sm font-medium text-primary mb-1">Thể loại game</h3>
                          <p className="mt-1 text-maintext font-medium">{project.gameGenre}</p>
                        </div>
                      )}
                      {project.gamePlatform && (
                        <div className="bg-[#F9FBFA] p-3 rounded-md">
                          <h3 className="text-sm font-medium text-primary mb-1">Nền tảng game</h3>
                          <p className="mt-1 text-maintext font-medium">{project.gamePlatform}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#F9FBFA] p-3 rounded-md">
                      <h3 className="text-sm font-medium text-primary mb-1">Ngày tạo</h3>
                      <p className="mt-1 text-maintext font-medium">{formatDate(project.createdAt)}</p>
                    </div>
                    <div className="bg-[#F9FBFA] p-3 rounded-md">
                      <h3 className="text-sm font-medium text-primary mb-1">Cập nhật lần cuối</h3>
                      <p className="mt-1 text-maintext font-medium">{formatDate(project.updatedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-primary">
                <CardHeader className="bg-gradient-to-r from-[#F3F8F4] to-white border-b">
                  <CardTitle className='text-maintext flex items-center gap-2'>
                    Thông tin dự án
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="bg-[#F9FBFA] p-3 rounded-md flex justify-between items-center">
                    <span className="text-sm font-medium text-primary">Trạng thái:</span>
                    <span className='text-maintext'>{getStatusBadge(project.status)}</span>
                  </div>
                  <div className="bg-[#F9FBFA] p-3 rounded-md flex justify-between items-center">
                    <span className="text-sm font-medium text-primary">Ngày bắt đầu:</span>
                    <span className='text-maintext font-medium'>{formatDate(project.startDate)}</span>
                  </div>
                  <div className="bg-[#F9FBFA] p-3 rounded-md flex justify-between items-center">
                    <span className="text-sm font-medium text-primary">Ngày kết thúc:</span>
                    <span className='text-maintext font-medium'>{formatDate(project.endDate)}</span>
                  </div>
                  <div className="bg-[#F9FBFA] p-3 rounded-md flex justify-between items-center">
                    <span className="text-sm font-medium text-primary">Số thành viên:</span>
                    <span className='text-maintext font-semibold'>{project.members.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="members" className="mt-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-[#F3F8F4] to-white border-b">
              <CardTitle className='text-maintext flex items-center gap-2'>
                Thành viên dự án
              </CardTitle>
              <Button
                className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90 shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => setIsAddMemberDialogOpen(true)}
              >
                <Icon path={mdiAccountPlus} size={0.8} className="mr-2" />
                Thêm thành viên
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {project.members.length === 0 ? (
                <div className="text-center py-6 bg-[#F9FBFA] rounded-lg border border-dashed border-gray-300">
                  <p className="text-muted-foreground">Dự án chưa có thành viên nào.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {project.members.map((member) => (
                    <div
                      key={member.user._id}
                      className="flex items-center justify-between p-4 border rounded-md hover:shadow-md transition-all duration-300 bg-[#F9FBFA] hover:bg-white"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative p-[2px] h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center">
                          <div className="p-[2px] bg-white rounded-full">
                            <Avatar className="!h-8 !w-8 flex-shrink-0">
                              {member.user.avatar ? (
                                <AvatarImage src={member.user.avatar} alt={member.user.fullName} />
                              ) : (
                                <AvatarImage src={`/images/dfavatar${getRandomAvatar(member.user._id)}.png`} alt={member.user.fullName} />
                              )}
                              <AvatarFallback className="bg-primary/10 text-primary">{member.user.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                          <p className="font-medium text-maintext">{member.user.fullName}</p>
                          <div className="flex items-center gap-2">
                            <Badge className={member.role === 'lead' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}>
                              {member.role === 'lead' ? 'Trưởng nhóm' : 'Thành viên'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300 border-red-200"
                        onClick={() => openRemoveMemberDialog(member.user._id, member.user.fullName)}
                        title="Xóa thành viên"
                      >
                        <Icon path={mdiDelete} size={0.8} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog xác nhận xóa thành viên */}
      <Dialog open={isRemoveMemberDialogOpen} onOpenChange={setIsRemoveMemberDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>Xác nhận xóa thành viên</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa thành viên "{memberToRemove?.name}" khỏi dự án này? Hành động này không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsRemoveMemberDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRemoveMember}
                  disabled={removeProjectMember.isPending}
                >
                  {removeProjectMember.isPending ? (
                    <>
                      <Icon path={mdiLoading} size={0.8} className="mr-2 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    'Xóa thành viên'
                  )}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog thêm thành viên */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle className='text-maintext'>Thêm thành viên vào dự án</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-maintext">
                      Người dùng
                    </label>
                    <Select
                      value={newMemberInfo.userId}
                      onValueChange={(value) => {
                        setNewMemberInfo({ ...newMemberInfo, userId: value });
                        setSelectedUserName(findUserNameById(value));
                      }}
                    >
                      <SelectTrigger className='bg-white focus:border-primary focus:ring-primary'>
                        <SelectValue placeholder="Chọn người dùng">
                          {selectedUserName || "Chọn người dùng"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingUsers ? (
                          <div className="flex items-center justify-center py-2">
                            <Icon path={mdiLoading} size={0.8} className="mr-2 animate-spin" />
                            <span>Đang tải...</span>
                          </div>
                        ) : (
                          usersData?.data.map((user: any) => (
                            <SelectItem key={user._id} value={user._id} className="py-2">
                              <div className="flex flex-col">
                                <span className="font-medium text-maintext">{user.fullName}</span>
                                <div className="flex text-xs text-muted-foreground mt-1 items-center">
                                  <Icon path={mdiShieldAccount} size={0.6} className="mr-2 text-gray-400" />
                                  <span className="mr-2">{user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</span>
                                  <Icon path={mdiEmail} size={0.6} className="mr-2 text-gray-400" />
                                  <span>{user.email}</span>
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-maintext">
                      Vai trò
                    </label>
                    <Select
                      value={newMemberInfo.role}
                      onValueChange={(value) => setNewMemberInfo({ ...newMemberInfo, role: value })}
                    >
                      <SelectTrigger className='bg-white focus:border-primary focus:ring-primary'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Thành viên</SelectItem>
                        <SelectItem value="lead">Trưởng nhóm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddMemberDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
                  onClick={handleAddMember}
                  disabled={addProjectMember.isPending}
                >
                  {addProjectMember.isPending ? (
                    <>
                      <Icon path={mdiLoading} size={0.8} className="mr-2 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    'Thêm thành viên'
                  )}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
} 