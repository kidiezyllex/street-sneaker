import React from 'react';
import Image from 'next/image';

const logos = [
  {
    name: 'Nike',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
  },
  {
    name: 'Adidas',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
  },
  {
    name: 'Puma',
    url: 'https://upload.wikimedia.org/wikipedia/fr/thumb/4/49/Puma_AG.svg/1280px-Puma_AG.svg.png',
  },
  {
    name: 'New Balance',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/New_Balance_logo.svg/2560px-New_Balance_logo.svg.png',
  },
  {
    name: 'Converse',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg',
  },
  {
    name: 'Vans',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Vans-logo.svg/2560px-Vans-logo.svg.png',
  },
  {
    name: 'Reebok',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Reebok_2019_logo.svg/2560px-Reebok_2019_logo.svg.png',
  },
  {
    name: 'Asics',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Asics_Logo.svg/2560px-Asics_Logo.svg.png',
  },
  {
    name: 'Salomon',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Salomon_logo.svg/2560px-Salomon_logo.svg.png',
  },
  {
    name: 'Hoka One One',
    url: 'https://upload.wikimedia.org/wikipedia/fr/thumb/2/21/Logo_Hoka_One_One.svg/2560px-Logo_Hoka_One_One.svg.png',
  },
  {
    name: 'Onitsuka Tiger',
    url: 'https://upload.wikimedia.org/wikipedia/en/8/87/Onitsuka_Tiger_Logo.svg',
  },
];

export const BrandLogos = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 relative overflow-hidden">
         <h2 className="text-2xl font-bold text-center mb-8 relative">
          <span className="uppercase bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm ">
            Các thương hiệu nổi tiếng
          </span>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </h2>
      {/* Hiệu ứng bong bóng trang trí */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute h-20 w-20 rounded-full bg-primary/70 top-12 left-[10%]"></div>
        <div className="absolute h-24 w-24 rounded-full bg-secondary/80 top-36 right-[15%]"></div>
        <div className="absolute h-16 w-16 rounded-full bg-primary/40 bottom-10 left-[20%]"></div>
        <div className="absolute h-32 w-32 rounded-full bg-secondary/70 -bottom-10 right-[25%]"></div>
        <div className="absolute h-28 w-28 rounded-full bg-primary/70 -top-10 left-[40%]"></div>
        <div className="absolute h-12 w-12 rounded-full bg-secondary/40 top-1/2 left-[5%]"></div>
        <div className="absolute h-14 w-14 rounded-full bg-primary/80 bottom-1/3 right-[10%]"></div>
        <div className="absolute h-10 w-10 rounded-full bg-secondary/70 top-1/4 right-[30%]"></div>
        <div className="absolute h-36 w-36 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 -bottom-16 left-[30%] blur-sm"></div>
        <div className="absolute h-40 w-40 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 -top-20 right-[20%] blur-sm"></div>
      </div>
      <div className="container mx-auto relative z-10">
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          {/* First set of logos */}
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-logo-cloud">
            {logos.map((logo) => (
              <li key={logo.name} className="flex items-center justify-center w-[150px]">
                <Image
                  draggable={false}
                  src={logo.url}
                  alt={logo.name}
                  width={120}
                  height={60}
                  className="max-h-12 object-contain select-none"
                />
              </li>
            ))}
          </ul>
          
          {/* Duplicate for seamless effect */}
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-logo-cloud" aria-hidden="true">
            {logos.map((logo) => (
              <li key={logo.name} className="flex items-center justify-center w-[150px]">
                <Image
                  draggable={false}
                  src={logo.url}
                  alt={logo.name}
                  width={120}
                  height={60}
                  className="max-h-12 object-contain select-none"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BrandLogos; 