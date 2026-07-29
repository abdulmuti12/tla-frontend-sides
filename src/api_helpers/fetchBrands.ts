import { FetchBrandsApiResponse } from '~/types/fetchBrandsApi';

export async function fetchBrands(): Promise<FetchBrandsApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/brands`);

    // Periksa apakah request berhasil (status 200-299)
    if (!response.ok) {
      console.error(`Error fetching brands: HTTP ${response.status} - ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return {
      meta: { method: 'GET', path: '/brands' },
      success: true,
      statusCode: response.status,
      data: data.data ?? data,
    };
  } catch (error) {
    console.error('Error fetching brands:', error);
    return null;
  }
}
