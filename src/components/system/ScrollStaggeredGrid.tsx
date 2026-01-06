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
      console.log(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialer Aufruf
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const multipliers = [-70, 0, -70];
  return (
    <>
      <div className={style.container} ref={containerRef}>
        {images.slice(0, 3).map((src, index) => (
          <Row
            src={src}
            key={index}
            index={index}
            transform={{
              transform: `translate3d(0, ${progress * multipliers[index]}px, 0)`,
            }}
          />
        ))}
      </div>
      <div className={style.overlay}></div>
    </>
  );
};
interface RowProps {
  src: string | StaticImageData;
  index: number;
  transform?: any;
}
const Row: FC<RowProps> = ({ src, index, transform }) => {
  return (
    <div className={style.row} style={transform}>
      <Image src={src} alt={`Grid Image ${index}`} className={style.image} />
      <Image src={src} alt={`Grid Image ${index}`} className={style.image} />
      <Image src={src} alt={`Grid Image ${index}`} className={style.image} />
    </div>
  );
};

export default ScrollStaggeredGrid;
