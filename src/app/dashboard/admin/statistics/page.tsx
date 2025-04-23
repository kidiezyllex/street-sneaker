'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@mdi/react';
import {
    mdiAccountGroup,
    mdiViewDashboard,
    mdiFileDocumentMultiple,
    mdiProjector,
    mdiForumOutline,
    mdiChartLine,
    mdiChartDonut,
    mdiChartBar,
    mdiLoading
} from '@mdi/js';
import {
    useOverviewStatistics,
    useUserStatistics,
    useProjectStatistics,
    useDocumentStatistics,
    useForumStatistics
} from '@/hooks/useStatistics';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function AdminStatisticsPage() {
    const [activeTab, setActiveTab] = useState('overview');

    const {
        data: overviewData,
        isLoading: isOverviewLoading
    } = useOverviewStatistics();

    const {
        data: userData,
        isLoading: isUserLoading
    } = useUserStatistics();

    const {
        data: projectData,
        isLoading: isProjectLoading
    } = useProjectStatistics();

    const {
        data: documentData,
        isLoading: isDocumentLoading
    } = useDocumentStatistics();

    const {
        data: forumData,
        isLoading: isForumLoading
    } = useForumStatistics();
    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-semibold !text-maintext">Thống kê</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex flex-col gap-6 mt-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Thống kê</h1>
                    <p className="text-maintext mt-2">
                        Thông tin thống kê chi tiết về người dùng, dự án, tài liệu và diễn đàn
                    </p>
                </div>

                <Tabs
                    defaultValue="overview"
                    className="w-full"
                    value={activeTab}
                    onValueChange={setActiveTab}
                >
                    <TabsList className="mb-6">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <Icon path={mdiViewDashboard} size={0.8} />
                            <span className='text-maintext'>Tổng quan</span>
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center gap-2">
                            <Icon path={mdiAccountGroup} size={0.8} />
                            <span className='text-maintext'>Người dùng</span>
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="flex items-center gap-2">
                            <Icon path={mdiProjector} size={0.8} />
                            <span className='text-maintext'>Dự án</span>
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="flex items-center gap-2">
                            <Icon path={mdiFileDocumentMultiple} size={0.8} />
                            <span className='text-maintext'>Tài liệu</span>
                        </TabsTrigger>
                        <TabsTrigger value="forum" className="flex items-center gap-2">
                            <Icon path={mdiForumOutline} size={0.8} />
                            <span className='text-maintext'>Diễn đàn</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        {isOverviewLoading ? (
                            <div className="flex justify-center items-center min-h-[300px]">
                                <Icon path={mdiLoading} size={2} className="text-primary animate-spin" />
                            </div>
                        ) : (
                            <OverviewContent data={(overviewData as any)?.data} />
                        )}
                    </TabsContent>

                    <TabsContent value="users">
                        {isUserLoading ? (
                            <div className="flex justify-center items-center min-h-[300px]">
                                <Icon path={mdiLoading} size={2} className="text-primary animate-spin" />
                            </div>
                        ) : (
                            <UserContent data={(userData as any)?.data} />
                        )}
                    </TabsContent>

                    <TabsContent value="projects">
                        {isProjectLoading ? (
                            <div className="flex justify-center items-center min-h-[300px]">
                                <Icon path={mdiLoading} size={2} className="text-primary animate-spin" />
                            </div>
                        ) : (
                            <ProjectContent data={(projectData as any)?.data} />
                        )}
                    </TabsContent>

                    <TabsContent value="documents">
                        {isDocumentLoading ? (
                            <div className="flex justify-center items-center min-h-[300px]">
                                <Icon path={mdiLoading} size={2} className="text-primary animate-spin" />
                            </div>
                        ) : (
                            <DocumentContent data={(documentData as any)?.data} />
                        )}
                    </TabsContent>

                    <TabsContent value="forum">
                        {isForumLoading ? (
                            <div className="flex justify-center items-center min-h-[300px]">
                                <Icon path={mdiLoading} size={2} className="text-primary animate-spin" />
                            </div>
                        ) : (
                            <ForumContent data={(forumData as any)?.data} />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// Thành phần tổng quan
const OverviewContent = ({ data }: { data: any }) => {
    const pieData = data ? [
        { name: 'Người dùng', value: data.totalUsers || 0, color: '#2C8B3D' },
        { name: 'Dự án', value: data.totalProjects || 0, color: '#88C140' },
        { name: 'Tài liệu', value: data.totalDocuments || 0, color: '#4F95DA' },
        { name: 'Bài viết', value: data.totalForumPosts || 0, color: '#F2A024' },
    ] : [];

    const barData = data ? [
        { name: 'Dự án - Tổng', value: data.totalProjects || 0, category: 'Dự án', type: 'Tổng', color: '#88C140' },
        { name: 'Dự án - Hoạt động', value: data.activeProjects || 0, category: 'Dự án', type: 'Hoạt động', color: '#2C8B3D' },
        { name: 'Tài liệu - Tổng', value: data.totalDocuments || 0, category: 'Tài liệu', type: 'Tổng', color: '#4F95DA' },
    ] : [];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-maintext">Tổng người dùng</CardTitle>
                        <Icon path={mdiAccountGroup} size={1} className="text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-maintext">{data?.totalUsers || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-maintext">Tổng dự án</CardTitle>
                        <Icon path={mdiProjector} size={1} className="text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-maintext">{data?.totalProjects || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-maintext">Dự án hoạt động</CardTitle>
                        <Icon path={mdiProjector} size={1} className="text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-maintext">{data?.activeProjects || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-maintext">Tổng tài liệu</CardTitle>
                        <Icon path={mdiFileDocumentMultiple} size={1} className="text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-maintext">{data?.totalDocuments || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-maintext">Bài viết diễn đàn</CardTitle>
                        <Icon path={mdiForumOutline} size={1} className="text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-maintext">{data?.totalForumPosts || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-maintext">
                                Phân bổ tổng quan
                            </CardTitle>
                            <Icon path={mdiChartDonut} size={1} className="text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[300px]">
                            {data && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [value, 'Số lượng']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-maintext">
                                Dự án và tài liệu
                            </CardTitle>
                            <Icon path={mdiChartBar} size={1} className="text-secondary" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[300px]">
                            {data && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={barData}
                                        layout="vertical"
                                        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="category" />
                                        <Tooltip />
                                        <Legend />
                                        {barData.map((entry, index) => (
                                            <Bar
                                                key={`bar-${index}`}
                                                dataKey="value"
                                                name={entry.type}
                                                stackId={entry.category}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Thành phần người dùng
const UserContent = ({ data }: { data: any }) => {
    const formatMonthData = (monthData: any[]) => {
        if (!monthData || !Array.isArray(monthData)) return [];

        return monthData.map(item => ({
            name: `${item._id.month}/${item._id.year}`,
            value: item.count,
        })).sort((a, b) => {
            const [monthA, yearA] = a.name.split('/').map(Number);
            const [monthB, yearB] = b.name.split('/').map(Number);

            if (yearA !== yearB) return yearA - yearB;
            return monthA - monthB;
        });
    };

    const formatEntityData = (entityData: any[], nameField = '_id') => {
        if (!entityData || !Array.isArray(entityData)) return [];

        return entityData.map((item, index) => {
            let displayName = item[nameField] || 'Không xác định';
            
            // Chuyển đổi tên vai trò
            if (nameField === '_id' && entityData === data?.usersByRole) {
                if (displayName === 'admin') displayName = 'Quản trị viên';
                else if (displayName === 'employee') displayName = 'Nhân viên';
            }
            
            return {
                name: displayName,
                value: item.count,
                color: [
                    '#2C8B3D', '#88C140', '#4F95DA', '#F2A024',
                    '#6366F1', '#10B981', '#EC4899', '#FF9800'
                ][index % 8]
            };
        }).sort((a, b) => b.value - a.value);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-maintext">
                                Người dùng theo phòng ban
                            </CardTitle>
                            <Icon path={mdiChartDonut} size={1} className="text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[300px]">
                            {data?.usersByDepartment && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={formatEntityData(data.usersByDepartment)}
                                            cx="70%"
                                            cy="50%"
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        >
                                            {formatEntityData(data.usersByDepartment).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [value, 'Người dùng']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-maintext">
                                Người dùng theo vị trí
                            </CardTitle>
                            <Icon path={mdiChartDonut} size={1} className="text-secondary" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[300px]">
                            {data?.usersByPosition && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={formatEntityData(data.usersByPosition)}
                                            cx="70%"
                                            cy="50%"
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        >
                                            {formatEntityData(data.usersByPosition).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [value, 'Người dùng']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-maintext">
                            Người dùng theo vai trò
                        </CardTitle>
                        <Icon path={mdiChartBar} size={1} className="text-primary" />
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="h-[300px]">
                        {data?.usersByRole && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={formatEntityData(data.usersByRole)}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="name" />
                                    <Tooltip formatter={(value) => [`${value} người dùng`, '']} />
                                    <Bar dataKey="value">
                                        {formatEntityData(data.usersByRole).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-maintext">
                            Người dùng tham gia theo tháng
                        </CardTitle>
                        <Icon path={mdiChartLine} size={1} className="text-secondary" />
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="h-[300px]">
                        {data?.usersJoinedByMonth && (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={formatMonthData(data.usersJoinedByMonth)}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`${value} người dùng`, 'Người dùng mới']} />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        name="Người dùng mới"
                                        stroke="#2C8B3D"
                                        fill="#88C140"
                                        activeDot={{ r: 8 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Thành phần dự án
const ProjectContent = ({ data }: { data: any }) => {
    const formatMonthData = (monthData: any[]) => {
        if (!monthData || !Array.isArray(monthData)) return [];

        return monthData.map(item => ({
            name: `${item._id.month}/${item._id.year}`,
            value: item.count,
        })).sort((a, b) => {
            const [monthA, yearA] = a.name.split('/').map(Number);
            const [monthB, yearB] = b.name.split('/').map(Number);

            if (yearA !== yearB) return yearA - yearB;
            return monthA - monthB;
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
            case 'in-progress':
            case 'đang tiến hành':
                return '#2C8B3D';
            case 'completed':
            case 'hoàn thành':
                return '#4F95DA';
            case 'planning':
            case 'lên kế hoạch':
                return '#F2A024';
            case 'on-hold':
            case 'tạm hoãn':
                return '#E73D30';
            default:
                return '#AAAAAA';
        }
    };

    const formatEntityData = (entityData: any[], nameField = '_id') => {
        if (!entityData || !Array.isArray(entityData)) return [];

        return entityData.map((item, index) => {
            let displayName = item[nameField] || 'Không xác định';
            
            // Chuyển đổi tên trạng thái dự án
            if (nameField === '_id' && entityData === data?.projectsByStatus) {
                if (displayName === 'in-progress') displayName = 'Đang tiến hành';
                else if (displayName === 'planning') displayName = 'Lên kế hoạch';
                else if (displayName === 'completed') displayName = 'Hoàn thành';
                else if (displayName === 'on-hold') displayName = 'Tạm hoãn';
                else if (displayName === 'active') displayName = 'Đang hoạt động';
            }
            
            return {
                name: displayName,
                value: item.count,
                color: [
                    '#2C8B3D', '#88C140', '#4F95DA', '#F2A024',
                    '#6366F1', '#10B981', '#EC4899', '#FF9800'
                ][index % 8]
            };
        }).sort((a, b) => b.value - a.value);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-maintext">
                                Dự án theo trạng thái
                            </CardTitle>
                            <Icon path={mdiChartDonut} size={1} className="text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[300px]">
                            {data?.projectsByStatus && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={formatEntityData(data.projectsByStatus)}
                                            cx="70%"
                                            cy="50%"
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        >
                                            {formatEntityData(data.projectsByStatus).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [value, 'Dự án']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-maintext">
                                Dự án theo thể loại
                            </CardTitle>
                            <Icon path={mdiChartDonut} size={1} className="text-secondary" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[300px]">
                            {data?.projectsByGenre && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={formatEntityData(data.projectsByGenre)}
                                            cx="70%"
                                            cy="50%"
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        >
                                            {formatEntityData(data.projectsByGenre).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [value, 'Dự án']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-maintext">
                            Dự án theo nền tảng
                        </CardTitle>
                        <Icon path={mdiChartBar} size={1} className="text-primary" />
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="h-[300px]">
                        {data?.projectsByPlatform && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={formatEntityData(data.projectsByPlatform)}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="name" />
                                    <Tooltip formatter={(value) => [`${value} dự án`, '']} />
                                    <Bar dataKey="value">
                                        {formatEntityData(data.projectsByPlatform).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-maintext">
                            Xu hướng tạo dự án theo tháng
                        </CardTitle>
                        <Icon path={mdiChartLine} size={1} className="text-secondary" />
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="h-[300px]">
                        {data?.projectsCreatedByMonth && (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={formatMonthData(data.projectsCreatedByMonth)}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`${value} dự án`, 'Dự án mới']} />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        name="Dự án mới"
                                        stroke="#88C140"
                                        fill="#88C140"
                                        activeDot={{ r: 8 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Thành phần tài liệu
const DocumentContent = ({ data }: { data: any }) => {
    const formatMonthData = (monthData: any[]) => {
        if (!monthData || !Array.isArray(monthData)) return [];

        return monthData.map(item => ({
            name: `${item._id.month}/${item._id.year}`,
            value: item.count,
            size: formatFileSize(item.totalSize || 0),
            totalSize: item.totalSize || 0,
        })).sort((a, b) => {
            const [monthA, yearA] = a.name.split('/').map(Number);
            const [monthB, yearB] = b.name.split('/').map(Number);

            if (yearA !== yearB) return yearA - yearB;
            return monthA - monthB;
        });
    };

    const formatEntityData = (entityData: any[], nameField = '_id', includeSize = false) => {
        if (!entityData || !Array.isArray(entityData)) return [];

        return entityData.map((item, index) => {
            const result: any = {
                name: item[nameField] || 'Không xác định',
                value: item.count,
                color: [
                    '#4F95DA', '#E73D30', '#2C8B3D', '#88C140',
                    '#F2A024', '#6366F1', '#EC4899', '#7B1FA2'
                ][index % 8]
            };

            if (includeSize && item.totalSize !== undefined) {
                result.size = formatFileSize(item.totalSize);
                result.totalSize = item.totalSize;
            }

            return result;
        }).sort((a, b) => b.value - a.value);
    };

    // Format kích thước file
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Lấy màu cho từng loại file
    const getFileTypeColor = (fileType: string) => {
        if (fileType.includes('image') || fileType.includes('img')) {
            return "#4F95DA"; // Xanh dương
        } else if (fileType.includes('pdf')) {
            return "#E73D30"; // Đỏ
        } else if (fileType.includes('doc') || fileType.includes('word')) {
            return "#2C8B3D"; // Xanh lá
        } else if (fileType.includes('xls') || fileType.includes('excel') || fileType.includes('sheet')) {
            return "#88C140"; // Xanh lá nhạt
        } else if (fileType.includes('ppt') || fileType.includes('powerpoint') || fileType.includes('presentation')) {
            return "#F2A024"; // Cam
        } else if (fileType.includes('video') || fileType.includes('movie')) {
            return "#6366F1"; // Tím
        } else if (fileType.includes('audio') || fileType.includes('sound') || fileType.includes('music')) {
            return "#EC4899"; // Hồng
        } else {
            return "#AAAAAA"; // Xám
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-maintext">
                                Tài liệu theo loại file
                            </CardTitle>
                            <Icon path={mdiChartDonut} size={1} className="text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[300px]">
                            {data?.documentsByType && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={formatEntityData(data.documentsByType, '_id', true)}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        >
                                            {formatEntityData(data.documentsByType, '_id', true).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={getFileTypeColor(entry.name)} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name, props) => {
                                                // @ts-ignore
                                                return [`${value} tệp (${props.payload.size})`, props.payload.name];
                                            }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-maintext">
                                Tài liệu theo danh mục
                            </CardTitle>
                            <Icon path={mdiChartDonut} size={1} className="text-secondary" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[300px]">
                            {data?.documentsByCategory && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={formatEntityData(data.documentsByCategory)}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        >
                                            {formatEntityData(data.documentsByCategory).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [value, 'Tài liệu']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-maintext">
                            Số lượng tài liệu theo tháng
                        </CardTitle>
                        <Icon path={mdiChartLine} size={1} className="text-primary" />
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="h-[300px]">
                        {data?.documentsUploadedByMonth && (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={formatMonthData(data.documentsUploadedByMonth)}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value, name, props) => {
                                            // @ts-ignore
                                            return [`${value} tệp (${props.payload.size})`, 'Tài liệu'];
                                        }}
                                    />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        name="Tài liệu"
                                        stroke="#4F95DA"
                                        fill="#4F95DA"
                                        activeDot={{ r: 8 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-maintext">
                            Dung lượng tài liệu theo tháng
                        </CardTitle>
                        <Icon path={mdiChartBar} size={1} className="text-secondary" />
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="h-[300px]">
                        {data?.documentsUploadedByMonth && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={formatMonthData(data.documentsUploadedByMonth)}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => formatFileSize(value)} />
                                    <Tooltip formatter={(value) => [formatFileSize(value as number), 'Dung lượng']} />
                                    <Legend />
                                    <Bar dataKey="totalSize" name="Dung lượng" fill="#4F95DA" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Thành phần diễn đàn
const ForumContent = ({ data }: { data: any }) => {
    const formatMonthData = (monthData: any[]) => {
        if (!monthData || !Array.isArray(monthData)) return [];

        return monthData.map(item => ({
            name: `${item._id.month}/${item._id.year}`,
            value: item.count,
        })).sort((a, b) => {
            const [monthA, yearA] = a.name.split('/').map(Number);
            const [monthB, yearB] = b.name.split('/').map(Number);

            if (yearA !== yearB) return yearA - yearB;
            return monthA - monthB;
        });
    };

    const topPosters = data?.topPosters ?
        data.topPosters.map((user: any, index: number) => ({
            name: user.fullName || user.username || 'Người dùng ' + user.userId,
            value: user.postCount,
            color: [
                '#2C8B3D', '#88C140', '#F2A024', '#4F95DA',
                '#6366F1', '#10B981', '#EC4899', '#FF9800'
            ][index % 8]
        })) : [];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-maintext">Tổng bài viết</CardTitle>
                        <Icon path={mdiForumOutline} size={1} className="text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-maintext">{data?.totalPosts || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-maintext">Tổng bình luận</CardTitle>
                        <Icon path={mdiForumOutline} size={1} className="text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-maintext">{data?.totalComments || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-semibold text-maintext">
                                Xu hướng bài viết theo tháng
                            </CardTitle>
                            <Icon path={mdiChartLine} size={1} className="text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[300px]">
                            {data?.postsPerMonth && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={formatMonthData(data.postsPerMonth)}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`${value} bài viết`, 'Bài viết']} />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            name="Bài viết"
                                            stroke="#F2A024"
                                            fill="#F2A024"
                                            activeDot={{ r: 8 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-semibold text-maintext">
                                Xu hướng bình luận theo tháng
                            </CardTitle>
                            <Icon path={mdiChartLine} size={1} className="text-secondary" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[300px]">
                            {data?.commentsPerMonth && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={formatMonthData(data.commentsPerMonth)}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`${value} bình luận`, 'Bình luận']} />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            name="Bình luận"
                                            stroke="#88C140"
                                            fill="#88C140"
                                            activeDot={{ r: 8 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-maintext">
                            Top 10 người dùng đăng nhiều bài viết nhất
                        </CardTitle>
                        <Icon path={mdiChartBar} size={1} className="text-primary" />
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="h-[400px]">
                        {data?.topPosters && data.topPosters.length > 0 && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={topPosters}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="name" />
                                    <Tooltip formatter={(value) => [`${value} bài viết`, '']} />
                                    <Bar dataKey="value" name="Số bài viết">
                                        {topPosters.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 