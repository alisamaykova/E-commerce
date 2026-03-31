import * as React from 'react';
import styles from './Text.module.scss';

export type TextProps = {
  className?: string;
  view?: 'title' | 'subtitle' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  weight?: 'normal' | 'medium' | 'bold';
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent';
  maxLines?: number;
};

const Text: React.FC<TextProps> = ({
  className,
  view,
  tag: Tag = 'p',
  weight,
  children,
  color,
  maxLines,
  ...props
}) => {
  const textClasses = [
    styles.text,
    view && styles[`text__view--${view}`],
    weight && styles[`text__weight--${weight}`],
    color && styles[`text__color--${color}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties = {};
  if (maxLines) {
    style.WebkitLineClamp = maxLines;
    style.display = '-webkit-box';
    style.WebkitBoxOrient = 'vertical';
    style.overflow = 'hidden';
  }

  return (
    <Tag className={textClasses} style={style} {...props}>
      {children}
    </Tag>
  );
};

export default Text;