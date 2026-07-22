'use client';

import { useEffect, useState } from 'react';

import { fetchCatalogue } from '~/api_helpers/FetchCatalogue';

import CatalogueItem from '~/components/Catalogue/CatalogueItem';
import SectionContainer from '~/components/PageSection/SectionContainer';
import SectionDesc from '~/components/PageSection/SectionDesc';
import SectionQuote from '~/components/PageSection/SectionQuote';

import { FetchCatalogueResponse } from '~/types/FetchCatalogue';

// const catalogueItems = [
//   {
//     image: "/assets/catalogue_tla/casa_italia.jpeg",
//     brand: "Casa Italia",
//   },
//   {
//     image: "/assets/catalogue_tla/homelogy.jpeg",
//     brand: "Homelogy",
//   },
//   {
//     image: "/assets/catalogue_tla/jands.jpeg",
//     brand: "Jands",
//   },
//   {
//     image: "/assets/catalogue_tla/masterpiece.jpeg",
//     brand: "Masterpiece",
//   },
//   {
//     image: "/assets/catalogue_tla/melba.jpeg",
//     brand: "Casa Italia",
//   },
// ];
export default function OurCatalogue({ catalogueDescription }: { catalogueDescription?: string }) {
  const [catalogueItems, setCatalogueItems] = useState<FetchCatalogueResponse['data']>([]);

  useEffect(() => {
    fetchCatalogue({}).then((data) => {
      setCatalogueItems(data?.data || []);
    });
  }, []);

  return (
    <SectionContainer>
      <div className="mb-10 flex flex-col gap-8 lg:flex-row">
        <SectionQuote className="basis-3/5">Our catalogue</SectionQuote>
        <SectionDesc className="basis-2/5">
          <p
            dangerouslySetInnerHTML={{
              __html:
                catalogueDescription ??
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel tempus tortor, sit amet tempor arcu. Maecenas aliquam urna id felis fringilla sodales.',
            }}
          ></p>
        </SectionDesc>
      </div>

      <div className="-mx-8 md:-mx-20 flex w-screen items-end gap-10 overflow-x-auto scrollbar-hide overflow-visible">
        {catalogueItems.map((item, index) => (
          <CatalogueItem
            key={index}
            image={item.image.cdnUrl}
            brand={item.brand?.name ?? '-'}
            downloadUrl={item.content.cdnUrl}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
