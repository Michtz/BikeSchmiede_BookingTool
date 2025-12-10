'use client';

import React, { FC, useState } from 'react';
import { Container } from '@/components/system/Container';
import Image from 'next/image';
import logoA from '@/assets/schmolke_logo.svg';
import logoB from '@/assets/CHAPTER2-Logo-Aqua.png';
import bikeTitleImage from '@/assets/toa_white_bike.jpeg';
import bikeA from '@/assets/1.png';
import bikeC from '@/assets/odin_roadbike.jpeg';
import bikeB from '@/assets/chapter2_bike.jpg';
import style from '@/styles/new/category.module.scss';
import Button, { ButtonContainer } from '@/components/system/Button';
import serviceOptions from '../../../testData.json';

import ImageGridContainer, {
  ImageGridContainerItem,
} from '@/components/system/new/ImageGrid';
import TextGridContainer from '@/components/system/new/TextGrid';
import TextImageGridContainer from '@/components/system/new/TextImageGrid';
import CartsGridContainer, { Service } from '@/components/system/new/CartsGrid';

interface HomeContainerProps {}

const CategoriesContainer: FC<HomeContainerProps> = () => {
  const [services, setServices] = useState<any[]>(serviceOptions.services);

  const items: ImageGridContainerItem[] = [
    { id: 1, bike: bikeA, logo: logoA, alt: 'Schmolke Bike', url: '/schmolke' },
    { id: 2, bike: bikeB, logo: logoB, alt: 'Odin Bike', url: '/odin' },
  ];

  return (
    <Container padding={false} backgroundColor flow={'column'}>
      <div className={style.titleImageContainer}>
        <Image src={bikeTitleImage} className={style.titleImage} alt={'jhf'} />{' '}
        <h1 className={style.titleText}>ROADBIKES</h1>
        <ButtonContainer className={style.titleButton}>
          <Button>Besprechung Buchen</Button>
        </ButtonContainer>
      </div>
      <h2
        style={{
          textAlign: 'center',
          width: '100%',
          fontFamily: '"Notable", sans-serif',
          fontSize: '40px',
        }}
      >
        Unser Angebot
      </h2>

      <ImageGridContainer items={items} />
      <TextGridContainer items={items} />
      <TextImageGridContainer items={items} />
    </Container>
  );

  // return (
  //   <Container padding={false} flow={'column'}>
  //     <div>
  //       <Image src={titeImage} alt={'jhf'} />
  //     </div>
  //   </Container>
  // );
};

export default CategoriesContainer;
