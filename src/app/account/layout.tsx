"use client"

import React, { useEffect, useState, createContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@mdi/react';
import { 
  mdiAccount, 
  mdiLock, 
  mdiAccountEdit, 
  mdiCog, 
  mdiChevronRight 
} from '@mdi/js';

import { useUser } from '@/context/useUserContext';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';

const sidebarAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

const contentAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.2 } }
};

interface AccountLayoutProps {
  children: React.ReactNode;
}

// Tạo context cho active tab
export const AccountTabContext = createContext({
  activeTab: 'overview',
  setActiveTab: (tab: string) => {},
});

export default function AccountLayout({ children }: AccountLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('overview');
  const { isAuthenticated, profile, isLoadingProfile } = useUser();
  useEffect(() => {
    const updateActiveTabFromHash = () => {
      if (typeof window !== 'undefined' && window.location.hash === '#account-tabs') {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        
        if (tabParam && ['overview', 'profile', 'password', 'settings'].includes(tabParam)) {
          setActiveTab(tabParam);
        } else {
          setActiveTab('overview');
        }
      }
    };
    updateActiveTabFromHash();
    window.addEventListener('hashchange', updateActiveTabFromHash);
    
    return () => {
      window.removeEventListener('hashchange', updateActiveTabFromHash);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isLoadingProfile) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoadingProfile, router]);

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const tabs = [
    {
      title: 'Tổng quan',
      icon: mdiAccount,
      value: 'overview',
    },
    {
      title: 'Thông tin cá nhân',
      icon: mdiAccountEdit,
      value: 'profile',
    },
    {
      title: 'Đổi mật khẩu',
      icon: mdiLock,
      value: 'password',
    },
    {
      title: 'Cài đặt',
      icon: mdiCog,
      value: 'settings',
    },
  ];

  return (
    <AccountTabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div 
            className="md:col-span-1"
            initial="hidden"
            animate="visible"
            variants={sidebarAnimation}
          >
            <Card className="sticky">
              <CardHeader className="pb-3">
                <CardTitle>Quản lý tài khoản</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {profile?.data?.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col" id="account-sidebar-tabs">
                  {tabs.map((tab) => (
                    <motion.div 
                      key={tab.value}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a
                        href={`#account-tabs?tab=${tab.value}`}
                        data-value={tab.value}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-muted ${
                          activeTab === tab.value ? 'bg-muted text-primary font-medium' : ''
                        }`}
                        onClick={() => {
                          setActiveTab(tab.value);
                          const tabContentElement = document.getElementById('account-tabs');
                          if (tabContentElement) {
                            tabContentElement.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <Icon path={tab.icon} size={0.8} className={`mr-3 ${activeTab === tab.value ? 'text-primary' : ''}`} />
                          <span>{tab.title}</span>
                        </div>
                        {activeTab === tab.value && (
                          <Icon path={mdiChevronRight} size={0.8} className="text-primary" />
                        )}
                      </a>
                    </motion.div>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="md:col-span-3"
            initial="hidden"
            animate="visible"
            variants={contentAnimation}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </AccountTabContext.Provider>
  );
} 