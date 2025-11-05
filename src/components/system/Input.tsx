'use client';
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import MaterialIcon from './MaterialIcon';
import style from '@/styles/system/Input.module.scss';

export type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search';

interface TooltipProps {
  text: string;
  more?: React.ReactNode;
}

interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    'type' | 'size'
  > {
  type?: InputType;
  label?: string;
  tooltip?: TooltipProps;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  readOnly?: boolean;
  inputProps?: UseFormRegisterReturn;
  startIcon?: string;
  endIcon?: string;
  clearable?: boolean;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(
  (
    {
      type = 'text',
      label,
      tooltip,
      helperText,
      error = false,
      required = false,
      fullWidth = false,
      multiline = false,
      minRows = 1,
      maxRows,
      readOnly = false,
      inputProps,
      startIcon,
      endIcon,
      clearable = false,
      showPasswordToggle = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const internalRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const inputRef =
      (ref as React.RefObject<HTMLInputElement | HTMLTextAreaElement>) ||
      internalRef;

    // Check if input has value
    useEffect(() => {
      const element = inputRef.current;
      if (element) {
        setHasValue(!!element.value);
      }
    }, [props.value, props.defaultValue, inputRef]);

    const handleFocus = (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    const handleClear = () => {
      if (inputRef.current) {
        const element = inputRef.current as HTMLInputElement;
        element.value = '';
        setHasValue(false);

        // Trigger change event for react-hook-form
        const event = new Event('change', { bubbles: true });
        element.dispatchEvent(event);
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const getInputType = () => {
      if (type === 'password' && showPassword) {
        return 'text';
      }
      return type;
    };

    const shouldShowPasswordToggle = type === 'password' && showPasswordToggle;
    const shouldShowClearButton = clearable && hasValue && !readOnly;

    const inputClasses = [
      style.input,
      error && style.error,
      fullWidth && style.fullWidth,
      isFocused && style.focused,
      hasValue && style.hasValue,
      readOnly && style.readOnly,
      (startIcon ||
        shouldShowPasswordToggle ||
        shouldShowClearButton ||
        endIcon) &&
        style.hasIcons,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const containerClasses = [
      style.inputContainer,
      fullWidth && style.fullWidth,
      error && style.error,
      isFocused && style.focused,
      readOnly && style.readOnly,
    ]
      .filter(Boolean)
      .join(' ');

    const renderInput = () => {
      const commonProps = {
        ref: inputRef,
        className: inputClasses,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onChange: handleChange,
        readOnly,
        disabled: props.disabled,
        'aria-invalid': error,
        'aria-describedby': helperText
          ? `${props.id || 'input'}-helper`
          : undefined,
        ...inputProps,
        ...props,
      };

      if (multiline) {
        return (
          <textarea
            {...(commonProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={minRows}
            style={{
              maxHeight: maxRows ? `50rem` : undefined,
              ...props.style,
            }}
          />
        );
      }

      return (
        <input
          {...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
          type={getInputType()}
        />
      );
    };

    return (
      <div className={containerClasses}>
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

        <div className={style.inputWrapper}>
          {startIcon && (
            <MaterialIcon
              icon={startIcon}
              className={style.startIcon}
              iconSize="small"
            />
          )}

          {renderInput()}

          <div className={style.endIcons}>
            {shouldShowClearButton && (
              <MaterialIcon
                icon="clear"
                className={style.clearIcon}
                iconSize="small"
                clickable
                onClick={handleClear}
              />
            )}
            {shouldShowPasswordToggle && (
              <>
                <MaterialIcon
                  icon={showPassword ? 'visibility_off' : 'visibility'}
                  color={'gray'}
                  outlined
                  iconSize="small"
                  clickable
                  onClick={togglePasswordVisibility}
                />
              </>
            )}
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
            id={`${props.id || 'input'}-helper`}
            className={`${style.helperText} ${error ? style.errorText : ''}`}
          >
            {helperText}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
