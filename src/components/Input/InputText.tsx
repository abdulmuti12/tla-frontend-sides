import { twMerge } from 'tailwind-merge';

import ArrowRight from '../Icons/ArrowRight';

export default function InputText({
  label,
  name,
  placeholder,
  required = false,
  className,
  size = 'md',
  value,
  button,
  disabled,
  onChange,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  className?: string;
  size?: 'sm' | 'md';
  value?: string;
  button?: React.ReactNode;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={twMerge('relative mb-10 h-11 w-full min-w-[200px]', className)}>
      <input
        placeholder={placeholder}
        className={twMerge(
          'border-blue-gray-200 text-blue-gray-700 placeholder-shown:border-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full border-b bg-transparent pb-1.5 pt-4 font-sans text-xl font-normal outline outline-0 transition-all focus:border-black/30 focus:outline-0 disabled:border-0',
          size === 'sm' ? 'text-sm' : 'text-xl',
        )}
        required={required}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <label
        className={twMerge(
          "after:content[' '] pointer-events-none absolute -top-2.5 left-0 flex h-full w-full select-none !overflow-visible truncate font-normal leading-tight text-black/50 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-black/60 after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-black/50 peer-focus:leading-tight peer-focus:text-black/50 peer-focus:after:scale-x-100 peer-focus:after:border-black/50 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-black/50",
          size === 'sm' ? 'text-[10px] peer-focus:text-[10px]' : 'text-sm peer-focus:text-sm',
        )}
      >
        {label}
        {required && <span>*</span>}
      </label>
      {button}
    </div>
  );
}
