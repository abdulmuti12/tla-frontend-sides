'use client';

import { useMemo } from 'react';

import Link from 'next/link';

import { twMerge } from 'tailwind-merge';
import { useColorConfigStore } from '~/store/color-config-store';
import { useHomepageConfigStore } from '~/store/homepage-config-store';

export default function FooterCopyright() {
  // const currentYear = new Date().getFullYear();

  const { homepageConfig } = useHomepageConfigStore();
  const { config } = useColorConfigStore();

  const copyrightLinks = useMemo(
    () => [
      {
        href: homepageConfig?.data?.termsAndConditionsUrl || '#',
        title: 'Terms & Conditions',
      },
      {
        href: homepageConfig?.data?.privacyPolicyUrl || '#',
        title: 'Privacy Policy',
      },
    ],
    [homepageConfig],
  );

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
        'flex w-full flex-col items-center justify-between gap-2 border-t px-6 py-4 text-sm md:flex-row md:px-20 lg:gap-8',
      )}
    >
      <p style={{ color: config.rawColor.accent_text }} className={twMerge(config.accent_text, 'text-sm leading-6')}>
        {`©️ Copyright PT Lamborghini Casa Indonesia 2025`}
      </p>
      <div className="flex gap-6 leading-6">
        {copyrightLinks.map(({ href, title }) => (
          <Link
            key={title}
            href={href}
            className="w-fit border-b border-transparent transition-all duration-150 hover:border-current"
          >
            {title}
          </Link>
        ))}
      </div>
    </div>
  );
}
