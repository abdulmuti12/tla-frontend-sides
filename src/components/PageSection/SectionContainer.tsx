'use client';

import { twMerge } from 'tailwind-merge';
import { useColorConfigStore } from '~/store/color-config-store';

export default function SectionContainer({
  children,
  className,
  id,
  style,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}>) {
  const { config } = useColorConfigStore();
  return (
    <div
      id={id}
      style={style}
      className={twMerge(
        config.bg,
        config.border,
        config.text,
        'w-full overflow-visible px-8 pb-12 pt-[60px] md:px-20',
        className,
      )}
    >
      {children}
    </div>
  );
}
