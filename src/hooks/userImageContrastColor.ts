import { useEffect, useState } from 'react';

interface RGB {
  r: number;
  g: number;
  b: number;
}

// Utility function to convert hex color to RGB
const hexToRgb = (hex: string): RGB => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

// Utility function to calculate luminance
const calculateLuminance = ({ r, g, b }: RGB): number => {
  const rgb = [r / 255, g / 255, b / 255].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};

// Utility function to check contrast ratio
const getContrastRatio = (color1: RGB, color2: RGB): number => {
  const lum1 = calculateLuminance(color1);
  const lum2 = calculateLuminance(color2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
};

// Function to get the opposite color
const getOppositeColor = (color: RGB): RGB => {
  return {
    r: 255 - color.r,
    g: 255 - color.g,
    b: 255 - color.b,
  };
};

// Function to convert RGB to hex
const rgbToHex = (color: RGB): string => {
  return '#' + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
};

// Hook to get contrasting colors
const useContrastingColors = (inputColor?: string): [string, string] => {
  const [contrastingColors, setContrastingColors] = useState<[string, string]>(['#000000', '#FFFFFF']);

  useEffect(() => {
    if (!inputColor) return;

    const baseColor = hexToRgb(inputColor);
    const oppositeColor = getOppositeColor(baseColor);

    const blackContrast = getContrastRatio(baseColor, { r: 0, g: 0, b: 0 });
    const whiteContrast = getContrastRatio(baseColor, {
      r: 255,
      g: 255,
      b: 255,
    });

    const blackOrWhite = blackContrast > whiteContrast ? '#000000' : '#FFFFFF';

    setContrastingColors([rgbToHex(oppositeColor), blackOrWhite]);
  }, [inputColor]);

  return contrastingColors;
};

export default useContrastingColors;
