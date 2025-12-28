'use client';

import { FC, useState } from 'react';
import style from '@/styles/system/new/ImageHoverImageContainer.module.scss';
import Image, { StaticImageData } from 'next/image';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';

export type HoverImageContainerItem = {
  id: number;
  imageA: string | StaticImageData;
  alt: string;
  imageB: string | StaticImageData;
  title: string;
  text: string;
  url: string;
};

interface HoverImageContainerProps {
  items: HoverImageContainerItem[];
}

const ImageHoverImageContainer: FC<HoverImageContainerProps> = ({ items }) => {
  const router: AppRouterInstance = useRouter();
  const [isHovered, setIsHovered] = useState<boolean | number>(false);

  return (
    <div className={style.gridContainer}>
      {items.map((item: HoverImageContainerItem) => (
        <div
          key={item.id}
          className={style.cardItem}
          onClick={() => router.push(item.url)}
        >
          <div className={style.bikeWrapper}>
            <Image
              src={item.imageA}
              alt={item.alt}
              className={style.bikeImage}
            />
            <h3 className={style.title}>{item.title}</h3>
          </div>

          <div
            className={style.logoOverlay}
            onMouseEnter={() => setIsHovered(item.id)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={item.imageB}
              alt={item.alt}
              className={`${style.logoImage} ${isHovered === item.id ? style.hovered : ''}`}
            />
            <div
              className={`${style.textcontainer} ${isHovered === item.id ? style.hovered : ''}`}
            >
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ImageHoverImageContainer;
