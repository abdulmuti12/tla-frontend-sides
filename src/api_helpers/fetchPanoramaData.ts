export interface PanoramaItem {
  id: string;
  name: string;
  url: string;         // default URL (desktop优先)
  desktopUrl: string;  // always desktop
  mobileUrl: string;   // always mobile
}

export async function fetchPanoramaData(): Promise<PanoramaItem[]> {
  const response = await fetch('/api/panorama');
  if (!response.ok) throw new Error(`Failed to fetch panorama data: ${response.status}`);
  const raw = await response.json();
  return Array.isArray(raw.data) ? raw.data : [];
}
