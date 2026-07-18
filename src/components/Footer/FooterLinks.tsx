'use client';

import Link from 'next/link';

import { twMerge } from 'tailwind-merge';
import { useColorConfigStore } from '~/store/color-config-store';

export interface FooterLinksProps {
  className?: string;
  title: string;
  links: {
    href: string;
    title: string;
    target?: string;
    rel?: string;
  }[];
}

export default function FooterLinks({ title, links, className }: FooterLinksProps) {
  const { config } = useColorConfigStore();
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <h5
        style={{ color: config.rawColor.accent_text }}
        className={twMerge(config.accent_text, 'text-xs font-medium leading-normal tracking-[0.08]')}
      >
        {title}
      </h5>
      {links.map(({ href, title, target, rel }) => (
        <Link
          key={`${title}-${href}`}
          rel={rel}
          href={href}
          target={target}
          className="w-fit border-b border-transparent transition-all duration-150 hover:border-current"
        >
          {title}
        </Link>
      ))}
    </div>
  );
}
