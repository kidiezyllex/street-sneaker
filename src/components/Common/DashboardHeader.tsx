'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@mdi/react';
import { 
  mdiMenu, 
  mdiAccount, 
  mdiBell, 
  mdiMagnify, 
  mdiLogout
} from '@mdi/js';
import { useMenuSidebar } from '@/stores/useMenuSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useUser } from '@/context/useUserContext';
import { useProfile } from '@/hooks/authentication';
import ProfileDialog from './ProfileDialog';
import { useRouter } from 'next/navigation';

export default function DashboardHeader() {
  const { toggle } = useMenuSidebar();
  const { logoutUser } = useUser();
  const {profileData} = useProfile();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const router = useRouter();
  const handleLogout = () => {
    logoutUser();
    toast.success('Đăng xuất thành công');
    router.push('/auth/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Chức năng tìm kiếm đang được phát triển');
  };

  return (
    <div className="py-3 pl-0 px-6 bg-white border-b flex justify-between items-center h-16">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggle}
          className="h-8 w-8"
        >
          <Icon path={mdiMenu} size={0.8} />
        </Button>
        
        <form className="relative hidden md:flex items-center" onSubmit={handleSearchSubmit}>
          <Icon 
            path={mdiMagnify} 
            size={0.8} 
            className="absolute left-3 text-gray-400"
          />
          <Input 
            placeholder="Tìm kiếm tài liệu..." 
            className="pl-10 w-72 h-9 bg-gray-50 focus:border-primary focus:ring-primary"
          />
        </form>
      </div>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full hover:bg-gray-50">
                <div className="p-[1px] bg-white rounded-full flex items-center justify-center h-full w-full">
                  <Icon path={mdiBell} size={0.8} className='text-gray-400'/>
                </div>
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-[#F2A024] text-white text-[10px]">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 font-medium text-maintext">Thông báo</div>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-auto">
              {[1, 2, 3].map((item, index) => (
                <DropdownMenuItem key={item} className="py-3 px-4 cursor-pointer">
                  <div className="flex gap-3">
                    <div className="relative p-[2px] h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                      <div className="p-[2px] bg-white rounded-full">
                        <Avatar className="!h-8 !w-8 flex-shrink-0">
                          <AvatarImage src={`/images/dfavatar${index+1}.png`} />
                          <AvatarFallback className='bg-transparent font-bold text-gray-400'>{profileData?.data.fullName.split(' ').pop()?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-maintext">Cập nhật nhiệm vụ thiết kế</span>
                      <span className="text-xs text-gray-500 mt-1">{profileData?.data.fullName} đã bình luận về nhiệm vụ của bạn</span>
                      <span className="text-xs text-gray-400 mt-2">10 phút trước</span>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-2 flex justify-center">
              <Link href="/dashboard/notifications" className="text-[#2C8B3D] text-sm font-medium">
                Xem tất cả thông báo
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 flex items-center gap-2 px-2 rounded-full hover:bg-transparent cursor-pointer">
              <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                <div className="p-[2px] bg-white rounded-full">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={profileData?.data.avatar || "/images/dfavatar1.png"} />
                    <AvatarFallback className='bg-transparent font-bold text-gray-400'>{profileData?.data.fullName.split(' ').pop()?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
             <div className='flex flex-col items-start'>
             <span className="text-sm font-medium hidden sm:inline-block">{profileData?.data.fullName}</span>
             <span className="text-xs hidden sm:inline-block text-gray-500">{profileData?.data.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</span>
             </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center p-3">
              <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 mr-3">
                <div className="p-[2px] bg-white rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profileData?.data.avatar || "/images/dfavatar1.png"} />
                    <AvatarFallback className='bg-transparent font-bold text-gray-400'>{profileData?.data.fullName.split(' ').pop()?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-maintext">{profileData?.data.fullName}</p>
                <p className="text-xs text-gray-500">{profileData?.data.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-2 cursor-pointer" onClick={() => setIsProfileDialogOpen(true)}>
              <Icon path={mdiAccount} size={0.8} className="mr-2 text-gray-400" />
              <span className='text-maintext font-semibold'>Hồ sơ cá nhân</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2 cursor-pointer text-red-600" onClick={handleLogout}>
              <Icon path={mdiLogout} size={0.8} className="mr-2 text-red-600" />
              <span className='text-red-600 font-semibold'>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <ProfileDialog isOpen={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen} />
    </div>
  );
} 