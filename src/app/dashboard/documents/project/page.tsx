'use client';

import { useState } from 'react';
import { useGetDocuments } from '@/hooks/useDocument';
import DocumentList from '@/components/DocumentPage/DocumentList';
import DocumentUploadButton from '@/components/DocumentPage/DocumentUploadButton';
import DocumentDetail from '@/components/DocumentPage/DocumentDetail';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetProjects } from '@/hooks/useProject';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiRefresh } from '@mdi/js';

export default function ProjectDocumentsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  
  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjects();
  const { data: documentsData, isLoading: isLoadingDocuments, refetch } = useGetDocuments(
    selectedProjectId ? { project: selectedProjectId } : undefined
  );

  const handleProjectChange = (value: string) => {
    setSelectedProjectId(value);
    setSelectedDocumentId(null);
  };

  if (isLoadingProjects) {
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/documents">Quản lý tài liệu</BreadcrumbLink>
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
        
        <Skeleton className="h-10 w-full max-w-xs" />
      </div>
    );
  }

  if (selectedDocumentId) {
    return (
      <DocumentDetail 
        id={selectedDocumentId} 
        onBack={() => setSelectedDocumentId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/documents">Quản lý tài liệu</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold !text-maintext">Tài liệu dự án</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Tài liệu dự án</h1>
        {selectedProjectId && (
          <DocumentUploadButton type="project" projectId={selectedProjectId} />
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Select 
          value={selectedProjectId} 
          onValueChange={handleProjectChange}
        >
          <SelectTrigger className="w-full max-w-xs bg-white">
            <SelectValue placeholder="Chọn dự án" />
          </SelectTrigger>
          <SelectContent>
            {projectsData?.data.map((project) => (
              <SelectItem key={project._id} value={project._id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => refetch()}
          title="Làm mới"
        >
          <Icon path={mdiRefresh} size={0.8} />
        </Button>
      </div>

      {!selectedProjectId ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <h3 className="text-lg font-medium text-muted-foreground">Vui lòng chọn dự án</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Chọn một dự án từ danh sách để xem tài liệu
          </p>
        </div>
      ) : (
        <DocumentList 
          type="project" 
          projectId={selectedProjectId}
          onViewDocument={(id) => setSelectedDocumentId(id)}
        />
      )}
    </div>
  );
} 