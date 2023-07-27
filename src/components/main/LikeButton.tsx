import React, { MouseEvent, ReactNode } from 'react';
import Styles from './Contents.module.scss';
export interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

export default function LikeButton({ onClick, children }: Props) {
  return (
    <button onClick={onClick} className={Styles.likes}>
      ❤️ : {children}
    </button>
  );
}
