import { twMerge } from 'tailwind-merge';

export default function Close({ className }: { className?: string }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge('h-4 w-4', className)}
    >
      <path d="M22.5 7.5L7.5 22.5" stroke="#231F20" strokeLinecap="square" strokeLinejoin="round" />
      <path d="M7.5 7.5L22.5 22.5" stroke="#231F20" strokeLinecap="square" strokeLinejoin="round" />
    </svg>
  );
}
