'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import style from '@/components/system/scrollDeepDive/ScrollDeepDive.module.scss';
import Button from '@/components/system/button/Button';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';

interface ScrollDeepDiveBikeProps {
  imageSrc: StaticImageData | string;
  title: string;
  zoomDurationVh?: number;
  holdDurationVh?: number;
}

const ScrollDeepDiveBike: FC<ScrollDeepDiveBikeProps> = ({
  imageSrc,
  title,
  zoomDurationVh = 150,
  holdDurationVh = 150,
}) => {
  const router: AppRouterInstance = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [animProgress, setAnimProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const currentScroll = -rect.top;

      const zoomEndPx = (zoomDurationVh / 100) * windowHeight;

      let progress = currentScroll / zoomEndPx;

      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
      setAnimProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [zoomDurationVh]);

  const buttonOpacity = Math.max(0, (animProgress - 0.9) * 5);
  const buttonScale = 0.8 + animProgress * 0.2;
  const bikeScale = 1.3 - animProgress * 0.5;
  const bikeMoveY = 20 - animProgress * 30;

  return (
    <div
      className={style.mainContainer}
      ref={containerRef}
      style={{ height: `${100 + zoomDurationVh + holdDurationVh}vh` }}
    >
      <div className={style.stickyWrapper}>
        {' '}
        <div
          className={style.backgroundText}
          style={{ opacity: animProgress * 0.05 }}
        >
          ODIN
        </div>
        <div className={style.content}>
          <div
            className={style.titleWrapper}
            style={{
              opacity: '0.8',
              transform: `translateY(${animProgress * -100}px) scale(${1 - animProgress * 0.1})`,
            }}
          >
            <h2 className={style.mainTitle}>{title}</h2>
          </div>

          <div
            className={style.imageContainer}
            style={{
              transform: `scale(${bikeScale}) translateY(${bikeMoveY}%)`,
            }}
          >
            <Image
              src={imageSrc}
              alt={title}
              className={style.image}
              priority
              width={100}
              height={100}
              style={{
                transform: `scale(${buttonScale * 1.2})`,
              }}
            />
          </div>

          <div
            className={style.buttonWrapper}
            style={{
              opacity: buttonOpacity,
              transform: `scale(${buttonScale})`,
              pointerEvents: animProgress > 0.9 ? 'auto' : 'none',
            }}
          >
            <Button
              className={style.mainButton}
              onClick={() => router.push('/configurator')}
            >
              Konfigurator
            </Button>
            <Button
              className={style.mainButton}
              variant={'secondary'}
              onClick={() => router.push('/configurator')}
            >
              Besprechung buchen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollDeepDiveBike;
