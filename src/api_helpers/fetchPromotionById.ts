import { FetchPromotionByIdApiResponse } from '~/types/fetchPromotionById';

export async function fetchPromotionById(promotionId: string): Promise<FetchPromotionByIdApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/promotions/${promotionId}`);
    const raw = await response.json();
    if (!raw) return null;
    return {
      meta: raw.meta ?? { method: 'GET', path: `/promotions/${promotionId}` },
      success: raw.success ?? true,
      statusCode: raw.statusCode ?? 200,
      data: raw.data ?? raw,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
