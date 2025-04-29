import type { Metadata } from 'next';
import './globals.css';
//                                                                                                                     import './font.css';
import NextTopLoader from 'nextjs-toploader';
import { ToastProvider } from '@/provider/ToastProvider';
import { ReactQueryClientProvider } from '@/provider/ReactQueryClientProvider';
import { UserProvider } from '@/context/useUserContext';
import "flag-icons/css/flag-icons.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css"; 
import { Manrope } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Street Sneakers',
  description: 'Street Sneakers',
  icons: {
    icon: '/images/faviconV2.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="vi" suppressHydrationWarning className={manrope.className}>
      <body className="bg-background min-h-screen">
        <ReactQueryClientProvider>
          <UserProvider>
            <NextTopLoader
              color="#2C8B3D"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              easing="ease"
              speed={200}
              showSpinner={false}
            />
            <ToastProvider />
            {children}
          </UserProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
