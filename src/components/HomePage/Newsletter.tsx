import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiEmailOutline, mdiChevronRight } from '@mdi/js';

export const Newsletter = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/10 to-extra/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Icon path={mdiEmailOutline} size={2} className="text-primary mx-auto mb-4" />
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Đăng ký nhận thông tin
            </h2>
            
            <p className="text-gray-600 mb-8">
              Hãy đăng ký để nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt 
              và các sự kiện độc quyền từ StreetSneaker.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <input 
                  type="email" 
                  placeholder="Email của bạn" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              
              <Button className="flex items-center justify-center gap-1">
                <span>Đăng ký</span>
                <Icon path={mdiChevronRight} size={0.8} />
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Bằng cách đăng ký, bạn đồng ý với Chính sách bảo mật của chúng tôi.
              Bạn có thể hủy đăng ký bất cứ lúc nào.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 