'use client';

import React, { FC, useState } from 'react';
import { Container } from '@/components/system/Container';
import Image from 'next/image';
import logoA from '@/assets/schmolke_logo.svg';
import logoB from '@/assets/gebioMized.avif';
import bikeTietleImage from '@/assets/odin_back_green.jpg';
import bikeA from '@/assets/1.png';
import bikeTitleImage from '@/assets/title_image_michel.jpg';
import bikeB from '@/assets/chapter2_bike.jpg';
import marken from '@/assets/title_mikel_full.jpg';
import workshop from '@/assets/werkstatt1_edited.jpg';
import bikejitting from '@/assets/bikefitting_test.jpg';
import bikeC from '@/assets/odin_roadbike.jpeg';
import angela from '@/assets/angela.jpg';
import style from '@/styles/new/HomeContainer.module.scss';
import Button, { ButtonContainer } from '@/components/system/Button';
import serviceOptions from '../../../testData.json';

import ImageGridContainer, {
  ImageGridContainerItem,
} from '@/components/system/new/ImageGrid';
import TextGridContainer from '@/components/system/new/TextGrid';
import TextImageGridContainer from '@/components/system/new/TextImageGrid';
import CartsGridContainer, { Service } from '@/components/system/new/CartsGrid';
import Logo from '@/components/icons/Logo';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface HomeContainerProps {}

const BrandsContainer: FC<HomeContainerProps> = () => {
  const router: AppRouterInstance = useRouter();
  const [services, setServices] = useState<any[]>(serviceOptions.services);

  const items: ImageGridContainerItem[] = [
    { id: 1, bike: logoA, logo: logoA, alt: 'Schmolke Bike', url: '/schmolke' },
    { id: 2, bike: logoB, logo: logoB, alt: 'Odin Bike', url: '/odin' },
  ];

  return (
    <Container padding={false} backgroundColor flow={'column'}>
      <div className={style.titleImageContainer}>
        <Image src={bikeTietleImage} className={style.titleImage} alt={'jhf'} />{' '}
        <Logo width={350} className={style.titleText} color={'#3A7361'} />
        <ButtonContainer className={style.titleButton}>
          <Button>Besprechung Buchen</Button>
        </ButtonContainer>
      </div>

      <TextGridContainer items={items} />
      {/*<h2*/}
      {/*  style={{*/}
      {/*    textAlign: 'center',*/}
      {/*    width: '100%',*/}
      {/*    fontSize: '40px',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  BIKESCHMIEDE - dein Fahrradgeschäft in der Umgebung von Luzern für*/}
      {/*  Fahrräder, Bikefitting und Werkstatt*/}
      {/*</h2>*/}
      {/*<p>*/}
      {/*  BIKESCHMIEDE - dein Fahrradgeschäft in der Umgebung von Luzern für*/}
      {/*  Fahrräder, Bikefitting und Werkstatt BIKESCHMIEDE ist ein modernes*/}
      {/*  Fahrradgeschäft in Horw/Luzern, das sich auf personalisierte Rennräder*/}
      {/*  spezialisiert hat und eine wachsende Community in der ganzen Schweiz*/}
      {/*  hat. Neben maßgeschneiderten Rennrädern bietet BIKESCHMIEDE einen*/}
      {/*  erstklassigen Werkstattservice sowie umfassendes Bikefitting von*/}
      {/*  gebioMized an. Zudem beherbergt BIKESCHMIEDE das einzige Concept-Lab von*/}
      {/*  gebioMized in der Schweiz. Mit drei verschiedenen Rennradmarken – ODIN,*/}
      {/*  CHAPTER 2 und SCHMOLKE – haben wir für jeden Radfahrer das perfekte*/}
      {/*  Modell! Außerdem bieten wir E-Bikes der Marken FOCUS und EGO Movement*/}
      {/*  an. Unsere professionelle Werkstatt wartet nicht nur Fahrräder, die bei*/}
      {/*  uns gekauft wurden, sondern auch alle anderen Modelle. Zusätzlich*/}
      {/*  findest du bei uns die stylische Funktionsbekleidung der spanischen*/}
      {/*  Marke SIROKO und die Fahrradschuhe von LAKE.*/}
      {/*</p>*/}

      <div className={style.imageWallContainer}>
        <div className={style.wrapper}>
          <Image alt={'gv'} src={marken} className={style.imageWallItem} />

          <div className={style.overlay}>
            <h2>UNSERE MARKEN</h2>
            <Button>MEHR</Button>
          </div>
        </div>{' '}
        <div className={style.wrapper}>
          <Image alt={'gv'} src={angela} className={style.imageWallItem} />

          <div className={style.overlay}>
            <h2>BIKEFITTING</h2>
            <Button>MEHR</Button>
          </div>
        </div>{' '}
        <div className={style.wrapper}>
          <Image alt={'gv'} src={workshop} className={style.imageWallItem} />

          <div className={style.overlay}>
            <h2>WERKSTATT</h2>
            <Button>MEHR</Button>
          </div>
        </div>{' '}
        <div className={style.wrapper}>
          <Image alt={'gv'} src={bikeC} className={style.imageWallItem} />

          <div className={style.overlay}>
            <h2>ROADBIKES</h2>
            <Button onClick={() => router.push('/roadbikes')}>MEHR</Button>
          </div>
        </div>{' '}
        <div className={style.wrapper}>
          <Image alt={'gv'} src={marken} className={style.imageWallItem} />

          <div className={style.overlay}>
            <h2>E-BIKES</h2>
            <Button>MEHR</Button>
          </div>
        </div>
        {/*<Image alt={'gv'} src={workshop} className={style.imageWallItem} />*/}
        {/*<Image alt={'gv'} src={bikejitting} className={style.imageWallItem} />*/}
        {/*<Image alt={'gv'} src={marken} className={style.imageWallItem} />*/}
        {/*<Image alt={'gv'} src={marken} className={style.imageWallItem} />*/}
      </div>

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

export default BrandsContainer;
