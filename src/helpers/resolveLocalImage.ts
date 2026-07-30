/**
 * Resolves API image URLs to URLs that will load on the Next.js frontend.
 *
 * For /static/* paths the URL is rewritten to point at the API host root
 * (API_HOST has a trailing /api prefix; static files live at the host root,
 * not under /api). Already-absolute URLs are passed through.
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

export function resolveImageUrl(url: string | undefined): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const apiHost = (process.env.NEXT_PUBLIC_API_HOST || process.env.API_HOST || '').replace(/\/api$/, '');
  const staticBase = process.env.NEXT_PUBLIC_STATIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || apiHost;
  return `${staticBase}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Rewrite <img src="..."> inside an HTML string so relative URLs (e.g. "/static/...")
 * get prefixed with the static host. Keeps absolute URLs and non-img tags untouched.
 */
export function rewriteHtmlImageUrls(html: string): string {
  if (!html) return '';
  return html.replace(/<img\b([^>]*?)\bsrc=("([^"]*)"|'([^']*)')/gi, (match, attrs, _quote, dq, sq) => {
    const src = dq ?? sq ?? '';
    if (!src || /^https?:\/\//i.test(src) || src.startsWith('data:')) return match;
    const absolute = resolveImageUrl(src);
    const replacement = `"${absolute}"`;
    return `<img${attrs}src=${dq !== undefined ? replacement : `'${absolute}'`}`;
  });
}

/**
 * Apply brand-specific local asset fallbacks for /static/ paths.
 * Use this for the public-facing brand page when brand backend files are missing.
 */
export function resolveLocalImage(url: string | undefined, brandSemanticLabel?: string): string {
  // If URL is provided, try to map based on pattern
  if (url) {
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

  // Fallback: if no URL provided but we have a brand name and local assets, use them
  if (brandSemanticLabel && BRAND_ASSETS[brandSemanticLabel]) {
    // For hero/background images, return the heroImage fallback
    return BRAND_ASSETS[brandSemanticLabel].heroImage || '';
    // For logos (in practice, check calling context), we'd return logo, but the caller should pass appropriate argument
  }

  return '';
}
