import React from 'react';
import { SvgIconProps } from '@/types/common';

const ProfileIcon: React.FC<SvgIconProps> = ({
  width = 28,
  height = 28,
  color = '#686868',
  className,
  onClick,
}) => (
  <svg
    onClick={onClick}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="8"
      r="4"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 20c0-4 4-6 8-6s8 2 8 6"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default ProfileIcon;
