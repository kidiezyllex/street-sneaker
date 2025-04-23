'use client';

import { useState } from 'react';
import { useGetDocuments } from '@/hooks/useDocument';
import { useGetDocumentCategories } from '@/hooks/useDocumentCategory';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { 
  mdiFileDocumentOutline, 
  mdiFileMultipleOutline, 
  mdiAccountMultiple,
  mdiChevronRight,
  mdiFileImageOutline,
  mdiFilePdfBox,
  mdiFileWordBoxOutline,
  mdiFileExcelBoxOutline,
  mdiPlusCircleOutline
} from '@mdi/js';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DocumentsPage() {
  const { data: personalDocuments, isLoading: isLoadingPersonal } = useGetDocuments({ project: undefined });
  const { data: projectDocuments, isLoading: isLoadingProject } = useGetDocuments({ project: "any" });
  const { data: sharedDocuments, isLoading: isLoadingShared } = useGetDocuments({ project: "shared" });
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetDocumentCategories();

  const isLoading = isLoadingPersonal || isLoadingProject || isLoadingShared || isLoadingCategories;

  // Tính toán số lượng tài liệu theo loại file
  const getDocumentsByType = () => {
    const allDocuments = [
      ...(personalDocuments?.data || []),
      ...(projectDocuments?.data || []),
    ];
    
    const types = {
      image: 0,
      pdf: 0,
      word: 0,
      excel: 0,
      other: 0,
    };
    
    allDocuments.forEach(doc => {
      const extension = doc.filePath.split('.').pop()?.toLowerCase();
      
      if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
        types.image++;
      } else if (extension === 'pdf') {
        types.pdf++;
      } else if (['doc', 'docx'].includes(extension || '')) {
        types.word++;
      } else if (['xls', 'xlsx'].includes(extension || '')) {
        types.excel++;
      } else {
        types.other++;
      }
    });
    
    return types;
  };

  const getRecentDocuments = () => {
    const allDocuments = [
      ...(personalDocuments?.data || []),
      ...(projectDocuments?.data || []),
    ];
    
    return allDocuments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getPopularCategories = () => {
    const allDocuments = [
      ...(personalDocuments?.data || []),
      ...(projectDocuments?.data || []),
    ];
    
    const categoryCount: Record<string, { id: string, name: string, count: number }> = {};
    
    allDocuments.forEach(doc => {
      if (doc.category) {
        const categoryId = doc.category._id;
        if (!categoryCount[categoryId]) {
          categoryCount[categoryId] = {
            id: categoryId,
            name: doc.category.name,
            count: 0
          };
        }
        categoryCount[categoryId].count++;
      }
    });
    
    return Object.values(categoryCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
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
              <Skeleton className="h-5 w-32" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div>
          <Skeleton className="h-10 w-64 mb-6" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const documentTypes = getDocumentsByType();
  const recentDocuments = getRecentDocuments();
  const popularCategories = getPopularCategories();

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold !text-maintext">Quản lý tài liệu</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold text-primary">Quản lý tài liệu</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/documents/list">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <Icon path={mdiFileDocumentOutline} size={1.5} className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1 text-maintext">Tất cả tài liệu</h3>
              <p className="text-muted-foreground text-sm mb-4">Quản lý tài liệu cá nhân của bạn</p>
              <div className="mt-auto">
                <Badge className="font-medium">
                  {personalDocuments?.data.length || 0} tài liệu
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/documents/project">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-secondary/10 rounded-full mb-4">
                <Icon path={mdiFileMultipleOutline} size={1.5} className="text-secondary" />
              </div>
              <h3 className="text-lg font-medium mb-1 text-maintext">Tài liệu dự án</h3>
              <p className="text-muted-foreground text-sm mb-4">Quản lý tài liệu cho các dự án</p>
              <div className="mt-auto">
                <Badge className="font-medium bg-secondary text-white border-secondary">
                  {projectDocuments?.data.length || 0} tài liệu
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/documents/shared">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-extra/10 rounded-full mb-4">
                <Icon path={mdiAccountMultiple} size={1.5} className="text-extra" />
              </div>
              <h3 className="text-lg font-medium mb-1 text-maintext">Tài liệu được chia sẻ</h3>
              <p className="text-muted-foreground text-sm mb-4">Xem tài liệu được chia sẻ với bạn</p>
              <div className="mt-auto">
                <Badge className="font-medium bg-extra text-white border-extra">
                  {sharedDocuments?.data.length || 0} tài liệu
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-maintext">Tài liệu gần đây</h3>
              <Button variant="link" asChild>
                <Link href="/dashboard/documents/list" className="text-primary">
                  Xem tất cả
                  <Icon path={mdiChevronRight} size={0.6} className="ml-1" />
                </Link>
              </Button>
            </div>

            {recentDocuments.length === 0 ? (
              <div className="text-center py-8 bg-muted/10 rounded-md border border-dashed">
                <p className="text-muted-foreground">Chưa có tài liệu nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div key={doc._id} className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/10 transition-colors">
                    <div className="p-2 bg-muted/20 rounded-md">
                      <Icon 
                        path={getFileIcon(doc.filePath)} 
                        size={1} 
                        className="text-primary" 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/dashboard/documents/${doc._id}`}>
                        <h4 className="text-sm font-medium text-maintext truncate hover:text-primary">
                          {doc.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
                        {doc.category && (
                          <span className="before:content-['•'] before:mx-1">{doc.category.name}</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-maintext">Loại tài liệu</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted/10 rounded-md">
                <div className="p-2 bg-blue-100 rounded-md">
                  <Icon path={mdiFileImageOutline} size={1} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-maintext">Hình ảnh</h4>
                  <p className="text-xs text-muted-foreground">JPG, PNG, GIF</p>
                </div>
                <Badge variant="outline">{documentTypes.image}</Badge>
              </div>

              <div className="flex items-center gap-4 p-3 bg-muted/10 rounded-md">
                <div className="p-2 bg-red-100 rounded-md">
                  <Icon path={mdiFilePdfBox} size={1} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-maintext">PDF</h4>
                  <p className="text-xs text-muted-foreground">Tài liệu PDF</p>
                </div>
                <Badge variant="outline">{documentTypes.pdf}</Badge>
              </div>

              <div className="flex items-center gap-4 p-3 bg-muted/10 rounded-md">
                <div className="p-2 bg-blue-100 rounded-md">
                  <Icon path={mdiFileWordBoxOutline} size={1} className="text-blue-700" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-maintext">Word</h4>
                  <p className="text-xs text-muted-foreground">DOC, DOCX</p>
                </div>
                <Badge variant="outline">{documentTypes.word}</Badge>
              </div>

              <div className="flex items-center gap-4 p-3 bg-muted/10 rounded-md">
                <div className="p-2 bg-green-100 rounded-md">
                  <Icon path={mdiFileExcelBoxOutline} size={1} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-maintext">Excel</h4>
                  <p className="text-xs text-muted-foreground">XLS, XLSX</p>
                </div>
                <Badge variant="outline">{documentTypes.excel}</Badge>
              </div>

              <div className="flex items-center gap-4 p-3 bg-muted/10 rounded-md">
                <div className="p-2 bg-gray-100 rounded-md">
                  <Icon path={mdiFileDocumentOutline} size={1} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-maintext">Khác</h4>
                  <p className="text-xs text-muted-foreground">Các định dạng khác</p>
                </div>
                <Badge variant="outline">{documentTypes.other}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Badge({ children, className = '', variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'outline' }) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
        variant === 'outline' ? 'border-muted-foreground/20 text-muted-foreground' : 'border-primary bg-primary/10 text-primary'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function getFileIcon(filePath: string) {
  const extension = filePath.split('.').pop()?.toLowerCase();
  
  switch(extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return mdiFileImageOutline;
    case 'pdf':
      return mdiFilePdfBox;
    case 'doc':
    case 'docx':
      return mdiFileWordBoxOutline;
    case 'xls':
    case 'xlsx':
      return mdiFileExcelBoxOutline;
    default:
      return mdiFileDocumentOutline;
  }
} 