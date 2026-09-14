export interface PanoramaConnection {
  targetId: string;
  yaw: number;
  pitch: number;
  label: string;
}

export interface PanoramaItem {
  id: string;
  name: string;
  url: string;
  desktopUrl: string;
  mobileUrl: string;
  connections: PanoramaConnection[];
}

export async function fetchPanoramaData(): Promise<PanoramaItem[]> {
  const response = await fetch('/api/panorama');
  if (!response.ok) throw new Error(`Failed to fetch panorama data: ${response.status}`);
  const raw = await response.json();
  return Array.isArray(raw.data) ? raw.data : [];
}
