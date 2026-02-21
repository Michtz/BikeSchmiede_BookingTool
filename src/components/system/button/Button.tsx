'use client';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import MaterialIcon from '../materialIcon/MaterialIcon';
import Link from '../link/Link';
import style from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'error' | 'ghost' | 'icon';
  size?: 'small' | 'normal' | 'big';
  appearance?: 'button' | 'icon';
  href?: string;
  icon?: string;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
  flex?: boolean;
  visability?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'normal',
      appearance = 'button',
      href,
      icon,
      loading = false,
      disabled = false,
      children,
      className = '',
      onClick,
      flex = false,
      visability = true,
      ...props
    },
    ref,
  ) => {
    const buttonContent = (
      <>
        {!loading && children}
        {icon && !loading && <MaterialIcon icon={icon} iconSize={size} />}
        {loading && <span>Laden...</span>}
      </>
    );

    const buttonElement = (
      <button
        ref={ref}
        disabled={disabled || loading || !visability}
        onClick={onClick}
        className={`${style.buttonContainer} ${className}`}
        data-variant={variant}
        data-size={size}
        data-appearance={appearance}
        data-flex={flex}
        data-loading={loading}
        data-visability={visability}
        {...props}
      >
        {buttonContent}
      </button>
    );

    // If href is provided and not disabled, wrap in Link
    if (href && !disabled) {
      return <Link href={href}>{buttonElement}</Link>;
    }

    return buttonElement;
  },
);

Button.displayName = 'Button';

interface ButtonContainerProps {
  children: React.ReactNode;
  spread?: boolean;
  className?: string;
  styles?: React.CSSProperties;
}

export const ButtonContainer: React.FC<ButtonContainerProps> = ({
  children,
  spread = true,
  className = '',
  styles,
}) => (
  <div
    onClick={(e) => e.stopPropagation()}
    className={`${style.buttonContainerContainer} ${className}`}
    data-spread={spread}
    style={styles}
  >
    {children}
  </div>
);

type ComponentSize = 'small' | 'normal' | 'large';

interface ButtonGroupOption {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface ButtonGroupProps {
  options: Array<ButtonGroupOption>;
  fullWidth?: boolean;
  navGap?: boolean;
  size?: ComponentSize;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  size = 'normal',
  fullWidth = false,
  options,
  navGap,
}): React.ReactElement => {
  const ref: React.RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);
  const [flexDirection, setFlexDirection] = useState<'row' | 'column'>('row');
  const singleNodeWidth: number = 100;

  useEffect(() => {
    if (!ref.current) return;
    if (
      ref.current.clientWidth <=
      singleNodeWidth * ref.current.childElementCount
    )
      setFlexDirection('column');
    else setFlexDirection('row');
  }, []);

  useEffect(() => {
    const handler = (): void => {
      if (!ref.current) return;
      if (
        ref.current.clientWidth <=
        singleNodeWidth * ref.current.childElementCount
      )
        setFlexDirection('column');
      else setFlexDirection('row');
    };
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  return (
    <section
      ref={ref}
      className={style.buttonGroup}
      data-direction={flexDirection}
      data-nav-gap={navGap}
      data-fullwidth={fullWidth}
    >
      {options.map((optionProps: ButtonGroupOption, index: number) => {
        return <ButtonGroupOption key={index} size={size} {...optionProps} />;
      })}
    </section>
  );
};

interface ButtonGroupOptionProps extends ButtonGroupOption {
  size?: ComponentSize;
}

const ButtonGroupOption: React.FC<ButtonGroupOptionProps> = ({
  size = 'normal',
  active,
  disabled,
  label,
  onClick,
}): React.ReactElement => {
  const sharedProps: Record<string, any> = {
    className: style.buttonOption,
    'data-size': size,
    'data-selected': active,
    'data-disabled': disabled,
    children: label,
  };

  const handleButtonClick = (): void => {
    if (active || disabled) return;
    if (onClick) onClick();
  };

  return (
    <button
      type="button"
      {...sharedProps}
      onClick={handleButtonClick}
      disabled={disabled}
    />
  );
};
export default Button;
