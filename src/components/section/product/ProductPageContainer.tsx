'use client';

import React, { FC, useRef } from 'react';
import bikeTietleImage from '@/assets/odin_frame_black_cutout_1.png';
import image1 from '@/assets/maikel_hochformat.jpg';

import OverlayContainer from '@/components/system/OverlayContainer';
import MidScrollVideoPlayer from '@/components/system/MidScrollVideoPlayer';
import ScrollDeepDiveBike from '@/components/system/ScrollDeepDive';
import StickyImageContainer from '@/components/system/StickyImageContainer';
import ScrollStaggeredGrid from '@/components/system/ScrollStaggeredGrid';

export const PLACHOLDERTEXT: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip`;

interface ProductPageContainerProps {
  view: string;
}

const ProductPageContainer: FC<ProductPageContainerProps> = ({ view }) => {
  const contentTriggerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <StickyImageContainer image={bikeTietleImage} title={view} />
      <OverlayContainer ref={contentTriggerRef}>
        <div>
          <h2>Begründung was hier spannend ist</h2>
          <p>{PLACHOLDERTEXT}</p>
          <p>{PLACHOLDERTEXT}</p>
        </div>
      </OverlayContainer>
      <div style={{ height: '700px' }}></div>
      <OverlayContainer ref={contentTriggerRef}>
        <MidScrollVideoPlayer
          videoSrc={'assets/output_smooth_assembly_odin_white.mp4'}
        />
      </OverlayContainer>{' '}
      <OverlayContainer ref={contentTriggerRef}>
        <ScrollDeepDiveBike imageSrc={'/assets/test_feska.webp'} title={view} />
      </OverlayContainer>{' '}
      <OverlayContainer ref={contentTriggerRef}>
        <ScrollStaggeredGrid
          images={[image1, image1, image1, image1, image1, image1]}
        />
      </OverlayContainer>
    </>
  );
};

export default ProductPageContainer;
