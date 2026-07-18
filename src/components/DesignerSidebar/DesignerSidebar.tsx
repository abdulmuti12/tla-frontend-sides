import { useRef, useState } from 'react';

import { Dialog, DialogPanel } from '@headlessui/react';

import { FetchDesignerByBrandIdResponse } from '~/types/fetchDesignerByBrandId';

import ArrowRight from '../Icons/ArrowRight';
import Close from '../Icons/Close';

export default function DesignerSidebar({
  isOpen,
  onClose,
  designer,
  designerIndex,
  totalDesigners,
  onNextDesigner,
  onPreviousDesigner,
}: {
  isOpen: boolean;
  onClose: () => void;
  designer?: Partial<FetchDesignerByBrandIdResponse['data'][number]>;
  designerIndex: number;
  totalDesigners: number;
  onNextDesigner: () => void;
  onPreviousDesigner: () => void;
}) {
  const imageCarouselRef = useRef<HTMLDivElement>(null);
  const [isMaxScroll, setIsMaxScroll] = useState(false);
  const [isMinScroll, setIsMinScroll] = useState(true);

  const onClickNext = () => {
    if (imageCarouselRef.current) {
      imageCarouselRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  const onClickPrevious = () => {
    if (imageCarouselRef.current) {
      imageCarouselRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (imageCarouselRef.current) {
      setIsMaxScroll(
        imageCarouselRef.current.scrollLeft ===
          imageCarouselRef.current.scrollWidth - imageCarouselRef.current.clientWidth,
      );
      setIsMinScroll(imageCarouselRef.current.scrollLeft === 0);
    }
  };

  return (
    <Dialog as="div" open={isOpen} onClose={onClose} className="absolute z-[102] focus:outline-none">
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-end bg-black bg-opacity-60 p-0">
          <DialogPanel
            transition
            className="data-[closed]:transform-[scale(95%)] relative h-screen w-full max-w-[534px] overflow-hidden overflow-y-auto bg-white/100 pb-10 duration-300 ease-out data-[closed]:opacity-0"
          >
            <div className="z-10 mt-[48px] flex flex-col gap-6 border-b border-b-black/30 px-6 py-6 md:flex-row md:px-10">
              <img src={designer?.image?.cdnUrl} className="w-full object-cover md:h-[272px] md:w-[204px]" alt="" />
              <div className="flex flex-col justify-between">
                <div>
                  <div className="mb-2 font-serif text-[48px] italic leading-none">{designer?.name}</div>
                  <div className="text-xs leading-[20.4px] text-black/70">{designer?.shortBio}</div>
                </div>
                <p className="line-clamp-5 text-xs leading-[20.4px] text-black/70">{designer?.bio}</p>
              </div>
            </div>

            {/* Collaboration Project Images */}
            {designer?.projectImages && designer?.projectImages?.length > 0 && (
              <div className="mb-[48px] px-6 py-6 md:px-10">
                <div className="mb-5 font-serif text-2xl italic leading-none">Collaboration Project</div>
                <div className="relative">
                  <div
                    ref={imageCarouselRef}
                    onScroll={handleScroll}
                    className="flex w-auto gap-4 overflow-x-auto scrollbar-hide"
                  >
                    {designer?.projectImages?.map((img) => (
                      <img key={img.id} alt={img.name} src={img.cdnUrl} className="w-[296px] flex-shrink-0" />
                    ))}
                  </div>
                  {!isMaxScroll && designer?.projectImages?.length > 1 && (
                    <div className="absolute right-0 top-0 grid h-full place-items-center">
                      <button onClick={onClickNext}>
                        <DesignerArrowRight className="cursor-pointer shadow-lg" />
                      </button>
                    </div>
                  )}
                  {!isMinScroll && designer?.projectImages?.length > 1 && (
                    <div className="absolute left-0 top-0 grid h-full place-items-center">
                      <button onClick={onClickPrevious}>
                        <DesignerArrowRight className="rotate-180 cursor-pointer shadow-lg" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="fixed top-0 flex h-[48px] w-full max-w-[534px] items-center justify-between border-b border-black/30 bg-white/100 px-6 py-3 md:px-10">
              <div className="text-xs leading-normal text-black/50">DESIGNERS COLLABORATION</div>
              <button onClick={onClose}>
                <Close />
              </button>
            </div>

            {/* Footer for navigation between designers */}
            <div className="fixed bottom-0 flex h-[48px] w-full max-w-[534px] items-center justify-between border-t border-t-black/30 bg-white/100 px-6 text-xs md:px-10">
              <div className="flex items-center gap-2">
                <div>{designerIndex + 1}</div>
                <div className="w-3 border-t border-black/50 md:block md:w-[72px]" />
                <div className="text-black/50">{totalDesigners}</div>
              </div>

              <div>{designer?.name}</div>
              <div className="flex gap-2 md:gap-6">
                <button className="cursor-pointer" onClick={onPreviousDesigner}>
                  <ArrowRight className="h-4 w-4 rotate-180 md:h-6 md:w-6" />
                </button>
                <button className="cursor-pointer" onClick={onNextDesigner}>
                  <ArrowRight className="h-4 w-4 md:h-6 md:w-6" />
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

const DesignerArrowRight = ({ className }: { className: string }) => (
  <svg className={className} width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_bd_392_2096)">
      <circle cx="30" cy="26" r="18" fill="white" fill-opacity="0.2" shape-rendering="crispEdges" />
      <circle cx="30" cy="26" r="17.5" stroke="white" shape-rendering="crispEdges" />
    </g>
    <path d="M31.8311 30.5693L36.3997 26.0006L31.8311 21.4319" stroke="white" strokeLinecap="square" />
    <path d="M35.7601 25.9998L23.1367 25.9998" stroke="white" strokeLinecap="square" stroke-linejoin="round" />
    <defs>
      <filter
        id="filter0_bd_392_2096"
        x="0"
        y="-4"
        width="60"
        height="64"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="6" />
        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_392_2096" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="6" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <feBlend mode="normal" in2="effect1_backgroundBlur_392_2096" result="effect2_dropShadow_392_2096" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_392_2096" result="shape" />
      </filter>
    </defs>
  </svg>
);
