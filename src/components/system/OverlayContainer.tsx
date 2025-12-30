'use client';

import React, { forwardRef, PropsWithChildren } from 'react';
import style from '@/styles/system/new/OverlayContainer.module.scss';

interface BrandIntroProps extends PropsWithChildren {}

const OverlayContainer = forwardRef<HTMLDivElement, BrandIntroProps>(
  ({ children }, ref) => {
    return (
      <div className={style.contentBelow} ref={ref}>
        {children}
      </div>
    );
  },
);

OverlayContainer.displayName = 'Overlay....'; // SEO muesi de no ergänze

export default OverlayContainer;
