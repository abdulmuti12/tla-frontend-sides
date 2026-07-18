/**
 * Maps backend image paths (which may be missing from disk) to local public/assets paths.
 * This bridges the gap when the CDN/static files don't exist locally.
 */
const BRAND_ASSET_MAP: Record<string, Record<string, string>> = {
  'casa-italia': {
    heroImage: '/assets/brand_logo/Casa_Italia_BG.jpg',
    logo: '/assets/brand_logo/casa_italia.png',
    contactImage: '/assets/brand_logo/Casa_Italia_BG.jpg',
    pressRelease: '/assets/Press_release_1.jpg',
  },
};

/**
 * Resolve a CDN URL to a local asset path if the brand has a local image mapping.
 * Returns the original URL if no local image exists (so the backend URL is attempted).
 */
export function resolveLocalImage(url: string | undefined, brandSemanticLabel?: string): string {
  if (!url) return '';

  // If the URL is already a local public path, use it directly
  if (url.startsWith('/assets/') || url.startsWith('http')) return url;

  if (brandSemanticLabel && BRAND_ASSET_MAP[brandSemanticLabel]) {
    const map = BRAND_ASSET_MAP[brandSemanticLabel];

    // heroImage — static/brand_hero_image/
    if (url.startsWith('/static/brand_hero_image/')) {
      return map.heroImage || url;
    }
    // logo — static/dev/ or static/brand_logo_image/
    if (url.startsWith('/static/brand_logo_image/')) {
      return map.logo || url;
    }
    // Generic static paths used for story/detail images
    if (url.startsWith('/static/dev/')) {
      return map.logo || url;
    }
    // Contact images
    if (url.startsWith('/static/brand_contact_image/')) {
      return map.contactImage || url;
    }
  }

  return url;
}

export function resolveLocalImages<T extends { cdnUrl?: string }>(
  items: T[] | undefined,
  brandSemanticLabel?: string,
): (T & { resolvedUrl?: string })[] {
  if (!items) return [];
  return items.map((item) => ({
    ...item,
    resolvedUrl: resolveLocalImage(item.cdnUrl, brandSemanticLabel),
  }));
}
