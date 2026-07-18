import { FetchBrandByIdApiResponse } from '~/types/fetchBrandByIdApi';

export async function fetchBrandById(brandId: string): Promise<FetchBrandByIdApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/brands/${brandId}`);
    const raw = await response.json();
    if (!raw) return null;
    return {
      meta: raw.meta ?? { method: 'GET', path: `/brands/${brandId}` },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? 200,
      data: raw.data ?? raw,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
