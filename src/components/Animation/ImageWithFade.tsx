'use client';

import React, { useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import './FadeAnimation.css';

type FadeDirection = 'left' | 'right' | 'top' | 'bottom';

export default function ImageWithFade({
  src,
  alt = 'Animated image',
  direction = 'left',
  className,
}: {
  src: string;
  alt: string;
  direction?: FadeDirection;
  className?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');

  useEffect(() => {
    // When `src` changes, fade out the current image
    setFadeState('fade-out');

    // After the fade-out animation ends, change the image and fade it in
    const timeoutId = setTimeout(() => {
      setCurrentSrc(src); // Update the image source
      setFadeState('fade-in'); // Fade the new image in
    }, 150); // Duration of the fade-out animation

    // Cleanup timeout when the component unmounts or `src` changes
    return () => clearTimeout(timeoutId);
  }, [src]);

  return <img src={currentSrc} alt={alt} className={twMerge(`image ${fadeState} fade-${direction}`, className)} />;
}
