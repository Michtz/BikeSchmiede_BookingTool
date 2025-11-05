import React from 'react';
import { SvgIconProps } from '@/types/common';

const ToolIcon: React.FC<SvgIconProps> = ({
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
      d="M22.4282 39V18.1252"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M22.4282 18.2769C22.4282 17.4753 23.0507 16.587 23.94 16.0887C25.6963 15.1137 27.1525 14.1388 27.1525 11.5064C27.1525 9.0149 25.0849 7 22.5282 7C19.9715 7 17.9039 9.0149 17.9039 11.5064"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M22.4282 18.2769C22.4282 17.4861 22.0169 16.5761 21.1387 16.0887C19.3824 15.1137 17.9262 14.1388 17.9262 11.5064"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M30.843 18.3853L30.843 20.5518"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M32.7105 25.9032H29.1201C28.4079 25.9032 27.8306 26.4658 27.8306 27.1598V37.6893C27.8306 38.3833 28.4079 38.9459 29.1201 38.9459H32.7105C33.4227 38.9459 34 38.3833 34 37.6893V27.1598C34 26.4658 33.4227 25.9032 32.7105 25.9032Z"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M32.9551 21.2343H28.8755C28.2984 21.2343 27.8306 21.6902 27.8306 22.2525V24.8741C27.8306 25.4364 28.2984 25.8923 28.8755 25.8923H32.9551C33.5322 25.8923 34 25.4364 34 24.8741V22.2525C34 21.6902 33.5322 21.2343 32.9551 21.2343Z"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M7.91214 27.2637C7.74796 26.3443 8.45484 25.5 9.38878 25.5H17.694C18.6068 25.5 19.308 26.3085 19.1789 27.2121L17.7503 37.2121C17.6448 37.9511 17.0119 38.5 16.2654 38.5H11.1745C10.4478 38.5 9.8256 37.9791 9.69785 37.2637L7.91214 27.2637Z"
      stroke={color}
    />
    <path
      d="M11 29C11.2761 29 11.5 28.7761 11.5 28.5C11.5 28.2239 11.2761 28 11 28V29ZM8 29H11V28H8V29Z"
      fill={color}
    />
    <path
      d="M11 31C11.2761 31 11.5 30.7761 11.5 30.5C11.5 30.2239 11.2761 30 11 30V31ZM8.5 31H11V30H8.5V31Z"
      fill={color}
    />
    <path
      d="M11 33C11.2761 33 11.5 32.7761 11.5 32.5C11.5 32.2239 11.2761 32 11 32V33ZM9 33H11V32H9V33Z"
      fill={color}
    />
    <path
      d="M11 35C11.2761 35 11.5 34.7761 11.5 34.5C11.5 34.2239 11.2761 34 11 34V35ZM9 35H11V34H9V35Z"
      fill={color}
    />
  </svg>
);
export default ToolIcon;
