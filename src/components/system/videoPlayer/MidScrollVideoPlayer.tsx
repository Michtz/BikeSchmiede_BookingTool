'use client';

import React, { FC, useEffect, useRef } from 'react';
import style from '@/components/system/videoPlayer/MidScrollVideoPlayer.module.scss';
import { PLACHOLDERTEXT } from '@/components/sections/product/ProductPageContainer';

interface MidScrollVideoPlayerProps {
  videoSrc: string;
  playbackConst?: number; // 600px Scroll-Weg
}

const MidScrollVideoPlayer: FC<MidScrollVideoPlayerProps> = ({
  videoSrc,
  playbackConst = 2200,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !videoRef.current) return;

      const video = videoRef.current;
      const rect = containerRef.current.getBoundingClientRect();

      // Das 'Sticking' beginnt, wenn rect.top <= 0 erreicht
      // Das passiert in deinem Fall, wenn das Video die Mitte/Oben erreicht

      // Berechnung des Fortschritts basierend darauf, wie weit wir
      // in die 'playbackConst' (600px) hineingescrollt haben.
      let progress = -rect.top / playbackConst;

      // Begrenzung zwischen 0 und 1
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      if (video.duration) {
        video.currentTime = video.duration * progress;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [playbackConst]);

  return (
    <div
      className={style.mainContainer}
      ref={containerRef}
      style={{ height: `calc(100vh + ${playbackConst}px)` }}
    >
      {' '}
      <div className={style.stickyWrapper}>
        <div className={style.videoContainer}>
          <video
            className={style.videoElement}
            ref={videoRef}
            muted
            playsInline
            preload="auto"
          >
            {/* Achte darauf, dass der Pfad mit / beginnt, wenn er in 'public' liegt */}
            <source
              src={videoSrc.startsWith('/') ? videoSrc : `/${videoSrc}`}
              type="video/mp4"
            />
          </video>
          <div className={style.contentOverlay}></div>
        </div>
      </div>
      <div className={style.textContainer}>
        <h2>Wähle dein Rahmen</h2>
        <p>{PLACHOLDERTEXT}</p>
      </div>{' '}
      <div style={{ height: '300px' }}></div>
      <div className={style.textContainer}>
        <h2>Wähle dein Farbe</h2>
        <p>{PLACHOLDERTEXT}</p>
      </div>{' '}
      <div style={{ height: '300px' }}></div>
      <div className={style.textContainer}>
        <h2>Wähle dein Komponenten</h2>
        <p>{PLACHOLDERTEXT}</p>
      </div>{' '}
      <div style={{ height: '300px' }}></div>
      <div className={style.textContainer}>
        <h2>Wähle dein BikeFitting</h2>
        <p>{PLACHOLDERTEXT}</p>
      </div>
      <div style={{ height: '300px' }}></div>
      <div className={style.textContainer}>
        <h2>Garantie garantiert</h2>
        <p>{PLACHOLDERTEXT}</p>
      </div>
    </div>
  );
};

export default MidScrollVideoPlayer;
