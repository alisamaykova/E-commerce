import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';
import Loader from '../Loader';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  className,
  disabled = false,
  type = 'button',
  ...props
}) => {

  const buttonClasses = classNames(
    styles.button,
    className,
    {
      [styles['button--loading']]: loading,
      [styles['button--loading-original-enabled']]: loading && !disabled,
    }
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader size="s"/>}
      <span className={styles['button--text']}>{children}</span>
    </button>
  );
};

export default Button;