import React from 'react';
import Link from 'next/link';
import { Icon } from '@mdi/react';
import { mdiFacebook, mdiInstagram, mdiTwitter, mdiYoutube, mdiMapMarker, mdiPhone, mdiEmail } from '@mdi/js';

export const Footer = () => {
  return (
    <footer className="bg-white pt-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Thông tin liên hệ */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">StreetSneaker</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-600">
                <Icon path={mdiMapMarker} size={0.9} className="text-primary mt-1" />
                <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <Icon path={mdiPhone} size={0.9} className="text-primary" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <Icon path={mdiEmail} size={0.9} className="text-primary" />
                <span>info@streetsneaker.com</span>
              </li>
            </ul>
            
            <div className="mt-6 flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Icon path={mdiFacebook} size={1} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Icon path={mdiInstagram} size={1} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Icon path={mdiTwitter} size={1} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Icon path={mdiYoutube} size={1} />
              </Link>
            </div>
          </div>
          
          {/* Sản phẩm */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Giày nam
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Giày nữ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Giày trẻ em
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Phụ kiện
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Sản phẩm mới
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Khuyến mãi
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Trung tâm hỗ trợ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Phương thức thanh toán
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Về chúng tôi */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Tin tức & Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Cửa hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="py-8 mt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} StreetSneaker. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 