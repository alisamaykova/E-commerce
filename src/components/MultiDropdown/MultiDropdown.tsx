import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '../Input';
import styles from './MultiDropdown.module.scss';
import { observer } from 'mobx-react-lite';

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

const MultiDropdown: React.FC<MultiDropdownProps> = observer(({
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

  const safeOptions = Array.isArray(options) ? options : [];

  const filteredOptions = useMemo(() => {
    return safeOptions.filter(opt =>
      opt.value.toLowerCase().includes(filter.toLowerCase())
    );
  }, [safeOptions, filter]);

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

  const handleInputClick = () => !disabled && setIsOpen(true);
  const handleInputChange = (v: string) => setFilter(v);

  const selectedKeys = useMemo(() => new Set(value.map(v => v.key)), [value]);

  const handleOptionClick = (option: Option) => {
    const newValue = selectedKeys.has(option.key)
      ? value.filter(v => v.key !== option.key)
      : [...value, option];
    onChange(newValue);
  };

  const displayValue = useMemo(() => {
    return isOpen ? filter : (value.length > 0 ? getTitle(value) : '');
  }, [isOpen, filter, value, getTitle]);

  const displayPlaceholder = useMemo(() => {
    return (isOpen && filter === '') || (!isOpen && value.length === 0) ? getTitle(value) : '';
  }, [isOpen, filter, value, getTitle]);

  const inputClassName = useMemo(() => {
    let cn = styles['multi-dropdown__input'];
    if (isOpen && value.length > 0) {
      cn +=  `${styles['multi-dropdowninput--open-selected']}`;
    } else if (!isOpen && value.length > 0) {
      cn +=  `${styles['multi-dropdowninput--closed-selected']}`;
    }
    return cn;
  }, [isOpen, value]);

  return (
    <div
      ref={ref}
      className={[
        styles['multi-dropdown'],
        disabled ? styles['multi-dropdown--disabled'] : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      <Input
        value={displayValue}
        onChange={handleInputChange}
        onClick={handleInputClick}
        placeholder={displayPlaceholder}
        disabled={disabled}
        className={inputClassName}
      />
      {isOpen && !disabled && (
        <div className={styles['multi-dropdown__options']}>
          {filteredOptions.map(opt => (
            <div
              key={opt.key}
              className={[
                styles['multi-dropdown__option'],
                selectedKeys.has(opt.key) ? styles['multi-dropdown__option--selected'] : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleOptionClick(opt)}
            >
              {opt.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default MultiDropdown;