import SectionContainer from '~/components/PageSection/SectionContainer';

const client_images = [
  '/assets/client_logo/color/ST_REGIS.png',
  '/assets/client_logo/color/JW.png',
  '/assets/client_logo/color/THE_RITZ_CARLTON.png',
  '/assets/client_logo/color/Marriot-Bonvoy.png',
  '/assets/client_logo/color/Bloomberg_Logo.png',
  '/assets/client_logo/color/Garuda_Indonesia.png',
  '/assets/client_logo/color/pakubuwono.png',
  '/assets/client_logo/color/BCA.png',
  '/assets/client_logo/color/Panin_Bank.png',
  '/assets/client_logo/color/BRI.png',
  '/assets/client_logo/color/BNI.png',
  '/assets/client_logo/color/jasamarga.png',
  '/assets/client_logo/color/fifa.png',
  '/assets/client_logo/color/CASA_DOMAINE.png',
  '/assets/client_logo/color/ALAM_SUTERA.png',
  '/assets/client_logo/color/foresta.jpg',
  '/assets/client_logo/color/logo-rgcc.png',
  '/assets/client_logo/color/SCBD.png',
  '/assets/client_logo/color/PIK2.png',
  '/assets/client_logo/color/REGATTA.png',
  '/assets/client_logo/color/gunadarma.png',
  '/assets/client_logo/color/tower_bersama.png',
  '/assets/client_logo/color/Bueluceria.png',
  '/assets/client_logo/color/MM_Galleri.png',
  '/assets/client_logo/color/rans.png',
  '/assets/client_logo/color/Gold_Coast.png',
  '/assets/client_logo/color/Pondok_Indah_Residence_Logo.png',
  '/assets/client_logo/color/SPRINGWOOD.png',
  '/assets/client_logo/color/HORISON.png',

  // '/assets/client_logo/color/HNI.png',
  // '/assets/client_logo/color/PERWIRA_STEEL.png',
  // '/assets/client_logo/color/RR_LOGO.png',
];

export default function OurClients() {
  return (
    <SectionContainer>
      <div className="mb-[60px] w-full text-center font-serif text-[64px] italic">Our Clients</div>

      <div className="flex w-full flex-wrap justify-center gap-x-6 gap-y-8 md:gap-y-[60px]">
        {client_images.map((image) => (
          <img
            src={image}
            className="h-[74px] w-[220px] md:w-[162px] flex-shrink-0 object-contain brightness-110 grayscale transition-all duration-200 hover:scale-105 hover:grayscale-0"
            key={image.split('/').pop()?.split('.')[0]}
            alt={image.split('/').pop()?.split('.')[0]}
          />
        ))}
      </div>
    </SectionContainer>
  );
}

const client_images_grayscale = [
  '/assets/client_logo/alam_sutera.png',
  '/assets/client_logo/bca.png',
  '/assets/client_logo/casa_domaine.png',
  '/assets/client_logo/fifa.png',
  '/assets/client_logo/hni.png',
  '/assets/client_logo/horison.png',
  '/assets/client_logo/jasa_raharja.png',
  '/assets/client_logo/jw_marriot.png',
  '/assets/client_logo/perwira_steel.png',
  '/assets/client_logo/pik2.png',
  '/assets/client_logo/pondok_indah.png',
  '/assets/client_logo/regatta.png',
  '/assets/client_logo/rancamaya.png',
  '/assets/client_logo/ritz_carlton.png',
  '/assets/client_logo/rr_chocolate.png',
  '/assets/client_logo/scbd.png',
  '/assets/client_logo/springwood.png',
  '/assets/client_logo/st_regis.png',
  '/assets/client_logo/gunadarma.png',
];
