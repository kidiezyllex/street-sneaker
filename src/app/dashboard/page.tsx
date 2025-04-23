"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@mdi/react"
import {
  mdiFileDocument,
  mdiForum,
  mdiCommentTextMultiple,
  mdiClipboardListOutline,
  mdiCalendarClock,
  mdiClockOutline,
} from "@mdi/js"
import { motion } from "framer-motion"
import Link from "next/link"
import { useProfile } from "@/hooks/authentication"
import Image from "next/image"
import { useState, useEffect } from "react"

// Dashboard LoadingSkeleton Component
const LoadingSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="relative w-5 h-5 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="w-full">
            <div className="h-10 w-3/4 bg-gray-200 rounded-md animate-pulse mb-2"></div>
            <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-full">
            <Card className="h-full overflow-hidden border-none ring-1 ring-gray-200 shadow-sm">
              <div className="h-1 w-full bg-gray-200"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
                <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="p-2.5 rounded-full bg-gray-200 animate-pulse h-10 w-10"></div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2 mb-3">
                  <div className="h-10 w-12 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Bottom Cards Skeleton */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i}>
            <Card className="overflow-hidden border-none ring-1 ring-gray-200 shadow-md h-full">
              <div className="h-1 w-full bg-gray-200"></div>
              <CardHeader className="pb-2 pt-5">
                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-6 w-36 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {i === 1 ? 
                  Array(5).fill(0).map((_, j) => (
                    <div key={j} className="border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="w-full">
                          <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse mb-1"></div>
                          <div className="h-3 w-1/4 bg-gray-200 rounded-md animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))
                : 
                  Array(3).fill(0).map((_, j) => (
                    <div key={j} className="border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center justify-center min-w-12 bg-gray-200 animate-pulse rounded-lg p-2 h-14"></div>
                          <div>
                            <div className="h-4 w-40 bg-gray-200 rounded-md animate-pulse mb-1"></div>
                            <div className="h-3 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { profileData } = useProfile()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const cards = [
    {
      title: "Tài liệu của tôi",
      description: "Quản lý tài liệu và dự án",
      icon: mdiFileDocument,
      link: "/dashboard/documents",
      color: "bg-[#2C8B3D]/10",
      iconColor: "text-[#2C8B3D]",
      value: "15",
      unit: "tài liệu",
    },
    {
      title: "Thảo luận dự án",
      description: "Chia sẻ và thảo luận trong dự án",
      icon: mdiForum,
      link: "/dashboard/forum",
      color: "bg-[#88C140]/10",
      iconColor: "text-[#88C140]",
      value: "3",
      unit: "dự án",
    },
    {
      title: "Bình luận",
      description: "Bình luận và phản hồi từ đồng nghiệp",
      icon: mdiCommentTextMultiple,
      link: "/dashboard/comments",
      color: "bg-[#F2A024]/10",
      iconColor: "text-[#F2A024]",
      value: "8",
      unit: "bình luận mới",
    },
    {
      title: "Nhiệm vụ thiết kế",
      description: "Quản lý các nhiệm vụ thiết kế của bạn",
      icon: mdiClipboardListOutline,
      link: "/dashboard/tasks",
      color: "bg-[#88C140]/10",
      iconColor: "text-[#88C140]",
      value: "5",
      unit: "nhiệm vụ",
    },
  ]

  // Animation variants for dashboard cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="relative">
            <Image
              quality={100}
              draggable={false}
              alt="&quot;"
              src="/images/comma.png"
              width={100}
              height={100}
              className="w-5 sm:w-6 lg:w-7"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#2C8B3D] mb-2">
              Chào mừng trở lại, <span className="text-active">{profileData?.data.fullName || "Người dùng"}!</span>
            </h2>
            <p className="text-gray-600 text-lg">Tổng quan về hoạt động của bạn trong dự án thiết kế game.</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {cards.map((card, index) => (
          <motion.div key={index} variants={item}>
            <Link href={card.link} className="block h-full">
              <Card className="h-full overflow-hidden group border-none ring-1 ring-gray-200 hover:ring-[#2C8B3D]/30 transition-all duration-300 hover:shadow-lg">
                <div className={`h-1 w-full ${card.color.replace("/10", "")}`}></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
                  <CardTitle className="text-lg font-semibold text-maintext group-hover:text-[#2C8B3D] transition-colors">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2.5 rounded-full ${card.color} group-hover:scale-110 transition-transform`}>
                    <Icon path={card.icon} size={1} className={card.iconColor} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-3">
                    <p className={`font-bold text-4xl ${card.iconColor}`}>{card.value}</p>
                    <p className="text-base text-gray-500">({card.unit})</p>
                  </div>
                  <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden border-none ring-1 ring-gray-200 shadow-md h-full">
            <div className="h-1 w-full bg-[#2C8B3D]"></div>
            <CardHeader className="pb-2 pt-5">
              <div className="flex items-center gap-4">
                <Icon path={mdiCommentTextMultiple} size={1} className="text-[#2C8B3D]" />
                <CardTitle className="text-[#2C8B3D] text-xl">Hoạt động gần đây</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div
                  key={i}
                  className="border-b border-gray-100 pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${i % 2 === 0 ? "bg-[#2C8B3D]" : "bg-[#F2A024]"} shadow-sm`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-maintext">
                        {i % 2 === 0 ? "Đã tải lên tài liệu mới" : "Đã bình luận về nhiệm vụ"}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Icon path={mdiClockOutline} size={0.6} className="text-gray-400" />
                        <p className="text-xs text-gray-500">1 giờ trước</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden border-none ring-1 ring-gray-200 shadow-md h-full">
            <div className="h-1 w-full bg-[#F2A024]"></div>
            <CardHeader className="pb-2 pt-5">
              <div className="flex items-center gap-4">
                <Icon path={mdiCalendarClock} size={1} className="text-[#F2A024]" />
                <CardTitle className="text-[#F2A024] text-xl">Lịch trình sắp tới</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="border-b border-gray-100 pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-md transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center justify-center min-w-12 bg-[#F2A024]/10 rounded-lg px-2 py-2 shadow-sm">
                        <span className="text-xs font-medium text-[#F2A024]">T{i + 2}</span>
                        <span className="text-lg font-bold text-[#F2A024]">{10 + i}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-maintext">Hoàn thành thiết kế nhân vật</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Icon path={mdiClockOutline} size={0.6} className="text-gray-400" />
                          <p className="text-xs text-gray-500">9:00 - 11:30</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
