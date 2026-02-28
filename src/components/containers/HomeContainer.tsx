import React, { FC } from 'react';
import OverlayContainer, {
  ContentContainer,
  ImageContainer,
} from '@/components/system/containers/Containers';
import ScrollHeroVideo from '@/components/system/scorllVideoHero/ScrollHeroVideo';
import Calculator from '@/components/system/calculator/Calculator';
import ScrollStaggeredGrid from '@/components/system/imageGridContainer/ScrollStaggeredGrid';

/* video  DO NOT DELETE!!!!!!!!!!!!!!!!!! edit prompt MacBook-Pro assets % ffmpeg -i odin_animatie.mp4   -c:v libx264 -x264-params keyint=1:scenecut=0 -crf 22 -preset medium -an output_smooth_odin_frame.mp4*/

interface HomeContainerProps {}

export const LOREM_IPSUM_TITLE: string = 'Lorem Ipsum ';
export const LOREM_IPSUM_SHORT_TEXT: string =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ';

const HomeContainer: FC<HomeContainerProps> = () => {
  const image1 = '/assets/pantaniModified.jpg';
  return (
    <>
      <ScrollHeroVideo
        botsOnlyText={LOREM_IPSUM_SHORT_TEXT}
        videoSrc="/assets/output_smooth.mp4"
      />
      <OverlayContainer border={false}>
        <ContentContainer
          title="Mehr als ein Rennrad"
          text="Entdecken Sie die perfekte Synergie aus Leistung und Design. Unsere handgefertigten Carbonrahmen sind für diejenigen gebaut, die auf jeder Straße Exzellenz verlangen."
          buttonText={'MEHR ERFAHREN'}
          buttonSide={'right'}
          href={'/bikes/roadbikes'}
        />
      </OverlayContainer>
      <OverlayContainer>
        <ImageContainer buttonText={'WOW zeig mer meh'} buttonSide={'middle'} />
      </OverlayContainer>
      <OverlayContainer>
        <ContentContainer
          title="Schweizer Ingenieurskunst"
          text="Präzision, Langlebigkeit und Innovation. Jedes Odin-Bike ist ein Zeugnis Schweizer Handwerkskunst und unserer Leidenschaft für radfahrerische Perfektion."
          buttonText={'MEHR ERFAHREN'}
          buttonSide={'right'}
          href={'/bikes/roadbikes'}
        />
      </OverlayContainer>
      <OverlayContainer>
        <ImageContainer />
      </OverlayContainer>
      <OverlayContainer>
        <ContentContainer
          title="Bauen Sie Ihr Traumrad"
          text="Vom Rahmen bis zum Finish – passen Sie jede Komponente an Ihren Fahrstil an. Erleben Sie das ultimative Fahrerlebnis, das speziell für Sie maßgeschneidert wurde."
          buttonText={'MEHR ERFAHREN'}
          buttonSide={'right'}
          href={'/bikes/roadbikes'}
        />
      </OverlayContainer>
      <OverlayContainer>
        <Calculator />
      </OverlayContainer>
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
        ]}
      />
    </>
  );
};

export default HomeContainer;
