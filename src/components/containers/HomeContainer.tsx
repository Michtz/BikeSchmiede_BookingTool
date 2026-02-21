'use client';
import React, { FC, useEffect, useRef, useState } from 'react';
import OverlayContainer from '@/components/system/containers/Containers';
import ScrollHeroVideo from '@/components/system/scorllVideoHero/ScrollHeroVideo';

/* video  DO NOT DELETE!!!!!!!!!!!!!!!!!! edit prompt MacBook-Pro assets % ffmpeg -i odin_animatie.mp4   -c:v libx264 -x264-params keyint=1:scenecut=0 -crf 22 -preset medium -an output_smooth_odin_frame.mp4*/

interface HomeContainerProps {}

const HomeContainer: FC<HomeContainerProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showImageOverlay, setShowImageOverlay] = useState<boolean>(false);
  const isTicking = useRef(false);
  const showImageOverlayRef = useRef(false);
  const contentTriggerRef = useRef<HTMLDivElement>(null);

  const updateVideoPosition = () => {
    if (!containerRef.current || !videoRef.current) return;

    const container = containerRef.current;
    const video = videoRef.current;

    const containerTop = container.getBoundingClientRect().top;
    const scrollLength = container.scrollHeight - window.innerHeight;

    let progress = -containerTop / scrollLength;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    // --- VIDEO UPDATE ---
    if (Number.isFinite(video.duration)) {
      const targetTime = video.duration * progress;
      if (Math.abs(video.currentTime - targetTime) > 0.01) {
        video.currentTime = targetTime;
      }
    }
  };

  const handleScroll = () => {
    if (contentTriggerRef.current) {
      const contentRect = contentTriggerRef.current.getBoundingClientRect();

      const isCoveringImage = contentRect.top <= 0;

      if (showImageOverlayRef.current !== isCoveringImage) {
        showImageOverlayRef.current = isCoveringImage;
        setShowImageOverlay(isCoveringImage);
      }
    }
    if (!isTicking.current) {
      window.requestAnimationFrame(() => {
        updateVideoPosition();
        isTicking.current = false;
      });
      isTicking.current = true;
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ScrollHeroVideo
        videoSrc="/assets/output_smooth.mp4"
        showImageOverlay={showImageOverlay}
      />
      <OverlayContainer ref={contentTriggerRef}>
        das ist ein test
      </OverlayContainer>
      <OverlayContainer ref={contentTriggerRef}>
        das ist ein test
      </OverlayContainer>
      <OverlayContainer ref={contentTriggerRef}>
        das ist ein test
      </OverlayContainer>
    </>
  );
};

export default HomeContainer;
