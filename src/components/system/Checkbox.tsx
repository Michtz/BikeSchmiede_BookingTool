'use client';

import { ChangeEvent } from 'react';
import MaterialIcon from './MaterialIcon';
import style from '@/styles/system/Input.module.scss';

interface CheckboxProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  label?: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  className?: string;
}

const Checkbox = ({
  id,
  name,
  checked,
  onChange,
  onBlur,
  label,
  description,
  icon,
  disabled = false,
  error = false,
  helperText,
  className,
}: CheckboxProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const checkboxClasses = [
    style.checkboxContainer,
    error && style.error,
    disabled && style.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={checkboxClasses}>
      <label className={style.checkboxLabel}>
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className={style.checkbox}
          aria-invalid={error}
          aria-describedby={
            helperText ? `${id || 'checkbox'}-helper` : undefined
          }
        />
        {(label || description) && (
          <div className={style.checkboxContent}>
            {label && (
              <div className={style.checkboxLabelText}>
                {icon && <MaterialIcon icon={icon} iconSize="small" />}
                {label}
              </div>
            )}
            {description && (
              <div className={style.checkboxDescription}>{description}</div>
            )}
          </div>
        )}
      </label>

      {helperText && (
        <div
          id={`${id || 'checkbox'}-helper`}
          className={`${style.helperText} ${error ? style.errorText : ''}`}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Checkbox;
