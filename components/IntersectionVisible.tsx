import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface IntersectionVisibleProps {
  children: ReactNode;
  threshold?: number;
}

/**
 * ⚡ NEO: Utility component to delay rendering of heavy elements until they are visible.
 */
export const IntersectionVisible: React.FC<IntersectionVisibleProps> = ({ children, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={!isVisible ? 'min-h-[100px]' : ''}>
      {isVisible ? children : <div className="animate-pulse bg-slate-50 rounded-xl h-full w-full"></div>}
    </div>
  );
};
