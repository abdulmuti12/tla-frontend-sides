/**
 * Resolves API image URLs to URLs that will load on the Next.js frontend.
 *
 * The Next.js rewrites `/static/*` to the backend API server, so /static/ paths
 * just need to be passed through.
 *
 * For brands whose backend files are missing (e.g. casa-italia), map to local
 * public/assets paths instead.
 */

const BRAND_ASSETS: Record<string, Record<string, string>> = {
  'casa-italia': {
    heroImage: '/assets/brand_logo/Casa_Italia_BG.jpg',
    logo: '/assets/brand_logo/casa_italia.png',
    contactImage: '/assets/brand_logo/Casa_Italia_BG.jpg',
  },
};

/**
 * Pass through API URLs. /static/ paths are proxied to the backend via Next.js rewrites.
 */
export function resolveImageUrl(url: string | undefined): string {
  if (!url) return '';
  return url;
}

/**
 * Apply brand-specific local asset fallbacks for /static/ paths.
 * Use this for the public-facing brand page when brand backend files are missing.
 */
export function resolveLocalImage(url: string | undefined, brandSemanticLabel?: string): string {
  if (!url) return '';

  if (brandSemanticLabel && BRAND_ASSETS[brandSemanticLabel]) {
    const map = BRAND_ASSETS[brandSemanticLabel];

    if (url.startsWith('/static/brand_hero_image/')) return map.heroImage || url;
    if (url.startsWith('/static/brand_logo_image/')) return map.logo || url;
    if (url.startsWith('/static/dev/') || url.startsWith('/static/brand_contact_image/')) {
      return map.logo || url;
    }
  }

  return url;
}
