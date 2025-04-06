import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiCartOutline, mdiHeartOutline } from '@mdi/js';

// Dữ liệu mẫu cho sản phẩm
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

// Format giá tiền theo VND
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

// Component thẻ sản phẩm
const ProductCard = ({ product }: { product: typeof featuredProducts[0] }) => {
  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="relative group">
        <div className="overflow-hidden">
          <Image 
            src={product.image} 
            alt={product.name} 
            width={400} 
            height={400}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-extra text-white text-xs font-semibold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="rounded-full w-8 h-8 p-0">
            <Icon path={mdiHeartOutline} size={0.8} />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
        <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
        
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-bold text-primary">{formatPrice(discountedPrice)}</span>
            {product.discount > 0 && (
              <span className="text-xs text-gray-500 line-through ml-2">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          <Button size="sm" variant="ghost" className="text-primary p-1 h-8">
            <Icon path={mdiCartOutline} size={0.9} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
            <p className="text-gray-600 mt-2">Khám phá những mẫu giày mới nhất và bán chạy nhất</p>
          </div>
          
          <Button variant="outline" className="hidden md:flex">
            Xem tất cả
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline">Xem tất cả</Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;