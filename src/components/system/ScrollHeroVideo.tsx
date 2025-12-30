'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import OdinLogo from '@/components/icons/OdinLogo';
import style from '@/styles/system/new/ScrollHero.module.scss';

interface ScrollHeroProps {
  videoSrc: string;
  fallbackImage: StaticImageData;
  showImageOverlay: boolean;
}

const ScrollHeroVideo: FC<ScrollHeroProps> = ({
  videoSrc,
  fallbackImage,
  showImageOverlay,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showLogo, setShowLogo] = useState<boolean>(false);
  const isTicking = useRef(false);

  const updateVideoPosition = () => {
    if (!containerRef.current || !videoRef.current) return;

    const container = containerRef.current;
    const video = videoRef.current;

    const containerTop = container.getBoundingClientRect().top;
    const scrollLength = container.scrollHeight - window.innerHeight;

    let progress = -containerTop / scrollLength;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    if (Number.isFinite(video.duration)) {
      const targetTime = video.duration * progress;
      if (Math.abs(video.currentTime - targetTime) > 0.01) {
        video.currentTime = targetTime;
      }
    }

    const shouldShowLogo = progress > 0.25;
    if (showLogo !== shouldShowLogo) {
      setShowLogo(shouldShowLogo);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!isTicking.current) {
        window.requestAnimationFrame(() => {
          updateVideoPosition();
          isTicking.current = false;
        });
        isTicking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [showLogo]);

  const isVisible = showLogo && !showImageOverlay;
  return (
    <div className={style.scrollContainer} ref={containerRef}>
      <div className={style.stickyWrapper}>
        {showImageOverlay ? (
          <>
            <Image
              src={fallbackImage}
              className={style.titleImage}
              alt="Hero Background"
            />
          </>
        ) : (
          <video
            className={style.videoElement}
            ref={videoRef}
            muted
            playsInline
            preload="auto"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        <div className={style.overlayContent}>
          <h1 className={`${style.logoFade} ${isVisible ? style.visible : ''}`}>
            <OdinLogo width={400} />
            <span className={style.srOnly}>
              Odin Roadbikes – Premium Custom-Build Carbon Roadbikes
            </span>
          </h1>
          <h2
            className={`${style.logoFade} ${showImageOverlay ? style.visible : ''}`}
            style={{
              fontSize: '40px',
              position: 'absolute',
              top: '60%',
            }}
          >
            Unsere neusten Kreationen
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ScrollHeroVideo;
