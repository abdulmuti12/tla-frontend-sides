import { FetchBrandByIdApiResponse } from '~/types/fetchBrandByIdApi';

export async function fetchBrandById(brandId: string): Promise<FetchBrandByIdApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/brands/${brandId}`);

    // Periksa apakah request berhasil (status 200-299)
    if (!response.ok) {
      console.error(`Error fetching brand by ID ${brandId}: HTTP ${response.status} - ${response.statusText}`);
      return null;
    }

    const raw = await response.json();
    if (!raw) return null;

    return {
      meta: raw.meta ?? { method: 'GET', path: `/brands/${brandId}` },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? response.status,
      data: raw.data ?? raw,
    };
  } catch (error) {
    console.error('Error fetching brand by ID:', error);
    return null;
  }
}
