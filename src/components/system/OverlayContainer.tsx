'use client';

import React, { forwardRef } from 'react';
import style from '@/styles/system/new/OverlayContainer.module.scss';

type OverLayContent = {
  backgroundText: string;
  title: string;
  text: string;
};

interface BrandIntroProps {
  showText: boolean;
  showImageOverlay: boolean;
  content: OverLayContent;
}

const OverlayContainer = forwardRef<HTMLDivElement, BrandIntroProps>(
  ({ showText, showImageOverlay, content }, ref) => {
    return (
      <div className={style.contentBelow} ref={ref}>
        <h2 style={{ opacity: showText ? '0.03' : '0.1', transition: '1.5s' }}>
          {content.backgroundText}
        </h2>
        <h3>{content.title}</h3>
        <p style={{ opacity: showText ? '1' : '0', transition: '1.5s' }}>
          {content.text}
        </p>

        <span className={style.stickyWrapper2}>
          <div
            style={{
              opacity: showImageOverlay ? 1 : 0,
              transition: 'opacity 0.5s',
              pointerEvents: showImageOverlay ? 'all' : 'none',
            }}
          ></div>
        </span>
      </div>
    );
  },
);

OverlayContainer.displayName = 'Overlay....'; // SEO muesi de no ergänze

export default OverlayContainer;
