'use client';

import Link from 'next/link';

import { twMerge } from 'tailwind-merge';
import { useColorConfigStore } from '~/store/color-config-store';

export interface PressReleaseItemProps {
  className?: string;
  id: string;
  image: string;
  title: string;
  brand?: string;
  subTitle?: string;
}

export default function PressReleaseItem({ id, className, image, title, brand, subTitle }: PressReleaseItemProps) {
  const { config } = useColorConfigStore();

  return (
    <Link
      href={`/press/${id}`}
      className={twMerge(
        `group relative mb-[122px] min-w-40 max-w-[80vw] flex-shrink-0 first:ml-8 md:first:ml-20 last:mr-8 md:last:mr-20`,
        className,
      )}
    >
      <img src={image} alt="Press Release 1" />
      <div className="absolute top-full w-fit mt-4 flex flex-col items-start gap-1">
        {brand && (
          <h6
            style={{ color: config.rawColor.accent_text }}
            className={twMerge(config.accent_text, 'text-xs font-medium uppercase tracking-[0.08]')}
          >
            {brand}
          </h6>
        )}
        <h5
          style={{ color: config.rawColor.secondaryText }}
          className={twMerge(
            config.text,
            'line-clamp-2 border-b border-transparent text-xl font-bold leading-snug transition-all duration-150 group-hover:border-current',
          )}
        >
          {title}
        </h5>
        {subTitle && (
          <p
            style={{ color: config.rawColor.accent_text }}
            className={twMerge(config.accent_text, 'text-sm leading-6')}
          >
            {subTitle}
          </p>
        )}
      </div>
    </Link>
  );
}
