import { useMemo } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { twMerge } from 'tailwind-merge';

export default function NavbarItem({
  className,
  href = '#',
  children,
  onClick,
}: {
  className?: string;
  href?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  const currentPath = usePathname();
  const onBrandPage = useMemo(() => {
    return currentPath.includes('/brand');
  }, [currentPath]);
  const isBrandMenuItem = useMemo(() => {
    return children?.toString().includes('Brand');
  }, [children]);

  return (
    <button
      id="nav_item"
      className={twMerge(
        'cursor-pointer text-center font-sans text-base uppercase leading-[1.26] tracking-[0.08] lg:text-xs',
        className,
      )}
      onClick={onClick}
    >
      <Link
        href={href}
        className={twMerge(
          'inline-block border-b border-b-transparent pb-2 transition-all duration-75 hover:border-b-current',
          currentPath === href ? 'border-b-current' : '',
          onBrandPage && isBrandMenuItem ? 'border-b-current' : '',
        )}
      >
        {children}
      </Link>
    </button>
  );
}
