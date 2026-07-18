'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { twMerge } from 'tailwind-merge';
import { fetchPromotionById } from '~/api_helpers/fetchPromotionById';

import { FetchPromotionByIdApiResponse } from '~/types/fetchPromotionById';

const resolveImageUrl = (cdnUrl?: string) => {
  if (!cdnUrl) return '';
  if (/^https?:\/\//i.test(cdnUrl)) return cdnUrl;
  const apiHost = process.env.API_HOST || '';
  return `${apiHost}${cdnUrl.startsWith('/') ? '' : '/'}${cdnUrl}`;
};

// Rewrite <img src="..."> inside an HTML string so relative URLs (e.g. "/static/...")
// get prefixed with the API host. Keeps absolute URLs and non-img tags untouched.
const rewriteHtmlImageUrls = (html: string) => {
  if (!html) return '';
  const apiHost = process.env.API_HOST || '';
  return html.replace(/<img\b([^>]*?)\bsrc=("([^"]*)"|'([^']*)')/gi, (match, attrs, _quote, dq, sq) => {
    const src = dq ?? sq ?? '';
    if (!src || /^https?:\/\//i.test(src) || src.startsWith('data:')) return match;
    const absolute = `${apiHost}${src.startsWith('/') ? '' : '/'}${src}`;
    const replacement = `"${absolute}"`;
    return `<img${attrs}src=${dq !== undefined ? replacement : `'${absolute}'`}`;
  });
};

export default function PromotionPage({ promotionId }: { promotionId: string }) {
  const [promotion, setPromotion] = useState<FetchPromotionByIdApiResponse['data']>();

  useEffect(() => {
    fetchPromotionById(promotionId).then((data) => setPromotion(data?.data));
  }, [promotionId]);

  return (
    <>
      <div className="mt-[64px] p-8 lg:px-20 lg:pt-20">
        {/* Breadcrumbs */}
        <div className="mb-2 text-sm text-black/50 lg:mb-6">
          <Link href="/projects?tab=promotions">Promotion</Link>
          <span> / </span>
          <span className="text-black/100">{promotion?.title}</span>
        </div>
        {/* Promotion Title */}
        <div className="mb-6 font-serif text-6xl font-medium italic leading-none sm:mb-14 lg:text-[68px]">
          {promotion?.title}
        </div>

        {/* Promotion Details */}
        <div className="flex w-full justify-between text-sm text-black/70">
          <div className="flex gap-16 ">
            <div className="flex items-center gap-2 lg:gap-4">
              <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6.5" r="5.5" stroke="#231F20" strokeOpacity="0.3" />
                <circle cx="6" cy="6.5" r="1" fill="#231F20" />
              </svg>
              {promotion?.brand.name}
            </div>
            <div>
              {promotion?.startDate &&
                new Date(promotion?.startDate).toLocaleDateString('id-ID', {
                  month: 'long',
                  year: 'numeric',
                })}
              {' - '}
              {promotion?.endDate &&
                new Date(promotion?.endDate).toLocaleDateString('id-ID', {
                  month: 'long',
                  year: 'numeric',
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="px-8 lg:px-20">
        <img
          alt={promotion?.title}
          src={resolveImageUrl(promotion?.image?.cdnUrl)}
          className="h-[360px] w-full object-cover"
        />
      </div>

      {/* Content */}
      {promotion?.content && (
        <div className="mb-12 mt-8 grid w-full place-items-center px-8 lg:mb-24 lg:mt-16">
          <div
            className={twMerge(
              'prose w-full max-w-[624px]',
              'prose-headings:font-serif prose-headings:font-normal prose-headings:italic ',
              'prose-p:font-sans prose-p:font-normal prose-p:leading-[27.2px]',
              'prose-img:w-full',
            )}
            dangerouslySetInnerHTML={{
              __html: rewriteHtmlImageUrls(promotion.content),
            }}
          ></div>
        </div>
      )}
    </>
  );
}
