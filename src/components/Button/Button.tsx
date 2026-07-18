import { twMerge } from 'tailwind-merge';

export default function Button({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={twMerge(
        `flex items-center gap-2 rounded-full border border-black/30 px-4 py-2 text-xs text-black/100`,
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
