import * as React from 'react'
import type { IconProps } from '../Icon'
import Icon from '../Icon'
import '../Icon/Icon.module.scss'

const ArrowDownIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth={1.5}
    {...props}>
      <polyline points="4 9 12 16 20 9" />
    </Icon>
  )
}

export default ArrowDownIcon;