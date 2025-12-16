'use client';

import React, { FC } from 'react';
import { Container } from '@/components/system/Container';
import Image from 'next/image';
import bikeTitleImage from '@/assets/werkstatt1_edited.jpg';
import style from '@/styles/new/WorkshopContainer.module.scss';
import Button, { ButtonContainer } from '@/components/system/Button';
import serviceOptions from '../../../testData.json';
import CartsGridContainer, { Service } from '@/components/system/new/CartsGrid';

interface HomeContainerProps {}

const WorkshopContainer: FC<HomeContainerProps> = () => {
  return (
    <Container padding={false} backgroundColor flow={'column'}>
      <div className={style.titleImageContainer}>
        <Image src={bikeTitleImage} className={style.titleImage} alt={'jhf'} />{' '}
        {/*<h1 className={style.titleText}>WERKSTATT</h1>*/}
        <ButtonContainer className={style.titleButton}>
          <Button></Button>
        </ButtonContainer>
      </div>

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
      <CartsGridContainer items={serviceOptions.services as Service[]} />
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

export default WorkshopContainer;
