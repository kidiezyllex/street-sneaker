'use client';

import { IconLock, IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

//                                                                                                                     Mock data cho thông tin người dùng
const mockUser = {
  id: '1',
  name: 'Nguyễn Văn A',
  email: 'admin@streetsneaker.com',
  role: 'Admin',
  avatarUrl: 'https://picsum.photos/id/1005/200',
};

export default function UserMenu() {
  const handleLogout = () => {
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
          <AvatarFallback>
            {mockUser.name.split(' ').pop()?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{mockUser.name}</p>
            <p className="text-xs leading-none text-gray-400">{mockUser.email}</p>
            <p className="text-xs leading-none text-primary mt-1">{mockUser.role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconUser className="mr-2 h-4 w-4" />
            <span>Thông tin tài khoản</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconSettings className="mr-2 h-4 w-4" />
            <span>Cài đặt</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconLock className="mr-2 h-4 w-4" />
            <span>Đổi mật khẩu</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <IconLogout className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 