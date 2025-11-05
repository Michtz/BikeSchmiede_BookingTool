import React from 'react';
import { SvgIconProps } from '@/types/common';

const ScaleIcon: React.FC<SvgIconProps> = ({
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
      d="M19.4801 35.4526H27.5257C28.8113 35.4526 29.8526 36.494 29.8526 37.7796V37.8843C29.8526 38.2043 29.5908 38.4661 29.2709 38.4661H17.7349C17.4149 38.4661 17.1531 38.2043 17.1531 37.8843V37.7796C17.1531 36.494 18.1945 35.4526 19.4801 35.4526Z"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path d="M23.5029 16.3074V35.4527" stroke={color} strokeMiterlimit="10" />
    <path
      d="M23.5029 8.59058V11.0106"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M23.5029 16.6448C25.0579 16.6448 26.3185 15.3842 26.3185 13.8292C26.3185 12.2742 25.0579 11.0135 23.5029 11.0135C21.9479 11.0135 20.6873 12.2742 20.6873 13.8292C20.6873 15.3842 21.9479 16.6448 23.5029 16.6448Z"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M9.09308 23.7582C9.09308 26.3179 11.167 28.3918 13.7267 28.3918C16.2864 28.3918 18.3603 26.3179 18.3603 23.7582H9.09308Z"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M9.04498 23.47L13.3718 14.2264C13.587 13.7813 14.2241 13.793 14.4248 14.2438L18.4 23.46"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M20.6349 13.7536L12.6359 13.7536"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M37.9519 23.7582C37.9519 26.3179 35.878 28.3918 33.3183 28.3918C30.7586 28.3918 28.6847 26.3179 28.6847 23.7582H37.9519Z"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M38 23.47L33.6732 14.2264C33.4579 13.7813 32.8209 13.793 32.6202 14.2438L28.645 23.46"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M26.4101 13.7536L34.4091 13.7536"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
  </svg>
);
export default ScaleIcon;
