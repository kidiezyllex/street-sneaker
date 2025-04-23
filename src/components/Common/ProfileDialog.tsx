'use client';

import React, { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/authentication';
import { useUpdateUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import { Icon } from '@mdi/react';
import { mdiContentSave, mdiLoading } from '@mdi/js';
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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

interface ProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileDialog({ isOpen, onOpenChange }: ProfileDialogProps) {
  const { profileData } = useProfile();
  const updateUser = useUpdateUser();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    department: '',
    position: '',
    skills: [] as string[],
    skillInput: '',
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        fullName: profileData.data.fullName || '',
        email: profileData.data.email || '',
        bio: profileData.data.bio || '',
        department: profileData.data.department || '',
        position: profileData.data.position || '',
        skills: profileData.data.skills || [],
        skillInput: '',
      });
    }
  }, [profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (formData.skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.skillInput.trim()],
        skillInput: ''
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData?.data._id) {
      toast.error('Không thể xác định ID người dùng');
      return;
    }

    try {
      await updateUser.mutateAsync({
        id: profileData.data._id,
        payload: {
          fullName: formData.fullName,
          email: formData.email,
          bio: formData.bio,
          department: formData.department, 
          position: formData.position,
          skills: formData.skills
        }
      });
      toast.success('Cập nhật hồ sơ thành công');
      onOpenChange(false);
    } catch (error) {
      toast.error('Lỗi khi cập nhật hồ sơ');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6">
            <DialogHeader className="pb-4">
              <DialogTitle>Hồ sơ cá nhân</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin cá nhân của bạn
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                    <div className="p-[2px] bg-white rounded-full">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileData?.data.avatar || "/images/dfavatar1.png"} />
                        <AvatarFallback className='bg-transparent font-bold text-gray-400 text-2xl'>
                          {profileData?.data.fullName.split(' ').pop()?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">ID: {profileData?.data.employeeId}</div>
                  <div className="text-sm text-gray-500">
                    {profileData?.data.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                  </div>
                </div>
                
                <div className="flex-1 grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid gap-4 mb-4">
                <div className="grid gap-2">
                  <Label htmlFor="department">Phòng ban</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="position">Chức vụ</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="bio">Giới thiệu</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="skills">Kỹ năng</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills.map((skill, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm flex items-center"
                      >
                        {skill}
                        <button 
                          type="button"
                          className="ml-1 text-gray-500 hover:text-red-500"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="skillInput"
                      name="skillInput"
                      value={formData.skillInput}
                      onChange={handleChange}
                      placeholder="Thêm kỹ năng mới"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddSkill}
                    >
                      Thêm
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit"
                  disabled={updateUser.isPending}
                >
                  {updateUser.isPending ? (
                    <>
                      <Icon path={mdiLoading} size={0.8} className="mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Icon path={mdiContentSave} size={0.8} className="mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 