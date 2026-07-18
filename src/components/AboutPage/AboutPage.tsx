'use client';

import { useEffect, useState } from 'react';

import { fetchAboutPageConfig, FetchAboutPageConfigApiResponse } from '~/api_helpers/fetchAboutPageConfig';

import SectionContainer from '../PageSection/SectionContainer';
import SectionDesc from '../PageSection/SectionDesc';
import SectionQuote from '../PageSection/SectionQuote';
import SectionTitle from '../PageSection/SectionTitle';
import SectionGalery from '../SectionGalery/SectionGalery';

export default function AboutPage() {
  const [aboutPageConfig, setAboutPageConfig] = useState<FetchAboutPageConfigApiResponse | null>(null);

  useEffect(() => {
    fetchAboutPageConfig().then(setAboutPageConfig);
  }, []);

  if (!aboutPageConfig) return <main className="min-h-screen"></main>;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="mb-14 bg-BG/Cream px-8 pt-24 font-serif text-5xl sm:text-6xl lg:text-7xl font-medium uppercase lg:px-20 lg:pb-14 lg:pt-32 xl:text-[100px] lg:leading-[67.5px] flex flex-col">
        <div className="flex w-full flex-wrap justify-between flex-row">
          <div className="leading-tight md:text-nowrap">Leading Retailer</div>
          <div className="leading-tight place-self-end">Of</div>
        </div>
        <div className="flex gap-x-6 flex-row flex-wrap">
          <div className="leading-tight">Luxury</div>
          <div className="flex-1 sm:text-center leading-tight">Furniture</div>
        </div>
      </div>

      {/* Hero Description */}
      <div className="mb-14 flex justify-end pr-10 lg:pr-20">
        <div
          className="w-2/3 lg:w-1/3"
          dangerouslySetInnerHTML={{
            __html:
              aboutPageConfig?.data?.description ??
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel tempus tortor, sit amet tempor arcu. Maecenas aliquam urna id felis fringilla sodales.',
          }}
        ></div>
      </div>

      {/* Hero Image */}
      <img
        className="w-full aspect-[1440/490] object-cover"
        src={aboutPageConfig?.data?.banner?.cdnUrl ?? '/assets/about_me_hero.png'}
        alt="About"
      />

      {/* Why Us */}
      <SectionContainer className="mb-0 bg-black/100 pb-14">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex basis-3/5 flex-col justify-between">
            <h5 className="mb-2 text-sm font-medium uppercase leading-normal tracking-[0.08] text-white/50 md:text-base">
              Why Us?
            </h5>
            <div className="mb-24 font-serif text-[32px] font-normal italic leading-none text-white/100 lg:text-[68px]">
              {aboutPageConfig?.data?.whyUsTitle ??
                'Our distinguished brands boasting a carefully curated selection of lifestyle products.'}
            </div>

            <div className="flex flex-col gap-10 lg:flex-row">
              <div
                className="text-white/70"
                dangerouslySetInnerHTML={{
                  __html:
                    aboutPageConfig?.data?.whyUsDescription ??
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu ultrices sem. Ut volutpat, diam sed facilisis scelerisque, felis quam',
                }}
              ></div>
              <img
                className="aspect-square object-cover"
                src={aboutPageConfig?.data?.whyUsImage?.cdnUrl ?? '/assets/about_tla_person.png'}
                alt="TLA office"
              />
            </div>
          </div>

          <div className="basis-2/5">
            <img
              className="aspect-[504/569] object-cover h-full"
              src={aboutPageConfig?.data?.whyUsBanner?.cdnUrl ?? '/assets/about_tla_building.png'}
              alt="TlA Building"
            />
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="border-b border-b-white/30 bg-black/100 py-10">
        <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
          <div className="basis-1/2 font-serif text-[80px] italic text-white/100">Vision</div>
          <div className="basis-1/2 text-center text-white/80 lg:text-left">
            {aboutPageConfig?.data?.vision ??
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu ultrices sem. Ut volutpat, diam sed facilisis scelerisque, felis quam aliquam ligula, sed gravida libero erat quis est. Cras vel elementum turpis. Aliquam sollicitudin pharetra consectetur'}
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-black/100 pb-24 pt-10">
        <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
          <div className="basis-1/2 font-serif text-[80px] italic text-white/100">Mission</div>
          <div className="basis-1/2 text-center text-white/80 lg:text-left">
            {aboutPageConfig?.data?.mission ??
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu ultrices sem. Ut volutpat, diam sed facilisis scelerisque, felis quam aliquam ligula, sed gravida libero erat quis est. Cras vel elementum turpis. Aliquam sollicitudin pharetra consectetur'}
          </div>
        </div>
      </SectionContainer>

      {/* Our Services */}
      <SectionContainer>
        <SectionTitle>Our Services</SectionTitle>
        <div className="flex flex-col gap-8 lg:flex-row">
          <SectionQuote className="basis-3/5 font-normal">
            {aboutPageConfig?.data?.ourServiceTitle ?? 'Enriching your life with premier and diverse services'}
          </SectionQuote>

          <SectionDesc className="basis-2/5">
            <p
              dangerouslySetInnerHTML={{
                __html:
                  aboutPageConfig?.data?.outServiceDescription ??
                  `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu ultrices sem. Ut volutpat, diam sed
facilisis scelerisque, felis quam
<br />
<br />
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu ultrices sem. Ut volutpat, diam sed
facilisis scelerisque, felis quam aliquam ligula, sed gravida libero erat quis est.
                `,
              }}
            ></p>
          </SectionDesc>
        </div>
      </SectionContainer>

      {/* Services List */}
      <div className="group relative flex gap-8 overflow-hidden whitespace-nowrap lg:gap-10">
        <div className="mb-16 flex w-max flex-shrink-0 animate-slide-left gap-8 overflow-hidden lg:gap-10 ">
          {aboutPageConfig?.data?.ourServiceImages?.map(({ cdnUrl, id }) => (
            <div
              key={id}
              style={{ backgroundImage: `url('${cdnUrl}')` }}
              className="relative flex h-[440px] w-[330px] flex-shrink-0 flex-col justify-end bg-cover p-8"
            >
              {/* <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#66615D] to-transparent"></div>
              <div className="relative z-10 text-wrap font-serif text-[44px] italic leading-[39.6px] text-white/100">
                {name}
              </div> */}
            </div>
          ))}
        </div>
        <div className="mb-16 flex w-max flex-shrink-0 animate-slide-left gap-8 overflow-hidden lg:gap-10 ">
          {aboutPageConfig?.data?.ourServiceImages?.map(({ cdnUrl, id }) => (
            <div
              key={id}
              style={{ backgroundImage: `url('${cdnUrl}')` }}
              className="relative flex h-[440px] w-[330px] flex-shrink-0 flex-col justify-end bg-cover p-8"
            >
              {/* <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#66615D] to-transparent"></div>
              <div className="relative z-10 text-wrap font-serif text-[44px] italic leading-[39.6px] text-white/100">
                {name}
              </div> */}
            </div>
          ))}
        </div>
      </div>

      {/* Who we are */}
      <SectionContainer>
        <SectionTitle>Who We Are</SectionTitle>
        <div className="flex flex-col gap-8 lg:flex-row">
          <SectionQuote className="basis-3/5 font-normal">
            {aboutPageConfig?.data?.whoWeAreTitle ??
              'Orchestrates a masterpiece where architecture and interior design meet craftsmanship'}
          </SectionQuote>

          <SectionDesc className="basis-2/5">
            <p
              dangerouslySetInnerHTML={{
                __html:
                  aboutPageConfig?.data?.whoWeAreDescription ??
                  `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu ultrices sem. Ut volutpat, diam sed
facilisis scelerisque, felis quam
<br />
<br />
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu ultrices sem. Ut volutpat, diam sed
facilisis scelerisque, felis quam aliquam ligula, sed gravida libero erat quis est.
            `,
              }}
            ></p>
          </SectionDesc>
        </div>
      </SectionContainer>

      <div className="group relative overflow-hidden whitespace-nowrap">
        <div className="inline-block w-max animate-slide-left overflow-hidden">
          <SectionGalery images={aboutPageConfig?.data?.whoWeAreImages?.map(({ cdnUrl }) => cdnUrl) ?? []} />
        </div>
        <div className="inline-block w-max animate-slide-left overflow-hidden">
          <SectionGalery images={aboutPageConfig?.data?.whoWeAreImages?.map(({ cdnUrl }) => cdnUrl) ?? []} />
        </div>
      </div>
    </main>
  );
}

const services = [
  {
    name: 'Layouting Service',
    image: '/assets/services/layout_service.png',
  },
  {
    name: 'Customization',
    image: '/assets/services/customization.png',
  },
  {
    name: 'Interior Design Service',
    image: '/assets/services/interior_design_service.png',
  },
  {
    name: 'Interior Styling',
    image: '/assets/services/interior_styling.png',
  },
];
