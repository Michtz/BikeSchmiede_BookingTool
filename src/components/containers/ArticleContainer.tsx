'use client';

import React, { FC, useState } from 'react';
import { Container } from '@/components/system/Container';
import Image from 'next/image';
import logoA from '@/assets/schmolke_logo.svg';
import logoB from '@/assets/CHAPTER2-Logo-Aqua.png';
import bikeTitleImage from '@/assets/schmolke_roadBike.jpg';
import frame from '@/assets/3.png';
import bikeC from '@/assets/odin_roadbike.jpeg';
import bikeB from '@/assets/schmolke_bike_two.png';
import style from '@/styles/system/new/ArticleContainer.module.scss';
import Button, { ButtonContainer } from '@/components/system/Button';
import serviceOptions from '../../../testData.json';

import ImageGridContainer, {
  ImageGridContainerItem,
} from '@/components/system/new/ImageGrid';
import TextGridContainer from '@/components/system/new/TextGrid';
import TextImageGridContainer from '@/components/system/new/TextImageGrid';
import CartsGridContainer, { Service } from '@/components/system/new/CartsGrid';
import schmolkeLogo from '@/assets/schmolke_logo.svg';
import bikeA from '@/assets/1.png';

interface HomeContainerProps {
  article: string;
}

const ArticleContainer: FC<HomeContainerProps> = ({ article }) => {
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
        <Image src={schmolkeLogo} alt={'scgmolke'} className={style.logo} />
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
        Schmolke Carbon
      </h2>
      <span className={style.contentBoxA}>
        <p>
          Mit Schmolke Carbon haben wir einen der führenden Lieferanten von
          Leichtbauteilen in unserem Sortiment. Ebenso bieten wir Rennräder und
          Gravelbikes dieses spezialisierten Fahrradbauers an. Die hochwertigen
          Produkte von Schmolke ermöglichen es, dass du dein Rennrad noch
          leichter bauen kannst und sorgen an den richtigen Stellen für eine
          gute Balance zwischen Gewicht und Steifigkeit. Wir können
          Schmolke-Produkte auf Kundenwunsch liefern und haben ebenso ein
          Sortiment an Schmolke Carbon-Produkten in unserem Geschäft. Mit
          Schmolke Carbon holst du das Beste aus deinem Fahrrad heraus! Auch für
          Kompletträder mit Schmolke-Rahmen bist du bei uns genau richtig!
          Kontaktiere uns für eine Beratung!
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

  // return (
  //   <Container padding={false} flow={'column'}>
  //     <div>
  //       <Image src={titeImage} alt={'jhf'} />
  //     </div>
  //   </Container>
  // );
};

export default ArticleContainer;
