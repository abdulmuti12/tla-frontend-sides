'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Transition } from '@headlessui/react';
import { useLockBodyScroll } from '@uidotdev/usehooks';
import { twMerge } from 'tailwind-merge';
import { useColorConfigStore } from '~/store/color-config-store';

import TLALogo from '~/components/Icons/TLALogo';
import NavbarItem from '~/components/Navbar/NavbarItem';

import BrandGrid from '../BrandGrid/BrandGrid';
import { ClickOutside } from '../ClickOutside/ClickOutside';
import { MenuBurger } from '../Icons/MenuBurger';

const whiteNavbarList = ['/about', '/project', '/press', '/promotion'];

// Implement debounce function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export default function Navbar() {
  const pathname = usePathname();
  const { config } = useColorConfigStore();
  const [scrollY, setScrollY] = useState(0);
  const [whiteNavbar, setWhiteNavbar] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoverBrands, setHoverBrands] = useState(false);
  const onScroll = () => setScrollY(window.scrollY);

  const onHoverBrands = () => setHoverBrands(true);
  const onLeaveBrands = () => setHoverBrands(false);

  useEffect(() => {
    setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const currentRouteIsWhiteNavbar = whiteNavbarList.some((route) => pathname?.startsWith(route));

    if (currentRouteIsWhiteNavbar) setWhiteNavbar(true);
    else setWhiteNavbar(false);
  }, [pathname]);

  const onToggleMenu = debounce(() => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  }, 50);

  return (
    <nav
      style={
        whiteNavbar || scrollY > 0 || isMenuOpen || hoverBrands
          ? {
              color: config.rawColor.text,
              borderColor: config.rawColor.border,
              backgroundColor: config.rawColor.bg,
            }
          : {
              color: config.rawColor.navbar,
              borderColor: 'transparent',
              backgroundColor: 'transparent',
            }
      }
      className={`fixed top-0 z-[101] flex h-16 w-screen items-center justify-center gap-20 px-3 transition-all duration-500 ease-out ${
        whiteNavbar || scrollY > 0 || isMenuOpen || hoverBrands
          ? twMerge(config.bg, config.border, config.text)
          : twMerge(`border-transparent`, config.navbar)
      }`}
    >
      {!(whiteNavbar || scrollY > 0 || isMenuOpen || hoverBrands) && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 to-transparent" />
      )}
      <NavbarItem className="hidden lg:block" href="/about">
        About Us
      </NavbarItem>
      <div
        className="peer/brands hidden h-full place-items-center lg:grid"
        onMouseEnter={onHoverBrands}
        onMouseLeave={onLeaveBrands}
      >
        <NavbarItem className="hidden lg:block">Brands</NavbarItem>
      </div>
      <div className="lg:hidden">
        <button onClick={onToggleMenu}>
          <TLALogo />
        </button>
      </div>
      <div className="hidden lg:block">
        <Link href="/">
          <TLALogo />
        </Link>
      </div>
      <NavbarItem className="hidden lg:block" href="/projects">
        Projects
      </NavbarItem>
      <NavbarItem className="hidden lg:block" href="/contact">
        Contact Us
      </NavbarItem>

      <button className="lg:hidden absolute right-3" onClick={onToggleMenu}>
        <MenuBurger />
      </button>

      {isMenuOpen && (
        <ClickOutside
          style={{
            backgroundColor: config.rawColor.bg,
            color: config.rawColor.text,
          }}
          className={twMerge(
            'absolute left-0 top-[63px] flex h-fit w-full flex-col gap-4 py-6',
            config.bg,
            config.text,
          )}
          onClick={onToggleMenu}
        >
          <NavbarItem className="w-screen" href="/" onClick={onToggleMenu}>
            Home
          </NavbarItem>
          <NavbarItem href="/about" onClick={onToggleMenu}>
            About Us
          </NavbarItem>
          <NavbarItem href="/#brands" onClick={onToggleMenu}>
            Brands
          </NavbarItem>
          <NavbarItem href="/projects" onClick={onToggleMenu}>
            Projects
          </NavbarItem>
          <NavbarItem href="/contact" onClick={onToggleMenu}>
            Contact Us
          </NavbarItem>
        </ClickOutside>
      )}
      <Transition show={hoverBrands}>
        <BrandGridMenu
          onHoverBrands={onHoverBrands}
          onLeaveBrands={onLeaveBrands}
          whiteNavbar={whiteNavbar}
          scrollY={scrollY}
          isMenuOpen={isMenuOpen}
          hoverBrands={hoverBrands}
          config={config}
        />
      </Transition>
    </nav>
  );
}

const BrandGridMenu = React.forwardRef<
  HTMLDivElement,
  {
    onHoverBrands: () => void;
    onLeaveBrands: () => void;
    whiteNavbar: boolean;
    scrollY: number;
    isMenuOpen: boolean;
    hoverBrands: boolean;
    config: any;
  }
>(({ onHoverBrands, onLeaveBrands, whiteNavbar, scrollY, isMenuOpen, hoverBrands, config }, ref) => {
  useLockBodyScroll();

  return (
    <div
      ref={ref}
      onMouseEnter={onHoverBrands}
      onMouseLeave={onLeaveBrands}
      style={
        whiteNavbar || scrollY > 0 || isMenuOpen || hoverBrands
          ? {
              borderColor: config.rawColor.border,
              backgroundColor: config.rawColor.bg,
            }
          : {
              borderColor: 'transparent',
              backgroundColor: 'transparent',
            }
      }
      className={`absolute left-0 top-[64px] hidden h-fit max-h-[calc(100vh-64px)] w-screen transition-all ease-out hover:block peer-hover/brands:block data-[closed]:opacity-0 data-[enter]:duration-500 data-[leave]:duration-700 
          ${whiteNavbar || scrollY > 0 || isMenuOpen || hoverBrands ? twMerge(config.bg, config.border, config.text) : twMerge(`border-transparent`, config.navbar)}`}
    >
      <BrandGrid clickBrandEffect={onLeaveBrands} />
    </div>
  );
});

BrandGridMenu.displayName = 'BrandGridMenu';
