'use client';

import { twMerge } from 'tailwind-merge';
import { useColorConfigStore } from '~/store/color-config-store';

export default function FooterLinksSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const { config } = useColorConfigStore();

  return (
    <div
      style={{
        backgroundColor: config.rawColor.bg,
        borderColor: config.rawColor.border,
        color: config.rawColor.secondaryText,
      }}
      className={twMerge(
        config.bg,
        config.border,
        config.text,
        'flex w-full flex-col gap-6 p-6 md:gap-[60px] md:border-l md:p-10',
        className,
      )}
    >
      {children}
    </div>
  );
}
