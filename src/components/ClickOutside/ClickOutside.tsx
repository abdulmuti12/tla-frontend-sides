'use clientf';

import { useEffect, useRef } from 'react';

interface ClickOutsideProps {
  style?: React.CSSProperties;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  exceptionRef?: React.RefObject<HTMLElement>;
}

export function ClickOutside({ style, onClick, children, className, exceptionRef }: ClickOutsideProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickListener = (event: MouseEvent) => {
      let clickedInside: null | boolean = false;
      if (exceptionRef) {
        clickedInside =
          (wrapperRef.current && wrapperRef.current.contains(event.target as Node)) ||
          (exceptionRef.current && exceptionRef.current === event.target) ||
          (exceptionRef.current && exceptionRef.current.contains(event.target as Node));
      } else {
        clickedInside = wrapperRef.current && wrapperRef.current.contains(event.target as Node);
      }

      if (!clickedInside) onClick();
    };

    document.addEventListener('mousedown', handleClickListener);

    return () => {
      document.removeEventListener('mousedown', handleClickListener);
    };
  }, [exceptionRef, onClick]);

  return (
    <div style={style} ref={wrapperRef} className={`${className || ''}`}>
      {children}
    </div>
  );
}
