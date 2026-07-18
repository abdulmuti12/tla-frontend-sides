import { FetchDesignerByBrandIdResponse } from '~/types/fetchDesignerByBrandId';

export async function fetchDesignerByBrandId(brandId: string): Promise<FetchDesignerByBrandIdResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/designers/brands/${brandId}`);
    const raw = await response.json();
    if (!raw) return null;
    if (Array.isArray(raw)) {
      return {
        meta: { method: 'GET', path: `/designers/brands/${brandId}` },
        success: true,
        statusCode: 200,
        data: raw,
      };
    }
    return {
      meta: raw.meta ?? { method: 'GET', path: `/designers/brands/${brandId}` },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? 200,
      data: raw.data ?? raw,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
