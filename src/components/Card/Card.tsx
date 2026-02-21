import React from 'react';
import Text from '../Text';
import styles from './Card.module.scss';

export type CardProps = {
  className?: string;
  image: string;
  captionSlot?: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  contentSlot?: React.ReactNode;
  onClick?: React.MouseEventHandler;
  actionSlot?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({
  className,
  image,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  onClick,
  actionSlot,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  const wrapWithStopPropagation = (node: React.ReactNode, wrapperClass?: string) => {
    if (!node) return null;
    return (
      <div className={wrapperClass} onClick={(e) => e.stopPropagation()}>
        {node}
      </div>
    );
  };

  const renderContentSlot = () => {
    if (!contentSlot) return null;
    if (typeof contentSlot === 'string' || typeof contentSlot === 'number') {
      return (
        <Text view="p-18" weight="bold">
          {contentSlot}
        </Text>
      );
    }
    return contentSlot;
  };

  return (
    <div className={`${styles.card} ${className || ''}`} onClick={handleClick}>
      <div className={styles['card__image-container']}>
        <img src={image} alt="" className={styles['card__image']} />
      </div>

      <div className={styles['card__content']}>
        {captionSlot && wrapWithStopPropagation(captionSlot, styles['card__caption'])}

        <Text maxLines={2} view="p-18" weight="bold" className={styles['card__title']}>
          {title}
        </Text>

        {wrapWithStopPropagation(
          <Text maxLines={3} view="p-16" color="secondary" className={styles['card__subtitle']}>
            {subtitle}
          </Text>,
        )}

        {(contentSlot || actionSlot) && (
          <div className={styles['card__footer']}>
            {contentSlot && wrapWithStopPropagation(renderContentSlot())}
            {actionSlot && wrapWithStopPropagation(actionSlot)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;