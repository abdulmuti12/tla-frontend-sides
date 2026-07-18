'use client';

import { twMerge } from 'tailwind-merge';
import { useColorConfigStore } from '~/store/color-config-store';

export default function SectionQuote({ children, className }: { children: React.ReactNode; className?: string }) {
  const { config } = useColorConfigStore();
  return (
    <div
      style={{ color: config.rawColor.text }}
      className={twMerge(`font-serif text-[32px] italic leading-none lg:text-[68px] ${className}`)}
    >
      {children}
    </div>
  );
}
