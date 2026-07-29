import { FetchDesignerByBrandIdResponse } from '~/types/fetchDesignerByBrandId';

export async function fetchDesignerByBrandId(brandId: string): Promise<FetchDesignerByBrandIdResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/designers/brands/${brandId}`);

    // Periksa apakah request berhasil (status 200-299)
    if (!response.ok) {
      console.error(`Error fetching designers by brand ID ${brandId}: HTTP ${response.status} - ${response.statusText}`);
      return null;
    }

    const raw = await response.json();
    if (!raw) return null;

    if (Array.isArray(raw)) {
      return {
        meta: { method: 'GET', path: `/designers/brands/${brandId}` },
        success: true,
        statusCode: response.status,
        data: raw,
      };
    }

    return {
      meta: raw.meta ?? { method: 'GET', path: `/designers/brands/${brandId}` },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? response.status,
      data: raw.data ?? raw,
    };
  } catch (error) {
    console.error('Error fetching designers by brand ID:', error);
    return null;
  }
}
