import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '../Input';
import styles from './MultiDropdown.module.scss';

export type Option = {
  key: string;
  value: string;
};

export type MultiDropdownProps = {
  className?: string;
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  disabled?: boolean;
  getTitle: (value: Option[]) => string;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  className,
  options,
  value,
  onChange,
  disabled = false,
  getTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    return options.filter(opt =>
      opt.value.toLowerCase().includes(filter.toLowerCase())
    );
  }, [options, filter]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFilter('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (inputValue: string) => {
    setFilter(inputValue);
  };

  const handleOptionClick = (option: Option) => {
    const isSelected = value.some(v => v.key === option.key);
    const newValue = isSelected
      ? value.filter(v => v.key !== option.key)
      : [...value, option];
    onChange(newValue);
  };

  const isSelected = (option: Option) => value.some(v => v.key === option.key);

  const inputValue = isOpen
    ? filter
    : value.length > 0
      ? getTitle(value)
      : '';

  const placeholder =
    (isOpen && filter === '') || (!isOpen && value.length === 0)
      ? getTitle(value)
      : '';

  let inputClassName = styles['multi-dropdowninput'];
  if (isOpen && value.length > 0) {
    inputClassName +=  `${styles['multi-dropdowninput--open-selected']}`;
  } else if (!isOpen && value.length > 0) {
    inputClassName +=  `${styles['multi-dropdowninput--closed-selected']}`;
  }

  return (
    <div
      ref={ref}
      className={[
        styles['multi-dropdown'],
        disabled ? styles['multi-dropdown--disabled'] : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-testid="multi-dropdown"
    >
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onClick={handleInputClick}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClassName}
      />

      {isOpen && !disabled && (
        <div
          className={styles['multi-dropdown__options']}
          data-testid="options-list"
        >
          {filteredOptions.map(opt => (
            <div
              key={opt.key}
              className={[
                styles['multi-dropdown__option'],
                isSelected(opt) ? styles['multi-dropdown__option--selected'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleOptionClick(opt)}
              data-testid={`option-${opt.key}`}
            >
              {opt.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;