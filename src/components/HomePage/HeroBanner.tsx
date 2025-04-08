import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '../ui/button';
import Icon from '@mdi/react';
import { mdiSale, mdiArrowRightThin } from '@mdi/js';
import { InteractiveHoverButton } from '../Common/InteractiveHoverButton';
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