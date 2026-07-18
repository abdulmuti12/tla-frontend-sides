import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)'],
        serif: ['var(--font-cormorant-garamond)'],
      },
      colors: {
        'BG/Black': 'rgba(32, 32, 32, 1)',
        'BG/Cream': 'rgba(247, 246, 241, 1)',
        'black/30': 'rgba(35, 31, 32, 0.3)',
        'black/40': 'rgba(35, 31, 32, 0.4)',
        'black/50': 'rgba(35, 31, 32, 0.5)',
        'black/70': 'rgba(35, 31, 32, 0.7)',
        'black/100': 'rgba(35, 31, 32, 1)',
        'white/30': 'rgba(255, 255, 255, 0.3)',
        'white/50': 'rgba(255, 255, 255, 0.5)',
        'white/70': 'rgba(255, 255, 255, 0.7)',
        'white/100': 'rgba(255, 255, 255, 1)',
      },
      keyframes: {
        'slide-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'slide-left': 'slide-left 35s linear infinite',
      },
      safelist: [
        'group/designer-0',
        'group/designer-1',
        'group/designer-2',
        'group/designer-3',
        'group/designer-4',
        'group/designer-5',
        'group/designer-6',
      ],
    },
  },
  plugins: [require('tailwind-scrollbar-hide'), require('@tailwindcss/typography')],
};
export default config;
