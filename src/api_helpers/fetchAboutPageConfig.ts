import { getAPIKey } from './getAPiKey';

export async function fetchAboutPageConfig(): Promise<FetchAboutPageConfigApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/page-data/about-us`);
    const raw = await response.json();
    const data = raw?.data ?? raw;
    if (!data) return null;
    return {
      meta: raw?.meta ?? { method: 'GET', path: '/page-data/about-us' },
      success: raw?.success ?? true,
      statusCode: raw?.statusCode ?? 200,
      data,
    };
  } catch (error) {
    console.error('Error fetching about page config:', error);
    return null;
  }
}

export async function updateAboutPageConfig(data: {
  title: string;
  description: string;
  bannerId: string;
  whyUsTitle: string;
  whyUsDescription: string;
  whyUsBannerId: string;
  whyUsImageId: string;
  vision: string;
  mission: string;
  ourServiceTitle: string;
  outServiceDescription: string;
  ourServiceImageIds: string[];
  whoWeAreTitle: string;
  whoWeAreDescription: string;
  whoWeAreImageIds: string[]; // max 6
}): Promise<FetchAboutPageConfigApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/page-data/about-us`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating about page config:', error);
    return null;
  }
}

export interface FetchAboutPageConfigApiResponse {
  meta: {
    method: string;
    path: string;
  };
  success: boolean;
  statusCode: number;
  data: {
    description: string;
    mission: string;
    ourServiceTitle: string;
    outServiceDescription: string;
    title: string;
    updatedAt: string;
    vision: string;
    whoWeAreDescription: string;
    whoWeAreTitle: string;
    whyUsDescription: string;
    whyUsTitle: string;
    id: string;
    banner: {
      name: string;
      cdnUrl: string;
      filePath: string;
      fileType: string;
      createdAt: string;
      updatedAt: string;
      id: string;
    };
    ourServiceImages: Array<{
      name: string;
      cdnUrl: string;
      filePath: string;
      fileType: string;
      createdAt: string;
      updatedAt: string;
      id?: string;
    }>;
    whoWeAreImages: Array<{
      name: string;
      cdnUrl: string;
      filePath: string;
      fileType: string;
      createdAt: string;
      updatedAt: string;
      id: string;
    }>;
    whyUsBanner: {
      name: string;
      cdnUrl: string;
      filePath: string;
      fileType: string;
      createdAt: string;
      updatedAt: string;
      id: string;
    };
    whyUsImage: {
      name: string;
      cdnUrl: string;
      filePath: string;
      fileType: string;
      createdAt: string;
      updatedAt: string;
      id: string;
    };
  };
}
