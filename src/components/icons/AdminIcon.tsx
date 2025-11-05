import React from 'react';
import { SvgIconProps } from '@/types/common';

const AdminIcon: React.FC<SvgIconProps> = ({
  width = 24,
  height = 24,
  color = '#686868',
  className,
  onClick,
}) => (
  <svg
    onClick={onClick}
    className={className}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z"
      fill={color}
    />
    <path
      d="M16 16C16 14.3431 14.2091 13 12 13C9.79086 13 8 14.3431 8 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default AdminIcon;
