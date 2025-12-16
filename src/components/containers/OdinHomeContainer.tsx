'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import { Container } from '@/components/system/Container';
import Image from 'next/image';
import logoA from '@/assets/gebioMized.avif';
import logoB from '@/assets/logo_black.png';

import bikeB from '@/assets/3.png';
import marken from '@/assets/title_mikel_full.jpg';
import workshop from '@/assets/werkstatt1_edited.jpg';
import bikejitting from '@/assets/schmolke_bike_2.jpg';
import bikeC from '@/assets/odin_roadbike.jpeg';
import angela from '@/assets/angela.jpg';
import style from '@/styles/new/HomeContainer.module.scss';
import Button from '@/components/system/Button';
import { ImageGridContainerItem } from '@/components/system/new/ImageGrid';
import TextImageGridContainer from '@/components/system/new/TextImageGrid';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import OdinLogo from '@/components/icons/OdinLogo';
import frame from '@/assets/3.png';

/* video  DO NOT DELETE!!!!!!!!!!!!!!!!!! edit prompt MacBook-Pro assets % ffmpeg -i odin_animatie.mp4   -c:v libx264 -x264-params keyint=1:scenecut=0 -crf 22 -preset medium -an output_smooth_odin_frame.mp4*/

interface HomeContainerProps {}

const OdinHomeContainer: FC<HomeContainerProps> = () => {
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
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showLogo, setShowLogo] = useState<boolean>(false);
  const [showImageOverlay, setShowImageOverlay] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(false);
  const showLogoRef = useRef(false);
  const isTicking = useRef(false);
  const showImageOverlayRef = useRef(false);
  const showTextRef = useRef(false);
  const contentTriggerRef = useRef<HTMLDivElement>(null);
  const isVisible = showLogo && !showImageOverlay;

  const updateVideoPosition = () => {
    if (!containerRef.current || !videoRef.current) return;

    const container = containerRef.current;
    const video = videoRef.current;

    const containerTop = container.getBoundingClientRect().top;
    const scrollLength = container.scrollHeight - window.innerHeight;

    let progress = -containerTop / scrollLength;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    // --- VIDEO UPDATE ---
    if (Number.isFinite(video.duration)) {
      const targetTime = video.duration * progress;
      if (Math.abs(video.currentTime - targetTime) > 0.01) {
        video.currentTime = targetTime;
      }
    }

    const shouldShowLogo = progress > 0.25;
    if (showLogoRef.current !== shouldShowLogo) {
      showLogoRef.current = shouldShowLogo;
      setShowLogo(shouldShowLogo);
    }
  };

  const handleScroll = () => {
    if (contentTriggerRef.current) {
      const contentRect = contentTriggerRef.current.getBoundingClientRect();

      // Wenn 'top' kleiner oder gleich 0 ist, füllt der Container den Screen ab oben.
      // Du kannst hier auch "-100" nehmen, wenn es etwas später passieren soll.
      const isCoveringImage = contentRect.top <= 0;
      const isTextVisible = contentRect.top <= 0;
      console.log(contentRect.top);
      // Nur State ändern, wenn er sich wirklich geändert hat!
      if (showImageOverlayRef.current !== isCoveringImage) {
        showImageOverlayRef.current = isCoveringImage;
        setShowImageOverlay(isCoveringImage);
      }

      if (showTextRef.current !== isTextVisible) {
        showTextRef.current = isTextVisible;
        setShowText(isTextVisible);
      }
    }
    if (!isTicking.current) {
      window.requestAnimationFrame(() => {
        updateVideoPosition();
        isTicking.current = false;
      });
      isTicking.current = true;
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={style.scrollContainer} ref={containerRef}>
        <div className={style.stickyWrapper}>
          {showImageOverlay ? (
            // <Image
            //   src={bikeTietleImage}
            //   className={style.titleImage}
            //   alt={'jhf'}
            // />
            <video
              className={style.videoElement2}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              key={'b'}
            >
              <source
                src="/assets/output_smooth_odin_frame.mp4"
                type="video/mp4"
              />
              Dein Browser unterstützt das Video-Tag nicht.
            </video>
          ) : (
            <video
              className={style.videoElement}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              key={'a'}
            >
              <source src="/assets/output_smooth.mp4" type="video/mp4" />
            </video>
          )}

          <div className={style.overlayContent}>
            <h1
              className={`${style.logoFade} ${isVisible ? style.visible : ''}`}
            >
              <OdinLogo width={400} />
              <span className={style.srOnly}>
                Odin Roadbikes – Premium Carbon Rennräder aus der Schweiz
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className={style.contentBelow} ref={contentTriggerRef}>
        <h2>WHAT IS ODIN</h2>
        <p style={{ opacity: showText ? '1' : '0', transition: '0.5s easy' }}>
          ODIN Roadbikes steht für garantierten Fahrspass. Wir bauen die
          Fahrräder individuell nach Ihren Körpermaßen und mit Komponenten Ihrer
          Wahl. Wir sorgen dafür, dass Ihr Traumfahrrad genau auf Sie
          zugeschnitten ist. Bei verschiedenen Modellen können Sie sogar die
          Farben und das Design selbst auswählen.
        </p>
        <span className={style.stickyWrapper2}>
          <div
            style={{
              opacity: showImageOverlay ? 1 : 0,
              transition: 'opacity 0.5s',
              pointerEvents: showImageOverlay ? 'all' : 'none',
              color: 'red',
            }}
          ></div>
        </span>
      </div>

      <div className={style.contentBelow}>
        <Container padding={false} flow={'column'}>
          <span className={style.contentBoxA}>
            <p>
              Mit Schmolke Carbon haben wir einen der führenden Lieferanten von
              Leichtbauteilen in unserem Sortiment. Ebenso bieten wir Rennräder
              und Gravelbikes dieses spezialisierten Fahrradbauers an. Die
              hochwertigen Produkte von Schmolke ermöglichen es, dass du dein
              Rennrad noch leichter bauen kannst und sorgen an den richtigen
              Stellen für eine gute Balance zwischen Gewicht und Steifigkeit.
              Wir können Schmolke-Produkte auf Kundenwunsch liefern und haben
              ebenso ein Sortiment an Schmolke Carbon-Produkten in unserem
              Geschäft. Mit Schmolke Carbon holst du das Beste aus deinem
              Fahrrad heraus! Auch für Kompletträder mit Schmolke-Rahmen bist du
              bei uns genau richtig! Kontaktiere uns für eine Beratung!
            </p>
            <Image className={style.image} src={frame} alt={'frame'} />
          </span>{' '}
          <span className={style.contentBoxA}>
            <Image className={style.image} src={frame} alt={'frame'} />

            <p>
              Mit Schmolke Carbon haben wir einen der führenden Lieferanten von
              Leichtbauteilen in unserem Sortiment. Ebenso bieten wir Rennräder
              und Gravelbikes dieses spezialisierten Fahrradbauers an. Die
              hochwertigen Produkte von Schmolke ermöglichen es, dass du dein
              Rennrad noch leichter bauen kannst und sorgen an den richtigen
              Stellen für eine gute Balance zwischen Gewicht und Steifigkeit.
              Wir können Schmolke-Produkte auf Kundenwunsch liefern und haben
              ebenso ein Sortiment an Schmolke Carbon-Produkten in unserem
              Geschäft. Mit Schmolke Carbon holst du das Beste aus deinem
              Fahrrad heraus! Auch für Kompletträder mit Schmolke-Rahmen bist du
              bei uns genau richtig! Kontaktiere uns für eine Beratung!
            </p>
          </span>
          <span className={style.contentBoxA}>
            <p>
              Mit Schmolke Carbon haben wir einen der führenden Lieferanten von
              Leichtbauteilen in unserem Sortiment. Ebenso bieten wir Rennräder
              und Gravelbikes dieses spezialisierten Fahrradbauers an. Die
              hochwertigen Produkte von Schmolke ermöglichen es, dass du dein
              Rennrad noch leichter bauen kannst und sorgen an den richtigen
              Stellen für eine gute Balance zwischen Gewicht und Steifigkeit.
              Wir können Schmolke-Produkte auf Kundenwunsch liefern und haben
              ebenso ein Sortiment an Schmolke Carbon-Produkten in unserem
              Geschäft. Mit Schmolke Carbon holst du das Beste aus deinem
              Fahrrad heraus! Auch für Kompletträder mit Schmolke-Rahmen bist du
              bei uns genau richtig! Kontaktiere uns für eine Beratung!
            </p>
            <Image className={style.image} src={frame} alt={'frame'} />
          </span>{' '}
          <span className={style.contentBoxA}>
            <Image className={style.image} src={frame} alt={'frame'} />

            <p>
              Mit Schmolke Carbon haben wir einen der führenden Lieferanten von
              Leichtbauteilen in unserem Sortiment. Ebenso bieten wir Rennräder
              und Gravelbikes dieses spezialisierten Fahrradbauers an. Die
              hochwertigen Produkte von Schmolke ermöglichen es, dass du dein
              Rennrad noch leichter bauen kannst und sorgen an den richtigen
              Stellen für eine gute Balance zwischen Gewicht und Steifigkeit.
              Wir können Schmolke-Produkte auf Kundenwunsch liefern und haben
              ebenso ein Sortiment an Schmolke Carbon-Produkten in unserem
              Geschäft. Mit Schmolke Carbon holst du das Beste aus deinem
              Fahrrad heraus! Auch für Kompletträder mit Schmolke-Rahmen bist du
              bei uns genau richtig! Kontaktiere uns für eine Beratung!
            </p>
          </span>
          <div style={{ paddingTop: '80px', paddingBottom: '40px' }}>
            <div className={style.titleImageContainer}>
              <OdinLogo
                width={350}
                className={style.titleText}
                color={'#3A7361'}
              />
            </div>

            <h2
              style={{
                textAlign: 'center',
                fontSize: '40px',
                marginTop: '2rem',
              }}
            >
              WAS WIR ZU BIETEN HABEN
            </h2>

            <TextImageGridContainer items={items} />
            <div className={style.imageWallContainer}>
              {/* ... Image Wall ... */}
            </div>
          </div>
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
              <Image
                alt={'gv'}
                src={workshop}
                className={style.imageWallItem}
              />

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
      </div>
    </>
  );

  // return (
  //   <Container padding={false} flow={'column'}>
  //     <div>
  //       <Image src={titeImage} alt={'jhf'} />
  //     </div>
  //   </Container>
  // );
};

export default OdinHomeContainer;
