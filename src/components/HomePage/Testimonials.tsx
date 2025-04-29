import React from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Icon } from '@mdi/react';
import { mdiStar, mdiStarHalfFull, mdiStarOutline } from '@mdi/js';

//                                                                                                                     Dữ liệu mẫu cho phần đánh giá
const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    role: 'Người yêu giày',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content: 'Tôi rất hài lòng với chất lượng giày và dịch vụ khách hàng tại StreetSneaker. Sản phẩm đúng như mô tả và được giao hàng nhanh chóng.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Trần Thị B',
    role: 'Người chạy bộ',
    avatar: 'https://i.pravatar.cc/150?img=5',
    content: 'Đã mua nhiều đôi giày chạy bộ tại đây và chưa bao giờ thất vọng. Giày thoải mái, bền và giá cả hợp lý.',
    rating: 4,
  },
  {
    id: 3,
    name: 'Lê Văn C',
    role: 'Vận động viên',
    avatar: 'https://i.pravatar.cc/150?img=12',
    content: 'StreetSneaker luôn có những mẫu giày thể thao mới nhất và chính hãng. Tôi tin tưởng và sẽ tiếp tục mua sắm tại đây.',
    rating: 5,
  },
];

//                                                                                                                     Component hiển thị sao đánh giá
const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        if (starValue <= rating) {
          return (
            <Icon 
              key={i} 
              path={mdiStar} 
              size={1.2} 
              className="text-yellow-400" 
            />
          );
        } else if (starValue - 0.5 <= rating) {
          return (
            <Icon 
              key={i} 
              path={mdiStarHalfFull} 
              size={1.2} 
              className="text-yellow-400" 
            />
          );
        } else {
          return (
            <Icon 
              key={i} 
              path={mdiStarOutline} 
              size={1.2} 
              className="text-gray-300" 
            />
          );
        }
      })}
    </div>
  );
};

//                                                                                                                     Component card đánh giá
const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-extra/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
          <Image 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            width={60} 
            height={60}
            className="rounded-full relative z-10 border-2 border-white dark:border-gray-700" 
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{testimonial.name}</h4>
          <p className="text-sm text-gray-400 dark:text-gray-400">{testimonial.role}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <RatingStars rating={testimonial.rating} />
      </div>
      
      <div className="relative">
        <div className="absolute -top-2 -left-2 text-4xl text-primary/10 dark:text-primary/20">"</div>
        <p className="text-gray-700 dark:text-gray-300 relative z-10">{testimonial.content}</p>
        <div className="absolute -bottom-2 -right-2 text-4xl text-primary/10 dark:text-primary/20">"</div>
      </div>
    </motion.div>
  );
};

export const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-20 bg-gradient-to-b from-zinc-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Chúng tôi luôn lắng nghe và cải thiện dịch vụ dựa trên phản hồi của khách hàng
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 