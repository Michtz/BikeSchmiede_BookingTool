import React from 'react';
import style from '@/styles/system/LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'normal' | 'big';
  variant?: 'circular' | 'dots' | 'pulse';
  color?: 'primary' | 'white' | 'gray';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'normal',
  variant = 'circular',
  color = 'primary',
}) => {
  if (variant === 'circular') {
    return (
      <div className={style.spinner} data-size={size} data-color={color} />
    );
  }

  if (variant === 'dots') {
    return (
      <div className={style.dotsContainer} data-size={size}>
        <div className={style.dot} data-color={color} />
        <div className={style.dot} data-color={color} />
        <div className={style.dot} data-color={color} />
      </div>
    );
  }

  if (variant === 'pulse') {
    return <div className={style.pulse} data-size={size} data-color={color} />;
  }

  return null;
};

export default LoadingSpinner;
