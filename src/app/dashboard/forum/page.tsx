'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ForumPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Mặc định chuyển hướng đến trang danh sách bài viết
    router.push('/dashboard/forum/posts');
  }, [router]);
  
  return null;
} 