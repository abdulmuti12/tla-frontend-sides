import { create } from 'zustand';

interface ColorConfig {
  text: string;
  bg: string;
  border: string;
  accent_text: string;
  navbar: string;
  rawColor: {
    text?: string;
    secondaryText?: string;
    bg?: string;
    border?: string;
    accent_text?: string;
    navbar?: string;
  };
}

interface ColorConfigStore {
  config: ColorConfig;
  setConfig: (config: Partial<ColorConfig>) => void;
  resetConfig: () => void;
}

const defaultConfig: ColorConfig = {
  text: 'text-black/100',
  bg: 'bg-BG/Cream',
  border: 'border-black/30',
  accent_text: 'text-black/50',
  navbar: 'text-white/100',
  rawColor: {
    text: 'rgba(35, 31, 32, 1)', // black/100
    secondaryText: 'rgba(35, 31, 32, 1)', // black/100
    bg: 'rgba(247, 246, 241, 1)', // BG/Cream
    border: 'rgba(35, 31, 32, 0.3)', // black/30
    accent_text: 'rgba(35, 31, 32, 0.5)', // black/50
    navbar: 'rgba(255, 255, 255, 1)', // white/100
  },
};

// This function will store color as class name
export const useColorConfigStore = create<ColorConfigStore>((set) => ({
  config: defaultConfig,
  setConfig: (config: Partial<ColorConfig>) =>
    set((state) => ({
      config: { ...state.config, ...config },
    })),
  resetConfig: () => set({ config: defaultConfig }),
}));
