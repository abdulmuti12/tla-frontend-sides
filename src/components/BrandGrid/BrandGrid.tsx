import { useEffect, useMemo, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';
import { fetchBrands } from '~/api_helpers/fetchBrands';
import { useColorConfigStore } from '~/store/color-config-store';

import { isGoodContrastToBlack } from '~/hooks/contrastUtils';

import { FetchBrandsApiResponse } from '~/types/fetchBrandsApi';

import ArrowRight from '../Icons/ArrowRight';

export default function BrandGrid({ clickBrandEffect }: { clickBrandEffect?: (brandId: string) => void }) {
  const resolveImageUrl = (cdnUrl?: string) => {
    if (!cdnUrl) return '';
    if (/^https?:\/\//i.test(cdnUrl)) return cdnUrl;
    const apiHost = process.env.API_HOST || '';
    return `${apiHost}${cdnUrl.startsWith('/') ? '' : '/'}${cdnUrl}`;
  };

  const router = useRouter();
  const pathname = usePathname();
  const { config } = useColorConfigStore();
  const goodContrastToBlack = useMemo(
    () => isGoodContrastToBlack(config.rawColor.bg || '#f7f6f1'),
    [config.rawColor.bg],
  );

  const compareContrast = useMemo(() => {
    return pathname.includes('brand');
  }, [pathname]);

  const [brandDetails, setBrandDetails] = useState<FetchBrandsApiResponse['data']>([]);

  useEffect(() => {
    fetchBrands().then((data) => {
      setBrandDetails(data?.data || []);
    });
  }, []);

  const brandLength = brandDetails.length;
  const calculateGrid = (n: number) => {
    return brandLength % n === 0 ? brandLength - n : brandLength - (brandLength % n);
  };

  const grid1b = calculateGrid(1);
  const grid2b = calculateGrid(2);
  const grid4b = calculateGrid(4);

  const onClickBrand = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>, semanticLabel: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/brand/${semanticLabel}`);
    clickBrandEffect && clickBrandEffect(semanticLabel);
  };

  return (
    <div className="flex flex-wrap">
      {brandDetails.map((brand, i) => (
        <div
          key={i}
          onClick={(e) => onClickBrand(e, brand.semanticLabel)}
          className={twMerge(
            `group relative flex aspect-square basis-full flex-col items-center border-black/30 px-7 py-10 transition-all duration-300 hover:cursor-pointer md:basis-1/2 md:border-r-[0.25px] lg:basis-1/4`,
            grid1b > 0 ? `max-md:[&:nth-child(-n+6)]:border-b-[0.25px]` : '',
            grid2b > 0 ? `max-lg:[&:nth-child(-n+6)]:border-b-[0.25px]` : '',
            grid4b > 0 ? `lg:[&:nth-child(-n+4)]:border-b-[0.25px]` : '',
            'max-lg:[&:nth-child(2n)]:border-r-0',
            'lg:[&:nth-child(4n)]:border-r-0',
          )}
        >
          <div className="absolute left-0 top-0 h-full w-full opacity-0 group-hover:opacity-100">
            <img
              src={resolveImageUrl(brand.heroImage?.cdnUrl) || resolveImageUrl(brand.logo?.cdnUrl) || '/assets/brand_placeholder.png'}
              alt={brand.name}
              className="h-full w-full object-cover transition-all duration-200 ease-in-out "
            />
            <div className="absolute inset-0 bg-black opacity-60 transition-all duration-200"></div>
          </div>
          <div className="grid flex-1 place-items-center">
            <img
              src={resolveImageUrl(brand.logo?.cdnUrl) ?? ''}
              alt={brand.name}
              className={twMerge(
                'relative max-h-[140px] scale-[0.8] transition-all duration-200 ease-in-out group-hover:invert group-hover:max-h-[60px]',
                compareContrast ? (goodContrastToBlack ? '' : 'invert') : '',
              )}
            />
          </div>
          <div className="z-10 mb-4 line-clamp-2 hidden text-center text-xs leading-5 text-white/70 transition-all duration-200 group-hover:block lg:mb-10 lg:text-xs">
            {brand.story?.title?.slice(0, 80) ?? ''}
            {(brand.story?.title?.length ?? 0) > 80 ? '...' : ''}
          </div>
          <Button
            onClick={(e) => onClickBrand(e, brand.semanticLabel)}
            className="z-10 hidden items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs tracking-[0.08] text-white transition-all duration-200 hover:border-BG/Cream hover:bg-BG/Cream hover:text-black group-hover:flex"
          >
            <span className="uppercase">View Detail</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}

// const brandDetails = [
//   {
//     logo: "/assets/brand_logo/Casa_Italia.png",
//     bg: "/assets/brand_logo/Casa_Italia_BG.jpg",
//   },
//   {
//     logo: "/assets/brand_logo/Homelogy.png",
//     bg: "/assets/brand_logo/Homelogy_BG.jpg",
//   },
//   {
//     logo: "/assets/brand_logo/Melba.png",
//     bg: "/assets/brand_logo/Melba_BG.jpg",
//   },
//   {
//     logo: "/assets/brand_logo/Masterpiece.png",
//     bg: "/assets/brand_logo/Masterpiece_BG.jpg",
//   },
//   {
//     logo: "/assets/brand_logo/Polflex_Office.png",
//     bg: "/assets/brand_logo/Polflex_Office_BG.jpg",
//   },
//   {
//     logo: "/assets/brand_logo/Jands.png",
//     bg: "/assets/brand_logo/Jands_BG.jpg",
//   },
//   {
//     logo: "/assets/brand_logo/Archtemy.png",
//     bg: "/assets/brand_logo/Archtemy_BG.jpg",
//   },
// ];
