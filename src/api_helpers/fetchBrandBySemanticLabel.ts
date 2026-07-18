import { FetchBrandByIdApiResponse } from '~/types/fetchBrandByIdApi';

export async function fetchBrandBySemanticLabel(semanticLabel: string): Promise<FetchBrandByIdApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/brands/semantic/${semanticLabel}`);
    const raw = await response.json();
    if (!raw) return null;
    return {
      meta: raw.meta ?? { method: 'GET', path: `/brands/semantic/${semanticLabel}` },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? 200,
      data: raw.data ?? raw,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
