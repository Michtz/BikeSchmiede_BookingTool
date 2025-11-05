'use client';
import React, { useState, useRef, useEffect } from 'react';
import MaterialIcon from './MaterialIcon';
import style from '@/styles/system/Select.module.scss';

export interface SelectChangeEvent {
  target: {
    name?: string;
    value: string;
  };
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  id?: string;
  name?: string;
  value: string | number;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  onChange: (event: SelectChangeEvent) => void;
  onBlur?: () => void;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  className?: string;
}

const Select = ({
  id,
  name,
  value,
  label,
  placeholder = 'Auswählen...',
  options,
  onChange,
  onBlur,
  error = false,
  disabled = false,
  fullWidth = false,
  required = false,
  className,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption?.label || placeholder;

  const handleToggle = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;

    const event: SelectChangeEvent = {
      target: {
        name,
        value: option.value.toString(),
      },
    };

    onChange(event);
    setIsOpen(false);
    onBlur?.();
  };

  const selectClasses = [
    style.select,
    error && style.error,
    fullWidth && style.fullWidth,
    isOpen && style.focused,
    disabled && style.disabled,
    !value && style.placeholder,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fullWidth ? style.fullWidth : ''}>
      {label && (
        <label className={style.label} htmlFor={id}>
          {label}
          {required && <span className={style.required}>*</span>}
        </label>
      )}

      <div className={style.selectContainer} ref={selectRef}>
        <div
          className={selectClasses}
          onClick={handleToggle}
          id={id}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          tabIndex={disabled ? -1 : 0}
        >
          <span className={style.selectValue}>{displayValue}</span>

          <MaterialIcon
            icon={isOpen ? 'expand_less' : 'expand_more'}
            iconSize="small"
          />
        </div>

        {isOpen && (
          <div className={style.selectDropdown}>
            {options.map((option) => (
              <div
                key={option.value}
                className={`${style.selectOption} ${
                  option.value === value ? style.selected : ''
                } ${option.disabled ? style.disabled : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
