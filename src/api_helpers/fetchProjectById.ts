import { fetchProjectByIdApiResponse } from '~/types/fetchProjectById';

export async function fetchProjectById(projectId: string): Promise<fetchProjectByIdApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/projects/${projectId}`);
    const raw = await response.json();
    if (!raw) return null;
    return {
      meta: raw.meta ?? { method: 'GET', path: `/projects/${projectId}` },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? 200,
      data: raw.data ?? raw,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
