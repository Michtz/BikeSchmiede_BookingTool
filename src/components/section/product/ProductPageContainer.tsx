'use client';

import React, { FC } from 'react';
import { Container } from '@/components/system/Container';
import Image from 'next/image';
import logoA from '@/assets/schmolke_logo.svg';
import bikeTitleImage from '@/assets/odin_frame_black_gravity_textt.png';
import frame from '@/assets/odin_frame_black.png';
import bikeB from '@/assets/odin_green_frame.png';
import style from '@/styles/system/new/ArticleContainer.module.scss';
import Button, { ButtonContainer } from '@/components/system/Button';
import { ImageGridContainerItem } from '@/components/system/new/ImageGrid';
import TextImageGridContainer from '@/components/system/new/TextImageGrid';
import bikeA from '@/assets/odin_frame_white.png';

const ProductPageContainer: FC = () => {
  const items: ImageGridContainerItem[] = [
    { id: 1, bike: bikeA, logo: logoA, alt: 'Schmolke Bike', url: '/schmolke' },
    {
      id: 2,
      bike: bikeB,
      logo: logoA,
      alt: 'schmolke bike 2',
      url: '/schmolke',
    },
    {
      id: 3,
      bike: bikeB,
      logo: logoA,
      alt: 'schmolke bike 2',
      url: '/schmolke',
    },
    { id: 4, bike: bikeA, logo: logoA, alt: 'Schmolke Bike', url: '/schmolke' },
  ];
  return (
    <Container padding={false} backgroundColor flow={'column'}>
      <div className={style.titleImageContainer}>
        <Image src={bikeTitleImage} className={style.titleImage} alt={'jhf'} />
        <ButtonContainer className={style.titleButton}>
          <Button>Besprechung Buchen</Button>
        </ButtonContainer>
      </div>

      <span className={style.contentBoxA}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <Image className={style.image} src={frame} alt={'frame'} />
      </span>
      <TextImageGridContainer items={items} />

      <h2
        style={{
          textAlign: 'center',
          width: '100%',
          fontFamily: '"Notable", sans-serif',
          fontSize: '40px',
          margin: '2rem',
        }}
      >
        Werkstatt Angebot
      </h2>
    </Container>
  );
};

export default ProductPageContainer;
