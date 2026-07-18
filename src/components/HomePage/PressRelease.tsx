'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { fetchPressReleases } from '~/api_helpers/fetchPressReleases';
import { useColorConfigStore } from '~/store/color-config-store';

import Button from '~/components/Button/Button';
import ArrowRight from '~/components/Icons/ArrowRight';
import SectionContainer from '~/components/PageSection/SectionContainer';
import SectionDesc from '~/components/PageSection/SectionDesc';
import SectionQuote from '~/components/PageSection/SectionQuote';
import SectionTitle from '~/components/PageSection/SectionTitle';
import PressReleaseItem from '~/components/PressRelease/PressReleaseItem';

import { FetchPressReleasesResponse } from '~/types/fetchPressReleasesApi';
import { resolveLocalImage } from '~/helpers/resolveLocalImage';

export default function PressRelease({
  brandId,
  className,
  style,
  showCta = true,
  pressTitle,
  pressDescription,
  brandSemanticLabel,
}: {
  brandId?: string;
  className?: string;
  style?: React.CSSProperties;
  showCta?: boolean;
  pressTitle?: string;
  pressDescription?: string;
  brandSemanticLabel?: string;
}) {
  const router = useRouter();
  const { config } = useColorConfigStore();
  const [pressReleases, setPressReleases] = useState<FetchPressReleasesResponse['data']>([]);

  useEffect(() => {
    fetchPressReleases({ limit: 6, page: 1, brandId }).then((data) => {
      setPressReleases(data?.data || []);
    });
  }, [brandId]);

  return (
    <SectionContainer
      style={{ color: config.text, backgroundColor: config.bg, ...style }}
      className={`${config.text} ${className}`}
    >
      <SectionTitle>Press Release</SectionTitle>
      <div className="mb-10 flex flex-col gap-8 lg:flex-row">
        <SectionQuote className="basis-3/5">{pressTitle ?? 'Discover our latest updates and inspiration'}</SectionQuote>
        {showCta && (
          <SectionDesc className="basis-2/5">
            <p
              dangerouslySetInnerHTML={{
                __html:
                  pressDescription ??
                  ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel tempus tortor, sit amet tempor arcu. Maecenas aliquam urna id felis fringilla sodales.',
              }}
            ></p>

            <Button
              className="transition-all duration-150 hover:border-black/80 hover:bg-black/80 hover:text-white"
              onClick={() => router.push('/projects?tab=press')}
            >
              <span className="uppercase">View All</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </SectionDesc>
        )}
      </div>

      <div className="-mx-8 md:-mx-20 flex w-screen items-end gap-10 overflow-x-auto scrollbar-hide">
        {pressReleases.map((item, index) =>
          item.image?.cdnUrl && item.brand?.name ? (
            <PressReleaseItem
              key={index}
              id={item.id}
              image={resolveLocalImage(item.image.cdnUrl, brandSemanticLabel)}
              title={item.title}
              subTitle={`${new Date(item.createdAt).toLocaleDateString()}`}
              brand={item.brand.name}
            />
          ) : null,
        )}
      </div>
      {pressReleases.length === 0 && <div className="">No press releases found for this brand</div>}
    </SectionContainer>
  );
}

// const pressRelaseItems: PressReleaseItemProps[] = [
//   {
//     image: "/assets/Press_release_1.jpg",
//     brand: "Casa Italia",
//     title:
//       "The Compendium of Luxury Living that Offers Design Philosophy, Essentiality and Interiors",
//     subTitle: "BCA Solitaire Prioritas Magazine - December  2023",
//   },
//   {
//     image: "/assets/Press_release_2.jpg",
//     brand: "Casa Italia",
//     title: "New Concept Store of Casa Italia",
//     subTitle: "Elle Indonesia Magazine - September 2023",
//   },
//   {
//     image: "/assets/Press_release_3.jpg",
//     brand: "The Luxury Asia Living",
//     title: "The Creative Life by Claudia Apriliana",
//     subTitle: "Prestige Indonesia - October 2022",
//   },
//   {
//     image: "/assets/Press_release_1.jpg",
//     brand: "Casa Italia",
//     title:
//       "The Compendium of Luxury Living that Offers Design Philosophy, Essentiality and Interiors",
//     subTitle: "BCA Solitaire Prioritas Magazine - December  2023",
//   },
//   {
//     image: "/assets/Press_release_2.jpg",
//     brand: "Casa Italia",
//     title: "New Concept Store of Casa Italia",
//     subTitle: "Elle Indonesia Magazine - September 2023",
//   },
//   {
//     image: "/assets/Press_release_3.jpg",
//     brand: "The Luxury Asia Living",
//     title: "The Creative Life by Claudia Apriliana",
//     subTitle: "Prestige Indonesia - October 2022",
//   },
// ];
