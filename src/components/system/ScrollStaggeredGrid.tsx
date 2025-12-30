'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import style from '@/styles/system/ScrollStaggeredGrid.module.scss';

interface ScrollStaggeredGridProps {
  images: (StaticImageData | string)[];
}

const ScrollStaggeredGrid: FC<ScrollStaggeredGridProps> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight: number = window.innerHeight;

      const start = windowHeight;

      let currentProgress = (start - rect.top) / (start + rect.height * 0.5);

      if (currentProgress < 0) currentProgress = 0;
      if (currentProgress > 1) currentProgress = 1;

      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialer Aufruf
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Definition der Offsets für jedes der 6 Bilder im Endzustand (in Pixeln oder %)
  // Werte können angepasst werden für einen stärkeren/schwächeren Effekt
  const offsets = [
    0, // Bild 1: Bleibt stabil
    60, // Bild 2: Wandert nach unten
    120, // Bild 3: Wandert stark nach unten
    -40, // Bild 4: Wandert leicht nach oben
    80, // Bild 5: Wandert nach unten
    20, // Bild 6: Wandert leicht nach unten
  ];

  return (
    <div className={style.gridContainer} ref={containerRef}>
      {images.slice(0, 6).map((src, index) => (
        <div
          key={index}
          className={style.gridItem}
          style={{
            transform: `translateY(${progress * (offsets[index] || 0)}px)`,
          }}
        >
          <div className={style.imageWrapper}>
            <Image
              src={src}
              alt={`Grid Image ${index}`}
              fill
              className={style.image}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScrollStaggeredGrid;
