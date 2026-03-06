'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import OdinLogo from '@/components/icons/OdinLogo';
import style from './ScrollHero.module.scss';

interface ScrollHeroProps {
  videoSrc: string;
  showImageOverlay?: boolean;
  botsOnlyText: string;
}

const ScrollHeroVideo: FC<ScrollHeroProps> = ({
  videoSrc,
  showImageOverlay: showImageOverlayProp,
  botsOnlyText,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showLogo, setShowLogo] = useState<boolean>(false);
  const [showImageOverlayInternal, setShowImageOverlayInternal] =
    useState<boolean>(false);
  const isTicking = useRef(false);

  const showImageOverlay =
    showImageOverlayProp !== undefined
      ? showImageOverlayProp
      : showImageOverlayInternal;

  const updateVideoPosition = () => {
    if (!containerRef.current || !videoRef.current) return;

    const container = containerRef.current;
    const video = videoRef.current;

    const containerTop = container.getBoundingClientRect().top;

    // Die Animation soll über eine Strecke von z.B. 100vh gehen
    const animationDistance = window.innerHeight / 3;
    let progress = -containerTop / animationDistance;

    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    if (video.duration && Number.isFinite(video.duration)) {
      const targetTime = video.duration * progress;
      if (Math.abs(video.currentTime - targetTime) > 0.01) {
        video.currentTime = targetTime;
      }
    }

    const shouldShowLogo = progress > 0.25;
    if (showLogo !== shouldShowLogo) {
      setShowLogo(shouldShowLogo);
    }

    const isCovering = containerTop <= -container.scrollHeight;
    if (showImageOverlayInternal !== isCovering) {
      setShowImageOverlayInternal(isCovering);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // "Prime" the video for mobile devices to allow seeking
      video.play().then(() => {
        video.pause();
        updateVideoPosition();
      }).catch(() => {
        // Autoplay might be blocked, but we can still try to seek
        updateVideoPosition();
      });
    }

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
    window.addEventListener('resize', updateVideoPosition);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateVideoPosition);
    };
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [showLogo, showImageOverlay, showImageOverlayProp]);

  const isVisible = showLogo && !showImageOverlay;
  return (
    <div className={style.scrollContainer} ref={containerRef}>
      <div className={style.stickyWrapper}>
        <video
          className={style.videoElement}
          ref={videoRef}
          muted
          playsInline
          autoPlay
          preload="auto"
          src={videoSrc}
          onLoadedMetadata={updateVideoPosition}
        />

        <div className={style.overlayContent}>
          <h1 className={`${style.logoFade} ${isVisible ? style.visible : ''}`}>
            <OdinLogo width={400} />
            <span className={style.srOnly}>{botsOnlyText}</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ScrollHeroVideo;
