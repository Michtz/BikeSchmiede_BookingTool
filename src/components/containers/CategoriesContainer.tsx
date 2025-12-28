'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import { Container } from '@/components/system/Container';
import logoA from '@/assets/odin_frame_black.png';
import bikeA from '@/assets/odin_white.png';

import bikeTietleImage from '@/assets/tow_bianci_2.png';
import ScrollHero from '@/components/system/ScrollHero';
import ImageHoverImageContainer, {
  HoverImageContainerItem,
} from '@/components/system/new/ImageHoverImageContainer';

const CategoriesContainer: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showImageOverlay, setShowImageOverlay] = useState<boolean>(false);
  const contentTriggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTicking = useRef(false);

  const showImageOverlayRef = useRef(false);

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
  const items: HoverImageContainerItem[] = [
    {
      id: 1,
      imageA: bikeA,
      imageB: logoA,
      alt: 'Schmolke Bike',
      title: 'GRAVITY',
      text: 'Made to Climb',

      url: '/bikes/roadbikes/gravity',
    },
    {
      id: 2,
      imageA: bikeA,
      imageB: logoA,
      alt: 'Schmolke Bike',
      title: 'REACTION',
      text: 'Feel the Power',

      url: '/bikes/roadbikes/gravity',
    },
    {
      id: 3,
      imageA: bikeA,
      imageB: logoA,
      alt: 'Schmolke Bike',
      title: 'FLOW',
      text: 'Follow your Spirit',

      url: '/bikes/roadbikes/gravity',
    },
    {
      id: 4,
      imageA: bikeA,
      imageB: logoA,
      alt: 'Schmolke Bike',
      title: 'SLIDE',
      text: 'Slide the Wind',
      url: '/bikes/roadbikes/gravity',
    },
  ];

  return (
    <Container padding={false} backgroundColor flow={'column'}>
      <ScrollHero
        videoSrc="/assets/output_smooth_odin_drive_right.mp4"
        fallbackImage={bikeTietleImage}
        showImageOverlay={showImageOverlay}
      />

      {/*<OverlayContainer*/}
      {/*  ref={contentTriggerRef}*/}
      {/*  showText={showText}*/}
      {/*  showImageOverlay={showImageOverlay}*/}
      {/*  content={overlayOne}*/}
      {/*/>*/}

      <h2
        style={{
          textAlign: 'center',
          width: '100%',
          fontFamily: '"Notable", sans-serif',
          fontSize: '40px',
          paddingBottom: '60px',
          marginBottom: '60px',
          marginTop: '60px',
        }}
      >
        Rahmen Typen
      </h2>

      <ImageHoverImageContainer items={items} />
    </Container>
  );
};

export default CategoriesContainer;
