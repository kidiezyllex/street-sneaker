import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Dữ liệu mẫu cho phần đánh giá
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

// Component card đánh giá
const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-4 mb-4">
        <Image 
          src={testimonial.avatar} 
          alt={testimonial.name} 
          width={50} 
          height={50}
          className="rounded-full" 
        />
        <div>
          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>
      
      <div className="mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xl ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
      
      <p className="text-gray-700">{testimonial.content}</p>
    </motion.div>
  );
};

export const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-zinc-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Khách hàng nói gì về chúng tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn lắng nghe và cải thiện dịch vụ dựa trên phản hồi của khách hàng
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 