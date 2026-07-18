import { ProjectApiResponse } from '~/types/ProjectApi';

function wrap(raw: any, page: number, limit: number): ProjectApiResponse | null {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    return {
      meta: { method: 'GET', path: '/projects' },
      success: true,
      statusCode: 200,
      data: raw,
      pageMeta: { page, limit, pageCount: 1, totalCount: raw.length },
    };
  }
  if (raw?.projects) {
    return {
      meta: raw.meta ?? { method: 'GET', path: '/projects' },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? 200,
      data: raw.projects,
      pageMeta: {
        page,
        limit,
        pageCount: 1,
        totalCount: raw.count ?? raw.projects.length,
      },
    };
  }
  return {
    meta: raw.meta ?? { method: 'GET', path: '/projects' },
    success: raw.success ?? true,
    statusCode: raw.statusCode ?? 200,
    data: Array.isArray(raw.data) ? raw.data : [],
    pageMeta: raw.pageMeta ?? { page, limit, pageCount: 1, totalCount: 0 },
  };
}

export async function fetchProjects({
  limit = 10,
  page = 1,
  brandId,
}: {
  limit: number;
  page: number;
  brandId?: string;
}): Promise<ProjectApiResponse | null> {
  try {
    let response;
    if (brandId && brandId !== 'all') {
      response = await fetch(`${process.env.API_HOST}/projects/brands/${brandId}?limit=${limit}&page=${page}`);
    } else {
      response = await fetch(`${process.env.API_HOST}/projects?limit=${limit}&page=${page}`);
    }
    const raw = await response.json();
    return wrap(raw, page, limit);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return null;
  }
}
