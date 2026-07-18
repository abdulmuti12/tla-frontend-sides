import { FetchPressReleasesResponse } from '~/types/fetchPressReleasesApi';

function wrapPress(raw: any, page: number): FetchPressReleasesResponse | null {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    return {
      meta: { method: 'GET', path: '/press-releases' },
      success: true,
      statusCode: 200,
      data: raw,
      pageMeta: { page, limit: raw.length, pageCount: 1, totalCount: raw.length },
    };
  }
  if (raw?.pressReleases) {
    return {
      meta: raw.meta ?? { method: 'GET', path: '/press-releases' },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? 200,
      data: raw.pressReleases,
      pageMeta: raw.pageMeta ?? { page, limit: raw.pressReleases.length, pageCount: 1, totalCount: raw.count ?? raw.pressReleases.length },
    };
  }
  return {
    meta: raw.meta ?? { method: 'GET', path: '/press-releases' },
    success: raw.success ?? true,
    statusCode: raw.statusCode ?? 200,
    data: Array.isArray(raw.data) ? raw.data : [],
    pageMeta: raw.pageMeta ?? { page, limit: 10, pageCount: 1, totalCount: 0 },
  };
}

export async function fetchPressReleases({
  limit = 10,
  page = 1,
  brandId,
}: {
  limit: number;
  page: number;
  brandId?: string;
}): Promise<FetchPressReleasesResponse | null> {
  try {
    let response;
    if (brandId && brandId !== 'all') {
      response = await fetch(
        `${process.env.API_HOST}/press-releases/brands/${brandId}?limit=${limit}&page=${page}`,
      );
    } else {
      response = await fetch(`${process.env.API_HOST}/press-releases?limit=${limit}&page=${page}`);
    }
    const raw = await response.json();
    return wrapPress(raw, page);
  } catch (error) {
    console.error('Error fetching press releases:', error);
    return null;
  }
}
