import * as React from 'react';
import Icon from'../Icon';
import type { IconProps } from '../Icon';
import '../Icon/Icon.module.scss'

const CheckIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon strokeLinecap='square'
    strokeLinejoin='miter'
    strokeWidth={2}
    {...props}>
      <path d ="M19 8 L10 18 L4 12" />
    </Icon>
  )
}

export default CheckIcon;
