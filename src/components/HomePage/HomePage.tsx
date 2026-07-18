'use client';

import { useHomepageConfigStore } from '~/store/homepage-config-store';

import FeaturedProjects from '~/components/HomePage/FeaturedProjects';
import Hero from '~/components/HomePage/Hero';
import OurBrands from '~/components/HomePage/OurBrands';
import OurCatalogue from '~/components/HomePage/OurCatalogue';
import OurClients from '~/components/HomePage/OurClients';
import PressRelease from '~/components/HomePage/PressRelease';
import WhoWeAre from '~/components/HomePage/WhoWeAre';

export default function HomePage() {
  const { homepageConfig } = useHomepageConfigStore();

  if (!homepageConfig || !homepageConfig.data) return <main className="min-h-screen"></main>;
  const data = homepageConfig.data;
  return (
    <main className="min-h-screen">
      <Hero
        mainBannerDescription={data.mainBannerDescription}
        mainBannerImage={data.mainBannerImage?.localUrl}
      />
      <WhoWeAre
        aboutUsTitle={data.aboutUsTitle}
        aboutUsDescription={data.aboutUsDescription}
        aboutUsImage={data.aboutUsBannerImage?.localUrl}
      />
      <OurBrands />
      <FeaturedProjects />
      <OurClients />
      <PressRelease
        pressTitle={data.pressTitle}
        pressDescription={data.pressDescription}
      />
      <OurCatalogue catalogueDescription={data.catalogueDescription} />
    </main>
  );
}
