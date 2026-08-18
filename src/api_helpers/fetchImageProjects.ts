import { FetchImageProjectsApiResponse } from '~/types/imageProjectApi';
import { getAPIKey } from './getAPiKey';

export async function fetchImageProjectsByProjectId(projectId: string): Promise<FetchImageProjectsApiResponse | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/image-projects/projects/${projectId}`, {
      headers: { Authorization: getAPIKey() },
    });
    const raw = await response.json();
    if (!raw) return null;
    return {
      meta: raw.meta ?? { method: 'GET', path: `/image-projects/projects/${projectId}` },
      success: raw.success ?? true,
      statusCode: response.status,
      data: Array.isArray(raw.data) ? raw.data : [],
    };
  } catch (error) {
    console.error('Error fetching image projects:', error);
    return null;
  }
}

export async function deleteImageProject(imageProjectId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${process.env.API_HOST}/image-projects/${imageProjectId}`, {
      method: 'DELETE',
      headers: { Authorization: getAPIKey() },
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting image project:', error);
    return { success: false, message: String(error) };
  }
}

export async function createImageProjectBulk(items: Array<{ image: string; projectId: string }>): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${process.env.API_HOST}/image-projects/bulk`, {
      method: 'POST',
      headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating image projects bulk:', error);
    return { success: false, message: String(error) };
  }
}
