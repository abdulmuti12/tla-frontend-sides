'use client';

import { useEffect } from 'react';

import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import { usePathname } from 'next/navigation';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ConfigProvider } from 'antd';
import { Toaster } from 'sonner';
import { fetchHomePageConfig } from '~/api_helpers/fetchHomePageConfig';
import { useHomepageConfigStore } from '~/store/homepage-config-store';

import Footer from '~/components/Footer/Footer';
import NewsletterModal from '~/components/HomePage/NewsletterModal';
import Navbar from '~/components/Navbar/Navbar';

const PlustJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
});

const ComorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant-garamond',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const adminPage = '__admin';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { setHomepageConfig } = useHomepageConfigStore();

  useEffect(() => {
    fetchHomePageConfig().then(setHomepageConfig);
  }, [setHomepageConfig]);

  if (pathname.split('/')[1] === adminPage) {
    return (
      <html lang="en" className={`${PlustJakartaSans.variable} ${ComorantGaramond.variable}`}>
        <body>
          <ConfigProvider theme={{ components: { Tabs: { colorPrimary: '#000' } } }}>{children}</ConfigProvider>
        </body>
      </html>
    );
  }

  return (
    <html
      lang="en"
      className={`${PlustJakartaSans.variable} ${ComorantGaramond.variable} bg-BG/Cream font-sans text-black/100`}
    >
      <body>
        <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'rgb(32,32,32)' } } }}>
          <Navbar />
          <NewsletterModal />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
          <Toaster toastOptions={{ className: 'bg-BG/Cream text-black/100' }} />
        </ConfigProvider>
      </body>
    </html>
  );
}
