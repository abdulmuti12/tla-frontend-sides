import { Metadata } from 'next';

import RootLayout from '~/components/RootLayout/RootLayout';

import './globals.css';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayout>{children}</RootLayout>;
}

export const metadata: Metadata = {
  title: 'The Luxury Asia',
  description: 'The Luxury Asia Group',
};
