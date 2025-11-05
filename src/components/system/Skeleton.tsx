import React from 'react';
import style from '@/styles/system/Skeleton.module.scss';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

// Todo: add for all items if time
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius,
  variant = 'rectangular',
  animation = 'pulse',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'text':
        return {
          height: '1rem',
          borderRadius: '4px',
          transform: 'scale(1, 0.8)',
        };
      case 'circular':
        return {
          borderRadius: '50%',
          width: width,
          height: height,
        };
      case 'rectangular':
      default:
        return {
          borderRadius: borderRadius || '4px',
        };
    }
  };

  return (
    <div
      className={`${style.skeleton} ${className}`}
      data-animation={animation}
      style={{
        width,
        height,
        ...getVariantStyles(),
      }}
    />
  );
};

export default Skeleton;
