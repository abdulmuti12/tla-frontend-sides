'use client';

import React, { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { fetchBrands } from '~/api_helpers/fetchBrands';
import { fetchPressReleases } from '~/api_helpers/fetchPressReleases';
import { fetchProjects } from '~/api_helpers/FetchProjects';
import { fetchPromotionsApi } from '~/api_helpers/fetchPromotionsApi';

import { FetchBrandsApiResponse } from '~/types/fetchBrandsApi';
import { FetchPressReleasesResponse } from '~/types/fetchPressReleasesApi';
import { FetchPromotionsApiResponse } from '~/types/fetchPromotionsApi';
import { ProjectApiResponse } from '~/types/ProjectApi';

import ImageWithFade from '../Animation/ImageWithFade';
import ArrowRight from '../Icons/ArrowRight';

const resolveImageUrl = (cdnUrl?: string) => {
  if (!cdnUrl) return '';
  if (/^https?:\/\//i.test(cdnUrl)) return cdnUrl;
  const apiHost = process.env.API_HOST || '';
  return `${apiHost}${cdnUrl.startsWith('/') ? '' : '/'}${cdnUrl}`;
};


export default function NewsPage() {
  const router = useRouter();
  const query = useSearchParams();
  const [fadeDirection, setFadeDirection] = useState<'left' | 'right'>('right');
  const [projects, setProjects] = useState<ProjectApiResponse['data']>([]);
  const [pressReleases, setPressReleases] = useState<FetchPressReleasesResponse['data']>([]);
  const [promotions, setPromotions] = useState<FetchPromotionsApiResponse['data']>([]);

  const [pageMeta, setPageMeta] = useState<ProjectApiResponse['pageMeta']>({
    page: 1,
    limit: 6,
    pageCount: 1,
    totalCount: 1,
  });

  const [featuredNews, setFeaturedNews] = useState<FetchPressReleasesResponse['data']>([]);
  const [featuredNewsIndex, setFeaturedNewsIndex] = useState<number>(0);

  const [brandList, setBrandList] = useState<FetchBrandsApiResponse['data']>();
  const [selectedBrandId, setSelectedBrandId] = useState<string>('all');

  const [activeTab, setActiveTab] = useState<'projects' | 'press' | 'promotions'>('projects');

  const onNextPage = () => {
    if (pageMeta.page === pageMeta.pageCount) return;
    setPageMeta((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const onPrevPage = () => {
    if (pageMeta.page === 1) return;
    setPageMeta((prev) => ({ ...prev, page: prev.page - 1 }));
  };

  const onNextFeaturedNews = () => {
    setFadeDirection('right');
    if (featuredNewsIndex === featuredNews.length - 1) setFeaturedNewsIndex(0);
    else setFeaturedNewsIndex((prev) => prev + 1);
  };

  const onPrevFeaturedNews = () => {
    setFadeDirection('left');
    if (featuredNewsIndex === 0) setFeaturedNewsIndex(featuredNews.length - 1);
    else setFeaturedNewsIndex((prev) => prev - 1);
  };

  const resetPageMeta = () => {
    setPageMeta({
      limit: 10,
      page: 1,
      pageCount: 1,
      totalCount: 1,
    });
  };

  useEffect(() => {
    resetPageMeta();
    setSelectedBrandId('all');
  }, [activeTab]);

  useEffect(() => {
    const tab = query.get('tab');
    if (tab && (tab === 'projects' || tab === 'press' || tab === 'promotions')) {
      setActiveTab(tab as 'projects' | 'press' | 'promotions');
    }
  }, [query]);

  useEffect(() => {
    const tab = query.get('tab');
    if (tab) router.replace('/projects');
  }, [activeTab, query, router]);

  useEffect(() => {
    switch (activeTab) {
      case 'projects':
        fetchProjects({
          limit: pageMeta.limit,
          page: pageMeta.page,
          brandId: selectedBrandId,
        }).then((data) => {
          setProjects(data?.data || []);
          setPageMeta(
            data?.pageMeta || {
              limit: 10,
              page: 1,
              pageCount: 1,
              totalCount: 1,
            },
          );
        });
        break;
      case 'press':
        fetchPressReleases({
          limit: pageMeta.limit,
          page: pageMeta.page,
          brandId: selectedBrandId,
        }).then((data) => {
          setPressReleases(data?.data || []);
          setPageMeta(
            data?.pageMeta || {
              limit: 10,
              page: 1,
              pageCount: 1,
              totalCount: 1,
            },
          );
        });
        break;
      case 'promotions':
        fetchPromotionsApi({
          limit: pageMeta.limit,
          page: pageMeta.page,
          brandId: selectedBrandId,
        }).then((data) => {
          setPromotions(data?.data || []);
          setPageMeta(
            data?.pageMeta || {
              limit: 10,
              page: 1,
              pageCount: 1,
              totalCount: 1,
            },
          );
        });
        break;
      default:
        break;
    }
  }, [activeTab, pageMeta.limit, pageMeta.page, selectedBrandId]);

  useEffect(() => {
    fetchProjects({
      limit: 10,
      page: 1,
    }).then((data) => {
      setProjects(data?.data || []);
    });
    fetchPressReleases({
      limit: 10,
      page: 1,
    }).then((data) => {
      setPressReleases(data?.data || []);
      setFeaturedNews(data?.data.slice(0, 3) || []);
    });
    fetchPromotionsApi({
      limit: 10,
      page: 1,
    }).then((data) => {
      setPromotions(data?.data || []);
    });
    fetchBrands().then((data) => {
      setBrandList(data?.data);
    });
  }, []);

  return (
    <>
      {/* HERO */}
      <div className="mb-6 flex flex-col bg-black/100 pt-16 md:flex-row">
        <div className="basis-1/2 p-8 lg:p-20">
          <div className="mb-12 font-serif text-7xl uppercase text-white/100 lg:text-[120px]">Projects</div>
          <div className="h-[286px]">
            {featuredNews.length > 0 && (
              <div>
                <div className="mb-8 font-serif text-[32px] italic leading-none text-white/100 md:text-[48px]">
                  Featured
                </div>
                <div
                  className="mb-14 flex h-[150px] cursor-pointer flex-col gap-2 group"
                  onClick={() => router.push(`/press/${featuredNews[featuredNewsIndex].id}`)}
                >
                  <div className="text-sm uppercase text-white/50">{featuredNews[featuredNewsIndex].brand?.name ?? ''}</div>
                  <div className="line-clamp-2 cursor-pointer text-[24px] font-bold leading-[44.8px] text-white/100 md:text-[32px] border-b border-transparent group-hover:border-current w-fit transition-all duration-150">
                    {featuredNews[featuredNewsIndex].title}
                  </div>
                  <div className="text-white/70">
                    {new Date(featuredNews[featuredNewsIndex].createdAt).toLocaleDateString('id-ID', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-6 text-white/100">
            <button
              onClick={onPrevFeaturedNews}
              className="cursor-pointer border-b border-transparent transition-all duration-150 hover:border-current p-2"
            >
              <ArrowRight className="h-7 w-7 rotate-180" />
            </button>
            <button
              onClick={onNextFeaturedNews}
              className="cursor-pointer border-b border-transparent transition-all duration-150 hover:border-current p-2"
            >
              <ArrowRight className="h-7 w-7" />
            </button>
          </div>
        </div>
        <div className="h-[680px] basis-1/2">
          {featuredNews.length > 0 && (
            <ImageWithFade
              direction={fadeDirection}
              className="h-full w-full object-cover"
              src={resolveImageUrl(featuredNews[featuredNewsIndex].image.cdnUrl)}
              alt={featuredNews[featuredNewsIndex].title}
            />
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="mb-8 flex border-b border-b-black/50 px-2 lg:px-20">
        <button
          className={`flex cursor-pointer items-end gap-1 border-b-2 p-4 text-sm uppercase leading-none lg:p-6 lg:text-base ${
            activeTab === 'projects' ? ' border-b-black/100 font-bold' : ''
          }`}
          onClick={() => setActiveTab('projects')}
        >
          PROJECTS <div className="mb-1 text-xs">({projects?.length})</div>
        </button>
        <button
          className={`flex cursor-pointer items-end gap-1 border-b-2 p-4 text-sm uppercase leading-none lg:p-6 lg:text-base ${
            activeTab === 'press' ? 'border-b-black/100 font-bold' : ''
          }`}
          onClick={() => setActiveTab('press')}
        >
          PRESS <div className="mb-1 text-xs">({pressReleases?.length})</div>
        </button>
        <button
          className={`flex cursor-pointer items-end gap-1 border-b-2 p-4 text-sm uppercase leading-none lg:p-6 lg:text-base ${
            activeTab === 'promotions' ? 'border-b-black/100 font-bold' : ''
          }`}
          onClick={() => setActiveTab('promotions')}
        >
          PROMOTIONS <div className="mb-1 text-xs">({promotions?.length ?? 0})</div>
        </button>
      </div>

      {/* TITLE */}
      <div className="flex flex-col justify-between gap-4 px-8 lg:flex-row lg:items-center lg:gap-14 lg:px-20">
        <div className="font-serif text-[48px] italic lg:text-[60px]">
          {activeTab === 'projects' ? 'Projects' : activeTab === 'press' ? 'Press' : 'Promotions'}
        </div>
        <div className="w-full lg:w-72">
          <label htmlFor="category-filter" className="mb-2.5 block uppercase text-black/50">
            Filter by Brand
          </label>
          <div className="relative">
            <select
              id="category-filter"
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="w-full cursor-pointer appearance-none border-b border-b-black/30 bg-transparent py-2 font-bold text-black/100"
            >
              <option value="all">All</option>
              {brandList?.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-0 top-2 mt-[1.5px]"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.99916 9.60001L11.71 15.3109L17.4209 9.60001" stroke="#231F20" strokeLinecap="square" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2 lg:grid-cols-3 lg:p-20 items-end">
        {/* Projects */}
        {activeTab === 'projects' && (
          <>
            {projects?.length > 0 ? (
              projects?.map((project, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer flex-col gap-4"
                  onClick={() => router.push(`/project/${project.id}`)}
                >
                  <div className="w-full overflow-hidden">
                    <img
                      className="w-full object-cover grayscale transition-all duration-300 hover:scale-105 hover:grayscale-0 h-[280px]"
                      src={resolveImageUrl(project.images?.[0]?.cdnUrl)}
                      alt={project.name}
                    />
                  </div>
                  <div className="flex justify-between text-sm font-medium uppercase tracking-[0.08]">
                    <div className="flex items-start gap-2 lg:gap-4">
                      <svg
                        className="mt-1"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="6" cy="6.5" r="5.5" stroke="#231F20" strokeOpacity="0.3" />
                        <circle cx="6" cy="6.5" r="1" fill="#231F20" />
                      </svg>

                      {project.name}
                    </div>
                    <div>{project.category}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-20">
                <div className="text-2xl font-medium text-black/70">No projects found</div>
                <div className="text-base text-black/50">Try changing your filter or check back later</div>
              </div>
            )}
          </>
        )}

        {/* Press Release */}
        {activeTab === 'press' && (
          <>
            {pressReleases?.length > 0 ? (
              pressReleases?.map((pressRelease, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer flex-col gap-4 group"
                  onClick={() => router.push(`/press/${pressRelease.id}`)}
                >
                  <img
                    className="mb-4 w-[400px] object-cover max-lg:w-full"
                    src={resolveImageUrl(pressRelease.image.cdnUrl)}
                    alt={pressRelease.title}
                  />
                  <div className="flex flex-col">
                    <div className="text-xs text-black/50">{pressRelease.brand.name}</div>
                    <div className=" text-xl font-bold border-b line-clamp-2 border-transparent group-hover:border-black/100 w-fit transition-all duration-150">
                      {pressRelease.title}
                    </div>
                    <div className="text-sm text-black/70">
                      {new Date(pressRelease.createdAt).toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-20">
                <div className="text-2xl font-medium text-black/70">No press releases found</div>
                <div className="text-base text-black/50">Try changing your filter or check back later</div>
              </div>
            )}
          </>
        )}

        {/* Promotions */}
        {activeTab === 'promotions' && (
          <>
            {promotions?.length > 0 ? (
              promotions?.map((promotion, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer flex-col gap-4 group"
                  onClick={() => router.push(`/promotion/${promotion.id}`)}
                >
                  <img
                    className="mb-4 w-[400px] object-cover max-lg:w-full"
                    src={resolveImageUrl(promotion.image.cdnUrl)}
                    alt={promotion.title}
                  />
                  <div className="flex flex-col">
                    <div className="text-xs text-black/50">{promotion.brand.name}</div>
                    <div className=" text-xl font-bold border-b line-clamp-2 border-transparent group-hover:border-black/100 w-fit">
                      {promotion.title}
                    </div>
                    <div className="text-sm text-black/70">
                      {new Date(promotion.startDate).toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric',
                      })}
                      {' - '}
                      {new Date(promotion.endDate).toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-20">
                <div className="text-2xl font-medium text-black/70">No promotions found</div>
                <div className="text-base text-black/50">Try changing your filter or check back later</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* PAGINATION */}
      <div className="mb-[100px] flex w-full justify-center gap-6">
        <button onClick={onPrevPage}>
          <ArrowRight className="h-7 w-7 rotate-180" />
        </button>
        <div className="flex gap-3">
          <button className="grid h-[34px] w-[34px] place-items-center rounded-full bg-black/100 text-sm font-medium text-white/100">
            {pageMeta.page}
          </button>
          {/* <button className="grid h-[34px] w-[34px] place-items-center rounded-full text-sm font-medium">
            2
          </button>
          <button className="grid h-[34px] w-[34px] place-items-center rounded-full text-sm font-medium">
            3
          </button>
          <button className="grid h-[34px] w-[34px] place-items-center rounded-full text-sm font-medium">
            4
          </button>
          <button className="grid h-[34px] w-[34px] place-items-center rounded-full text-sm font-medium">
            5
          </button> */}
        </div>
        <button onClick={onNextPage}>
          <ArrowRight className="h-7 w-7" />
        </button>
      </div>
    </>
  );
}

// const projects = [
//   {
//     image: "https://dummyimage.com/480x640/000/fff&text=Project+1",
//     title: "RR Chocolate",
//     category: "Commercial",
//   },
//   {
//     image: "https://dummyimage.com/480x640/000/fff&text=Project+2",
//     title: "MR.S",
//     category: "Classic",
//   },
//   {
//     image: "https://dummyimage.com/480x640/000/fff&text=Project+3",
//     title: "Cikeas",
//     category: "Modern",
//   },
//   {
//     image: "https://dummyimage.com/480x640/000/fff&text=Project+4",
//     title: "Gunadarma University",
//     category: "Office",
//   },
//   {
//     image: "https://dummyimage.com/480x640/000/fff&text=Project+5",
//     title: "Casa Italia Kemang",
//     category: "Store",
//   },
//   {
//     image: "https://dummyimage.com/480x640/000/fff&text=Project+6",
//     title: "The RR Chocolate",
//     category: "Commercial",
//   },
// ];
