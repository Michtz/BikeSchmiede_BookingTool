'use client';
import { FC, useMemo } from 'react';
import { Carousel as _Carousel } from 'react-bootstrap';
import Image, { StaticImageData } from 'next/image';
import style from '@/styles/system/Carousel.module.scss';

export interface CarouselItem {
  image: string | StaticImageData;
  alt: string;
  title?: string;
  description?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  interval?: number;
  controls?: boolean;
  indicators?: boolean;
  fade?: boolean;
  pause?: 'hover' | false;
  startIndex?: number;
}
const useRotatedArray = <T,>(items: T[], startIndex: number): T[] => {
  return useMemo(() => {
    if (!items || items.length === 0) return items;

    const normalizedIndex =
      ((startIndex % items.length) + items.length) % items.length;

    return [
      ...items.slice(normalizedIndex),
      ...items.slice(0, normalizedIndex),
    ];
  }, [items, startIndex]);
};

const Carousel: FC<CarouselProps> = ({
  items,
  interval = null,
  controls = true,
  indicators = false,
  fade = false,
  pause = 'hover',
  startIndex = 0,
}) => {
  const rotatedItems: CarouselItem[] = useRotatedArray(items, startIndex);
  if (!items || items.length === 0) return null;

  return (
    <_Carousel
      interval={interval}
      controls={controls}
      indicators={indicators}
      fade={fade}
      pause={pause}
      className={style.carousel}
    >
      {rotatedItems.map((item, index) => (
        <_Carousel.Item
          key={(item.image as string) + index}
          className={style.carouselItem}
        >
          <div style={{ height: '280px', position: 'relative' }}>
            <Image
              src={item.image}
              alt={item.alt}
              fill
              style={{ objectFit: 'cover', objectPosition: '50% 55%' }}
              sizes="100vw"
              priority={items.indexOf(item) === 0}
              className={style.image}
            />
          </div>

          {(item.title || item.description) && (
            <_Carousel.Caption className={style.blurContainerLight}>
              {item.title && <h5>{item.title}</h5>}
              {item.description && <p>{item.description}</p>}
            </_Carousel.Caption>
          )}
        </_Carousel.Item>
      ))}
    </_Carousel>
  );
};

export default Carousel;
