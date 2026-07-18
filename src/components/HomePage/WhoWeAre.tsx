'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import Button from '~/components/Button/Button';
import ArrowRight from '~/components/Icons/ArrowRight';
import SectionContainer from '~/components/PageSection/SectionContainer';
import SectionDesc from '~/components/PageSection/SectionDesc';
import SectionQuote from '~/components/PageSection/SectionQuote';
import SectionTitle from '~/components/PageSection/SectionTitle';

export default function WhoWeAre({
  aboutUsTitle,
  aboutUsDescription,
  aboutUsImage,
}: {
  aboutUsTitle?: string;
  aboutUsDescription?: string;
  aboutUsImage?: string;
}) {
  const router = useRouter();
  return (
    <>
      <SectionContainer>
        <SectionTitle>About us</SectionTitle>
        <div className="flex flex-col gap-8 md:flex-row">
          <SectionQuote className="basis-3/5 font-normal">
            {aboutUsTitle ?? 'Orchestrates a masterpiece where architecture and interior design meet craftsmanship'}
          </SectionQuote>

          <SectionDesc className="basis-2/5">
            <p>
              {aboutUsDescription ??
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel tempus tortor, sit amet tempor arcu. Maecenas aliquam urna id felis fringilla sodales.'}
            </p>

            <Button
              className="transition-all duration-150 hover:border-black/80 hover:bg-black/80 hover:text-white"
              onClick={() => router.push('/about')}
            >
              <span className="uppercase">Learn More</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </SectionDesc>
        </div>
      </SectionContainer>
      <img
        className="w-full aspect-[1452/343] object-cover"
        src={aboutUsImage ?? '/assets/2701_Divano_Hero_Generale_1.png'}
        alt="who we are section image"
      />
    </>
  );
}
