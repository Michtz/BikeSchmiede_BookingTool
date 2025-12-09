'use client';

import { FC, MouseEventHandler } from 'react';
import style from '@/styles/system/new/ImageGridContainer.module.scss';
import Image, { StaticImageData } from 'next/image';
import Button from '@/components/system/Button';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export type ImageGridContainerItem = {
  id: number;
  bike: string | StaticImageData;
  alt: string;
  logo: string | StaticImageData;
  url: string;
};

export interface ImageGridContainerProps {
  items: ImageGridContainerItem[];
}

const ImageGridContainer: FC<ImageGridContainerProps> = ({ items }) => {
  const router: AppRouterInstance = useRouter();
  return (
    <div className={style.gridContainer}>
      {items.map((item: ImageGridContainerItem) => (
        <div
          key={item.id}
          className={style.cardItem}
          onClick={() => router.push(item.url)}
        >
          <div className={style.bikeWrapper}>
            <Image src={item.bike} alt={item.alt} className={style.bikeImage} />
          </div>

          <div className={style.logoOverlay}>
            <Image
              src={item.logo}
              alt="Brand Logo"
              className={style.logoImage}
            />
            <Button>MEHR</Button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ImageGridContainer;
