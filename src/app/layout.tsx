import type { Metadata } from 'next';
import './globals.css';
// import './font.css';
import { ReactNode } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { ToastProvider } from '@/provider/ToastProvider';
import { ReactQueryClientProvider } from '@/provider/ReactQueryClientProvider';
import "flag-icons/css/flag-icons.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css"; 
export const metadata: Metadata = {
  title: 'StreetSneaker',
  description: 'StreetSneaker - Cửa hàng giày thể thao chính hãng',
  icons: {
    icon: '/images/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-background min-h-screen">
        <ReactQueryClientProvider>
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
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
