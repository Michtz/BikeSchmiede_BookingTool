'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import { Container } from '@/components/system/Container';
import Image from 'next/image';
import logoA from '@/assets/gebioMized.avif';
import logoB from '@/assets/logo_black.png';
import bikeTietleImage from '@/assets/odin_back_green.jpg';
import bikeA from '@/assets/1.png';
import bikeTitleImage from '@/assets/title_image_michel.jpg';
import bikeB from '@/assets/3.png';
import marken from '@/assets/title_mikel_full.jpg';
import workshop from '@/assets/werkstatt1_edited.jpg';
import bikejitting from '@/assets/bikefitting_cutout_white.png';
import bikeC from '@/assets/odin_roadbike.jpeg';
import angela from '@/assets/angela.jpg';
import style from '@/styles/new/HomeContainer.module.scss';
import Button, { ButtonContainer } from '@/components/system/Button';
import serviceOptions from '../../../testData.json';
import Video from 'next-video';

import ImageGridContainer, {
  ImageGridContainerItem,
} from '@/components/system/new/ImageGrid';
import TextGridContainer from '@/components/system/new/TextGrid';
import TextImageGridContainer from '@/components/system/new/TextImageGrid';
import CartsGridContainer, { Service } from '@/components/system/new/CartsGrid';
import Logo from '@/components/icons/Logo';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import OdinLogo from '@/components/icons/OdinLogo';
import dynamic from 'next/dynamic';
import frame from '@/assets/3.png';

interface HomeContainerProps {}

const OdinHomeContainer: FC<HomeContainerProps> = () => {
  const router: AppRouterInstance = useRouter();
  const [services, setServices] = useState<any[]>(serviceOptions.services);

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
  const showLogoRef = useRef(false);
  const isTicking = useRef(false);

  useEffect(() => {
    // 1. Wir nutzen useRef für den "Ticking"-Status, damit kein Re-Render ausgelöst wird

    const handleScroll = () => {
      // Wenn schon ein Update geplant ist (isTicking = true),
      // IGNORIEREN wir dieses Scroll-Event komplett.
      // Das blockt die hunderten unnötigen Aufrufe ab.
      if (!isTicking.current) {
        // Wir planen das Update für den nächsten Monitor-Refresh (ca. 16ms später)
        window.requestAnimationFrame(() => {
          updateVideoPosition();
          // Erst JETZT erlauben wir wieder neue Updates
          isTicking.current = false;
        });

        // Wir markieren, dass wir beschäftigt sind
        isTicking.current = true;
      }
    };
    //
    // // Die eigentliche Logik haben wir ausgelagert, um es sauber zu halten
    // const updateVideoPosition = () => {
    //   if (!containerRef.current || !videoRef.current) return;
    //
    //   const container = containerRef.current;
    //   const video = videoRef.current;
    //
    //   const containerTop = container.getBoundingClientRect().top;
    //   const scrollLength = container.scrollHeight - window.innerHeight;
    //
    //   let progress = -containerTop / scrollLength;
    //
    //   // Clamping
    //   if (progress < 0) progress = 0;
    //   if (progress > 1) progress = 1;
    //
    //   // Nur updaten, wenn duration verfügbar ist
    //   if (Number.isFinite(video.duration)) {
    //     // Optional: Mikro-Optimierung
    //     console.log(video.duration);
    //     // Nur setzen, wenn sich die Zeit wirklich relevant geändert hat (z.B. > 0.01s)
    //     const targetTime = video.duration * progress;
    //     if (Math.abs(video.currentTime - targetTime) > 0.01) {
    //       video.currentTime = targetTime;
    //     }
    //   }
    // };

    // ... in deinem useEffect ...

    const updateVideoPosition = () => {
      if (!containerRef.current || !videoRef.current) return;

      const container = containerRef.current;
      const video = videoRef.current;

      const containerTop = container.getBoundingClientRect().top;
      const scrollLength = container.scrollHeight - window.innerHeight;

      let progress = -containerTop / scrollLength;

      // Clamping
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      // --- VIDEO UPDATE ---
      if (Number.isFinite(video.duration)) {
        const targetTime = video.duration * progress;
        if (Math.abs(video.currentTime - targetTime) > 0.01) {
          video.currentTime = targetTime;
        }
      }

      // --- LOGO LOGIK (Der neue Teil) ---
      // Wir wollen das Logo ab 25% (0.25) einblenden
      const shouldShowLogo = progress > 0.25;

      // PERFORMANCE SCHUTZ:
      // Wir rufen setServices NUR auf, wenn sich der Wert WIRKLICH geändert hat.
      // Wir vergleichen mit dem Ref, nicht mit dem State, da der Ref immer sofort aktuell ist.
      if (showLogoRef.current !== shouldShowLogo) {
        showLogoRef.current = shouldShowLogo; // Ref updaten
        setShowLogo(shouldShowLogo); // State updaten (löst Re-Render aus)
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <div className={style.scrollContainer} ref={containerRef}>
        <div className={style.stickyWrapper}>
          <video
            ref={videoRef}
            className={style.videoElement}
            muted
            playsInline
            preload="auto"
          >
            <source src="/assets/output_smooth.mp4" type="video/mp4" />
          </video>

          {/* Logo Overlay */}
          <div className={style.overlayContent}>
            <div
              style={{
                opacity: showLogo ? 1 : 0,
                transition: 'opacity 0.5s',
                pointerEvents: showLogo ? 'all' : 'none',
              }}
            >
              <OdinLogo width={400} />
            </div>
          </div>
        </div>
      </div>

      {/* Dieser Container schiebt sich jetzt ÜBER das Video.
          Wichtig: Er beginnt erst NACH den 400vh des scrollContainers.
      */}
      <div className={style.contentBelow}>
        <Container padding={false} flow={'column'}>
          <h2>WHAT IS ODIN</h2>
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
          {/* Ein bisschen Abstand oben, damit der Text nicht am Rand klebt */}
          <div style={{ paddingTop: '80px', paddingBottom: '40px' }}>
            <div className={style.titleImageContainer}>
              <OdinLogo
                width={350}
                className={style.titleText}
                color={'#3A7361'}
              />
              {/* ... Rest deines Headers ... */}
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

            {/* ... Rest deiner Seite (Grids etc.) ... */}
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
