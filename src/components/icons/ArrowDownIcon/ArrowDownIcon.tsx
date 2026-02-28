import * as React from 'react'
import type { IconProps } from '../Icon'
import Icon from '../Icon'
import '../Icon/Icon.module.scss'

const ArrowDownIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <polyline points="20 9 12 16 4 9" />
    </Icon>
  )
}

export default ArrowDownIcon;
