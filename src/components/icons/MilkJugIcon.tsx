import React from 'react';
import { SvgIconProps } from '@/types/common';

const MilkJugIcon: React.FC<SvgIconProps> = ({
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
      d="M21.0362 38.4255H31.5291C32.2727 38.4255 32.877 37.8625 32.877 37.1617V28.6823C32.877 28.6823 32.877 28.6248 32.877 28.5903L29.4607 11.643C29.3561 11.0226 28.7984 10.5745 28.1244 10.5745H21.0827H20.4204H13.7157C13.0533 10.5745 12.4839 11.0341 12.3794 11.643L8.96309 28.5903C8.96309 28.5903 8.96309 28.6478 8.96309 28.6823V37.1617C8.96309 37.8625 9.56733 38.4255 10.311 38.4255H21.0478H21.0362Z"
      stroke={color}
      strokeMiterlimit="10"
    />
    <path
      d="M31.1572 15.0325L34.8291 13.3435C35.0499 13.2401 35.3172 13.2631 35.5147 13.4009L39.1285 15.9746C39.3144 16.101 39.419 16.3193 39.4074 16.5491L38.8264 29.9231C38.8264 30.1185 38.7334 30.2908 38.5824 30.4057L35.9795 32.5083"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M14.9009 10.5745H7.59194C6.9296 10.5745 6.45318 11.2179 6.61586 11.8728L10.4272 21.754"
      stroke={color}
      strokeMiterlimit="10"
    />
  </svg>
);

export default MilkJugIcon;
