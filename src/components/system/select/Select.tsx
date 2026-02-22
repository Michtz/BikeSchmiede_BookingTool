'use client';
import React, { forwardRef, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import style from './Select.module.scss';
import MaterialIcon from '@/components/system/materialIcon/MaterialIcon';

interface TooltipProps {
  text: string;
  more?: React.ReactNode;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  tooltip?: TooltipProps;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  readOnly?: boolean;
  inputProps?: UseFormRegisterReturn;
  startIcon?: string;
  endIcon?: string;
  options: SelectOption[];
  containerStyle?: React.CSSProperties;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      tooltip,
      helperText,
      error = false,
      required = false,
      fullWidth = false,
      readOnly = false,
      inputProps,
      startIcon,
      endIcon = 'arrow_down', // Default dropdown arrow
      options,
      placeholder,
      className,
      containerStyle,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const selectClasses = [
      style.select,
      error && style.error,
      fullWidth && style.fullWidth,
      isFocused && style.focused,
      readOnly && style.readOnly,
      (startIcon || endIcon) && style.hasIcons,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const containerClasses = [
      style.selectContainer,
      fullWidth && style.fullWidth,
      error && style.error,
      isFocused && style.focused,
      readOnly && style.readOnly,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses} style={containerStyle}>
        {label && (
          <div className={style.labelContainer}>
            <label className={style.label}>
              {label}
              {required && <span className={style.required}>*</span>}
            </label>
            {tooltip && (
              <div className={style.tooltipContainer}>
                <MaterialIcon
                  icon="help_outline"
                  iconSize="small"
                  className={style.tooltipIcon}
                />
                <div className={style.tooltip}>
                  <div className={style.tooltipContent}>
                    {tooltip.text}
                    {tooltip.more && (
                      <div className={style.tooltipMore}>{tooltip.more}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className={style.selectWrapper}>
          {startIcon && (
            <MaterialIcon
              icon={startIcon}
              className={style.startIcon}
              iconSize="small"
            />
          )}

          <select
            ref={ref}
            className={selectClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={props.disabled || readOnly}
            aria-invalid={error}
            aria-describedby={
              helperText ? `${props.id || 'select'}-helper` : undefined
            }
            {...inputProps}
            {...props}
          >
            {placeholder && (
              <option
                value=""
                disabled
                selected={!props.value && !props.defaultValue}
              >
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className={style.endIcons}>
            {endIcon && (
              <MaterialIcon
                icon={endIcon}
                className={style.endIcon}
                iconSize="small"
              />
            )}
          </div>
        </div>

        {helperText && (
          <div
            id={`${props.id || 'select'}-helper`}
            className={`${style.helperText} ${error ? style.errorText : ''}`}
          >
            {helperText}
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
