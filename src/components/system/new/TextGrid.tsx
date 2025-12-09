'use client';

import { FC, MouseEventHandler } from 'react';
import style from '@/styles/system/new/TextGridContainer.module.scss';
import Button from '@/components/system/Button';
import Image, { StaticImageData } from 'next/image';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';

export type TextGridContainerItem = {
  id: number;
  bike: string | StaticImageData;
  alt: string;
  logo: string | StaticImageData;
  url: string;
};

interface TextGridContainerProps {
  items: TextGridContainerItem[];
}

const TextGridContainer: FC<TextGridContainerProps> = ({ items }) => {
  const router: AppRouterInstance = useRouter();

  return (
    <div className={style.gridContainer}>
      {items.map((item: TextGridContainerItem) => (
        <div
          key={item.id}
          className={style.cardItem}
          onClick={() => router.push(item.url)}
        >
          <div className={style.bikeWrapper}>
            <Image src={item.bike} alt={item.alt} className={style.bikeImage} />
          </div>

          <div className={style.logoOverlay}>
            <h3>Schmolke</h3>
            <p>
              Schmolke Schmolke bietet leichtgewichtige Komponenten, die
              Leistung und Langlebigkeit kombinieren. Mit innovativen
              Technologien sorgen sie für ein außergewöhnliches Fahrerlebnis. Ob
              du ein begeisterter Radfahrer bist oder zuverlässige Teile suchst,
              Schmolke hat richtigen Lösungen. Entdecke die Balance zwischen
              Gewicht und.
            </p>
            <Button>MEHR</Button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default TextGridContainer;
