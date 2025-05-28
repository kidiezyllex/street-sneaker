import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiEmailOutline, mdiChevronRight, mdiCheck, mdiEmailFast } from '@mdi/js';
import { Input } from '../ui/input';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-extra/5 dark:from-primary/20 dark:via-primary/10 dark:to-extra/10">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-extra/20 rounded-full blur-3xl opacity-50"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.3, 0.5]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="relative z-10"
            >
              <Icon path={mdiEmailOutline} size={2.5} className="text-primary mx-auto mb-4" />
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-maintext dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Đăng ký nhận thông tin
            </motion.h2>
            
            <motion.p 
              className="text-maintext dark:text-gray-300 mb-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Hãy đăng ký để nhận thông tin về sản phẩm mới, Đợt khuyến mãi đặc biệt 
              và các sự kiện độc quyền từ StreetSneaker.
            </motion.p>
            
            <motion.form 
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-extra/20 rounded-[6px] blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn" 
                  className="w-full h-[41px] p-2 rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-maintext dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary relative z-10 transition-all duration-300"
                />
              </div>
              
              <Button 
                type="submit"
                className="flex items-center justify-center gap-1 min-w-[120px] relative group overflow-hidden rounded-none h-10"
              >
               Đăng ký
               <Icon path={mdiEmailFast} size={0.7} />
              </Button>
            </motion.form>
            
            <motion.p 
              className="text-sm text-maintext dark:text-maintext mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Bằng cách đăng ký, bạn đồng ý với Chính sách bảo mật của chúng tôi.
              Bạn có thể hủy đăng ký bất cứ lúc nào.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 