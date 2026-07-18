'use client';

import { useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';
import { fetchBrands } from '~/api_helpers/fetchBrands';
import { useColorConfigStore } from '~/store/color-config-store';

import FooterContent from '~/components/Footer/FooterContent';
import FooterCopyright from '~/components/Footer/FooterCopyright';
import FooterLinksSection from '~/components/Footer/FooterLinksSection';

import FooterLinks, { FooterLinksProps } from './FooterLinks';

const quickLinks: FooterLinksProps = {
  title: 'Quick Links',
  links: [
    {
      href: '/about',
      title: 'About Us',
    },
    {
      href: '/projects?tab=press',
      title: 'Featured News',
    },
    {
      href: '/contact',
      title: 'Contact Us',
    },
    {
      href: 'https://www.google.com/maps/dir/?api=1&destination=Jakarta+Design+Center+1st+Floor+SR+09-10,+RT.10/RW.6,+Petamburan,+Kecamatan+Tanah+Abang,+Kota+Jakarta+Pusat,+Daerah+Khusus+Ibukota+Jakarta+10260',
      title: 'Office Location',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  ],
};
const socialLinks: FooterLinksProps = {
  title: 'Social',
  links: [
    {
      href: 'https://www.instagram.com/casaitalialiving/',
      title: 'Instagram',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    {
      href: 'https://www.facebook.com/profile.php?id=100015048008665',
      title: 'Facebook',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    {
      href: 'https://www.youtube.com/@TheluxuryasiaGroup',
      title: 'Youtube',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    {
      href: 'https://www.linkedin.com/in/the-luxury-asia-group-0762a7283',
      title: 'Linkedin',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  ],
};

// const brandLinks: FooterLinksProps = {
//   title: "Brands",
//   links: [
//     {
//       href: "/brand",
//       title: "Casa Italia",
//     },
//     {
//       href: "/brand",
//       title: "Homeology",
//     },
//     {
//       href: "/brand",
//       title: "Meiba",
//     },
//     {
//       href: "/brand",
//       title: "Masterpiece",
//     },
//     {
//       href: "/brand",
//       title: "Polflex Office",
//     },
//     {
//       href: "/brand",
//       title: "Jands",
//     },
//     {
//       href: "/brand",
//       title: "Archtemy",
//     },
//   ],
// };

export default function Footer() {
  const { config } = useColorConfigStore();
  const [brandLinks, setBrandLinks] = useState<FooterLinksProps>({
    title: 'Brands',
    links: [],
  });

  useEffect(() => {
    fetchBrands().then((data) => {
      if (!data) return;
      setBrandLinks({
        title: 'Brands',
        links: data?.data.map((brand) => ({
          href: `/brand/${brand.semanticLabel}`,
          title: brand.name,
        })),
      });
    });
  }, []);

  return (
    <div
      style={{
        backgroundColor: config.rawColor.bg,
        borderColor: config.rawColor.border,
        color: config.rawColor.text,
      }}
      className={twMerge(config.bg, config.border, config.text)}
    >
      <div
        style={{ borderColor: config.rawColor.border }}
        className={twMerge('flex w-full flex-col border-t sm:flex-row', config.border)}
      >
        <FooterContent className="flex-grow-0 basis-full sm:basis-[43%]" />
        <FooterLinksSection className="flex-grow-0 basis-full sm:basis-[28.5%]">
          <FooterLinks {...quickLinks} />
          <FooterLinks {...socialLinks} />
        </FooterLinksSection>
        <FooterLinksSection className="flex-grow-0 basis-full sm:basis-[28.5%]">
          <FooterLinks {...brandLinks} />
        </FooterLinksSection>
      </div>
      <FooterCopyright />
    </div>
  );
}
