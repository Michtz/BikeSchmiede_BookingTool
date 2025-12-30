'use client';

import { FC, useState } from 'react';
import style from '@/styles/system/new/ImageHoverTextContainer.module.scss';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';

export type ImageHoverTextContainerItem = {
  id: number;
  imageA: string | StaticImageData;
  alt: string;
  title: string;
  text: string;
  url: string;
};

interface ImageHoverTextContainerProps {
  items: ImageHoverTextContainerItem[];
}

const ImageHoverTextContainer: FC<ImageHoverTextContainerProps> = ({
  items,
}) => {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className={style.gridContainer}>
      {items.map((item) => (
        <div
          key={item.id}
          className={style.cardItem}
          onClick={() => router.push(item.url)}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className={style.imageWrapper}>
            <Image
              src={item.imageA}
              alt={item.alt}
              fill
              className={style.image}
            />
            <h3 className={style.title}>{item.title}</h3>
          </div>

          <div
            className={`${style.overlayContainer} ${hoveredId === item.id ? style.isVisible : ''}`}
          >
            <div className={style.textcontainer}>
              <h3 className={style.titleOverlay}>{item.title}</h3>
              <p className={style.textOverlay}>{item.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageHoverTextContainer;
