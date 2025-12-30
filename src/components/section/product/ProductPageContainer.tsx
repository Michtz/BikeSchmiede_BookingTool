'use client';

import React, { FC, useRef, useState } from 'react';
import { Container } from '@/components/system/Container';
import Image from 'next/image';
import logoA from '@/assets/schmolke_logo.svg';
import frame from '@/assets/odin_frame_black.png';
import style from '@/styles/system/new/ArticleContainer.module.scss';
import bikeA from '@/assets/odin_frame_black.png';
import ScrollHeroImage from '@/components/system/ScrollHeroImage';
import bikeTietleImage from '@/assets/odin_frame_black_gravity_text.png';
import OverlayContainer from '@/components/system/OverlayContainer';
import ImageHoverTextContainer from '@/components/system/new/ImageHoverTextContainer';

export const PLACHOLDERTEXT: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip`;

const ProductPageContainer: FC = () => {
  const [showImageOverlay] = useState<boolean>(false);

  const contentTriggerRef = useRef<HTMLDivElement>(null);
  const items: any[] = [
    {
      id: 1,
      imageA: bikeA,
      imageB: logoA,
      alt: 'Schmolke Bike',
      title: 'GRAVITY',
      text: PLACHOLDERTEXT,
      url: '/bikes/roadbikes/gravity',
    },
    {
      id: 2,
      imageA: bikeA,
      imageB: logoA,
      alt: 'Schmolke Bike',
      title: 'REACTION',
      text: PLACHOLDERTEXT,

      url: '/bikes/roadbikes/gravity',
    },
    {
      id: 3,
      imageA: bikeA,
      imageB: logoA,
      alt: 'Schmolke Bike',
      title: 'FLOW',
      text: PLACHOLDERTEXT,

      url: '/bikes/roadbikes/gravity',
    },
    {
      id: 4,
      imageA: bikeA,
      imageB: logoA,
      alt: 'Schmolke Bike',
      title: 'SLIDE',
      text: PLACHOLDERTEXT,
      url: '/bikes/roadbikes/gravity',
    },
  ];

  return (
    <>
      <ScrollHeroImage
        fallbackImage={bikeTietleImage}
        showImageOverlay={showImageOverlay}
      />
      <OverlayContainer ref={contentTriggerRef}>
        <ImageHoverTextContainer items={items} />
      </OverlayContainer>
      <div style={{ height: '80vh', backgroundColor: 'transparent' }}></div>
      <OverlayContainer ref={contentTriggerRef}>
        <ImageHoverTextContainer items={items} />
      </OverlayContainer>
      <Container padding={false} backgroundColor flow={'column'}>
        {/*<div className={style.titleImageContainer}>*/}
        {/*  <Image src={bikeTitleImage} className={style.titleImage} alt={'jhf'} />*/}
        {/*  <ButtonContainer className={style.titleButton}>*/}
        {/*    <Button>Besprechung Buchen</Button>*/}
        {/*  </ButtonContainer>*/}
        {/*</div>*/}
        <span className={style.contentBoxA}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <Image className={style.image} src={frame} alt={'frame'} />
        </span>
        <h2
          style={{
            textAlign: 'center',
            width: '100%',
            fontSize: '40px',
            margin: '2rem',
          }}
        >
          Werkstatt Angebot
        </h2>
      </Container>
    </>
  );
};

export default ProductPageContainer;
