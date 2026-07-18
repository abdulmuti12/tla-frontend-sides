import { create } from 'zustand';
import { FetchHomePageConfigApiResponse } from '~/api_helpers/fetchHomePageConfig';

interface HomepageConfigStore {
  homepageConfig: FetchHomePageConfigApiResponse | null;
  setHomepageConfig: (config: FetchHomePageConfigApiResponse | null) => void;
}

export const useHomepageConfigStore = create<HomepageConfigStore>((set) => ({
  homepageConfig: null,
  setHomepageConfig: (config: FetchHomePageConfigApiResponse | null) => set({ homepageConfig: config }),
}));
