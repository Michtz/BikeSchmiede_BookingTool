import React from 'react';
import { SvgIconProps } from '@/types/common';

const CoffeeCupIcon: React.FC<SvgIconProps> = ({
  width = 45,
  height = 45,
  color = '#4C4B4B',
  className,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 45 45"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.2253 22.2575H32.875C33.2188 22.2575 33.4982 22.5306 33.4982 22.8667C33.4982 24.9254 33.0899 31.6896 28.4048 35.5759H23.2361H21.6027H16.4341C11.7489 31.6896 11.3406 24.9254 11.3406 22.8667C11.3406 22.5306 11.62 22.2575 11.9639 22.2575H23.2468H23.2253Z"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M7.01009 35.5759H37.7965C38.0544 35.5759 38.2693 35.786 38.2693 36.038C38.2693 37.3825 37.1517 38.4748 35.7763 38.4748H9.03028C7.65483 38.4748 6.53728 37.3825 6.53728 36.038C6.53728 35.786 6.75219 35.5759 7.01009 35.5759Z"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M33.509 25.5976C35.1531 24.7994 36.8186 24.7783 37.7535 25.7026C39.1182 27.0366 38.4735 29.82 36.3136 31.9207C34.4331 33.7588 32.0153 34.473 30.5324 33.7273"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M22.9137 19.1065C22.1293 18.2242 20.9472 17.0163 22.6128 14.8421L22.6451 14.8001C24.2999 12.6259 23.1286 11.4075 22.3442 10.5357"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M27.1475 19.0645C26.5027 18.4028 25.7398 17.4364 27.083 15.8084L27.1045 15.7769C28.4477 14.1489 27.9534 12.8464 27.3087 12.1847"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M18.0567 19.1275C17.4119 18.4658 16.649 17.4995 17.9922 15.8714L18.0137 15.8399C19.3569 14.2119 18.8626 12.9095 18.2179 12.2477"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
  </svg>
);

export default CoffeeCupIcon;
