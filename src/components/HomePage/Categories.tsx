import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Dữ liệu mẫu cho danh mục
const categories = [
  {
    id: 1,
    name: 'Giày thể thao nam',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    productCount: 120,
    slug: 'giay-the-thao-nam',
  },
  {
    id: 2,
    name: 'Giày chạy bộ',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    productCount: 85,
    slug: 'giay-chay-bo',
  },
  {
    id: 3,
    name: 'Giày thể thao nữ',
    image: 'https://images.unsplash.com/photo-1585591359088-e144e8a61170?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    productCount: 95,
    slug: 'giay-the-thao-nu',
  },
  {
    id: 4,
    name: 'Giày thời trang',
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    productCount: 70,
    slug: 'giay-thoi-trang',
  },
];

const CategoryCard = ({ category }: { category: typeof categories[0] }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-xl"
    >
      <Link href={`/categories/${category.slug}`} className="block group">
        <div className="aspect-[4/5] relative overflow-hidden">
          <Image 
            src={category.image} 
            alt={category.name} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-1">{category.name}</h3>
              <p className="text-gray-200 text-sm">{category.productCount} sản phẩm</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const Categories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Danh mục sản phẩm</h2>
            <p className="text-gray-600 mt-2">Khám phá sản phẩm theo từng danh mục</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories; 