'use client';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MaterialIcon from '../materialIcon/MaterialIcon';
import style from './Link.module.scss';

interface LinkProps {
  href?: string;
  children: React.ReactNode;
  external?: boolean;
  disabled?: boolean;
  className?: string;
  prefetch?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  icon?: string;
  asButton?: boolean;
  fullWidth?: boolean;
  weight?: 'normal' | 'bold';
  active?: boolean;
}

const Link: React.FC<LinkProps> = ({
  href,
  children,
  external = false,
  disabled = false,
  className = '',
  prefetch = false,
  onClick,
  icon,
  asButton = false,
  fullWidth = false,
  weight = 'normal',
  active = false,
}) => {
  const router = useRouter();
  const prefetched = useRef<boolean>(false);

  useEffect(() => {
    if (prefetch && href && !external && !prefetched.current) {
      router.prefetch(href);
    }
  }, [prefetch, href, external, router]);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;

    if (onClick) {
      onClick(event);
      return;
    }

    if (href && !external) {
      event.preventDefault();
      router.push(href);
    }
  };

  const content = (
    <>
      <span className={style.text}>{children}</span>
      {icon && <MaterialIcon icon={icon} />}
    </>
  );

  const sharedProps = {
    className,
    onClick: handleClick,
    'data-disabled': disabled,
    'data-fullwidth': fullWidth,
    'data-weight': weight,
    'data-active': active,
  };

  // Button mode
  if (asButton || !href || onClick) {
    return (
      <span
        {...sharedProps}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            handleClick(e as any);
          }
        }}
      >
        {content}
      </span>
    );
  }

  // External link
  if (external) {
    return (
      <a
        {...sharedProps}
        className={className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  // Internal link
  return (
    <a {...sharedProps} href={href}>
      {content}
    </a>
  );
};

export default Link;
