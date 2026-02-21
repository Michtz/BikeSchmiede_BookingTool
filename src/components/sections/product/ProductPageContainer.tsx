import React, { FC, useRef } from 'react';
import bikeTietleImage from '@/assets/odin_frame_black_cutout_1.png';
import image1 from '@/assets/maikel_hochformat.jpg';

import OverlayContainer, {
  ContentContainer,
} from '@/components/system/containers/Containers';
import MidScrollVideoPlayer from '@/components/system/videoPlayer/MidScrollVideoPlayer';
import ScrollDeepDiveBike from '@/components/system/scrollDeepDive/ScrollDeepDive';
import StickyImageContainer from '@/components/system/stickyImage/StickyImageContainer';
import ScrollStaggeredGrid from '@/components/system/imageGridContainer/ScrollStaggeredGrid';

export const PLACHOLDERTEXT: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis.`;

interface ProductPageContainerProps {
  view: string;
}

const ProductPageContainer: FC<ProductPageContainerProps> = ({ view }) => {
  const contentTriggerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <StickyImageContainer image={bikeTietleImage} title={view} />
      <OverlayContainer ref={contentTriggerRef}>
        <ContentContainer
          title={'Beste Geometry zum klettern'}
          text={PLACHOLDERTEXT}
        />
      </OverlayContainer>
      <div style={{ height: '700px' }}></div>
      <OverlayContainer ref={contentTriggerRef}>
        <MidScrollVideoPlayer
          videoSrc={'assets/output_smooth_assembly_odin_white.mp4'}
        />
      </OverlayContainer>
      <OverlayContainer ref={contentTriggerRef}>
        <ScrollDeepDiveBike imageSrc={'/assets/test_feska.webp'} title={view} />
      </OverlayContainer>
      <OverlayContainer ref={contentTriggerRef}>
        <ScrollStaggeredGrid
          imagesArray={[
            image1,
            image1,
            image1,
            image1,
            image1,
            image1,
            image1,
            image1,
            image1,
            image1,
            image1,
            image1,
            image1,
            image1,
            image1,
            image1,
            image1,
            image1,
          ]}
        />
      </OverlayContainer>
    </>
  );
};

export default ProductPageContainer;
