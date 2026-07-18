import { FeaturedProjectApiResponse } from '~/types/FeaturedProjectApi';

export async function fetchFeaturedProjects(): Promise<FeaturedProjectApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/projects/featured`);
    const raw = await response.json();
    if (!raw) return null;
    if (Array.isArray(raw)) {
      return {
        meta: { method: 'GET', path: '/projects/featured' },
        success: true,
        statusCode: 200,
        data: raw,
      };
    }
    if (raw?.projects) {
      return {
        meta: raw.meta ?? { method: 'GET', path: '/projects/featured' },
        success: raw.success ?? true,
        statusCode: raw.statusCode ?? 200,
        data: raw.projects,
      };
    }
    return {
      meta: raw.meta ?? { method: 'GET', path: '/projects/featured' },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? 200,
      data: raw.data ?? raw,
    };
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return null;
  }
}
