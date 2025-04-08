import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiCartOutline, mdiHeartOutline, mdiStar, mdiEye, mdiArrowRight } from '@mdi/js';
import { InteractiveHoverButton } from '../Common/InteractiveHoverButton';

// Dữ liệu sản phẩm mới
const newArrivalsData = [
  {
    id: 1,
    name: "Giày Chạy Bộ Nam Premium",
    price: 1250000,
    originalPrice: 1590000,
    discount: 21,
    image: "/images/products/product-1.jpg",
    rating: 5,
    slug: "giay-chay-bo-nam-premium",
    brand: "Nike",
    colors: ["Đen", "Trắng", "Xanh"],
    isBestSeller: true,
    stock: 15
  },
  {
    id: 2,
    name: "Giày Thể Thao Nữ Ultra Light",
    price: 980000,
    originalPrice: 1200000,
    discount: 18,
    image: "/images/products/product-2.jpg",
    rating: 4,
    slug: "giay-the-thao-nu-ultra-light",
    brand: "Adidas",
    colors: ["Hồng", "Xám", "Trắng"],
    isBestSeller: false,
    stock: 20
  },
  {
    id: 3,
    name: "Giày Chạy Trail Địa Hình",
    price: 1890000,
    originalPrice: 2190000,
    discount: 14,
    image: "/images/products/product-3.jpg",
    rating: 5,
    slug: "giay-chay-trail-dia-hinh",
    brand: "Salomon",
    colors: ["Xanh rêu", "Cam", "Đen"],
    isBestSeller: true,
    stock: 8
  },
  {
    id: 4,
    name: "Giày Tập Gym Đa Năng",
    price: 1150000,
    originalPrice: 1350000,
    discount: 15,
    image: "/images/products/product-4.jpg",
    rating: 4,
    slug: "giay-tap-gym-da-nang",
    brand: "Puma",
    colors: ["Đen", "Xanh", "Đỏ"],
    isBestSeller: false,
    stock: 12
  }
];

// Fallback images nếu không tải được từ path
const fallbackImages = [
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-3-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-6-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-7-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-5-300x300.jpg"
];

// Màu gradient theme
const themeColors = {
  primary: '#2C8B3D',
  secondary: '#88C140',
  accent: '#F2A024',
  lightBg: 'rgba(136, 193, 64, 0.1)'
};

// Component hiển thị rating stars
const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1 items-center">
      {[...Array(5)].map((_, i) => (
        <Icon 
          key={i} 
          path={mdiStar} 
          size={0.7} 
          className={i < rating ? "text-amber-500" : "text-gray-300"}
        />
      ))}
      <span className="text-xs text-gray-400 ml-1">({rating}.0)</span>
    </div>
  );
};

// Component thẻ giảm giá
const DiscountBadge = ({ discount }: { discount: number }) => {
  if (!discount) return null;
  
  return (
    <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-none font-medium text-xs text-white bg-gradient-to-r from-red-500 to-amber-500">
      -{discount}%
    </div>
  );
};

// Component thẻ best seller
const BestSellerBadge = ({ isBestSeller }: { isBestSeller: boolean }) => {
  if (!isBestSeller) return null;
  
  return (
    <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-none font-medium text-xs text-white bg-gradient-to-r from-[#2C8B3D] to-[#88C140]">
      Best Seller
    </div>
  );
};

// Component hiển thị màu sắc
const ColorOptions = ({ colors }: { colors: string[] }) => {
  return (
    <div className="flex gap-1 items-center">
      {colors.map((color, i) => (
        <div key={i} className="group relative">
          <div 
            className="w-4 h-4 rounded-full border cursor-pointer hover:scale-110 transition-transform duration-200" 
            style={{ 
              backgroundColor: color === 'Đen' ? 'black' : 
                           color === 'Trắng' ? 'white' : 
                           color === 'Xanh' ? '#3B82F6' : 
                           color === 'Đỏ' ? '#EF4444' :
                           color === 'Hồng' ? '#EC4899' :
                           color === 'Xám' ? '#6B7280' :
                           color === 'Cam' ? '#F97316' :
                           color === 'Xanh rêu' ? '#4D7C0F' : '#9CA3AF'
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Component card sản phẩm
const ProductCard = ({ product, index }: { product: typeof newArrivalsData[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Format giá tiền sang VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 pb-4 flex flex-col border border-gray-100"
    >
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden">
        <div className="relative aspect-square w-full overflow-hidden">
          {product.discount > 0 && <DiscountBadge discount={product.discount} />}
          {product.isBestSeller && <BestSellerBadge isBestSeller={product.isBestSeller} />}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          
          <Image 
            src={fallbackImages[index % fallbackImages.length]} 
            alt={product.name}
            quality={90}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            draggable={false}
            priority={index < 2}
          />
        </div>
        {/* Quick action buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-center items-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
          <Button 
            size="sm" 
            variant="secondary" 
            className="rounded-full w-9 h-9 bg-white/90 hover:bg-white shadow-md backdrop-blur-sm flex items-center justify-center"
            title="Xem nhanh"
          >
            <Icon path={mdiEye} size={0.8} className="text-gray-800" />
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            className="rounded-full w-9 h-9 bg-white/90 hover:bg-white shadow-md backdrop-blur-sm flex items-center justify-center"
            title="Yêu thích"
          >
            <Icon path={mdiHeartOutline} size={0.8} className="text-gray-800" />
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            className="rounded-full w-9 h-9 bg-white/90 hover:bg-white shadow-md backdrop-blur-sm flex items-center justify-center"
            title="Thêm vào giỏ hàng"
          >
            <Icon path={mdiCartOutline} size={0.8} className="text-gray-800" />
          </Button>
        </div>
      </Link>
      
      <div className="p-4 pb-0 flex flex-col gap-1">
        <div className="text-xs font-medium text-[#2C8B3D] uppercase tracking-wider">
          {product.brand}
        </div>
        <h3 className="text-gray-900 dark:text-white font-semibold text-lg truncate group-hover:text-[#2C8B3D] transition-colors duration-200">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <div className="">
          <RatingStars rating={product.rating} />
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-bold text-lg bg-gradient-to-r from-[#2C8B3D] to-[#88C140] bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className='flex gap-1 items-center justify-between mb-4'>
            <ColorOptions colors={product.colors} />
        
        {product.stock <= 10 && (
          <div className="text-xs text-orange-600 font-medium">
            (Chỉ còn {product.stock} sản phẩm)
          </div>
        )}</div>
      </div>
      <div className="flex w-full flex-col items-center justify-end flex-1">
       <InteractiveHoverButton className='rounded-none uppercase font-normal w-fit'>
        Xem chi tiết
        <Icon path={mdiArrowRight} size={0.8} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </InteractiveHoverButton>
      </div>
    </motion.div>
  );
};

export const NewArrivals = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <section 
    style={{
        backgroundImage: 'url(/images/new-arrivals.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    }}
    className="py-20 pt-12 bg-gradient-to-b from-white to-[#F8FBF6] dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        {/* Header Section */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-[#2C8B3D] uppercase bg-[#E9F5E2] rounded-full">Mới ra mắt</span>
          <h2 className="text-3xl font-bold text-center mb-4 relative">
            <span className="inline-block relative">
              <span className="uppercase bg-gradient-to-r from-[#2C8B3D] to-[#88C140] bg-clip-text text-transparent drop-shadow-sm">
                Sản phẩm mới nhất
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>

            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Khám phá bộ sưu tập giày mới nhất với công nghệ tiên tiến và thiết kế hiện đại
          </p>
        </motion.div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivalsData.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals; 