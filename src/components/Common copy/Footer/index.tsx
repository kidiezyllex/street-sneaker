import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@mdi/react';
import { mdiFacebook, mdiInstagram, mdiTwitter, mdiYoutube, mdiMapMarker, mdiPhone, mdiEmail, mdiArrowRight } from '@mdi/js';

//                                                                                                                     Component cho social media links
const SocialLink = ({ href, icon, color }: { href: string; icon: string; color: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link 
      href={href} 
      className={`block p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-${color} group transition-all duration-300`}
    >
      <Icon 
        path={icon} 
        size={1} 
        className={`text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors duration-300`}
      />
    </Link>
  </motion.div>
);

//                                                                                                                     Component cho footer links
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.li
    whileHover={{ x: 5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Link 
      href={href} 
      className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors group"
    >
      <Icon 
        path={mdiArrowRight} 
        size={0.8} 
        className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
      />
      <span>{children}</span>
    </Link>
  </motion.li>
);

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 pt-20 pb-10 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Thông tin liên hệ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">StreetSneaker</h3>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start space-x-3 text-gray-600 dark:text-gray-400"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Icon path={mdiMapMarker} size={1} className="text-primary mt-1" />
                <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
              </motion.li>
              <motion.li 
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Icon path={mdiPhone} size={1} className="text-primary" />
                <span>0123 456 789</span>
              </motion.li>
              <motion.li 
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Icon path={mdiEmail} size={1} className="text-primary" />
                <span>info@streetsneaker.com</span>
              </motion.li>
            </ul>
            
            <div className="mt-8 flex space-x-3">
              <SocialLink href="#" icon={mdiFacebook} color="blue-500" />
              <SocialLink href="#" icon={mdiInstagram} color="pink-500" />
              <SocialLink href="#" icon={mdiTwitter} color="blue-400" />
              <SocialLink href="#" icon={mdiYoutube} color="red-500" />
            </div>
          </motion.div>
          
          {/* Sản phẩm */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sản phẩm</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Giày nam</FooterLink>
              <FooterLink href="#">Giày nữ</FooterLink>
              <FooterLink href="#">Giày trẻ em</FooterLink>
              <FooterLink href="#">Phụ kiện</FooterLink>
              <FooterLink href="#">Sản phẩm mới</FooterLink>
              <FooterLink href="#">Khuyến mãi</FooterLink>
            </ul>
          </motion.div>
          
          {/* Hỗ trợ khách hàng */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Hỗ trợ</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Trung tâm hỗ trợ</FooterLink>
              <FooterLink href="#">Hướng dẫn mua hàng</FooterLink>
              <FooterLink href="#">Chính sách vận chuyển</FooterLink>
              <FooterLink href="#">Chính sách đổi trả</FooterLink>
              <FooterLink href="#">Câu hỏi thường gặp</FooterLink>
              <FooterLink href="#">Liên hệ</FooterLink>
            </ul>
          </motion.div>
          
          {/* Chính sách */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Chính sách</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Điều khoản sử dụng</FooterLink>
              <FooterLink href="#">Chính sách bảo mật</FooterLink>
              <FooterLink href="#">Chính sách thanh toán</FooterLink>
              <FooterLink href="#">Chính sách bảo hành</FooterLink>
              <FooterLink href="#">Chính sách vận chuyển</FooterLink>
              <FooterLink href="#">Chính sách đổi trả</FooterLink>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>© 2024 StreetSneaker. Tất cả quyền được bảo lưu.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 