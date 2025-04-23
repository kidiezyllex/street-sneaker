'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useProfile } from '@/hooks/authentication';
import { useEffect, useState } from 'react';
import { CustomScrollArea } from '@/components/ui/custom-scroll-area';

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] = useState<'admin' | 'employee'>('employee');
  const { profileData } = useProfile();
  useEffect(() => {
    if (profileData?.data?.role && profileData?.data?.role === 'admin') {
      setUserRole('admin');
    }
  }, [profileData]);

  return <DashboardLayout userRole={userRole}>
    <CustomScrollArea className="h-full">
      {children}
    </CustomScrollArea>
    </DashboardLayout>;
} 