'use client';

import SectionContainer from '~/components/PageSection/SectionContainer';
import SectionTitle from '~/components/PageSection/SectionTitle';

import BrandGrid from '../BrandGrid/BrandGrid';

export default function OurBrands() {
  return (
    <SectionContainer id="brands">
      <SectionTitle className="mb-6">Our Brands</SectionTitle>
      <BrandGrid />
    </SectionContainer>
  );
}
