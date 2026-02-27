import React from 'react';
import styles from './Loader.module.scss';

export type LoaderProps = {
  size?: 's' | 'm' | 'l';
  className?: string;
};

const Loader: React.FC<LoaderProps> = ({ size = 'l', className = '' }) => {
  return (
    <div className={`${styles['loader--container']} ${className}`}>
      <div
        className={`${styles.loader} ${styles[`loader--${size}`]}`}
        aria-label="Loading"
      />
    </div>
  );
};

export default Loader;

