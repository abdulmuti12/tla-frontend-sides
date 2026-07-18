import { FetchPressByIdApiResponse } from '~/types/fetchPressById';

export async function fetchPressById(id: string): Promise<FetchPressByIdApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/press-releases/${id}`);
    const raw = await response.json();
    if (!raw) return null;
    return {
      meta: raw.meta ?? { method: 'GET', path: `/press-releases/${id}` },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? 200,
      data: raw.data ?? raw,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
