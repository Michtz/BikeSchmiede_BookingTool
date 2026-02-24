'use client';

import React, { FC, useState } from 'react';
import Image from 'next/image';
import style from './BikeConfigurator.module.scss';

// Definition der Bauteile mit individuellem Z-Index
interface ConfigImage {
  src: string;
  zIndex: number;
}

interface ConfigStep {
  id: string;
  label: string;
  images: ConfigImage[];
}

const STEPS: ConfigStep[] = [
  {
    id: 'frame',
    label: 'Rahmen hinzufügen',
    images: [{ src: '/assets/configurator/frame/rahmen.png', zIndex: 6 }],
  },
  {
    id: 'gears',
    label: 'Schaltung hinzufügen',
    images: [
      { src: '/assets/configurator/gear_back/wechsler.png', zIndex: 3 }, // Vorne
      { src: '/assets/configurator/gear_front/kurbel.png', zIndex: 10 },
    ],
  },
  {
    id: 'wheels',
    label: 'Räder hinzufügen',
    images: [{ src: '/assets/configurator/weels/rad.png', zIndex: 2 }], // Meist ganz hinten
  },
  {
    id: 'sattel',
    label: 'Sattel hinzufügen',
    images: [{ src: '/assets/configurator/sattel/sattel.png', zIndex: 7 }],
  },
  {
    id: 'handlebar',
    label: 'Lenker hinzufügen',
    images: [{ src: '/assets/configurator/handlebar/lenker.png', zIndex: 8 }],
  },
];

const BikeConfigurator: FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleNextStep = () => {
    if (currentStep < STEPS.length) setCurrentStep((prev) => prev + 1);
  };

  return (
    <div className={style.configuratorContainer}>
      <div className={style.previewWrapper}>
        {STEPS.map((step, index) => {
          // Nur rendern, wenn der Step bereits erreicht wurde
          if (index >= currentStep) return null;

          return step.images.map((img) => (
            <div
              key={img.src}
              className={style.layerImage}
              style={{ zIndex: img.zIndex }} // Hier wird der individuelle Z-Index gesetzt
            >
              <Image
                src={img.src}
                alt={step.id}
                fill
                priority
                className={style.bikeImage}
              />
            </div>
          ));
        })}
      </div>

      <div className={style.controls}>
        <button
          onClick={handleNextStep}
          disabled={currentStep === STEPS.length}
        >
          {currentStep < STEPS.length ? STEPS[currentStep].label : 'Fertig'}
        </button>
      </div>
    </div>
  );
};

export default BikeConfigurator;
