import { FetchBrandsApiResponse } from '~/types/fetchBrandsApi';

export async function fetchBrands(): Promise<FetchBrandsApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/brands`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return null;
  }
}
