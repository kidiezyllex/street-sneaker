import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icon } from '@mdi/react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { mdiMapMarker, mdiEmail, mdiArrowRight } from '@mdi/js';

// Component cho social media links
const SocialLink = ({ href, icon }: { href: string; icon: JSX.Element }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link 
      href={href}
      target="_blank"
      className="block w-6"
    >
      {icon}
    </Link>
  </motion.div>
);
export const Footer = () => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
        }
      }
    ]
  };

  const partnerLogos = [
    { name: 'unity', src: '/images/brand1.png', width: 676, height: 246 },
    { name: 'facebook', src: '/images/brand2.png', width: 500, height: 101 },
    { name: 'google', src: '/images/brand3.png', width: 500, height: 169 },
    { name: 'mintegral', src: '/images/brand4.png', width: 533, height: 100 },
    { name: 'layer11', src: '/images/brand5.png', width: 390, height: 71 },
    { name: 'adcolony', src: '/images/brand6.png', width: 600, height: 166 },
    { name: 'huawei', src: '/images/brand7.png', width: 500, height: 110 },
    { name: 'ironsource', src: '/images/brand8.png', width: 1200, height: 236 },
  ];
  
  const socialLinks = [
    { name: 'linkedin', href: 'https://www.linkedin.com/company/street-sneakers/', src: '/images/linkedin.png', width: 60, height: 60 },
    { name: 'google-play', href: 'https://play.google.com/store/apps/dev?id=8799588644277179294&hl', src: '/images/google-play.png', width: 60, height: 60 },
    { name: 'app-store', href: 'https://apps.apple.com/us/developer/commandoo-joint-stock-company/id1561328863', src: '/images/app-store.png', width: 60, height: 60 },
    { name: 'facebook', href: 'https://www.facebook.com/street-sneakers', src: '/images/facebook.png', width: 60, height: 60 },
    { name: 'tiktok', href: 'https://www.tiktok.com/@street-sneakers', src: '/images/tiktok.png', width: 60, height: 60 },
  ];

  return (
    <>
      {/* Partners section */}
      <footer className="py-10 bg-[#F8F5F6] overflow-x-hidden">
        <div className="max-w-[2150px] mx-auto">
          <Slider {...sliderSettings} className="w-full gap-3">
            {partnerLogos.map((logo, index) => (
              <div key={index} className="h-9 overflow-hidden">
                <Image
                quality={100}
                  src={logo.src}
                  alt="logo"
                  width={logo.width}
                  height={logo.height}
                  className="mx-auto h-full object-contain"
                />
              </div>
            ))}
          </Slider>
        </div>
      </footer>

      {/* Main footer */}
      <footer className="footer pb-5 pt-14 bg-primary text-white">
        <div className="max-width mx-auto">
          {/* Mobile view */}
          <div className="flex flex-col justify-center items-center px-12 sm:hidden">
            <Image
              src="/images/footer-logo.png"
              alt="Logo"
              width={200}
              height={134}
              className="w-20 mb-3"
              quality={100}
              draggable={false}
            />
            <Icon path={mdiMapMarker} size={1.5} className="mb-3" />
            <p className="text-center mb-3">D29, Pham Van Bach Street, Cau Giay District, Ha Noi, Vietnam</p>
            
            <Icon path={mdiEmail} size={1.5} className="mb-3" />
            <p className="text-center mb-3">streetstore@gmail.com</p>
          </div>

          {/* Desktop view */}
          <div className="justify-start items-start hidden sm:flex">
            <div className="w-1/2 pl-24 pr-3 sm:pl-36">
              <Image
                src="/images/footer-logo.png"
                alt="Logo"
                width={200}
                height={134}
                className="w-14 mb-6 lg:w-20 lg:mb-10"
                quality={100}
                draggable={false}
              />
              <p className="text-sm mb-6 lg:mb-10 lg:text-lg">©2023 Street Sneakers. All Rights Reserved.</p>
              
              <div className="gap-5 flex justify-start items-center">
                {socialLinks.map((link, index) => (
                  <SocialLink 
                    key={index}
                    href={link.href}
                    icon={
                      <Image
                        src={link.src}
                        alt="link"
                        width={link.width}
                        height={link.height}
                        className="w-6"
                      />
                    }
                  />
                ))}
              </div>
            </div>

            <div className="w-1/2 pr-24 pl-3 sm:pr-36">
              <h2 className="text-xl font-bold mb-5 lg:text-2xl lg:mb-7">Contact Info</h2>
              <p className="flex justify-start items-start text-lg mb-3 lg:text-lg lg:mb-5">
                <Icon path={mdiMapMarker} size={1.2} className="mr-3" />
                <span className="overflow-hidden flex-1">D29, Pham Van Bach Street, Cau Giay District, Ha Noi, Vietnam</span>
              </p>
              <p className="flex justify-start items-start text-lg lg:text-lg">
                <Icon path={mdiEmail} size={1.2} className="mr-3" />
                <span className="overflow-hidden flex-1">streetstore@gmail.com</span>
              </p>
            </div>
          </div>

          {/* Footer links - Desktop */}
          <div className="hidden sm:flex justify-center items-end mt-10">
            <span className="mx-3">Terms and Conditions</span>
            <span className="mx-3">Privacy Policy</span>
            <span className="mx-3">Copyright</span>
            <span className="mx-3">Community</span>
          </div>

          {/* Social links - Mobile */}
          <div className="gap-5 sm:hidden flex justify-center items-center mt-3">
            {socialLinks.map((link, index) => (
              <a key={index} href={link.href} target="_blank" rel="noreferrer">
                <Image
                  src={link.src}
                  alt="link"
                  width={link.width}
                  height={link.height}
                  className="w-6"
                />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer; 