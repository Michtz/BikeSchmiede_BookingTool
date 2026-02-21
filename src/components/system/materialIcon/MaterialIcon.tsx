import React, { HTMLProps } from 'react';
import style from './MaterialIcon.module.scss';
import Link from '@/components/system/link/Link';

interface MaterialIconProps extends HTMLProps<HTMLSpanElement> {
  icon: string;
  iconSize?: string;
  outlined?: boolean;
  clickable?: boolean;
  onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  href?: string;
  color?: string; // add type
}

const MaterialIcon: React.FC<MaterialIconProps> = ({
  outlined = true,
  clickable = false,
  href,
  icon,
  iconSize = 'normal',
  onClick,
  color,
  ...props
}): React.ReactElement => {
  return (
    <span
      className={`${outlined ? 'material-icons-outlined' : 'material-icons'} ${style['icon-container']}`}
      data-size={iconSize}
      data-color={color}
      data-clickable={!!onClick || clickable || !!href}
      onClick={onClick}
      {...props}
    >
      {href ? <Link href={href}>{icon}</Link> : icon}
    </span>
  );
};

export default MaterialIcon;
