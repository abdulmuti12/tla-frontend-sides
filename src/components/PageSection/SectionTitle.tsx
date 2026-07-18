'use client';

import { twMerge } from 'tailwind-merge';
import { useColorConfigStore } from '~/store/color-config-store';

export default function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  const { config } = useColorConfigStore();
  return (
    <h5
      style={{ color: config.rawColor.accent_text }}
      className={twMerge(
        config.accent_text,
        `mb-2 text-sm font-medium uppercase leading-normal tracking-[0.08] md:text-base`,
        className,
      )}
    >
      {children}
    </h5>
  );
}
