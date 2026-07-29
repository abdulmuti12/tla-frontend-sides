import { FetchBrandByIdApiResponse } from '~/types/fetchBrandByIdApi';

export async function fetchBrandBySemanticLabel(semanticLabel: string): Promise<FetchBrandByIdApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/brands/semantic/${semanticLabel}`);

    // Periksa apakah request berhasil (status 200-299)
    if (!response.ok) {
      console.error(`Error fetching brand by semantic label ${semanticLabel}: HTTP ${response.status} - ${response.statusText}`);
      return null;
    }

    const raw = await response.json();
    if (!raw) return null;

    return {
      meta: raw.meta ?? { method: 'GET', path: `/brands/semantic/${semanticLabel}` },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? response.status,
      data: raw.data ?? raw,
    };
  } catch (error) {
    console.error('Error fetching brand by semantic label:', error);
    return null;
  }
}
