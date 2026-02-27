import classNames from 'classnames';
import * as React from 'react';
import styles from './Icon.module.scss';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
};

const colorMap = {
  primary: styles['icon__color--primary'],
  secondary: styles['icon__color--secondary'],
  accent: styles['icon__color--accent'],
};

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({
  children,
  className,
  color,
  width = 24,
  height = 24,
  style,
  ...props
}) => {
  const combinedClassName = classNames(color ? colorMap[color] : null, className);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={combinedClassName}
      style={style}
      {...props}
    >
      {children}
    </svg>
  );
};

export default Icon;