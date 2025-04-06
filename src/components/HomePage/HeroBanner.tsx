import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '../ui/button';
import Icon from '@mdi/react';
import { mdiSale, mdiArrowRightThin } from '@mdi/js';

const InteractiveHoverButton = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="!h-10 relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white bg-primary rounded-sm group"
        >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary to-extra opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10"></span>
            <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition-all duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-extra rounded-full opacity-30 group-hover:rotate-90 ease-out -z-10"></span>
            <span className="relative z-10 flex items-center gap-1">{children}</span>
        </motion.button>
    );
};

export const HeroBanner = () => {
    return (
     <main className='max-w-[1400px] mx-auto'>
           <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#FAFBF8] to-[#FCFCF9]">
            {/* Background light effect */}
            <div className="absolute top-0 left-1/4 w-56 h-56 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-extra/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000"></div>

            <div className="py-8 px-28">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                                <span className="block text-primary">Ưu đãi khách hàng mới</span>
                            </h2>
                            <p className="text-lg text-gray-700 max-w-md">
                                Đăng ký ngay bây giờ để nhận giảm giá 20% cho đơn hàng đầu tiên của bạn!
                            </p>
                            <div className="pt-4 flex items-center gap-4">
                                <InteractiveHoverButton>
                                    Tham gia ngay<Icon path={mdiArrowRightThin} size={1} />
                                </InteractiveHoverButton>
                                <Button variant="outline" className='border border-primary text-primary h-10 hover:text-primary/80'>
                                Nhận mã giảm giá
                                <Icon path={mdiSale} size={1} />
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    <div className="order-1 md:order-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="overflow-hidden"
                        >
                            <Image
                                src={"/images/banner.png"} 
                                alt="Sneaker Collection"
                                width={600}
                                height={400}
                                quality={100}
                                draggable={false}
                                className="w-full h-auto object-cover select-none"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
     </main>
    );
};

export default HeroBanner; 