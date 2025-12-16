'use client';

import { FC } from 'react';
import style from '@/styles/system/new/CartsGridContainer.module.scss';
import Button, { ButtonContainer } from '@/components/system/Button';
import OdinLogo from '@/components/icons/OdinLogo';
type ServiceLevel = 'brons' | 'silver' | 'gold';

export interface Service {
  id: string;
  name: string;
  category: ServiceLevel;
  price: string;
  features: string[];
  includes?: string;
  excludes?: string;
  note?: string;
}

interface CartsGridContainerProps {
  items: Service[];
}

const CartsGridContainer: FC<CartsGridContainerProps> = ({ items }) => {
  return (
    <div className={style.gridContainer}>
      {items.map((item: Service) => (
        <div key={item.id} className={style.cardItem}>
          <div className={style.wrapper}>
            <div className={style.iconContainer}>
              <OdinLogo
                color={
                  item.category === 'gold'
                    ? '#CDB14F'
                    : item.category === 'silver'
                      ? '#686868'
                      : '#BEC6CC'
                }
                className={style.logo}
              />
            </div>
            <h3>{item.name}</h3>
            <ul className={style.featureList}>
              {item.features.map((feature, i) => (
                <li key={feature + i}>{feature}</li>
              ))}
            </ul>
            <hr />
            <div className={style.bottomContainer}>
              <ul className={style.featureList}>
                {item.includes && <li>{item.includes}</li>}
                {item.excludes && <li>{item.excludes} </li>}
              </ul>
              <ButtonContainer className={style.buttonContainer}>
                <Button
                  style={{
                    backgroundColor:
                      item.category === 'gold'
                        ? '#CDB14F'
                        : item.category === 'silver'
                          ? '#686868'
                          : '#BEC6CC',
                    color:
                      item.category === 'gold'
                        ? '#3b372a'
                        : item.category === 'silver'
                          ? '#e1e1e1'
                          : '#444749',
                  }}
                >
                  Jetzt Buchen
                </Button>
              </ButtonContainer>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default CartsGridContainer;
