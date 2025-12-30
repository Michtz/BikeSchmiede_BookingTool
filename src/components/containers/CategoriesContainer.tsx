'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import { Container } from '@/components/system/Container';
import bikeA from '@/assets/odin_frame_black.png';

import bikeTietleImage from '@/assets/tow_bianci_2.png';
import ScrollHeroVideo from '@/components/system/ScrollHeroVideo';
import ImageHoverTextContainer from '@/components/system/new/ImageHoverTextContainer';
import { PLACHOLDERTEXT } from '@/components/section/product/ProductPageContainer';
import OverlayContainer from '@/components/system/OverlayContainer';

const CategoriesContainer: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showImageOverlay, setShowImageOverlay] = useState<boolean>(false);
  const contentTriggerRef = useRef<HTMLDivElement>(null);
  const contentTriggerRef2 = useRef<HTMLDivElement>(null);
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
        console.log(isCoveringImage);
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
  const items: any[] = [
    {
      id: 1,
      imageA: bikeA,
      alt: 'Schmolke Bike',
      title: 'Gravity',
      text: PLACHOLDERTEXT,
      url: '/bikes/roadbikes/gravity',
    },
    {
      id: 2,
      imageA: bikeA,
      alt: 'Schmolke Bike',
      title: 'Reaction',
      text: PLACHOLDERTEXT,

      url: '/bikes/roadbikes/gravity',
    },
    {
      id: 3,
      imageA: bikeA,
      alt: 'Schmolke Bike',
      title: 'Flow',
      text: PLACHOLDERTEXT,

      url: '/bikes/roadbikes/gravity',
    },
    {
      id: 4,
      imageA: bikeA,
      alt: 'Schmolke Bike',
      title: 'Slide',
      text: PLACHOLDERTEXT,
      url: '/bikes/roadbikes/gravity',
    },
  ];

  const content = (
    <>
      <h2
        style={{
          textAlign: 'center',
          width: '100%',
          fontSize: '40px',
          fontWeight: 'bold',

          paddingBottom: '60px',
          marginBottom: '60px',
          marginTop: '60px',
        }}
      >
        Rahmen Typen
      </h2>
      <ImageHoverTextContainer items={items} />
    </>
  );
  const content2 = (
    <>
      <h2
        style={{
          textAlign: 'center',
          width: '100%',
          fontSize: '40px',
          fontWeight: 'bold',
          paddingBottom: '60px',
          marginBottom: '60px',
          marginTop: '60px',
        }}
      >
        Ganzes Rennrad
      </h2>
      <ImageHoverTextContainer items={items} />
    </>
  );

  return (
    <Container padding={false} backgroundColor flow={'column'}>
      <ScrollHeroVideo
        videoSrc="/assets/output_smooth_odin_drive_right.mp4"
        fallbackImage={bikeTietleImage}
        showImageOverlay={showImageOverlay}
      />

      <OverlayContainer key={1} ref={contentTriggerRef}>
        {content}
      </OverlayContainer>
      <div style={{ height: '80vh', backgroundColor: 'transparent' }}></div>

      <OverlayContainer key={2} ref={contentTriggerRef2}>
        {content2}
      </OverlayContainer>
    </Container>
  );
};

export default CategoriesContainer;
