// Type for RGB values
interface RGB {
  r: number;
  g: number;
  b: number;
}

// Convert hex color to RGB format
function hexToRgb(hex: string): RGB {
  let bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return { r, g, b };
}

// Calculate relative luminance
export function rgbToLuminance(r: number, g: number, b: number): number {
  let a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate contrast ratio
export function contrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function isGoodContrastToBlack(backgroundColor: string) {
  const rgb = hexToRgb(backgroundColor);
  const srgb = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  const x = srgb.map((i) => {
    if (i <= 0.04045) {
      return i / 12.92;
    } else {
      return Math.pow((i + 0.055) / 1.055, 2.4);
    }
  });

  const L = 0.2126 * x[0] + 0.7152 * x[1] + 0.0722 * x[2];
  return L > 0.179;
}
