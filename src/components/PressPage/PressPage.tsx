'use client';

import React from 'react';
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { twMerge } from 'tailwind-merge';
import { fetchPressById } from '~/api_helpers/fetchPressById';

import { FetchPressByIdApiResponse } from '~/types/fetchPressById';

const resolveImageUrl = (cdnUrl?: string) => {
  if (!cdnUrl) return '';
  if (/^https?:\/\//i.test(cdnUrl)) return cdnUrl;
  const apiHost = process.env.API_HOST || '';
  return `${apiHost}${cdnUrl.startsWith('/') ? '' : '/'}${cdnUrl}`;
};

// Rewrite <img src="..."> inside an HTML string so relative URLs get prefixed with API_HOST.
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

export default function PressPage({ pressId }: { pressId: string }) {
  const [press, setPress] = useState<FetchPressByIdApiResponse['data']>();

  useEffect(() => {
    fetchPressById(pressId).then((data) => setPress(data?.data));
  }, [pressId]);

  return (
    <>
      <div className="mt-[64px] p-8 lg:px-20 lg:pt-20">
        {/* Breadcrumbs */}
        <div className="mb-2 text-sm text-black/50 lg:mb-6">
          <Link href="/projects?tab=press">Press</Link>
          <span> / </span>
          <span className="text-black/100">{press?.title}</span>
        </div>

        {/* Promotion Title */}
        <div className="mb-6 font-serif text-6xl font-medium italic leading-none sm:mb-14 lg:text-[68px]">
          {press?.title}
        </div>

        {/* Promotion Details */}
        <div className="flex w-full justify-between text-sm text-black/70">
          <div className="flex gap-16 ">
            <div className="flex items-center gap-2 lg:gap-4">
              <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6.5" r="5.5" stroke="#231F20" strokeOpacity="0.3" />
                <circle cx="6" cy="6.5" r="1" fill="#231F20" />
              </svg>

              {press?.brand.name}
            </div>
            <div>{press?.media}</div>
          </div>
          <div>
            {press?.date &&
              new Date(press?.date).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="">
        <img src={resolveImageUrl(press?.image?.cdnUrl)} alt={press?.title} className="h-[360px] w-full object-cover" />
      </div>

      {/* Content */}
      {press?.content && (
        <div className="mb-12 mt-8 grid w-full place-items-center px-8 lg:mb-24 lg:mt-16">
          <div
            className={twMerge(
              'prose w-full max-w-[624px]',
              'prose-headings:font-serif prose-headings:font-normal prose-headings:italic ',
              'prose-p:font-sans prose-p:font-normal prose-p:leading-[27.2px]',
              'prose-img:w-full',
            )}
            dangerouslySetInnerHTML={{
              __html: press?.content ? rewriteHtmlImageUrls(press.content) : '',
            }}
          ></div>
        </div>
      )}
    </>
  );
}
