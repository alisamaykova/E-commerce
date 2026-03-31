import React from 'react';
import Icon from '../Icon';
import type { IconProps } from '../Icon';

const CartIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props} viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M11.25 27.5 H18.75 C23.775 27.5 24.675 25.4875 24.9375 23.0375 L25.875 15.5375 C26.2125 12.4875 25.3375 10 20 10 H10 C4.66253 10 3.78753 12.4875 4.12503 15.5375 L5.06253 23.0375 C5.32503 25.4875 6.22503 27.5 11.25 27.5 Z"
        stroke="currentColor"
        fill="none"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.375 9.58751 V8.37501 C9.375 5.56251 11.6375 2.80001 14.45 2.53751 C17.8 2.21251 20.625 4.85001 20.625 8.13751 V9.86251"
        stroke="currentColor"
        fill="none"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6181 15 H10.6294"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.3691 15 H19.3803"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default CartIcon;