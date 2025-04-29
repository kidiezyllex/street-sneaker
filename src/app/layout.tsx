import type { Metadata } from 'next';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import { ToastProvider } from '@/provider/ToastProvider';
import { ReactQueryClientProvider } from '@/provider/ReactQueryClientProvider';
import { UserProvider } from '@/context/useUserContext';
import "flag-icons/css/flag-icons.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
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
    <html lang="vi" suppressHydrationWarning className={poppins.className}>
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
