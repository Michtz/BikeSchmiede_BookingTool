import React from 'react';
import { SvgIconProps } from '@/types/common';

const CartIcon: React.FC<SvgIconProps> = ({
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
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3h2l.4 2M7 13h10l3.5-7H5.4" stroke={color} />
    <circle cx="9" cy="20" r="1.5" stroke={color} />
    <circle cx="17" cy="20" r="1.5" stroke={color} />
  </svg>
);
export default CartIcon;
