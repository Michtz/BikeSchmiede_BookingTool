'use client';

import { FC, MouseEventHandler } from 'react';
import style from '@/styles/system/new/TextImageGridContainer.module.scss';
import Image, { StaticImageData } from 'next/image';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';

export type TextImageGridContainerItem = {
  id: number;
  bike: string | StaticImageData;
  alt: string;
  logo: string | StaticImageData;
  url: string;
};

interface TextImageGridContainerProps {
  items: TextImageGridContainerItem[];
}

const TextImageGridContainer: FC<TextImageGridContainerProps> = ({ items }) => {
  const router: AppRouterInstance = useRouter();

  return (
    <div className={style.gridContainer}>
      {items.map((item: TextImageGridContainerItem) => (
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
            <p>
              Schmolke Schmolke bietet leichtgewichtige Komponenten, die
              Leistung und Langlebigkeit kombinieren. Mit innovativen
              Technologien sorgen sie für ein außergewöhnliches Fahrerlebnis. Ob
              du ein begeisterter Radfahrer bist oder zuverlässige Teile suchst,
              Schmolke hat richtigen Lösungen. Entdecke die Balance zwischen
              Gewicht und.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default TextImageGridContainer;
