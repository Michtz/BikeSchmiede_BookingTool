'use client';

import React, { FC, useRef, useState } from 'react';
import ScrollHeroImage from '@/components/system/ScrollHeroImage';
import bikeTietleImage from '@/assets/odin_frame_black_gravity_text.png';
import OverlayContainer from '@/components/system/OverlayContainer';
import MidScrollVideoPlayer from '@/components/system/MidScrollVideoPlayer';
import ScrollDeepDiveBike from '@/components/system/ScrollDeepDive';

export const PLACHOLDERTEXT: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip`;

const ProductPageContainer: FC = () => {
  const [showImageOverlay] = useState<boolean>(false);

  const contentTriggerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ScrollHeroImage
        fallbackImage={bikeTietleImage}
        showImageOverlay={showImageOverlay}
      />

      <OverlayContainer ref={contentTriggerRef}>
        <MidScrollVideoPlayer
          videoSrc={'assets/output_smooth_assembly_odin_white.mp4'}
        />
      </OverlayContainer>
      <OverlayContainer ref={contentTriggerRef}>
        <ScrollDeepDiveBike
          imageSrc={'/assets/odin_roadbike_cutout.png'}
          title={'Gravity'}
        />
      </OverlayContainer>
    </>
  );
};

export default ProductPageContainer;
