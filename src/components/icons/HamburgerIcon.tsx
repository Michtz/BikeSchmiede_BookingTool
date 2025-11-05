import React from 'react';
import { SvgIconProps } from '@/types/common';

interface HamburgerIconProps extends SvgIconProps {
  isOpen?: boolean;
}

const HamburgerIcon: React.FC<HamburgerIconProps> = ({
  width = 24,
  height = 24,
  color = '#686868',
  className,
  onClick,
  isOpen = false,
}) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <g>
      <path
        d="M3 6h18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transformOrigin: 'center',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          transform: isOpen
            ? 'rotate(45deg) translate(5px, 5px)'
            : 'rotate(0deg)',
          opacity: isOpen ? 0 : 1,
        }}
      />
      <path
        d="M3 12h18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transformOrigin: 'center',
          transition: 'opacity 0.3s ease',
          opacity: isOpen ? 0 : 1,
        }}
      />
      <path
        d="M3 18h18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transformOrigin: 'center',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          transform: isOpen
            ? 'rotate(-45deg) translate(5px, -5px)'
            : 'rotate(0deg)',
          opacity: isOpen ? 0 : 1,
        }}
      />
      {/* X Icon paths - shown when open */}
      <path
        d="M6 6l12 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transformOrigin: 'center',
          transition: 'opacity 0.3s ease',
          opacity: isOpen ? 1 : 0,
        }}
      />
      <path
        d="M18 6l-12 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transformOrigin: 'center',
          transition: 'opacity 0.3s ease',
          opacity: isOpen ? 1 : 0,
        }}
      />
    </g>
  </svg>
);

export default HamburgerIcon;
