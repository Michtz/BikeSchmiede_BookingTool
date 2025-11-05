import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import style from '@/styles/system/NumberStepper.module.scss';

interface NumberStepperProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onDelete?: () => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  isMax?: boolean;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  quantity,
  onQuantityChange,
  onDelete,
  disabled = false,
  min = 1,
  max = 999,
  isMax = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(quantity.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when quantity prop changes
  useEffect(() => {
    if (!isEditing) {
      setInputValue(quantity.toString());
    }
  }, [quantity, isEditing]);

  const handleIncrement = () => {
    if (quantity < max) onQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > min) onQuantityChange(quantity - 1);
  };

  const handleSpanClick = () => {
    if (!disabled) {
      setIsEditing(true);
      setInputValue(quantity.toString());
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const newValue = parseInt(inputValue);

    if (
      !isNaN(newValue) &&
      newValue >= min &&
      newValue <= max &&
      newValue !== quantity
    ) {
      onQuantityChange(newValue);
    } else {
      setInputValue(quantity.toString());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onQuantityChange(parseInt(inputValue));
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setInputValue(quantity.toString());
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, isMax]);

  const isDecrementDisabled = disabled || quantity <= min;
  const isIncrementDisabled = disabled || quantity >= max || isMax;

  return (
    <div className={style.numberStepper}>
      <Button
        icon="remove"
        appearance="icon"
        variant="ghost"
        size="small"
        disabled={isDecrementDisabled}
        onClick={handleDecrement}
        className={style.stepperButton}
        type="button"
      />

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className={style.quantityInput}
          disabled={disabled}
        />
      ) : (
        <span
          className={style.quantityDisplay}
          onClick={handleSpanClick}
          title={disabled ? '' : 'Klicken zum Bearbeiten'}
        >
          {quantity}
        </span>
      )}

      <Button
        icon="add"
        appearance="icon"
        variant="ghost"
        size="small"
        disabled={isIncrementDisabled}
        onClick={handleIncrement}
        className={style.stepperButton}
        type="button"
      />

      {onDelete && (
        <Button
          icon="delete"
          appearance="icon"
          variant="error"
          size="small"
          onClick={onDelete}
          disabled={disabled}
          className={style.deleteButton}
        />
      )}
    </div>
  );
};

export default NumberStepper;
