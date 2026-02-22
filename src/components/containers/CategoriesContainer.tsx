'use client';
import React, { FC } from 'react';
import { PLACHOLDERTEXT } from '@/components/sections/product/ProductPageContainer';
import OverlayContainer, {
  Container,
  Title,
} from '@/components/system/containers/Containers';
import ImageHoverTextContainer from '@/components/system/imageHoverTextContainer/ImageHoverTextContainer';
import ScrollHeroVideo from '@/components/system/scorllVideoHero/ScrollHeroVideo';
import { LOREM_IPSUM_SHORT_TEXT } from '@/components/containers/HomeContainer';

const CategoriesContainer: FC = () => {
  const items: any[] = [
    {
      id: 1,
      imageA: '/assets/odin_frame_black.png',
      alt: 'Schmolke Bike',
      title: 'Gravity',
      text: PLACHOLDERTEXT,
      url: '/bikes/roadbikes/gravity',
    },
    {
      id: 2,
      imageA: '/assets/odin_frame_black.png',
      alt: 'Schmolke Bike',
      title: 'Reaction',
      text: PLACHOLDERTEXT,

      url: '/bikes/roadbikes/reaction',
    },
    {
      id: 3,
      imageA: '/assets/odin_frame_black.png',
      alt: 'Schmolke Bike',
      title: 'Flow',
      text: PLACHOLDERTEXT,

      url: '/bikes/roadbikes/flow',
    },
    {
      id: 4,
      imageA: '/assets/odin_frame_black.png',
      alt: 'Schmolke Bike',
      title: 'Slide',
      text: PLACHOLDERTEXT,
      url: '/bikes/roadbikes/slide',
    },
  ];
  const items2: any[] = [
    {
      id: 1,
      imageA: '/assets/odin_frame_black.png',
      alt: 'Schmolke Bike',
      title: 'Gravity',
      text: PLACHOLDERTEXT,
      url: '/bikes/roadbikes/gravity',
    },
    {
      id: 2,
      imageA: '/assets/odin_frame_black.png',
      alt: 'Schmolke Bike',
      title: 'Reaction',
      text: PLACHOLDERTEXT,

      url: '/bikes/roadbikes/reaction',
    },
    {
      id: 3,
      imageA: '/assets/odin_frame_black.png',
      alt: 'Schmolke Bike',
      title: 'Flow',
      text: PLACHOLDERTEXT,

      url: '/bikes/roadbikes/flow',
    },
    {
      id: 4,
      imageA: '/assets/odin_frame_black.png',
      alt: 'Schmolke Bike',
      title: 'Slide',
      text: PLACHOLDERTEXT,
      url: '/bikes/roadbikes/slide',
    },
  ];

  const content = (
    <>
      <Title>Rahmen Typen</Title>
      <ImageHoverTextContainer items={items} />
    </>
  );
  const content2 = (
    <>
      <Title>Ganzes Rad</Title>
      <ImageHoverTextContainer items={items2} />
    </>
  );

  return (
    <Container padding={false} backgroundColor flow={'column'}>
      <ScrollHeroVideo
        videoSrc="/assets/output_smooth_odin_drive_right.mp4"
        botsOnlyText={LOREM_IPSUM_SHORT_TEXT}
      />

      <OverlayContainer key={1}>{content}</OverlayContainer>

      <OverlayContainer key={2}>{content2}</OverlayContainer>
    </Container>
  );
};

export default CategoriesContainer;
