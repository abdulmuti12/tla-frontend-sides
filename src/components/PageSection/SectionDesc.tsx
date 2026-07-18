'use client';

import { twMerge } from 'tailwind-merge';
import { useColorConfigStore } from '~/store/color-config-store';

export default function SectionDesc({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  const { config } = useColorConfigStore();

  return (
    <div
      style={{ color: config.rawColor.accent_text }}
      className={twMerge(`flex flex-col items-start gap-6 text-base`, config.accent_text, className)}
    >
      {children}
    </div>
  );
}
