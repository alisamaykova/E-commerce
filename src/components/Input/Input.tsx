import React from 'react';
import classNames from 'classnames';
import ArrowDownIcon from '../icons/ArrowDownIcon/ArrowDownIcon';
import styles from './Input.module.scss';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  value: string;
  onChange: (value: string) => void;
  afterSlot?: React.ReactNode;
};

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  afterSlot,
  className = '',
  disabled,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const rightIcon = afterSlot !== undefined ? afterSlot : (
    <ArrowDownIcon color="secondary" className={styles['input__arrow-icon']} />
  );

  const inputClasses = classNames(
    styles.input,
    className,
    {
      [styles['input--with-after']]: afterSlot,
      [styles['input--disabled']]: disabled,
    }
  );

  return (
    <div className={inputClasses}>
      <input
        {...props}
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={styles['input__field']}
      />
      {rightIcon && <div className={styles['input__after']}>{rightIcon}</div>}
    </div>
  );
};

export default Input;