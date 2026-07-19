'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { twMerge } from 'tailwind-merge';
import { fetchBrandBySemanticLabel } from '~/api_helpers/fetchBrandBySemanticLabel';
import { fetchDesignerByBrandId } from '~/api_helpers/fetchDesignerByBrandId';
import { useColorConfigStore } from '~/store/color-config-store';

import useImageContrastColor from '~/hooks/userImageContrastColor';

import { FetchBrandByIdApiResponse } from '~/types/fetchBrandByIdApi';
import { FetchDesignerByBrandIdResponse } from '~/types/fetchDesignerByBrandId';

import ImageWithFade from '../Animation/ImageWithFade';
import DesignerSidebar from '../DesignerSidebar/DesignerSidebar';
import PressRelease from '../HomePage/PressRelease';
import ArrowRight from '../Icons/ArrowRight';
import SectionGalery from '../SectionGalery/SectionGalery';
import { resolveLocalImage, resolveImageUrl } from '~/helpers/resolveLocalImage';

export default function BrandPage({ semanticBrandName }: { semanticBrandName: string }) {
  const router = useRouter();
  const { config, setConfig, resetConfig } = useColorConfigStore();
  const [brandDetail, setBrandDetail] = useState<Partial<FetchBrandByIdApiResponse['data']>>();
  const [brandDesigners, setBrandDesigners] = useState<Partial<FetchDesignerByBrandIdResponse['data']>>([]);
  const [designerIndex, setDesignerIndex] = useState(0);
  const [designerSidebarIsOpen, setDesignerSidebarIsOpen] = useState(false);

  const [contrastColor, textColor] = useImageContrastColor(brandDetail?.backgroundColor);

  const [subBrands, setSubBrands] = useState<Partial<FetchBrandByIdApiResponse['data']['subBrands']>>([]);
  const [subBrandIndex, setSubBrandIndex] = useState(0);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const onClickDesigner = (index: number) => {
    setDesignerIndex(index);
    setDesignerSidebarIsOpen(true);
  };

  const onNextDesigner = () => {
    if (designerIndex === brandDesigners.length - 1) return;
    setDesignerIndex((prev) => prev + 1);
  };

  const onPreviousDesigner = () => {
    if (designerIndex === 0) return;
    setDesignerIndex((prev) => prev - 1);
  };

  const onNextImage = () => {
    if (subBrandIndex === subBrands.length - 1) {
      setSubBrandIndex(0);
    } else setSubBrandIndex((prev) => prev + 1);
  };

  const onPrevImage = () => {
    if (subBrandIndex === 0) {
      setSubBrandIndex(subBrands.length - 1);
    } else setSubBrandIndex((prev) => prev - 1);
  };

  useEffect(() => {
    fetchBrandBySemanticLabel(semanticBrandName).then((data) => {
      setBrandDetail(data?.data);
      setSubBrands(data?.data?.subBrands ?? []);
    });
  }, [semanticBrandName]);

  useEffect(() => {
    if (!brandDetail || !brandDetail?.id) return;
    fetchDesignerByBrandId(brandDetail.id).then((data) => {
      setBrandDesigners(data?.data ?? []);
    });
  }, [brandDetail]);

  useEffect(() => {
    // This is not final behaviour just to simulate
    setConfig({
      text: 'text-white/100',
      bg: 'bg-black/100',
      border: 'white/30',
      accent_text: 'text-white/50',
      navbar: 'text-black/100',
      rawColor: {
        text: brandDetail?.primaryColor ?? brandDetail?.fontType,
        secondaryText: brandDetail?.secondaryColor ?? brandDetail?.fontType,
        bg: brandDetail?.backgroundColor,
        border: `${brandDetail?.secondaryColor ?? brandDetail?.fontType}30`,
        accent_text: `${brandDetail?.secondaryColor ?? brandDetail?.fontType}50`,
        navbar: brandDetail?.fontType,
      },
    });

    // Cleanup function to reset config when component unmounts
    return () => {
      resetConfig();
    };
  }, [setConfig, resetConfig, brandDetail]);

  if (!brandDetail) return null;
  return (
    <div
      style={{
        color: config.rawColor.text,
        borderColor: config.rawColor.border,
        backgroundColor: config.rawColor.bg,
      }}
      className={twMerge(config.bg, config.text)}
    >
      {/* hero */}
      <div
        className="flex aspect-[1440/720] h-[80vh] w-screen flex-col items-start justify-end bg-cover object-cover p-8 pt-20 lg:p-20"
        style={{ backgroundImage: `url(${resolveLocalImage(brandDetail?.heroImage?.cdnUrl, semanticBrandName)})` }}
      >
        <img
          className="mb-8 max-w-48 invert"
          src={resolveLocalImage(brandDetail?.logo?.cdnUrl, semanticBrandName)}
          alt={brandDetail?.logo?.name}
        />
        <div className="leading-[27.2px] text-white/100">{brandDetail?.jargon}</div>
      </div>

      {/* brand story */}
      <div className="px-8 py-8 lg:px-20 lg:py-[60px]">
        <div style={{ color: config.rawColor.accent_text }} className="mb-2 text-sm uppercase">
          Brand Story
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="basis-3/5 font-serif text-[32px] italic leading-none lg:text-[64px]">
            {brandDetail?.story?.title}
          </div>
          <div className="basis-2/5 flex flex-col gap-6 items-start">
            <div
              style={{ color: config.rawColor.secondaryText }}
              dangerouslySetInnerHTML={{ __html: brandDetail?.story?.description ?? '' }}
            />
            {brandDetail?.websiteUrl && (
              <button
                style={{
                  backgroundColor: config.rawColor.bg,
                  color: config.rawColor.text,
                  borderColor: config.rawColor.border,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = config.rawColor.bg ?? '';
                  e.currentTarget.style.backgroundColor = config.rawColor.text ?? '';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = config.rawColor.text ?? '';
                  e.currentTarget.style.backgroundColor = config.rawColor.bg ?? '';
                }}
                className="transition-all duration-150 flex items-center gap-2 rounded-full border border-black/30 px-4 py-2 text-xs text-black/100 hover:border-black/80 hover:bg-black/80 hover:text-white"
                onClick={() => router.push(brandDetail?.websiteUrl ?? '')}
              >
                <span className="uppercase">VISIT WEBSITE</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* brand story images */}
      {brandDetail?.story?.images?.length && brandDetail?.story?.images?.length > 6 && (
        <div className="group relative overflow-hidden whitespace-nowrap">
          <div className="inline-block w-max animate-slide-left group-hover:animation-pause">
            {brandDetail?.story?.images
              .slice(6)
              .map((image) => (
                <img
                  key={image.cdnUrl}
                  className="mx-10 inline aspect-square w-[330px] object-cover"
                  src={resolveImageUrl(image.cdnUrl)}
                  alt={image.name}
                />
              ))}
          </div>
          <div className="inline-block w-max animate-slide-left group-hover:animation-pause">
            {brandDetail?.story?.images
              .slice(6)
              .map((image) => (
                <img
                  key={image.cdnUrl}
                  className="mx-10 inline aspect-square w-[330px] object-cover"
                  src={resolveImageUrl(image.cdnUrl)}
                  alt={image.name}
                />
              ))}
          </div>
        </div>
      )}

      {/* brand detail */}
      {brandDetail?.detail?.title && (
        <div className="overflow-hidden p-8 lg:p-20">
          <div style={{ color: config.rawColor.accent_text }} className="mb-2 text-sm uppercase">
            Brand Detail
          </div>
          <div className="mb-20 font-serif text-[32px] italic leading-none lg:text-[64px]">
            {brandDetail?.detail?.title}
          </div>

          <div className="flex flex-col gap-y-8 lg:flex-row">
            <div className="basis-full md:basis-1/3 lg:basis-1/4 lg:pr-20 flex-1">
              {subBrands.length > 0 && subBrands[subBrandIndex]?.logo?.cdnUrl && (
                <div
                  style={{ borderColor: config.rawColor.border }}
                  className="mb-7 grid aspect-square min-w-[200px] w-full max-w-[296px] place-items-center border p-2"
                >
                  <img
                    className="w-full max-w-[150px]"
                    src={resolveImageUrl(subBrands[subBrandIndex]?.logo?.cdnUrl)}
                    alt={subBrands[subBrandIndex]?.logo?.name}
                  />
                </div>
              )}

              <div className="mb-3 text-sm" style={{ color: config.rawColor.accent_text }}>
                {subBrands[subBrandIndex]?.shortDescription}
              </div>
              {subBrands.length > 0 && subBrands[subBrandIndex]?.websiteUrl && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={subBrands[subBrandIndex]?.websiteUrl}
                  className="mb-12 flex items-center gap-2 text-sm uppercase border-b border-transparent transition-all duration-150 hover:border-white w-fit"
                >
                  Visit Website <ArrowRight />
                </a>
              )}
              <div className="flex gap-6">
                <button
                  className="cursor-pointer border-b border-transparent transition-all duration-150 hover:border-white p-1"
                  onClick={onPrevImage}
                >
                  <ArrowRight className="h-7 w-7 rotate-180" />
                </button>
                <button
                  className="cursor-pointer border-b border-transparent transition-all duration-150 hover:border-white p-1"
                  onClick={onNextImage}
                >
                  <ArrowRight className="h-7 w-7" />
                </button>
              </div>
            </div>
            {subBrands.length > 0 && subBrands[subBrandIndex]?.coverImage?.cdnUrl && (
              <ImageWithFade
                className="max-h-[500px] basis-full object-cover lg:basis-3/4"
                alt={subBrands[subBrandIndex]?.coverImage?.name ?? ''}
                src={resolveImageUrl(subBrands[subBrandIndex]?.coverImage?.cdnUrl)}
              />
            )}
          </div>
        </div>
      )}

      {/* Galeries */}
      {brandDetail?.story?.images?.length && brandDetail?.story?.images?.length > 0 && (
        <div className="py-10 lg:py-20">
          <div className="mb-10 px-10 font-serif text-[32px] italic leading-none lg:px-20 lg:text-[68px]">
            Galleries
          </div>

          {/* Galeries Stack */}
          <div className="group relative overflow-hidden whitespace-nowrap">
            <div className="inline-block w-max animate-slide-left overflow-hidden group-hover:animation-pause">
              <SectionGalery images={brandDetail?.story?.images.slice(0, 6).map((image) => resolveImageUrl(image.cdnUrl))} />
            </div>
            <div className="inline-block w-max animate-slide-left overflow-hidden group-hover:animation-pause">
              <SectionGalery images={brandDetail?.story?.images.slice(0, 6).map((image) => resolveImageUrl(image.cdnUrl))} />
            </div>
          </div>
        </div>
      )}

      {/* Designer Collaboration */}
      {brandDesigners.length > 0 && (
        <div className="mb-10 px-8 pt-10 lg:px-20 lg:pt-16">
          <div style={{ color: config.rawColor.accent_text }} className="mb-2 text-sm uppercase">
            Designer Collaboration
          </div>
          <div className="font-serif text-[32px] italic leading-none lg:text-[64px]">Meet the Designer</div>
        </div>
      )}

      {brandDesigners.length > 0 && (
        <div className="group relative flex overflow-hidden whitespace-nowrap">
          <DesignerCarousel
            designers={brandDesigners as FetchDesignerByBrandIdResponse['data']}
            onClickDesigner={onClickDesigner}
          />

          {brandDesigners.length > 3 && (
            <DesignerCarousel
              designers={brandDesigners as FetchDesignerByBrandIdResponse['data']}
              onClickDesigner={onClickDesigner}
            />
          )}
        </div>
      )}

      <PressRelease
        brandId={brandDetail?.id}
        showCta={false}
        style={{
          backgroundColor: config.rawColor.bg,
          color: config.rawColor.text,
        }}
      />

      <DesignerSidebar
        isOpen={designerSidebarIsOpen}
        onClose={() => setDesignerSidebarIsOpen(false)}
        designer={brandDesigners[designerIndex]}
        designerIndex={designerIndex}
        totalDesigners={brandDesigners.length}
        onNextDesigner={onNextDesigner}
        onPreviousDesigner={onPreviousDesigner}
      />
    </div>
  );
}

const DesignerCarousel = ({
  designers,
  onClickDesigner,
}: {
  designers: FetchDesignerByBrandIdResponse['data'];
  onClickDesigner: (index: number) => void;
}) => {
  return (
    <div
      className={twMerge(
        'group-hover:animation-pause flex w-max flex-shrink-0 overflow-hidden',
        designers.length > 3 ? 'animate-slide-left' : 'animate-none',
      )}
    >
      {designers.map((item, index) => (
        <div
          key={index}
          onClick={() => onClickDesigner(index)}
          className={twMerge(
            'relative h-[660px] w-[330px] flex-shrink-0 cursor-pointer bg-cover p-10 overflow-hidden',
            `group/designer`,
          )}
        >
          <div
            style={{ backgroundImage: `url(${item?.image?.cdnUrl})` }}
            className="absolute group-hover/designer:scale-105 inset-0 z-0 bg-cover transition-all duration-300"
          ></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="relative z-10 flex h-full flex-col justify-end">
            <span
              className={twMerge(
                'mb-2 font-serif text-[40px] italic leading-none w-fit border-b border-transparent',
                `group-hover/designer:border-white transition-all duration-200`,
              )}
            >
              {item?.name}
            </span>
            <span className="text-sm">{item?.shortBio}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// const designer = [
//   {
//     name: "Eko Priharseno",
//     description: "Lorem ipsum dolor sit amet",
//     image: "https://dummyimage.com/330x660/202020/fff",
//   },
//   {
//     name: "Hans Susantio",
//     description: "Lorem ipsum dolor sit amet",
//     image: "https://dummyimage.com/330x660/202020/fff",
//   },
//   {
//     name: "Kelvin Thengono",
//     description: "Lorem ipsum dolor sit amet",
//     image: "https://dummyimage.com/330x660/202020/fff",
//   },
//   {
//     name: "Nadia",
//     description: "Lorem ipsum dolor sit amet",
//     image: "https://dummyimage.com/330x660/202020/fff",
//   },
//   {
//     name: "Eko Priharseno",
//     description: "Lorem ipsum dolor sit amet",
//     image: "https://dummyimage.com/330x660/202020/fff",
//   },
//   {
//     name: "Hans Susantio",
//     description: "Lorem ipsum dolor sit amet",
//     image: "https://dummyimage.com/330x660/202020/fff",
//   },
//   {
//     name: "Kelvin Thengono",
//     description: "Lorem ipsum dolor sit amet",
//     image: "https://dummyimage.com/330x660/202020/fff",
//   },
//   {
//     name: "Nadia",
//     description: "Lorem ipsum dolor sit amet",
//     image: "https://dummyimage.com/330x660/202020/fff",
//   },
// ];

// const images = [
//   "https://dummyimage.com/210x278/000/fff",
//   "https://dummyimage.com/328x300/000/fff",
//   "https://dummyimage.com/332x618/000/fff",
//   "https://dummyimage.com/324x392/000/fff",
//   "https://dummyimage.com/208x186/000/fff",
//   "https://dummyimage.com/332x618/000/fff",
// ];
