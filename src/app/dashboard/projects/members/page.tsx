"use client"

import { useState } from "react"
import { useGetProjects, useAddProjectMember, useRemoveProjectMember } from "@/hooks/useProject"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Icon } from "@mdi/react"
import {
  mdiDelete,
  mdiLoading,
  mdiAccountPlus,
  mdiAccountMultiple,
  mdiShieldAccount,
  mdiInformationOutline,
  mdiAccountCog,
} from "@mdi/js"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function MembersManagementPage() {
  const { data, isLoading, refetch } = useGetProjects()
  const removeProjectMember = useRemoveProjectMember()
  const addProjectMember = useAddProjectMember()
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string; projectId: string } | null>(null)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [newMemberInfo, setNewMemberInfo] = useState({ userId: "", role: "member" })

  const selectedProject = data?.data.find((project) => project._id === selectedProjectId)

  const handleRemoveMember = async () => {
    if (!memberToRemove) return
    try {
      await removeProjectMember.mutateAsync({
        projectId: memberToRemove.projectId,
        userId: memberToRemove.id,
      })
      toast.success("Thành công", {
        description: "Đã xóa thành viên khỏi dự án thành công",
      })
      setIsRemoveMemberDialogOpen(false)
      refetch()
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Đã xảy ra lỗi khi xóa thành viên",
      })
    }
  }

  const handleAddMember = async () => {
    if (!selectedProjectId) {
      toast.error("Lỗi", {
        description: "Vui lòng chọn dự án",
      })
      return
    }

    if (!newMemberInfo.userId) {
      toast.error("Lỗi", {
        description: "Vui lòng nhập ID người dùng",
      })
      return
    }

    try {
      await addProjectMember.mutateAsync({
        projectId: selectedProjectId,
        memberData: {
          userId: newMemberInfo.userId,
          role: newMemberInfo.role as "lead" | "member",
        },
      })
      toast.success("Thành công", {
        description: "Đã thêm thành viên vào dự án thành công",
      })
      setIsAddMemberDialogOpen(false)
      setNewMemberInfo({ userId: "", role: "member" })
      refetch()
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Đã xảy ra lỗi khi thêm thành viên",
      })
    }
  }

  const openRemoveMemberDialog = (projectId: string, userId: string, name: string) => {
    setMemberToRemove({ id: userId, name, projectId })
    setIsRemoveMemberDialogOpen(true)
  }

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
              <Skeleton className="h-5 w-24" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>

        <Skeleton className="h-10 w-full max-w-xs" />

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
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="text-gray-500 hover:text-primary transition-colors">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/projects" className="text-gray-500 hover:text-primary transition-colors">
                Quản lý dự án
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-primary">Quản lý thành viên</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Quản lý thành viên dự án</h1>
          <p className="text-gray-500 text-sm">Thêm, xóa và quản lý vai trò thành viên trong dự án</p>
        </div>
        <Button
          className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90 transition-colors shadow-sm"
          onClick={() => setIsAddMemberDialogOpen(true)}
          disabled={!selectedProjectId}
        >
          <Icon path={mdiAccountPlus} size={0.8} className="mr-2" />
          Thêm thành viên
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-lg p-4 border shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto flex-1">
            <Label htmlFor="project-select" className="text-sm font-medium block text-gray-700 mb-4">
              Chọn dự án để quản lý thành viên
            </Label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger
                id="project-select"
                className="w-full bg-white border-gray-200 focus:border-[#2C8B3D] focus:ring-[#2C8B3D]/20 transition-all"
              >
                <SelectValue placeholder="Chọn dự án" />
              </SelectTrigger>
              <SelectContent className="rounded-sm">
                {data?.data.map((project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProject && (
            <div className="flex items-center gap-2 mt-2 sm:mt-6">
              <Badge variant="outline" className="bg-[#E9F3EB] text-[#2C8B3D] border-[#2C8B3D]/20">
                <Icon path={mdiAccountMultiple} size={0.6} className="mr-1" />
                {selectedProject.members.length} thành viên
              </Badge>
              <Badge variant="outline" className="bg-[#EDF7FD] text-blue-600 border-blue-200">
                <Icon path={mdiShieldAccount} size={0.6} className="mr-1" />
                {selectedProject.members.filter((m) => m.role === "lead").length} trưởng nhóm
              </Badge>
            </div>
          )}
        </div>
      </motion.div>

      {!selectedProjectId ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300"
        >
          <div className="max-w-md mx-auto">
            <Icon path={mdiAccountCog} size={2.5} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Vui lòng chọn dự án</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Chọn một dự án từ danh sách để xem và quản lý thành viên. Bạn có thể thêm, xóa và phân quyền cho các thành
              viên trong dự án.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 p-1 bg-[#F3F8F4]">
              <TabsTrigger
                value="list"
                className="
                shadow-none
                data-[state=active]:bg-[#F3F8F4] data-[state=active]:text-primary border-b-2 data-[state=active]:border-primary rounded-none border-transparent"
              >
                <Icon path={mdiAccountMultiple} size={0.7} className="mr-2" />
                Danh sách thành viên
              </TabsTrigger>
              <TabsTrigger
                value="roles"
                className="shadow-none data-[state=active]:bg-[#F3F8F4] data-[state=active]:text-primary border-b-2 data-[state=active]:border-primary rounded-none border-transparent"
              >
                <Icon path={mdiShieldAccount} size={0.7} className="mr-2" />
                Vai trò thành viên
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-white border-b pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800 flex items-center">
                        <span className="mr-2">Thành viên dự án:</span>
                        <span className="text-primary font-semibold">{selectedProject?.name}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Quản lý danh sách thành viên và vai trò trong dự án
                      </CardDescription>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-500">
                            <Icon path={mdiInformationOutline} size={0.9} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Bạn có thể xóa thành viên bằng cách nhấn vào biểu tượng thùng rác bên phải
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {selectedProject?.members.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <Icon path={mdiAccountMultiple} size={2} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium mb-1">Dự án chưa có thành viên nào</p>
                      <p className="text-sm text-gray-400 max-w-md mx-auto mb-4">
                        Hãy thêm thành viên vào dự án để bắt đầu cộng tác và phân công nhiệm vụ
                      </p>
                      <Button
                        className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90"
                        onClick={() => setIsAddMemberDialogOpen(true)}
                      >
                        <Icon path={mdiAccountPlus} size={0.8} className="mr-2" />
                        Thêm thành viên
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-auto">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="font-medium">Thành viên</TableHead>
                            <TableHead className="font-medium">Vai trò</TableHead>
                            <TableHead className="font-medium">Ngày tham gia</TableHead>
                            <TableHead className="text-right font-medium">Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProject?.members.map((member) => (
                            <TableRow key={member.user._id} className="hover:bg-gray-50/50 transition-colors group">
                              <TableCell>
                                <div className="flex items-center gap-4">
                                  <Avatar className="border shadow-sm">
                                    {member.user.avatar ? (
                                      <AvatarImage
                                        src={member.user.avatar || "/placeholder.svg"}
                                        alt={member.user.fullName}
                                      />
                                    ) : null}
                                    <AvatarFallback className="bg-[#E9F3EB] text-[#2C8B3D] font-medium">
                                      {member.user.fullName.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-gray-800">{member.user.fullName}</p>
                                    <p className="text-sm text-gray-500">{member.user.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    member.role === "lead"
                                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }
                                >
                                  {member.role === "lead" ? (
                                    <Icon path={mdiShieldAccount} size={0.6} className="mr-1" />
                                  ) : (
                                    <Icon path={mdiAccountMultiple} size={0.6} className="mr-1" />
                                  )}
                                  {member.role === "lead" ? "Trưởng nhóm" : "Thành viên"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <span className="text-gray-600">
                                    {member.joinDate
                                      ? format(new Date(member.joinDate), "dd/MM/yyyy", { locale: vi })
                                      : "N/A"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                        onClick={() =>
                                          openRemoveMemberDialog(
                                            selectedProjectId,
                                            member.user._id,
                                            member.user.fullName,
                                          )
                                        }
                                      >
                                        <Icon path={mdiDelete} size={0.8} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Xóa thành viên</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles">
              <Card className="border-none shadow-md">
                <CardHeader className="bg-white border-b">
                  <CardTitle className="text-lg text-gray-800 flex items-center">
                    <span className="mr-2">Vai trò thành viên trong dự án:</span>
                    <span className="text-primary font-semibold">{selectedProject?.name}</span>
                  </CardTitle>
                  <CardDescription>Mô tả các vai trò và quyền hạn của thành viên trong dự án</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="p-5 border border-blue-100 rounded-lg bg-blue-50/50 shadow-sm">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Icon path={mdiShieldAccount} size={1} className="text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-blue-700">Trưởng nhóm</h3>
                      </div>
                      <p className="text-gray-600 mb-4 pl-12">
                        Trưởng nhóm có quyền quản lý dự án, thêm/xóa thành viên, và cập nhật thông tin dự án. Họ chịu
                        trách nhiệm phân công nhiệm vụ và đảm bảo tiến độ của dự án.
                      </p>
                      {selectedProject?.members.filter((m) => m.role === "lead").length === 0 ? (
                        <div className="bg-white p-4 rounded-md border border-blue-100 text-center">
                          <p className="text-sm text-gray-500">Dự án chưa có trưởng nhóm</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                          {selectedProject?.members
                            .filter((m) => m.role === "lead")
                            .map((member) => (
                              <div
                                key={member.user._id}
                                className="flex items-center gap-4 p-3 bg-white border border-blue-100 rounded-md shadow-sm hover:shadow-md transition-shadow"
                              >
                                <Avatar className="border-2 border-blue-100">
                                  {member.user.avatar ? (
                                    <AvatarImage
                                      src={member.user.avatar || "/placeholder.svg"}
                                      alt={member.user.fullName}
                                    />
                                  ) : null}
                                  <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                                    {member.user.fullName.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-800">{member.user.fullName}</p>
                                  <p className="text-sm text-gray-500">{member.user.email}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    <div className="p-5 border border-green-100 rounded-lg bg-green-50/50 shadow-sm">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Icon path={mdiAccountMultiple} size={1} className="text-green-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-green-700">Thành viên</h3>
                      </div>
                      <p className="text-gray-600 mb-4 pl-12">
                        Thành viên có quyền xem thông tin dự án và tham gia vào các hoạt động của dự án. Họ có thể thực
                        hiện các nhiệm vụ được giao, đóng góp ý kiến và cập nhật tiến độ công việc.
                      </p>
                      {selectedProject?.members.filter((m) => m.role === "member").length === 0 ? (
                        <div className="bg-white p-4 rounded-md border border-green-100 text-center">
                          <p className="text-sm text-gray-500">Dự án chưa có thành viên thường</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                          {selectedProject?.members
                            .filter((m) => m.role === "member")
                            .map((member) => (
                              <div
                                key={member.user._id}
                                className="flex items-center gap-4 p-3 bg-white border border-green-100 rounded-md shadow-sm hover:shadow-md transition-shadow"
                              >
                                <Avatar className="border-2 border-green-100">
                                  {member.user.avatar ? (
                                    <AvatarImage
                                      src={member.user.avatar || "/placeholder.svg"}
                                      alt={member.user.fullName}
                                    />
                                  ) : null}
                                  <AvatarFallback className="bg-green-100 text-green-700 font-medium">
                                    {member.user.fullName.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-800">{member.user.fullName}</p>
                                  <p className="text-sm text-gray-500">{member.user.email}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      {/* Dialog xác nhận xóa thành viên */}
      <Dialog open={isRemoveMemberDialogOpen} onOpenChange={setIsRemoveMemberDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 overflow-hidden rounded-lg">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl text-red-600 flex items-center gap-2">
                  <Icon path={mdiDelete} size={0.9} />
                  Xác nhận xóa thành viên
                </DialogTitle>
                <DialogDescription className="pt-2 text-gray-600">
                  Bạn có chắc chắn muốn xóa thành viên{" "}
                  <span className="font-medium text-gray-800">"{memberToRemove?.name}"</span> khỏi dự án này? Hành động
                  này không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-red-50 p-4 rounded-md my-4 border border-red-100">
                <p className="text-sm text-red-600 flex items-start gap-2">
                  <Icon path={mdiInformationOutline} size={0.8} className="mt-0.5 flex-shrink-0" />
                  <span>
                    Thành viên sẽ mất tất cả quyền truy cập vào dự án này và không thể xem hoặc chỉnh sửa nội dung dự
                    án.
                  </span>
                </p>
              </div>
              <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsRemoveMemberDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRemoveMember}
                  disabled={removeProjectMember.isPending}
                  className="w-full sm:w-auto"
                >
                  {removeProjectMember.isPending ? (
                    <>
                      <Icon path={mdiLoading} size={0.8} className="mr-2 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    "Xóa thành viên"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog thêm thành viên */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 overflow-hidden rounded-lg">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl text-maintext flex items-center gap-2">
                  Thêm thành viên vào dự án
                </DialogTitle>
                <DialogDescription className="pt-2 !text-sm">
                  Nhập thông tin người dùng để thêm vào dự án{" "}
                  <span className="font-medium text-primary text-sm">{selectedProject?.name}</span>.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-id" className="text-gray-700">
                      ID Người dùng
                    </Label>
                    <Input
                      id="user-id"
                      placeholder="Nhập ID người dùng"
                      value={newMemberInfo.userId}
                      onChange={(e) => setNewMemberInfo({ ...newMemberInfo, userId: e.target.value })}
                      className="bg-white border-gray-200 focus:border-[#2C8B3D] focus:ring-[#2C8B3D]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-select" className="text-gray-700">
                      Vai trò
                    </Label>
                    <Select
                      value={newMemberInfo.role}
                      onValueChange={(value) => setNewMemberInfo({ ...newMemberInfo, role: value })}
                    >
                      <SelectTrigger
                        id="role-select"
                        className="bg-white border-gray-200 focus:border-[#2C8B3D] focus:ring-[#2C8B3D]/20"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member" className="flex items-center gap-2">
                          <Icon path={mdiAccountMultiple} size={0.7} />
                          <span>Thành viên</span>
                        </SelectItem>
                        <SelectItem value="lead" className="flex items-center gap-2">
                          <Icon path={mdiShieldAccount} size={0.7} />
                          <span>Trưởng nhóm</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-4">
                  <div className="flex items-start gap-2">
                    <Icon path={mdiInformationOutline} size={0.8} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Lưu ý khi thêm thành viên:</p>
                      <ul className="list-disc pl-4 space-y-1 text-blue-600">
                        <li>ID người dùng phải chính xác</li>
                        <li>Người dùng phải đã đăng ký tài khoản trên hệ thống</li>
                        <li>Trưởng nhóm có toàn quyền quản lý dự án</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)} className="w-full sm:w-auto">
                  Hủy
                </Button>
                <Button
                  className="bg-[#2C8B3D] hover:bg-[#2C8B3D]/90 w-full sm:w-auto"
                  onClick={handleAddMember}
                  disabled={addProjectMember.isPending}
                >
                  {addProjectMember.isPending ? (
                    <>
                      <Icon path={mdiLoading} size={0.8} className="mr-2 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm thành viên"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
