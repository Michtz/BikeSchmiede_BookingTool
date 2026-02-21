'use client';

import { FC } from 'react';
import Image from 'next/image';
import style from '@/components/system/stickyImage/StickyImageContainer.module.scss';

interface ScrollHeroProps {
  image: string;
  title: string;
}

const StickyImageContainer: FC<ScrollHeroProps> = ({ image, title }) => {
  return (
    <div className={style.scrollContainer}>
      <div className={style.stickyWrapper}>
        <Image
          src={image}
          className={style.titleImage}
          alt="Hero Background"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <div className={style.overlayContent}>
          <h1 className={`${style.logoFade} ${style.visible}`}>{title}</h1>
        </div>
      </div>
    </div>
  );
};

export default StickyImageContainer;
