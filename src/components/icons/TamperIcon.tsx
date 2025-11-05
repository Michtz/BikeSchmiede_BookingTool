import { SvgIconProps } from '@/types/common';
import React from 'react';

const TamperIcon: React.FC<SvgIconProps> = ({
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
      d="M26.0257 29.2947C26.0257 29.2947 27.6317 23.1244 28.3688 19.8435C29.1058 16.5625 31.1739 6.52917 22.4945 6.52917H22.5275C13.8481 6.52917 15.9052 16.5731 16.6422 19.8541C17.3793 23.135 18.9853 29.3053 18.9853 29.3053H26.0147L26.0257 29.2947Z"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M22.5275 38.4708H31.8119C32.164 38.4708 32.45 38.1956 32.45 37.8569V35.5285C32.45 35.211 32.197 34.9464 31.8669 34.9147C26.8287 34.449 26.1907 29.3159 26.1907 29.3159H22.7145H22.2855H18.8093C18.8093 29.3159 18.1713 34.449 13.1331 34.9147C12.803 34.9464 12.55 35.2004 12.55 35.5285V37.8569C12.55 38.1956 12.836 38.4708 13.1881 38.4708H22.5275Z"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M13.4191 35.0311H31.8669"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
  </svg>
);
export default TamperIcon;
