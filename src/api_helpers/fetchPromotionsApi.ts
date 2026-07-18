import { FetchPromotionsApiResponse } from '~/types/fetchPromotionsApi';

function wrap(raw: any, page: number): FetchPromotionsApiResponse | null {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    return {
      meta: { method: 'GET', path: '/promotions' },
      success: true,
      statusCode: 200,
      data: raw,
      pageMeta: { page, limit: raw.length, pageCount: 1, totalCount: raw.length },
    };
  }
  if (raw?.promotions) {
    return {
      meta: raw.meta ?? { method: 'GET', path: '/promotions' },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? 200,
      data: raw.promotions,
      pageMeta: raw.pageMeta ?? { page, limit: raw.promotions.length, pageCount: 1, totalCount: raw.count ?? raw.promotions.length },
    };
  }
  return {
    meta: raw.meta ?? { method: 'GET', path: '/promotions' },
    success: raw.success ?? true,
    statusCode: raw.statusCode ?? 200,
    data: Array.isArray(raw.data) ? raw.data : [],
    pageMeta: raw.pageMeta ?? { page, limit: 10, pageCount: 1, totalCount: 0 },
  };
}

export async function fetchPromotionsApi({
  limit,
  page,
  brandId,
}: {
  limit: number;
  page: number;
  brandId?: string;
}): Promise<FetchPromotionsApiResponse | null> {
  try {
    let response;
    if (brandId && brandId !== 'all') {
      response = await fetch(`${process.env.API_HOST}/promotions/brands/${brandId}?limit=${limit}&page=${page}`);
    } else {
      response = await fetch(`${process.env.API_HOST}/promotions?limit=${limit}&page=${page}`);
    }
    const raw = await response.json();
    return wrap(raw, page);
  } catch (error) {
    console.error(error);
    return null;
  }
}
