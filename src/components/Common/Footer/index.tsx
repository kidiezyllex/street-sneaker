import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icon } from '@mdi/react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { mdiMapMarker, mdiEmail, mdiArrowRight } from '@mdi/js';

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
 
  const socialLinks = [
    { name: 'linkedin', href: 'https://www.linkedin.com/company/street-sneakers/', src: '/images/linkedin.png', width: 60, height: 60 },
    { name: 'google-play', href: 'https://play.google.com/store/apps/dev?id=8799588644277179294&hl', src: '/images/google-play.png', width: 60, height: 60 },
    { name: 'app-store', href: 'https://apps.apple.com/us/developer/commandoo-joint-stock-company/id1561328863', src: '/images/app-store.png', width: 60, height: 60 },
    { name: 'facebook', href: 'https://www.facebook.com/street-sneakers', src: '/images/facebook.png', width: 60, height: 60 },
    { name: 'tiktok', href: 'https://www.tiktok.com/@street-sneakers', src: '/images/tiktok.png', width: 60, height: 60 },
  ];

  return (
    <>
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
                className="w-14 mb-4 lg:w-20 lg:mb-10"
                quality={100}
                draggable={false}
              />
              <p className="text-sm mb-4 lg:mb-10 lg:text-lg">©2023 Street Sneakers. All Rights Reserved.</p>
            </div>

            <div className="w-1/2 pr-24 pl-3 sm:pr-36">
              <h2 className="text-xl font-bold mb-5 lg:text-2xl lg:mb-7">Contact Info</h2>
              <p className="flex justify-start items-start text-lg mb-3 lg:text-lg lg:mb-5">
                <Icon path={mdiMapMarker} size={1} className="mr-3" />
                <span className="overflow-hidden flex-1">D29, Pham Van Bach Street, Cau Giay District, Ha Noi, Vietnam</span>
              </p>
              <p className="flex justify-start items-start text-lg lg:text-lg">
                <Icon path={mdiEmail} size={1} className="mr-3" />
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
          <div className="gap-4 sm:hidden flex justify-center items-center mt-3">
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