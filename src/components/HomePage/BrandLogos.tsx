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
    <section className="py-12 bg-zinc-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-16 relative">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm ">
            Các thương hiệu nổi tiếng
          </span>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </h2>
        
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          {/* First set of logos */}
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-logo-cloud">
            {logos.map((logo) => (
              <li key={logo.name} className="flex items-center justify-center w-[150px]">
                <Image
                  src={logo.url}
                  alt={logo.name}
                  width={120}
                  height={60}
                  className="max-h-12 object-contain"
                />
              </li>
            ))}
          </ul>
          
          {/* Duplicate for seamless effect */}
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-logo-cloud" aria-hidden="true">
            {logos.map((logo) => (
              <li key={logo.name} className="flex items-center justify-center w-[150px]">
                <Image
                  src={logo.url}
                  alt={logo.name}
                  width={120}
                  height={60}
                  className="max-h-12 object-contain"
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