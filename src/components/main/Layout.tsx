import React, { ReactNode } from 'react';
import Styles from './Layout.module.scss';
interface Props {
  children: ReactNode;
  title: string;
}

export default function Layout({ children, title }: Props) {
  return (
    <div className={Styles.layout}>
      <h1 className={Styles.title}>{title}</h1>
      {children}
    </div>
  );
}
