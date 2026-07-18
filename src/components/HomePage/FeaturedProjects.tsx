'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { fetchFeaturedProjects } from '~/api_helpers/FetchFeaturedProjects';

import ImageWithFade from '~/components/Animation/ImageWithFade';
import ArrowRight from '~/components/Icons/ArrowRight';

import { FeaturedProjectApiResponse } from '~/types/FeaturedProjectApi';

export default function FeaturedProjects() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeDirection, setFadeDirection] = useState<'left' | 'right'>('right');
  const [featuredProjects, setFeaturedProjects] = useState<DeepPartial<FeaturedProjectApiResponse>['data']>([]);

  const handleNext = () => {
    if (!featuredProjects || featuredProjects.length === 0) return;
    setFadeDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredProjects.length);
  };

  const handlePrev = () => {
    if (!featuredProjects || featuredProjects.length === 0) return;
    setFadeDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredProjects.length) % featuredProjects.length);
  };

  useEffect(() => {
    fetchFeaturedProjects().then((data) => {
      if (data) setFeaturedProjects(data?.data);
    });
  }, []);

  if (!featuredProjects || featuredProjects.length === 0) return null;
  return (
    <div className="relative flex flex-col justify-between gap-8 bg-BG/Black pb-[100px] pl-8 pr-8 pt-8 text-white/100 lg:flex-row lg:gap-0 lg:pl-20 lg:pr-0 lg:pt-[124px]">
      <div className="flex flex-1 flex-col justify-between lg:mr-[60px]">
        <h2 className="mb-6 font-serif text-4xl  italic leading-none lg:mb-0 lg:text-[64px]">Featured Projects</h2>

        <h5 className="mb-6 text-xl leading-[1.4] lg:text-[28px]">{featuredProjects[currentIndex]?.name}</h5>
        <div className="mb-[60px] flex flex-col items-start gap-4 lg:flex-row lg:gap-10">
          <div>
            <div className="mb-1 text-xs leading-normal text-white/50">Category</div>
            <div className="font-serif text-2xl italic">{featuredProjects[currentIndex]?.category}</div>
          </div>
          <div>
            <div className="mb-1 text-xs leading-normal text-white/50">Location</div>
            <div className="font-serif text-2xl italic">{featuredProjects[currentIndex]?.location}</div>
          </div>
          <div>
            <div className="mb-1 text-xs leading-normal text-white/50">Year</div>
            <div className="font-serif text-2xl italic">
              {new Date(featuredProjects[currentIndex]?.date ?? '').getFullYear()}
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push(`/project/${featuredProjects[currentIndex]?.id}`)}
          className="mb-[42px] flex w-fit items-center gap-2 border-b border-black/100 transition-all duration-150 hover:border-white"
        >
          <div className="uppercase">View Project</div>
          <ArrowRight className="h-[18px] w-[18px]" />
        </button>

        <div className="flex items-center justify-between">
          <div className="flex gap-6">
            <button
              onClick={handlePrev}
              className="cursor-pointer border-b border-transparent transition-all duration-150 hover:border-white p-1"
            >
              <ArrowRight className="h-7 w-7 rotate-180" />
            </button>
            <button
              onClick={handleNext}
              className="cursor-pointer border-b border-transparent transition-all duration-150 hover:border-white p-1"
            >
              <ArrowRight className="h-7 w-7" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="">{currentIndex + 1}</div>
            <div className="w-20 border-t border-white/50" />
            <div className="text-white/50">{featuredProjects.length}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 overflow-hidden lg:flex-row">
        <div className="w-full lg:h-[496px] lg:w-[453px]">
          {featuredProjects[currentIndex]?.images?.[0] && (
            <ImageWithFade
              direction={fadeDirection}
              className="w-full object-cover grayscale transition-all duration-300 hover:grayscale-0 lg:h-[496px] lg:w-[453px]"
              src={featuredProjects[currentIndex]?.images?.[0]?.cdnUrl ?? ''}
              alt={featuredProjects[currentIndex]?.images?.[0]?.name ?? ''}
            />
          )}
        </div>

        <div className="w-full lg:h-[496px] lg:w-[373px]">
          {featuredProjects[currentIndex]?.images?.[1] && (
            <ImageWithFade
              direction={fadeDirection}
              className="w-full object-cover grayscale transition-all duration-300 hover:grayscale-0 lg:h-[496px] lg:w-[373px]"
              src={featuredProjects[currentIndex]?.images?.[1]?.cdnUrl ?? ''}
              alt={featuredProjects[currentIndex]?.images?.[1]?.name ?? ''}
            />
          )}
        </div>
      </div>
    </div>
  );
}
