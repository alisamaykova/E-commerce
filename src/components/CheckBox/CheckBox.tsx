import React from 'react';
import CheckIcon from '../icons/CheckIcon';
import styles from './CheckBox.module.scss';

export type CheckBoxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  onChange: (checked: boolean) => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({
  checked,
  onChange,
  disabled = false,
  className,
  style,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event.target.checked);
    }
  };

  const checkboxClasses = [
    styles.checkbox,
    disabled ? styles['checkbox--disabled'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={checkboxClasses} style={style}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles['checkbox__input']}
        {...props}
      />
      <span className={styles['checkbox__custom']}>
        {checked && (
          <CheckIcon
            className={styles['checkbox__icon']}
            color={disabled ? 'secondary' : 'accent'}
          />
        )}
      </span>
    </label>
  );
};

export default CheckBox;