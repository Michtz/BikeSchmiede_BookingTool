'use client';

import React, { FC } from 'react';
import { Container } from '@/components/system/Container';
import Image from 'next/image';
import logoA from '@/assets/gebioMized.avif';
import logoB from '@/assets/logo_black.png';
import bikeTietleImage from '@/assets/odin_back_green.jpg';
import bikeB from '@/assets/3.png';
import marken from '@/assets/title_mikel_full.jpg';
import workshop from '@/assets/werkstatt1_edited.jpg';
import bikejitting from '@/assets/bikefitting_cutout_white.png';
import bikeC from '@/assets/odin_roadbike.jpeg';
import angela from '@/assets/angela.jpg';
import style from '@/styles/new/HomeContainer.module.scss';
import Button, { ButtonContainer } from '@/components/system/Button';

import { ImageGridContainerItem } from '@/components/system/new/ImageGrid';
import TextImageGridContainer from '@/components/system/new/TextImageGrid';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import OdinLogo from '@/components/icons/OdinLogo';

interface HomeContainerProps {}

const HomeContainer: FC<HomeContainerProps> = () => {
  const router: AppRouterInstance = useRouter();

  const items: ImageGridContainerItem[] = [
    {
      id: 1,
      bike: bikejitting,
      logo: logoA,
      alt: 'Schmolke Bike',
      url: '/bikefitting',
    },
    { id: 2, bike: bikeB, logo: logoB, alt: 'Odin Bike', url: '/workshop' },
  ];

  return (
    <Container padding={false} backgroundColor flow={'column'}>
      <div className={style.titleImageContainer}>
        <Image src={bikeTietleImage} className={style.titleImage} alt={'jhf'} />{' '}
        <OdinLogo width={350} className={style.titleText} color={'#3A7361'} />
        <ButtonContainer className={style.titleButton}>
          <Button>Besprechung Buchen</Button>
        </ButtonContainer>
      </div>
      <h2
        style={{
          textAlign: 'center',
          width: '100%',
          fontSize: '40px',
        }}
      >
        WAS WIR ZU BIETEN HABEN
      </h2>
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
      <TextImageGridContainer items={items} />
      <div className={style.imageWallContainer}>
        <div className={style.wrapper}>
          <Image alt={'gv'} src={marken} className={style.imageWallItem} />

          <div className={style.overlay}>
            <h2>E-BIKES</h2>
            <Button>MEHR</Button>
          </div>
        </div>
        <div className={style.wrapper}>
          <Image alt={'gv'} src={angela} className={style.imageWallItem} />

          <div className={style.overlay}>
            <h2>BIKEFITTING</h2>
            <Button>MEHR</Button>
          </div>
        </div>{' '}
        <div className={style.wrapper}>
          <Image alt={'gv'} src={marken} className={style.imageWallItem} />

          <div className={style.overlay}>
            <h2>UNSERE MARKEN</h2>
            <Button>MEHR</Button>
          </div>
        </div>{' '}
        <div className={style.wrapper}>
          <Image alt={'gv'} src={workshop} className={style.imageWallItem} />

          <div className={style.overlay}>
            <h2>WERKSTATT</h2>
            <Button onClick={() => router.push('/workshop')}>MEHR</Button>
          </div>
        </div>{' '}
        <div className={style.wrapper}>
          <Image alt={'gv'} src={bikeC} className={style.imageWallItem} />

          <div className={style.overlay}>
            <h2>ROADBIKES</h2>
            <Button onClick={() => router.push('/roadbikes')}>MEHR</Button>
          </div>
        </div>{' '}
        {/*<Image alt={'gv'} src={workshop} className={style.imageWallItem} />*/}
        {/*<Image alt={'gv'} src={bikejitting} className={style.imageWallItem} />*/}
        {/*<Image alt={'gv'} src={marken} className={style.imageWallItem} />*/}
        {/*<Image alt={'gv'} src={marken} className={style.imageWallItem} />*/}
      </div>
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

export default HomeContainer;
