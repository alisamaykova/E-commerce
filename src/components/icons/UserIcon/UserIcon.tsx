import React from 'react';
import Icon from '../Icon';
import type { IconProps } from '../Icon';

const UserIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="5" />
      <path d="M4 23 a7 6 0 0 1 16 0" />
    </Icon>
  )
}
export default UserIcon;