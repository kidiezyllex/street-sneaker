"use client"

import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@mdi/react';
import { 
  mdiAccountOutline, 
  mdiShoppingOutline, 
  mdiHeartOutline, 
  mdiMapMarkerOutline,
  mdiLoading,
  mdiCheck,
  mdiEyeOutline,
  mdiEyeOffOutline
} from '@mdi/js';
import { useUser } from '@/context/useUserContext';
import { useUpdateProfile, useChangePassword } from '@/hooks/authentication';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AccountTabContext } from './layout';

//                                                                                                                     Profile form schema
const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Họ tên cần ít nhất 2 ký tự" }),
  phoneNumber: z.string().min(10, { message: "Số điện thoại không hợp lệ" }).optional().or(z.literal('')),
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

//                                                                                                                     Password form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: "Mật khẩu hiện tại phải có ít nhất 6 ký tự" }),
  newPassword: z.string().min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" }),
  confirmPassword: z.string().min(6, { message: "Xác nhận mật khẩu phải có ít nhất 6 ký tự" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export default function AccountPage() {
  const { profile, fetchUserProfile, updateUserProfile, logoutUser } = useUser();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  
  //                                                                                                                     Sử dụng context từ layout
  const { activeTab, setActiveTab } = useContext(AccountTabContext);
  
  const [isProfileSuccess, setIsProfileSuccess] = useState(false);
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [newProducts, setNewProducts] = useState(true);
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);

  const userData = profile?.data || {
    fullName: "Người dùng",
    email: "",
    phoneNumber: "",
    avatar: "",
    addresses: []
  };

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: userData.fullName || "",
      phoneNumber: userData.phoneNumber || "",
      avatar: userData.avatar || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profile?.data) {
      profileForm.reset({
        fullName: profile.data.fullName || "",
        phoneNumber: profile.data.phoneNumber || "",
        avatar: profile.data.avatar || "",
      });
    }
  }, [profile, profileForm]);
  const getInitials = () => {
    return userData.fullName.charAt(0).toUpperCase() || "U";
  };

  const handleProfileSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      if (updateUserProfile) {
        updateUserProfile(data);
      }
      
      await fetchUserProfile();
      setIsProfileSuccess(true);
      setTimeout(() => setIsProfileSuccess(false), 3000);
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  //                                                                                                                     Xử lý đổi mật khẩu
  const handlePasswordSubmit = async (data: PasswordFormValues) => {
    setPasswordError(null);
    
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      //                                                                                                                     Hiển thị thông báo thành công
      setIsPasswordSuccess(true);
      setTimeout(() => setIsPasswordSuccess(false), 3000);
      
      //                                                                                                                     Reset form
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Lỗi đổi mật khẩu:", error);
      setPasswordError(error?.message || "Đổi mật khẩu không thành công. Vui lòng thử lại.");
    }
  };

  //                                                                                                                     Xử lý lưu cài đặt
  const handleSaveSettings = () => {
    setTimeout(() => {
      setIsSettingsSaved(true);
      setTimeout(() => setIsSettingsSaved(false), 2000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>
            Thông tin tài khoản và các thông tin khác của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <Avatar className="h-24 w-24 border-2 border-primary/20">
                <AvatarImage src={userData.avatar || ""} alt={userData.fullName} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            
            <div className="space-y-4 flex-grow">
              <div>
                <h3 className="text-lg font-semibold text-primary">{userData.fullName}</h3>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
                {userData.phoneNumber && (
                  <p className="text-sm">{userData.phoneNumber}</p>
                )}
              </div>
              
              {userData.addresses && userData.addresses.length > 0 && (
                <div className="p-4 bg-muted rounded-md">
                  <div className="flex items-start gap-2">
                    <Icon path={mdiMapMarkerOutline} size={0.8} className="text-primary mt-1" />
                    <div>
                      <p className="text-sm font-medium">Địa chỉ giao hàng mặc định</p>
                      <p className="text-sm">
                        {userData.addresses[0].specificAddress}, 
                        {userData.addresses[0].wardId && " Phường/Xã: " + userData.addresses[0].wardId}, 
                        {userData.addresses[0].districtId && " Quận/Huyện: " + userData.addresses[0].districtId}, 
                        {userData.addresses[0].provinceId && " Tỉnh/Thành: " + userData.addresses[0].provinceId}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Quản lý tài khoản
              </CardTitle>
              <Icon path={mdiAccountOutline} size={1} className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Quản lý thông tin và cài đặt tài khoản</p>
              <div className="mt-4">
                <a
                  href="#account-tabs?tab=overview"
                  onClick={() => setActiveTab("overview")}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Quản lý tài khoản
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đơn hàng
              </CardTitle>
              <Icon path={mdiShoppingOutline} size={1} className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Xem lịch sử đơn hàng của bạn</p>
              <div className="mt-4">
                <a
                  href="/account/orders"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Xem đơn hàng
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sản phẩm yêu thích
              </CardTitle>
              <Icon path={mdiHeartOutline} size={1} className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Quản lý danh sách sản phẩm yêu thích</p>
              <div className="mt-4">
                <a
                  href="/account/wishlist"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Xem danh sách
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs cho quản lý tài khoản */}
      <div id="account-tabs">
        <Card>
          <CardHeader>
            <CardTitle>Quản lý tài khoản</CardTitle>
            <CardDescription>
              Cập nhật thông tin và cài đặt tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Ẩn TabsList vì đã chuyển sang sidebar */}
              <div className="hidden">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
                  <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
                  <TabsTrigger value="settings">Cài đặt</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Tab Tổng quan */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
                      <CardDescription>
                        Cập nhật thông tin cá nhân của bạn
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10 border border-primary/20">
                          <AvatarImage src={userData.avatar || ""} alt={userData.fullName} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{userData.fullName}</p>
                          <p className="text-xs text-muted-foreground">{userData.email}</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-4"
                        onClick={() => setActiveTab("profile")}
                      >
                        Cập nhật thông tin
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Bảo mật</CardTitle>
                      <CardDescription>
                        Quản lý mật khẩu và bảo mật tài khoản
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">Thay đổi mật khẩu thường xuyên để bảo vệ tài khoản của bạn</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setActiveTab("password")}
                      >
                        Đổi mật khẩu
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Thông báo</CardTitle>
                      <CardDescription>
                        Quản lý cách bạn nhận thông báo
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="text-sm">Thông báo đơn hàng</p>
                        <Switch checked={notifications} onCheckedChange={setNotifications} />
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-4"
                        onClick={() => setActiveTab("settings")}
                      >
                        Cài đặt thông báo
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Đơn hàng gần đây</CardTitle>
                      <CardDescription>
                        Xem đơn hàng gần nhất của bạn
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">Chưa có đơn hàng nào gần đây</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                      >
                        Xem tất cả đơn hàng
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Tab Thông tin cá nhân */}
              <TabsContent value="profile" className="space-y-4">
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Avatar section */}
                      <div className="flex flex-col items-center space-y-4">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <Avatar className="h-32 w-32 border-2 border-primary/20">
                            <AvatarImage src={profileForm.watch("avatar") || ""} alt={userData.fullName} />
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                              {getInitials()}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                        
                        <FormField
                          control={profileForm.control}
                          name="avatar"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Đường dẫn ảnh đại diện</FormLabel>
                              <FormControl>
                                <Input placeholder="URL ảnh đại diện" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Form fields */}
                      <div className="flex-1 space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Họ và tên</FormLabel>
                              <FormControl>
                                <Input placeholder="Họ và tên" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="opacity-70">
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input value={userData.email || ""} disabled />
                            </FormControl>
                          </FormItem>
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số điện thoại</FormLabel>
                              <FormControl>
                                <Input placeholder="Số điện thoại" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          type="submit" 
                          className="bg-primary hover:bg-primary/90"
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? (
                            <Icon path={mdiLoading} size={0.8} className="mr-2 animate-spin" />
                          ) : isProfileSuccess ? (
                            <Icon path={mdiCheck} size={0.8} className="mr-2" />
                          ) : null}
                          {updateProfileMutation.isPending 
                            ? "Đang cập nhật..." 
                            : isProfileSuccess 
                            ? "Cập nhật thành công" 
                            : "Cập nhật thông tin"}
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              {/* Tab Đổi mật khẩu */}
              <TabsContent value="password" className="space-y-4">
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                    {passwordError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-rose-50 text-rose-600 rounded-md text-sm"
                      >
                        {passwordError}
                      </motion.div>
                    )}
                    
                    <div className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mật khẩu hiện tại</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Nhập mật khẩu hiện tại" 
                                  type={showCurrentPassword ? "text" : "password"} 
                                  {...field} 
                                />
                              </FormControl>
                              <button 
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                <Icon 
                                  path={showCurrentPassword ? mdiEyeOffOutline : mdiEyeOutline} 
                                  size={0.9} 
                                />
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mật khẩu mới</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Nhập mật khẩu mới" 
                                  type={showNewPassword ? "text" : "password"} 
                                  {...field} 
                                />
                              </FormControl>
                              <button 
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                <Icon 
                                  path={showNewPassword ? mdiEyeOffOutline : mdiEyeOutline} 
                                  size={0.9} 
                                />
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Xác nhận mật khẩu mới" 
                                  type={showConfirmPassword ? "text" : "password"} 
                                  {...field} 
                                />
                              </FormControl>
                              <button 
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                <Icon 
                                  path={showConfirmPassword ? mdiEyeOffOutline : mdiEyeOutline} 
                                  size={0.9} 
                                />
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-2">
                      <motion.div 
                        className="flex justify-end"
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit" 
                          className="bg-primary hover:bg-primary/90"
                          disabled={changePasswordMutation.isPending}
                        >
                          {changePasswordMutation.isPending ? (
                            <Icon path={mdiLoading} size={0.8} className="mr-2 animate-spin" />
                          ) : isPasswordSuccess ? (
                            <Icon path={mdiCheck} size={0.8} className="mr-2" />
                          ) : null}
                          {changePasswordMutation.isPending 
                            ? "Đang cập nhật..." 
                            : isPasswordSuccess 
                            ? "Cập nhật thành công" 
                            : "Đổi mật khẩu"}
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              {/* Tab Cài đặt */}
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Cài đặt thông báo</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Quản lý cách bạn nhận thông báo và cập nhật từ chúng tôi
                    </p>
                    
                    <div className="space-y-2 divide-y">
                      <div className="flex items-center justify-between py-4">
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-medium">Thông báo đơn hàng</h4>
                          <p className="text-xs text-muted-foreground">Nhận thông báo khi đơn hàng của bạn có cập nhật trạng thái</p>
                        </div>
                        <Switch
                          checked={notifications}
                          onCheckedChange={setNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-4">
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-medium">Sản phẩm mới</h4>
                          <p className="text-xs text-muted-foreground">Nhận thông báo khi có sản phẩm mới ra mắt</p>
                        </div>
                        <Switch
                          checked={newProducts}
                          onCheckedChange={setNewProducts}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-4">
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-medium">Chương trình khuyến mãi</h4>
                          <p className="text-xs text-muted-foreground">Nhận thông báo về các chương trình khuyến mãi, giảm giá</p>
                        </div>
                        <Switch
                          checked={marketing}
                          onCheckedChange={setMarketing}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90">
                          {isSettingsSaved && <Icon path={mdiCheck} size={0.8} className="mr-2" />}
                          {isSettingsSaved ? "Đã lưu" : "Lưu cài đặt"}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Quản lý tài khoản</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">Đăng xuất khỏi tất cả thiết bị</h4>
                          <p className="text-xs text-muted-foreground">Đăng xuất tài khoản của bạn trên tất cả các thiết bị</p>
                        </div>
                        <Button variant="outline" onClick={logoutUser}>
                          Đăng xuất
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <h4 className="text-sm font-medium text-rose-500">Vô hiệu hóa tài khoản</h4>
                          <p className="text-xs text-muted-foreground">Tạm thời vô hiệu hóa tài khoản của bạn</p>
                        </div>
                        <Button variant="outline" className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                          Vô hiệu hóa
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 