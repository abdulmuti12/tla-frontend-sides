import { FetchCatalogueResponse } from '~/types/FetchCatalogue';

export async function fetchCatalogue({ limit }: { limit?: number }): Promise<FetchCatalogueResponse | null> {
  try {
    const UrlParams = new URLSearchParams();
    if (limit) UrlParams.set('limit', limit.toString());

    const response = await fetch(`${process.env.API_HOST}/catalogues?${UrlParams.toString()}`);
    const raw = await response.json();
    if (!raw) return null;
    if (Array.isArray(raw)) {
      return {
        meta: { method: 'GET', path: '/catalogues' },
        success: true,
        statusCode: 200,
        data: raw,
      };
    }
    return {
      meta: raw.meta ?? { method: 'GET', path: '/catalogues' },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? 200,
      data: raw.data ?? raw,
    };
  } catch (error) {
    console.error('Error fetching catalogue:', error);
    return null;
  }
}
