import { twMerge } from 'tailwind-merge';

import ArrowRight from '~/components/Icons/ArrowRight';

export interface CatalogueItemProps {
  className?: string;
  image: string;
  brand: string;
  downloadUrl: string;
}

export default function CatalogueItem({ className, image, brand, downloadUrl }: CatalogueItemProps) {
  const onClickDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  return (
    <div
      className={twMerge(
        'w-[296px] flex-shrink-0 first:ml-8 md:first:ml-20 last:mr-8 md:last:mr-20 cursor-pointer group',
        className,
      )}
      onClick={onClickDownload}
    >
      <img
        alt={brand}
        src={image}
        className="mb-4 w-[296px] drop-shadow-lg transition-all duration-300 ease-out group-hover:scale-[1.005]"
      />
      <h5 className="mb-3 text-[22px] font-bold leading-snug text-black/100">{brand}</h5>
      <button className="flex items-center gap-2 border-b border-transparent text-xs font-medium text-black/100 transition-all duration-150 group-hover:border-black/100">
        DOWNLOAD
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
