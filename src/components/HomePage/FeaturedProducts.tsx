import React from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiCartOutline, mdiHeartOutline, mdiArrowRight } from '@mdi/js';
import { useRef } from 'react';

//                                                                                                                     Dữ liệu mẫu cho sản phẩm
const featuredProducts = [
  {
    id: 1,
    name: 'Nike Air Max 270',
    price: 3200000,
    image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/1ed1da68-3266-46ef-9388-35bc1ca01986/air-max-270-shoes-0rmdjC.png',
    category: 'Giày thể thao',
    discount: 10,
  },
  {
    id: 2,
    name: 'Adidas Ultraboost 21',
    price: 4500000,
    image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/96a5f085ef594e29a5f2acb6011e3d4d_9366/Giay_Ultraboost_21_Tokyo_trang_S23840_01_standard.jpg',
    category: 'Giày chạy bộ',
    discount: 15,
  },
  {
    id: 3,
    name: 'Puma RS-X³',
    price: 2800000,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/368715/01/sv01/fnd/PNA/fmt/png/RS-X%C2%B3-TWILL-AIR-MESH-Shoes',
    category: 'Giày thời trang',
    discount: 0,
  },
  {
    id: 4,
    name: 'New Balance 990v5',
    price: 4200000,
    image: 'https://nb.scene7.com/is/image/NB/m990gl5_nb_02_i?$pdpflexf2$&wid=440&hei=440',
    category: 'Giày thể thao',
    discount: 5,
  },
];

//                                                                                                                     Format giá tiền theo VND
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

//                                                                                                                     Component thẻ sản phẩm
const ProductCard = ({ product, index }: { product: typeof featuredProducts[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group bg-white dark:bg-gray-800 rounded-[6px] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative">
        <div className="overflow-hidden aspect-square">
          <Image 
            src={product.image} 
            alt={product.name} 
            width={400} 
            height={400}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        
        {product.discount > 0 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 left-3 bg-extra text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg"
          >
            -{product.discount}%
          </motion.div>
        )}
        
        <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full w-10 h-10 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-lg"
          >
            <Icon path={mdiHeartOutline} size={1} className="text-maintext dark:text-gray-300" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full w-10 h-10 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-lg"
          >
            <Icon path={mdiCartOutline} size={1} className="text-maintext dark:text-gray-300" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-sm text-maintext dark:text-maintext mb-2">{product.category}</div>
        <h3 className="font-semibold text-maintext dark:text-white text-lg mb-3 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        
        <div className="flex items-baseline justify-between">
          <div className="space-y-1">
            <span className="font-bold text-primary text-lg">{formatPrice(discountedPrice)}</span>
            {product.discount > 0 && (
              <span className="text-sm text-maintext dark:text-maintext line-through block">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const FeaturedProducts = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-maintext dark:text-white mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-maintext dark:text-gray-300 max-w-2xl mx-auto">
            Khám phá những mẫu giày mới nhất và bán chạy nhất từ các thương hiệu hàng đầu
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <Button 
            variant="outline" 
            className="group border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            Xem tất cả sản phẩm
            <Icon path={mdiArrowRight} size={1} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;