import ScrollIcon from '~/components/ScrollIcon/ScrollIcon';

export default function Hero({
  mainBannerDescription,
  mainBannerImage,
}: {
  mainBannerDescription?: string;
  mainBannerImage?: string;
}) {
  return (
    <div
      className="relative flex h-[100vh] w-full flex-col gap-2 px-3 py-6 text-white md:gap-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${mainBannerImage ?? '/assets/2687_Divano_Air_Generale_1.png'})` }}
    >
      <div className="absolute inset-0 rounded-full bg-black opacity-10 blur-3xl"></div>
      <span className="relative z-10 mx-8 mt-24 overflow-visible font-serif text-[12vw] font-medium leading-none lg:mx-32 lg:text-[100px] lg:leading-[67.5px]">
        ONE STOP
      </span>
      <span className="relative z-10 ml-8 font-serif text-[12vw] font-medium leading-none lg:ml-[20vw] lg:text-[100px] lg:leading-[67.5px]">
        LUXURY
      </span>
      <div className="relative z-10 mx-8 flex flex-col gap-4 lg:mx-32 lg:flex-row lg:gap-[52px]">
        <span className="font-serif text-[12vw] font-medium leading-none lg:text-[100px] lg:leading-[67.5px]">
          DESTINATION
        </span>
        <span
          className="text-sm lg:text-base"
          dangerouslySetInnerHTML={{
            __html:
              mainBannerDescription ??
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel tempus tortor, sit amet tempor arcu. Maecenas aliquam urna id felis fringilla sodales.',
          }}
        ></span>
      </div>
      <div className="absolute bottom-16 left-0 z-10 flex w-full flex-col items-center justify-center gap-2">
        <ScrollIcon />
        <span className="text-xs font-medium leading-[18px]">SCROLL FOR MORE</span>
      </div>
    </div>
  );
}
