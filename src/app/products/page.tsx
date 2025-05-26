"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icon } from "@mdi/react"
import Image from "next/image"
import Link from "next/link"
import { mdiCartOutline, mdiHeartOutline, mdiEye, mdiFilterOutline, mdiClose, mdiMagnify } from "@mdi/js"
import { useProducts, useSearchProducts } from "@/hooks/product"
import type { IProductFilter } from "@/interface/request/product"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { checkImageUrl } from "@/lib/utils"
import { useCartStore } from "@/stores/useCartStore"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion, AnimatePresence } from "framer-motion"
import QrCodeScanner from "@/components/ProductPage/QrCodeScanner"
import VoucherForm from "@/components/ProductPage/VoucherForm"
import CartIcon from "@/components/ui/CartIcon"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

interface ProductCardProps {
  product: any
  onAddToCart: () => void
  onQuickView: () => void
  onAddToWishlist: () => void
}

interface ProductFiltersProps {
  filters: IProductFilter
  onChange: (filters: Partial<IProductFilter>) => void
}
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
}

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
  })
  const [filters, setFilters] = useState<IProductFilter>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("default")
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number; voucherId: string } | null>(
    null,
  )
  const [isSearching, setIsSearching] = useState(false)
  const { addToCart } = useCartStore()

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchQuery) {
        setIsSearching(true)
      } else {
        setIsSearching(false)
      }
    }, 500)

    return () => clearTimeout(timerId)
  }, [searchQuery])

  const paginationParams: IProductFilter = {
    page: pagination.page,
    limit: pagination.limit,
    status: "HOAT_DONG",
  }

  const productsQuery = useProducts(paginationParams)
  const searchQuery2 = useSearchProducts(isSearching ? { keyword: searchQuery, status: "HOAT_DONG" } : { keyword: "" })
  const { data: rawData, isLoading, isError } = isSearching ? searchQuery2 : productsQuery
  const data = useMemo(() => {
    if (!rawData || !rawData.data || !rawData.data.products) return rawData
    let filteredProducts = [...rawData.data.products]
    if (filters.brands && filters.brands.length > 0) {
      const brandsArray = Array.isArray(filters.brands) ? filters.brands : [filters.brands]
      filteredProducts = filteredProducts.filter((product) => {
        const brandId = typeof product.brand === "object" ? product.brand._id : product.brand
        return brandsArray.includes(brandId)
      })
    }

    if (filters.categories && filters.categories.length > 0) {
      const categoriesArray = Array.isArray(filters.categories) ? filters.categories : [filters.categories]
      filteredProducts = filteredProducts.filter((product) => {
        const categoryId = typeof product.category === "object" ? product.category._id : product.category
        return categoriesArray.includes(categoryId)
      })
    }

    if (filters.color) {
      filteredProducts = filteredProducts.filter((product) =>
        product.variants.some((variant: any) => {
          const colorId = typeof variant.colorId === "object" ? variant.colorId._id : variant.colorId
          return colorId === filters.color
        }),
      )
    }

    if (filters.size) {
      filteredProducts = filteredProducts.filter((product) =>
        product.variants.some((variant: any) => {
          const sizeId = typeof variant.sizeId === "object" ? variant.sizeId._id : variant.sizeId
          return sizeId === filters.size
        }),
      )
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const minPrice = filters.minPrice !== undefined ? filters.minPrice : 0
      const maxPrice = filters.maxPrice !== undefined ? filters.maxPrice : Number.POSITIVE_INFINITY

      filteredProducts = filteredProducts.filter((product) => {
        const price = product.variants[0]?.price || 0
        return price >= minPrice && price <= maxPrice
      })
    }

    // Sắp xếp sản phẩm
    if (sortOption !== "default") {
      filteredProducts.sort((a, b) => {
        const priceA = a.variants[0]?.price || 0
        const priceB = b.variants[0]?.price || 0
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()

        switch (sortOption) {
          case "price-asc":
            return priceA - priceB
          case "price-desc":
            return priceB - priceA
          case "newest":
            return dateB - dateA
          case "popularity":
            const stockA = a.variants.reduce((total: number, variant: any) => total + variant.stock, 0)
            const stockB = b.variants.reduce((total: number, variant: any) => total + variant.stock, 0)
            return stockB - stockA
          default:
            return 0
        }
      })
    }

    // Giữ nguyên thông tin phân trang từ API
    return {
      ...rawData,
      data: {
        ...rawData.data,
        products: filteredProducts,
      },
    }
  }, [rawData, filters, sortOption, pagination])

  const handleFilterChange = (updatedFilters: Partial<IProductFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...updatedFilters,
    }))
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }))
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }))
  }

  const handleAddToCart = (product: any) => {
    if (!product || !product.variants || product.variants.length === 0) {
      toast.error("Không thể thêm sản phẩm này vào giỏ hàng")
      return
    }

    const variant = product.variants[0]
    const productToAdd = {
      id: product._id,
      name: product.name,
      price: variant.price,
      image: variant.images?.[0] || "",
      quantity: 1,
      slug: product.name.toLowerCase().replace(/\s+/g, "-") + "-" + product._id,
      brand: typeof product.brand === "string" ? product.brand : product.brand.name,
      colors: [typeof variant.colorId === "object" ? variant.colorId.name : variant.colorId],
      size: typeof variant.sizeId === "object" ? variant.sizeId.name : variant.sizeId,
    }

    addToCart(productToAdd, 1)
    toast.success("Đã thêm sản phẩm vào giỏ hàng")
  }

  const handleQuickView = (product: any) => {
    window.location.href = `/products/${product.name.toLowerCase().replace(/\s+/g, "-")}-${product._id}`
  }

  const handleAddToWishlist = (product: any) => {
    toast.success("Đã thêm sản phẩm vào danh sách yêu thích")
  }

  const handleApplyVoucher = (voucherData: { code: string; discount: number; voucherId: string }) => {
    setAppliedVoucher(voucherData)
    toast.success(`Đã áp dụng mã giảm giá: ${voucherData.code}`)
  }

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null)
    toast.info("Đã xóa mã giảm giá")
  }

  const handleQrCodeDetected = (qrData: string) => {
    try {
      const productData = JSON.parse(qrData)

      if (productData && productData.productId) {
        const product = data?.data.products.find((p) => p._id === productData.productId)

        if (product) {
          handleAddToCart(product)
          toast.success(`Đã quét mã QR và thêm ${product.name} vào giỏ hàng`)
        } else {
          window.location.href = `/products/${productData.productId}`
        }
      } else {
        toast.error("Mã QR không chứa thông tin sản phẩm hợp lệ")
      }
    } catch (error) {
      toast.error("Không thể đọc mã QR. Vui lòng thử lại.")
    }
  }

  const filteredProducts = useMemo(() => {
    if (!data || !data.data || !data.data.products) return []
    return data.data.products
  }, [data])

  return (
    <div className="container mx-auto py-8 relative">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="!text-maintext hover:!text-maintext">
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="!text-maintext hover:!text-maintext" />
          <BreadcrumbItem>
            <BreadcrumbPage className="!text-maintext hover:!text-maintext">Sản phẩm</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Filters - Mobile */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden w-full"
            >
              <div className="bg-white rounded-[6px] shadow-sm border p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-medium">Bộ lọc sản phẩm</h2>
                  <Button variant="ghost" size="sm" onClick={toggleFilter}>
                    <Icon path={mdiClose} size={0.9} />
                  </Button>
                </div>
                <ProductFilters filters={filters} onChange={handleFilterChange} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden lg:block w-full lg:w-1/4 xl:w-1/5 ">
          <div className="bg-white rounded-[6px] shadow-sm border p-4 sticky top-20">
            <h2 className="font-medium mb-4">Bộ lọc sản phẩm</h2>
            <ProductFilters filters={filters} onChange={handleFilterChange} />

            {data && data.data.products && data.data.products.length > 0 && (
              <VoucherForm
                orderValue={data.data.products.reduce((sum, product) => sum + (product.variants[0]?.price || 0), 0)}
                onApplyVoucher={handleApplyVoucher}
                onRemoveVoucher={handleRemoveVoucher}
                appliedVoucher={appliedVoucher}
              />
            )}
          </div>
        </div>

        {/* Products */}
        <div className="w-full lg:w-3/4 xl:w-4/5">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <Icon
                path={mdiMagnify}
                size={0.9}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maintext"
              />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="default" value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Mặc định</SelectItem>
                <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="popularity">Phổ biến nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(9)].map((_, index) => (
                <Card key={index} className="overflow-hidden h-full">
                  <div className="aspect-square w-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Đã xảy ra lỗi khi tải dữ liệu</p>
              <Button onClick={() => setPagination({ ...pagination })}>Thử lại</Button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-maintext font-semibold">Tìm thấy <span className="text-primary text-lg">{filteredProducts.length}</span> sản phẩm</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onQuickView={() => handleQuickView(product)}  
                    onAddToWishlist={() => handleAddToWishlist(product)}
                  />
                ))}
              </div>

              {/* Phân trang */}
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        disabled={(data?.data?.pagination as any)?.currentPage <= 1}
                        onClick={(e) => {
                          e.preventDefault()
                          if ((data?.data?.pagination as any)?.currentPage > 1)
                            handlePageChange((data?.data?.pagination as any)?.currentPage - 1)
                        }}
                      />
                    </PaginationItem>
                    {(() => {
                      const pages = []
                      const totalPages = (data?.data?.pagination as any)?.totalPages || 1
                      const currentPage = (data?.data?.pagination as any)?.currentPage || 1

                      // Hiển thị trang đầu
                      if (totalPages > 0) {
                        pages.push(
                          <PaginationItem key={1}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === 1}
                              onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(1)
                              }}
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>,
                        )
                      }

                      // Hiển thị dấu ... nếu cần
                      if (currentPage > 3) {
                        pages.push(
                          <PaginationItem key="start-ellipsis">
                            <PaginationEllipsis />
                          </PaginationItem>,
                        )
                      }

                      // Hiển thị các trang gần currentPage
                      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                        if (i !== 1 && i !== totalPages) {
                          pages.push(
                            <PaginationItem key={i}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === i}
                                onClick={(e) => {
                                  e.preventDefault()
                                  handlePageChange(i)
                                }}
                              >
                                {i}
                              </PaginationLink>
                            </PaginationItem>,
                          )
                        }
                      }

                      // Hiển thị dấu ... nếu cần
                      if (currentPage < totalPages - 2) {
                        pages.push(
                          <PaginationItem key="end-ellipsis">
                            <PaginationEllipsis />
                          </PaginationItem>,
                        )
                      }

                      // Hiển thị trang cuối
                      if (totalPages > 1) {
                        pages.push(
                          <PaginationItem key={totalPages}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === totalPages}
                              onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(totalPages)
                              }}
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>,
                        )
                      }

                      return pages
                    })()}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        disabled={
                          (data?.data?.pagination as any)?.currentPage >= (data?.data?.pagination?.totalPages || 1)
                        }
                        onClick={(e) => {
                          e.preventDefault()
                          const totalPages = data?.data?.pagination?.totalPages || 1
                          const currentPage = data?.data?.pagination?.currentPage || 1
                          if (currentPage < totalPages) handlePageChange(currentPage + 1)
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              <div className="lg:hidden mt-8 bg-white rounded-[6px] shadow-sm border p-4">
                <VoucherForm
                  orderValue={filteredProducts.reduce((sum, product) => sum + (product.variants[0]?.price || 0), 0)}
                  onApplyVoucher={handleApplyVoucher}
                  onRemoveVoucher={handleRemoveVoucher}
                  appliedVoucher={appliedVoucher}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-maintext mb-4">Không tìm thấy sản phẩm nào</p>
              {(searchQuery || Object.keys(filters).length > 0) && (
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setFilters({})
                  }}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full bg-primary p-2 hover:bg-primary/80 transition-all duration-300">
        <CartIcon className="text-white" />
      </div>
    </div>
  )
}

const ProductCard = ({ product, onAddToCart, onQuickView, onAddToWishlist }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden border rounded-lg hover:shadow-2xl shadow-lg transition-all duration-500 h-full flex flex-col transform hover:-translate-y-3 bg-white relative backdrop-blur-sm">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg z-10 pointer-events-none" />

        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-t-2xl">
          <Link href={`/products/${product.name.toLowerCase().replace(/\s+/g, "-")}-${product._id}`} className="block">
            <div className="aspect-square overflow-hidden relative flex items-center justify-center">
              <motion.div
                className="w-full h-full relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Image
                  src={checkImageUrl(product.variants[0]?.images?.[0]) || "/placeholder.svg"}
                  alt={product.name}
                  className="object-contain w-full h-full drop-shadow-2xl filter group-hover:brightness-110 transition-all duration-500"
                  fill
                />
              </motion.div>
            </div>
          </Link>

          {/* Enhanced badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            {product.isNew && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border-2 border-white/50 backdrop-blur-sm"
              >
                ✨ Mới
              </motion.div>
            )}
            {product.discount && (
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border-2 border-white/50 backdrop-blur-sm animate-pulse"
              >
                🔥 -{product.discount}%
              </motion.div>
            )}
          </div>

          {/* Enhanced quick action buttons */}
          <motion.div
            className="absolute right-2 top-2 transform -translate-y-1/2 flex flex-col gap-3 z-30"
            initial={{ x: 60, opacity: 0 }}
            animate={{
              x: isHovered ? 0 : 60,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:!bg-primary hover:text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group/btn"
                onClick={(e) => { 
                  e.preventDefault()
                  onAddToCart()
                }}
                aria-label="Thêm vào giỏ hàng"
              >
                <Icon path={mdiCartOutline} size={0.8} className="group-hover/btn:animate-bounce" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:!bg-pink-500 hover:text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group/btn"
                onClick={(e) => {
                  e.preventDefault()
                  onAddToWishlist()
                }}
                aria-label="Yêu thích"
              >
                <Icon path={mdiHeartOutline} size={0.8} className="group-hover/btn:animate-pulse" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:!bg-blue-500 hover:text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group/btn"
                onClick={(e) => {
                  e.preventDefault()
                  onQuickView()
                }}
                aria-label="Xem nhanh"
              >
                <Icon path={mdiEye} size={0.8} className="group-hover/btn:animate-ping" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced product information */}
        <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-white via-gray-50/30 to-white border-t border-gray-100/50 rounded-b-2xl relative">
          {/* Brand with enhanced styling */}
          <div className="text-xs text-primary/80 mb-2 uppercase tracking-wider font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-pink-400 animate-pulse"></div>
            <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              {typeof product.brand === "string" ? product.brand : product.brand.name}
            </span>
          </div>

          <Link
            href={`/products/${product.name.toLowerCase().replace(/\s+/g, "-")}-${product._id}`}
            className="hover:text-primary transition-colors group/link"
          >
            <h3 className="font-bold text-base mb-3 line-clamp-2 leading-tight group-hover:text-primary/90 transition-colors duration-300 text-gray-800 group-hover/link:underline decoration-primary/50 underline-offset-2">
              {product.name}
            </h3>
          </Link>

          <div className="mt-auto">
            {/* Enhanced pricing */}
            <div className="flex items-end gap-3 mb-2">
              <motion.div
                className="font-black text-lg bg-gradient-to-r from-primary via-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {formatPrice(product.variants[0]?.price || 0)}
              </motion.div>
              {product.originalPrice && (
                <div className="text-sm text-maintext line-through font-medium bg-gray-100 px-2 py-1 rounded-lg">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>

            {/* Enhanced color variants */}
            {product.variants.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-maintext font-medium">Màu sắc:</span>
                <div className="flex gap-1.5">
                  {Array.from(
                    new Set(
                      product.variants.map((v: any) => (typeof v.colorId === "object" ? v.colorId._id : v.colorId)),
                    ),
                  )
                    .slice(0, 4)
                    .map((colorId, index: number) => {
                      const variant = product.variants.find(
                        (v: any) => (typeof v.colorId === "object" ? v.colorId._id : v.colorId) === colorId,
                      )
                      const color = typeof variant.colorId === "object" ? variant.colorId : { code: "#000000" }

                      return (
                        <motion.div
                          key={index}
                          className="w-5 h-5 rounded-full border-2 border-white shadow-lg ring-2 ring-gray-200 cursor-pointer"
                          style={{ backgroundColor: color.code }}
                          title={color.name}
                          whileHover={{ scale: 1.3, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        />
                      )
                    })}

                  {Array.from(
                    new Set(
                      product.variants.map((v: any) => (typeof v.colorId === "object" ? v.colorId._id : v.colorId)),
                    ),
                  ).length > 4 && (
                    <motion.span
                      className="text-xs text-maintext ml-1 bg-gray-100 px-2 py-1 rounded-full font-medium"
                      whileHover={{ scale: 1.1 }}
                    >
                      +
                      {Array.from(
                        new Set(
                          product.variants.map((v: any) => (typeof v.colorId === "object" ? v.colorId._id : v.colorId)),
                        ),
                      ).length - 4}
                    </motion.span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Decorative bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-pink-400/20 to-orange-400/20 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Card>
    </motion.div>
  )
}
const ProductFilters = ({ filters, onChange }: ProductFiltersProps) => {
  const productsQuery = useProducts({ limit: 100, status: "HOAT_DONG" })
  const products = productsQuery.data?.data.products || []
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    filters.brands ? (Array.isArray(filters.brands) ? filters.brands[0] : filters.brands) : undefined,
  )

  useEffect(() => {
    if (filters.brands) {
      setSelectedBrand(Array.isArray(filters.brands) ? filters.brands[0] : filters.brands)
    } else {
      setSelectedBrand(undefined)
    }
  }, [filters.brands])

  const handleBrandChange = (brandId: string) => {
    if (selectedBrand === brandId) {
      setSelectedBrand(undefined)
      onChange({ brands: undefined })
    } else {
      setSelectedBrand(brandId)
      onChange({ brands: brandId })
    }
  }

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    filters.categories ? (Array.isArray(filters.categories) ? filters.categories[0] : filters.categories) : undefined,
  )

  useEffect(() => {
    if (filters.categories) {
      setSelectedCategory(Array.isArray(filters.categories) ? filters.categories[0] : filters.categories)
    } else {
      setSelectedCategory(undefined)
    }
  }, [filters.categories])

  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(undefined)
      onChange({ categories: undefined })
    } else {
      setSelectedCategory(categoryId)
      onChange({ categories: categoryId })
    }
  }

  const handleColorChange = (colorId: string) => {
    onChange({
      color: filters.color === colorId ? undefined : colorId,
    })
  }
  const handleSizeChange = (sizeId: string) => {
    onChange({
      size: filters.size === sizeId ? undefined : sizeId,
    })
  }
  const brands = useMemo(() => {
    if (!products || products.length === 0) return []

    const uniqueBrands = Array.from(
      new Set(
        products.map((product) => {
          const brand = typeof product.brand === "object" ? product.brand : { _id: product.brand, name: product.brand }
          return JSON.stringify(brand)
        }),
      ),
    ).map((brandStr) => JSON.parse(brandStr))

    return uniqueBrands
  }, [products])

  const categories = useMemo(() => {
    if (!products || products.length === 0) return []

    const uniqueCategories = Array.from(
      new Set(
        products.map((product) => {
          const category =
            typeof product.category === "object" ? product.category : { _id: product.category, name: product.category }
          return JSON.stringify(category)
        }),
      ),
    ).map((categoryStr) => JSON.parse(categoryStr))

    return uniqueCategories
  }, [products])

  const colors = useMemo(() => {
    if (!products || products.length === 0) return []

    const allColors = products.flatMap((product) =>
      product.variants.map((variant) =>
        typeof variant.colorId === "object"
          ? variant.colorId
          : { _id: variant.colorId, name: variant.colorId, code: "#000000" },
      ),
    )

    const uniqueColors = Array.from(new Set(allColors.map((color) => JSON.stringify(color)))).map((colorStr) =>
      JSON.parse(colorStr),
    )

    return uniqueColors
  }, [products])

  const sizes = useMemo(() => {
    if (!products || products.length === 0) return []

    const allSizes = products.flatMap((product) =>
      product.variants.map((variant) =>
        typeof variant.sizeId === "object" ? variant.sizeId : { _id: variant.sizeId, value: variant.sizeId },
      ),
    )

    const uniqueSizes = Array.from(new Set(allSizes.map((size) => JSON.stringify(size))))
      .map((sizeStr) => JSON.parse(sizeStr))
      .sort((a, b) => (a.value || 0) - (b.value || 0)) // Sắp xếp theo kích thước tăng dần

    return uniqueSizes
  }, [products])

  const priceRange = useMemo(() => {
    if (!products || products.length === 0) {
      return { min: 0, max: 5000000 }
    }

    const prices = products.flatMap((product) => product.variants.map((variant) => variant.price || 0))

    return {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 5000000),
    }
  }, [products])

  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([
    filters.minPrice || priceRange.min,
    filters.maxPrice || priceRange.max,
  ])

  const handlePriceChange = (values: number[]) => {
    setSelectedPriceRange(values as [number, number])

    // Áp dụng thay đổi giá vào bộ lọc sau một khoảng thời gian ngắn
    const timerId = setTimeout(() => {
      onChange({
        minPrice: values[0],
        maxPrice: values[1],
      })
    }, 300)

    return () => clearTimeout(timerId)
  }

  const handleResetFilters = () => {
    setSelectedPriceRange([priceRange.min, priceRange.max])
    setSelectedCategory(undefined)
    onChange({
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      color: undefined,
      size: undefined,
    })
    toast.info("Đã đặt lại bộ lọc")
  }

  if (productsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Giá</h3>
        <div className="px-2">
          <Slider
            defaultValue={[priceRange.min, priceRange.max]}
            min={priceRange.min}
            max={priceRange.max}
            step={100000}
            value={selectedPriceRange}
            onValueChange={(value) => handlePriceChange(value as [number, number])}
          />
          <div className="flex justify-between mt-2 text-sm text-maintext">
            <span>{formatPrice(selectedPriceRange[0])}</span>
            <span>{formatPrice(selectedPriceRange[1])}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Thương hiệu</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {brands.map((brand) => (
            <div key={brand._id} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand._id}`}
                checked={selectedBrand === brand._id}
                onCheckedChange={() => handleBrandChange(brand._id)}
              />
              <label htmlFor={`brand-${brand._id}`} className="text-sm">
                {brand.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Danh mục</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {categories.map((category) => (
            <div key={category._id} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category._id}`}
                checked={selectedCategory === category._id}
                onCheckedChange={() => handleCategoryChange(category._id)}
              />
              <label htmlFor={`category-${category._id}`} className="text-sm">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Màu sắc</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color._id}
              className={`w-8 h-8 rounded-full border overflow-hidden relative transition-all duration-300 ${filters.color === color._id ? "ring-2 ring-primary ring-offset-2" : "border-gray-300"}`}
              style={{ backgroundColor: color.code }}
              title={color.name}
              onClick={() => handleColorChange(color._id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Kích cỡ</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size._id}
              className={`px-2 py-1 border rounded text-sm transition-all duration-300 ${filters.size === size._id ? "bg-primary text-white border-primary" : "border-gray-300 hover:border-primary"}`}
              onClick={() => handleSizeChange(size._id)}
            >
              {size.value ? `EU ${size.value}` : size.name || size._id}
            </button>
          ))}
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleResetFilters}>
        Đặt lại
      </Button>
    </div>
  )
}
