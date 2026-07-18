import { getAPIKey } from './getAPiKey';

export async function fetchHomePageConfig(): Promise<FetchHomePageConfigApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/page-data/home`);
    const raw = await response.json();
    const data = raw?.data ?? raw;
    if (!data) return null;
    return {
      meta: raw?.meta ?? { method: 'GET', path: '/page-data/home' },
      success: raw?.success ?? true,
      statusCode: raw?.statusCode ?? 200,
      data,
    };
  } catch (error) {
    console.error('Error fetching home page config:', error);
    return null;
  }
}

export async function updateHomePageConfig(data: {
  mainBannerTitle: string;
  mainBannerDescription: string;
  mainBannerImageId: string;
  aboutUsTitle: string;
  aboutUsDescription: string;
  aboutUsBannerImageId: string;
  pressTitle: string;
  pressDescription: string;
  catalogueDescription: string;
  termsAndConditionsUrl?: string;
  privacyPolicyUrl?: string;
}): Promise<FetchHomePageConfigApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/page-data/home`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating home page config:', error);
    return null;
  }
}

export interface FetchHomePageConfigApiResponse {
  meta: {
    method: string;
    path: string;
  };
  success: boolean;
  statusCode: number;
  data: {
    aboutUsDescription: string;
    aboutUsTitle: string;
    catalogueDescription: string;
    mainBannerDescription: string;
    mainBannerTitle: string;
    pressDescription: string;
    pressTitle: string;
    updatedAt: string;
    id: string;
    aboutUsBannerImage: {
      name: string;
      cdnUrl: string;
      localUrl: string;
      filePath: string;
      fileType: string;
      createdAt: string;
      updatedAt: string;
      id: string;
    };
    mainBannerImage: {
      name: string;
      cdnUrl: string;
      localUrl: string;
      filePath: string;
      fileType: string;
      createdAt: string;
      updatedAt: string;
      id: string;
    };
    termsAndConditionsUrl?: string;
    privacyPolicyUrl?: string;
  };
}
